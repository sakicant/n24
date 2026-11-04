<?php
/**
 * N24 admin: n24.hr/manage/
 * Log in, then add, edit, hide and delete listings and their photos.
 * Every save goes straight to the website (assets/data/listings.json) and keeps
 * a backup of the previous version in api/data/backups/.
 */

declare(strict_types=1);

require __DIR__ . '/../api/lib/auth.php';
require __DIR__ . '/../api/lib/admin-form.php';
require __DIR__ . '/../api/lib/images.php';

header('X-Frame-Options: DENY');
header('X-Robots-Tag: noindex, nofollow');
header('Cache-Control: no-store');
header('Referrer-Policy: same-origin');

n24_session();
$a = (string) ($_GET['a'] ?? '');
$post = ($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST';

function go(string $to): void
{
    header('Location: /manage/' . $to, true, 303);
    exit;
}

function flash(string $msg, string $kind = 'ok'): void
{
    $_SESSION['flash'] = [$msg, $kind];
}

function json_out(array $data, int $code = 200): void
{
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

// ------------------------------------------------------------------ first visit: create the login
if (!n24_is_setup()) {
    $error = '';
    if ($post) {
        n24_check_csrf();
        $hash = include __DIR__ . '/../api/lib/setup-code.php';
        $user = n24_text($_POST['user'] ?? '', 60);
        if (n24_login_blocked()) {
            $error = 'Too many attempts. Wait 15 minutes and try again.';
        } elseif (!password_verify(strtoupper(trim((string) ($_POST['code'] ?? ''))), $hash)) {
            n24_login_failed();
            $error = 'The setup code is not right.';
        } elseif (mb_strlen($user) < 3) {
            $error = 'Choose a username of at least 3 characters.';
        } elseif ($p = n24_password_problem((string) ($_POST['password'] ?? ''), (string) ($_POST['repeat'] ?? ''))) {
            $error = $p;
        } else {
            n24_write_config($user, (string) $_POST['password']);
            n24_login($user, (string) $_POST['password']);
            flash('Your login is ready. From now on use your username and password at n24.hr/manage/.');
            go('');
        }
    }
    page('Set up the admin', function () use ($error) { ?>
      <form method="post" class="card narrow" autocomplete="off">
        <h1>Set up the admin</h1>
        <p>Choose the username and password Tomislav will use to log in. You need the setup code from the website developer, once.</p>
        <?php if ($error) echo '<p class="msg msg-error">' . n24_e($error) . '</p>'; ?>
        <input type="hidden" name="csrf" value="<?= n24_e(n24_csrf()) ?>">
        <label>Setup code <input name="code" required autocapitalize="characters"></label>
        <label>Username <input name="user" required value="<?= n24_e($_POST['user'] ?? 'tomislav') ?>" autocomplete="username"></label>
        <label>Password (at least 10 characters) <input name="password" type="password" required minlength="10" autocomplete="new-password"></label>
        <label>Password again <input name="repeat" type="password" required minlength="10" autocomplete="new-password"></label>
        <button class="btn">Create login</button>
      </form>
    <?php });
    exit;
}

// ------------------------------------------------------------------ login
if (!n24_logged_in()) {
    if ($a === 'upload') {
        json_out(['ok' => false, 'error' => 'You were logged out. Copy your text, reload the page and log in again.'], 401);
    }
    $error = '';
    if ($post && $a === 'login') {
        n24_check_csrf();
        if (n24_login_blocked()) {
            $error = 'Too many wrong passwords. Wait 15 minutes and try again.';
        } elseif (n24_login((string) ($_POST['user'] ?? ''), (string) ($_POST['password'] ?? ''))) {
            go('');
        } else {
            $error = 'Wrong username or password.';
        }
    }
    page('Log in', function () use ($error) { ?>
      <form method="post" action="/manage/?a=login" class="card narrow">
        <h1>N24 admin</h1>
        <?php if ($error) echo '<p class="msg msg-error">' . n24_e($error) . '</p>'; ?>
        <input type="hidden" name="csrf" value="<?= n24_e(n24_csrf()) ?>">
        <label>Username <input name="user" required autocomplete="username" value="<?= n24_e($_POST['user'] ?? '') ?>"></label>
        <label>Password <input name="password" type="password" required autocomplete="current-password"></label>
        <button class="btn">Log in</button>
      </form>
    <?php });
    exit;
}

// ------------------------------------------------------------------ logged in: actions
try {
    if ($post) {
        n24_check_csrf();
    }

    if ($post && $a === 'logout') {
        n24_logout();
        go('');
    }

    if ($post && $a === 'upload') {
        $id = (string) ($_POST['id'] ?? '');
        if (!preg_match('/^n24-\d+$/', $id)) {
            json_out(['ok' => false, 'error' => 'Unknown listing.'], 400);
        }
        $f = $_FILES['photo'] ?? null;
        if (!$f || ($f['error'] ?? 1) !== UPLOAD_ERR_OK) {
            $err = $f['error'] ?? 0;
            json_out(['ok' => false, 'error' => in_array($err, [UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE], true)
                ? 'The photo is too large for the server. Try a smaller photo or a screenshot of it.'
                : 'The photo did not upload. Try again.'], 400);
        }
        $name = $id . '-' . bin2hex(random_bytes(4));
        try {
            n24_save_listing_image($f['tmp_name'], N24_PHOTOS, $name);
        } catch (RuntimeException $e) {
            json_out(['ok' => false, 'error' => $e->getMessage()], 400);
        }
        json_out(['ok' => true, 'name' => $name]);
    }

    if ($post && $a === 'save') {
        $id = (string) ($_POST['id'] ?? '');
        $isNew = !empty($_POST['new']);
        $saved = n24_update(function (array $list) use ($id, $isNew) {
            $old = $isNew ? [] : n24_find($list, $id);
            if (!$isNew && !$old) {
                throw new RuntimeException('This listing no longer exists. It may have been deleted.');
            }
            [$l, $errors] = n24_listing_from_post($_POST, $old ?: []);
            if ($errors) {
                $_SESSION['form'] = ['post' => $_POST, 'errors' => $errors];
                return ['skip' => true];
            }
            if ($isNew) {
                // Use the number shown on the form unless it was taken meanwhile.
                $l = ['id' => (preg_match('/^n24-\d+$/', $id) && !n24_find($list, $id)) ? $id : n24_next_id($list)] + $l;
                array_unshift($list, $l); // newest first
            } else {
                foreach ($list as $i => $x) {
                    if ($x['id'] === $id) $list[$i] = $l;
                }
                // Photos taken out of the listing are deleted from the server.
                foreach (array_diff($old['photos'] ?? [], $l['photos']) as $gone) {
                    n24_delete_photo($gone);
                }
            }
            return ['list' => $list, 'return' => $l];
        });
        if (!$saved) {
            flash('Some fields need fixing. Nothing was saved yet.', 'error');
            go($isNew ? '?a=new&id=' . rawurlencode($id) : '?a=edit&id=' . rawurlencode($id));
        }
        unset($_SESSION['form']);
        flash('Saved: ' . $saved['title'] . (!empty($saved['hidden']) ? ' (hidden from the website)' : ''), 'ok');
        $_SESSION['flash'][] = empty($saved['hidden']) ? n24_listing_path($saved) : '';
        go('?a=edit&id=' . rawurlencode($saved['id']));
    }

    if ($post && $a === 'delete') {
        $id = (string) ($_POST['id'] ?? '');
        $gone = n24_update(function (array $list) use ($id) {
            $old = n24_find($list, $id);
            if (!$old) return ['skip' => true];
            $list = array_values(array_filter($list, function ($x) use ($id) { return $x['id'] !== $id; }));
            return ['list' => $list, 'return' => $old];
        });
        if ($gone) {
            foreach ($gone['photos'] ?? [] as $photo) {
                n24_delete_photo($photo);
            }
            flash('Deleted: ' . $gone['title'] . ' (' . strtoupper($gone['id']) . ').');
        }
        go('');
    }

    if ($post && $a === 'password') {
        $c = n24_admin_config();
        if (!password_verify((string) ($_POST['current'] ?? ''), $c['hash'] ?? '')) {
            flash('The current password is not right.', 'error');
        } elseif ($p = n24_password_problem((string) ($_POST['password'] ?? ''), (string) ($_POST['repeat'] ?? ''))) {
            flash($p, 'error');
        } else {
            n24_write_config($c['user'], (string) $_POST['password']);
            flash('Password changed.');
            go('');
        }
        go('?a=password');
    }

    if ($a === 'backup') {
        header('Content-Type: application/json; charset=utf-8');
        header('Content-Disposition: attachment; filename="n24-listings-' . date('Y-m-d') . '.json"');
        readfile(N24_LISTINGS);
        exit;
    }
} catch (RuntimeException $e) {
    if ($a === 'upload') {
        json_out(['ok' => false, 'error' => $e->getMessage()], 500);
    }
    flash($e->getMessage(), 'error');
    go('');
}

// ------------------------------------------------------------------ pages
$list = n24_load();

if ($a === 'password') {
    page('Change password', function () { ?>
      <form method="post" action="/manage/?a=password" class="card narrow">
        <h1>Change password</h1>
        <input type="hidden" name="csrf" value="<?= n24_e(n24_csrf()) ?>">
        <label>Current password <input name="current" type="password" required autocomplete="current-password"></label>
        <label>New password (at least 10 characters) <input name="password" type="password" required minlength="10" autocomplete="new-password"></label>
        <label>New password again <input name="repeat" type="password" required minlength="10" autocomplete="new-password"></label>
        <button class="btn">Change password</button>
        <p><a href="/manage/">Back to listings</a></p>
      </form>
    <?php });
    exit;
}

if ($a === 'edit' || $a === 'new') {
    $isNew = $a === 'new';
    $id = (string) ($_GET['id'] ?? '');
    if ($isNew) {
        if (!preg_match('/^n24-\d+$/', $id) || n24_find($list, $id)) {
            go('?a=new&id=' . n24_next_id($list));
        }
        $l = ['id' => $id, 'features' => [], 'photos' => []];
    } else {
        $l = n24_find($list, $id);
        if (!$l) {
            flash('That listing does not exist.', 'error');
            go('');
        }
    }
    $v = n24_form_values($l);
    $errors = [];
    if (!empty($_SESSION['form'])) {
        // Coming back after a failed save: show what was typed, with the errors.
        [$typed] = n24_listing_from_post($_SESSION['form']['post'], $l);
        $v = n24_form_values($typed);
        $v['slug'] = n24_text($_SESSION['form']['post']['slug'] ?? '', 120);
        foreach (['price', 'size', 'plot', 'beds', 'baths', 'year', 'parking', 'garage'] as $k) {
            $v[$k] = n24_text($_SESSION['form']['post'][$k] ?? '', 30);
        }
        $errors = $_SESSION['form']['errors'];
        unset($_SESSION['form']);
    }
    page(($isNew ? 'New listing' : 'Edit ' . strtoupper($id)), function () use ($l, $v, $errors, $isNew) {
        $err = function ($k) use ($errors) {
            return isset($errors[$k]) ? '<span class="field-error">' . n24_e($errors[$k]) . '</span>' : '';
        };
        $f = function ($k) use ($v) { return n24_e($v[$k]); }; ?>
      <form method="post" action="/manage/?a=save" class="edit" id="edit" data-id="<?= n24_e($l['id']) ?>" data-csrf="<?= n24_e(n24_csrf()) ?>">
        <input type="hidden" name="csrf" value="<?= n24_e(n24_csrf()) ?>">
        <input type="hidden" name="id" value="<?= n24_e($l['id']) ?>">
        <?php if ($isNew) echo '<input type="hidden" name="new" value="1">'; ?>
        <input type="hidden" name="photos" id="photos" value="<?= n24_e(implode(',', $v['photos'])) ?>">

        <div class="edit-head">
          <div>
            <p class="crumb"><a href="/manage/">All listings</a></p>
            <h1><?= $isNew ? 'New listing' : n24_e($l['title']) ?></h1>
            <p class="ref">Reference <?= n24_e(strtoupper($l['id'])) ?><?php if (!$isNew && empty($l['hidden'])): ?> · <a href="<?= n24_e(n24_listing_path($l)) ?>" target="_blank" rel="noopener">View on website</a><?php endif; ?></p>
          </div>
        </div>

        <section class="card">
          <h2>Photos</h2>
          <p class="hint">The first photo is the main one on cards and at the top of the page. Use the arrows to change the order. Photos are made smaller and converted automatically.</p>
          <ul class="photos" id="photo-list">
            <?php foreach ($v['photos'] as $name): ?>
              <li data-name="<?= n24_e($name) ?>"><img src="/assets/img/listings/<?= n24_e($name) ?>-640.webp" alt=""><div class="ph-tools"><button type="button" data-move="-1" aria-label="Move left">←</button><button type="button" data-move="1" aria-label="Move right">→</button><button type="button" data-remove aria-label="Remove photo">✕</button></div></li>
            <?php endforeach; ?>
          </ul>
          <label class="drop" id="drop">
            <input type="file" id="photo-input" accept="image/*,.heic,.heif" multiple>
            <span><strong>Add photos</strong> · choose or drop them here</span>
          </label>
          <p class="upload-status" id="upload-status" role="status"></p>
        </section>

        <section class="card">
          <h2>Basics</h2>
          <label>Title <?= $err('title') ?><input name="title" required maxlength="140" value="<?= $f('title') ?>" placeholder="For example: Stone house with sea view"></label>
          <div class="grid3">
            <label>Place <?= $err('area') ?>
              <select name="area" required>
                <option value="">Choose</option>
                <?php foreach (N24_AREAS as $k => $name) echo '<option value="' . $k . '"' . ($v['area'] === $k ? ' selected' : '') . '>' . n24_e($name) . (in_array($k, N24_COAST, true) ? '' : ' (search only)') . '</option>'; ?>
              </select>
            </label>
            <label>Type <?= $err('type') ?>
              <select name="type" required>
                <option value="">Choose</option>
                <?php foreach (N24_TYPES as $k => $name) echo '<option value="' . $k . '"' . ($v['type'] === $k ? ' selected' : '') . '>' . $name . '</option>'; ?>
              </select>
            </label>
            <label>Price in € <?= $err('price') ?><input name="price" inputmode="numeric" value="<?= $f('price') ?>" placeholder="Empty = price on request"></label>
          </div>
          <div class="grid3">
            <label>Size m² <small>(living area; for land the plot)</small> <?= $err('size') ?><input name="size" inputmode="decimal" value="<?= $f('size') ?>"></label>
            <label>Plot m² <small>(houses and villas)</small> <?= $err('plot') ?><input name="plot" inputmode="decimal" value="<?= $f('plot') ?>"></label>
            <label>Status <input name="status" list="statuses" maxlength="60" value="<?= $f('status') ?>" placeholder="For example: Available"></label>
          </div>
          <datalist id="statuses"><option>Available</option><option>New build</option><option>Under construction</option><option>Building permit</option><option>Reserved</option><option>Sold</option></datalist>
          <div class="grid5">
            <label>Bedrooms <?= $err('beds') ?><input name="beds" inputmode="numeric" value="<?= $f('beds') ?>"></label>
            <label>Bathrooms <?= $err('baths') ?><input name="baths" inputmode="numeric" value="<?= $f('baths') ?>"></label>
            <label>Year built <?= $err('year') ?><input name="year" inputmode="numeric" value="<?= $f('year') ?>"></label>
            <label>Parking spaces <?= $err('parking') ?><input name="parking" inputmode="numeric" value="<?= $f('parking') ?>"></label>
            <label>Garages <?= $err('garage') ?><input name="garage" inputmode="numeric" value="<?= $f('garage') ?>"></label>
          </div>
        </section>

        <section class="card">
          <h2>Text</h2>
          <label>Description <small>(leave an empty line between paragraphs; the first paragraph also shows in Google)</small>
            <textarea name="description" rows="10"><?= $f('description') ?></textarea></label>
          <label>Features <small>(one per line, for example "Sea view")</small>
            <textarea name="features" rows="6"><?= $f('features') ?></textarea></label>
          <label>Construction and finishing <small>(optional, one per line)</small>
            <textarea name="standards" rows="4"><?= $f('standards') ?></textarea></label>
        </section>

        <section class="card">
          <h2>Units or plots <small>(for projects with several apartments or plots; leave empty otherwise)</small></h2>
          <p class="hint">When there are units, the price above shows as "From". Put the lowest available price there.</p>
          <div class="units-edit">
            <table>
              <thead><tr><th>Name</th><th>Size m²</th><th>Bedrooms</th><th>Garden m²</th><th>Price €</th><th>Status</th><th></th></tr></thead>
              <tbody id="units">
                <?php foreach (array_merge($v['units'], [[]]) as $u): $u = array_pad($u, 6, null); ?>
                <tr>
                  <td><input name="units[name][]" value="<?= n24_e($u[0]) ?>" aria-label="Unit name"></td>
                  <td><input name="units[size][]" value="<?= n24_e($u[1]) ?>" inputmode="decimal" aria-label="Size"></td>
                  <td><input name="units[beds][]" value="<?= n24_e($u[5]) ?>" inputmode="numeric" aria-label="Bedrooms"></td>
                  <td><input name="units[garden][]" value="<?= n24_e($u[4]) ?>" inputmode="decimal" aria-label="Garden"></td>
                  <td><input name="units[price][]" value="<?= n24_e($u[2]) ?>" inputmode="numeric" aria-label="Price" placeholder="On request"></td>
                  <td><select name="units[status][]" aria-label="Status"><option value="">Available</option><option<?= $u[3] === 'Reserved' ? ' selected' : '' ?>>Reserved</option><option<?= $u[3] === 'Sold' ? ' selected' : '' ?>>Sold</option></select></td>
                  <td><button type="button" class="link" data-unit-remove aria-label="Remove row">✕</button></td>
                </tr>
                <?php endforeach; ?>
              </tbody>
            </table>
          </div>
          <button type="button" class="btn btn-light" id="unit-add">+ Add a row</button>
        </section>

        <section class="card">
          <h2>More</h2>
          <div class="grid3">
            <label>Project
              <select name="project">
                <?php foreach (N24_PROJECTS as $k => $name) echo '<option value="' . $k . '"' . ($v['project'] === $k ? ' selected' : '') . '>' . n24_e($name) . '</option>'; ?>
              </select>
            </label>
            <label>Web address <small>(made from the title; change only if needed)</small>
              <input name="slug" value="<?= $f('slug') ?>" placeholder="made from the title"></label>
          </div>
          <label class="check"><input type="checkbox" name="renders" value="1"<?= $v['renders'] ? ' checked' : '' ?>> Some images are visualisations (renders); a note is shown under the photos</label>
          <label class="check"><input type="checkbox" name="hidden" value="1"<?= $v['hidden'] ? ' checked' : '' ?>> Hide from the website (keep it here, for example while it is reserved or not ready)</label>
        </section>

        <div class="savebar">
          <button class="btn" id="save">Save</button>
          <a href="/manage/" class="btn btn-light">Cancel</a>
        </div>
      </form>
      <?php if (!$isNew): ?>
      <form method="post" action="/manage/?a=delete" class="delete-form" data-title="<?= n24_e($l['title']) ?>">
        <input type="hidden" name="csrf" value="<?= n24_e(n24_csrf()) ?>">
        <input type="hidden" name="id" value="<?= n24_e($l['id']) ?>">
        <button class="btn btn-danger">Delete this listing</button>
        <span class="hint">Deletes the listing and its photos from the website. This cannot be undone.</span>
      </form>
      <?php endif;
    }, ['/assets/js/image-prep.js', '/manage/admin.js']);
    exit;
}

// Listing overview
page('Listings', function () use ($list) { ?>
  <div class="list-head">
    <h1>Listings <span class="count"><?= count($list) ?></span></h1>
    <a class="btn" href="/manage/?a=new">+ Add listing</a>
  </div>
  <input type="search" id="filter" class="filter" placeholder="Search by title, place or reference" aria-label="Search listings">
  <ul class="rows" id="rows">
    <?php foreach ($list as $l):
        $search = mb_strtolower($l['title'] . ' ' . $l['id'] . ' ' . n24_area_name($l['area'] ?? '') . ' ' . ($l['status'] ?? '')); ?>
      <li data-search="<?= n24_e($search) ?>">
        <a class="row" href="/manage/?a=edit&amp;id=<?= n24_e($l['id']) ?>">
          <span class="thumb"><?php if (!empty($l['img'])): ?><img src="/assets/img/listings/<?= n24_e($l['img']) ?>-640.webp" alt="" loading="lazy"><?php endif; ?></span>
          <span class="info">
            <strong><?= n24_e($l['title']) ?></strong>
            <span><?= n24_e(strtoupper($l['id'])) ?> · <?= n24_e(n24_area_name($l['area'] ?? '')) ?> · <?= n24_e(N24_TYPES[$l['type']] ?? '') ?><?= !empty($l['status']) ? ' · ' . n24_e($l['status']) : '' ?></span>
          </span>
          <span class="price"><?= !empty($l['price']) ? (!empty($l['units']) ? 'from ' : '') . n24_euro($l['price']) : 'on request' ?></span>
          <?php if (!empty($l['hidden'])): ?><span class="badge">Hidden</span><?php endif; ?>
        </a>
      </li>
    <?php endforeach; ?>
  </ul>
<?php }, ['/manage/admin.js']);

// ------------------------------------------------------------------ layout
function page(string $title, callable $body, array $scripts = []): void
{
    $flash = $_SESSION['flash'] ?? null;
    unset($_SESSION['flash']);
    $v = @filemtime(__DIR__ . '/admin.css') . @filemtime(__DIR__ . '/admin.js');
    ?><!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title><?= n24_e($title) ?> | N24 admin</title>
<link rel="icon" href="/brand/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/manage/admin.css?v=<?= n24_e($v) ?>">
</head>
<body>
<header class="top">
  <a class="brand" href="/manage/"><span class="frame" aria-hidden="true"></span>N24 <small>admin</small></a>
  <?php if (n24_logged_in()): ?>
  <nav>
    <a href="/" target="_blank" rel="noopener">Website</a>
    <a href="/manage/?a=backup">Download backup</a>
    <a href="/manage/?a=password">Password</a>
    <form method="post" action="/manage/?a=logout"><input type="hidden" name="csrf" value="<?= n24_e(n24_csrf()) ?>"><button class="link">Log out</button></form>
  </nav>
  <?php endif; ?>
</header>
<main class="wrap">
<?php if ($flash): ?>
  <p class="msg msg-<?= $flash[1] === 'error' ? 'error' : 'ok' ?>"><?= n24_e($flash[0]) ?><?php if (!empty($flash[2])): ?> · <a href="<?= n24_e($flash[2]) ?>" target="_blank" rel="noopener">View on website</a><?php endif; ?></p>
<?php endif; ?>
<?php $body(); ?>
</main>
<?php foreach ($scripts as $s) echo '<script src="' . n24_e($s) . '?v=' . n24_e($v) . '"></script>' . "\n"; ?>
</body>
</html>
<?php
}
