<?php
/**
 * Admin login: one account (Tomislav), created once on /admin/ with the setup code.
 * The password is stored only as a hash in api/data/admin-config.php.
 * Sessions expire after 8 hours without activity; every form carries a CSRF token;
 * after 8 wrong passwords from one address, login pauses for 15 minutes.
 */

require_once __DIR__ . '/store.php';

define('N24_ADMIN_CONFIG', N24_DATA . '/admin-config.php');
define('N24_LOGIN_LOG', N24_DATA . '/login-attempts.json');
define('N24_SESSION_IDLE', 8 * 3600);
define('N24_LOGIN_MAX_FAILS', 8);
define('N24_LOGIN_WINDOW', 15 * 60);

function n24_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }
    $secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (($_SERVER['SERVER_PORT'] ?? '') === '443');
    session_name('n24admin');
    session_set_cookie_params(['lifetime' => 0, 'path' => '/admin/', 'secure' => $secure, 'httponly' => true, 'samesite' => 'Lax']);
    session_start();
    if (!empty($_SESSION['user']) && (time() - ($_SESSION['seen'] ?? 0)) > N24_SESSION_IDLE) {
        $_SESSION = [];
        session_regenerate_id(true);
    }
    $_SESSION['seen'] = time();
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
    }
}

function n24_is_setup(): bool
{
    return is_file(N24_ADMIN_CONFIG);
}

function n24_admin_config(): array
{
    $c = n24_is_setup() ? include N24_ADMIN_CONFIG : null;
    return is_array($c) ? $c : [];
}

function n24_logged_in(): bool
{
    return !empty($_SESSION['user']);
}

function n24_csrf(): string
{
    return $_SESSION['csrf'] ?? '';
}

function n24_check_csrf(): void
{
    $sent = (string) ($_POST['csrf'] ?? $_SERVER['HTTP_X_CSRF'] ?? '');
    if ($sent === '' || !hash_equals(n24_csrf(), $sent)) {
        http_response_code(400);
        exit('The form expired. Go back, reload the page and try again.');
    }
}

function n24_write_config(string $user, string $password): void
{
    if (!is_dir(N24_DATA)) {
        mkdir(N24_DATA, 0750, true);
    }
    $php = "<?php\n// Admin login for /admin/. Written by the admin; the password is only stored as a hash.\nreturn " .
        var_export(['user' => $user, 'hash' => password_hash($password, PASSWORD_DEFAULT), 'changed' => date('c')], true) . ";\n";
    if (file_put_contents(N24_ADMIN_CONFIG . '.tmp', $php) === false || !rename(N24_ADMIN_CONFIG . '.tmp', N24_ADMIN_CONFIG)) {
        throw new RuntimeException('The login could not be saved on the server (folder api/data is not writable).');
    }
    @chmod(N24_ADMIN_CONFIG, 0640);
    if (function_exists('opcache_invalidate')) {
        @opcache_invalidate(N24_ADMIN_CONFIG, true);
    }
}

/** Returns an error message, or '' when the password is acceptable. */
function n24_password_problem(string $password, string $repeat): string
{
    if (mb_strlen($password) < 10) {
        return 'The password needs at least 10 characters.';
    }
    if ($password !== $repeat) {
        return 'The two passwords are not the same.';
    }
    return '';
}

function n24_ip_key(): string
{
    return hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '') . '|n24');
}

function n24_login_blocked(): bool
{
    $log = json_decode((string) @file_get_contents(N24_LOGIN_LOG), true) ?: [];
    $recent = array_filter($log[n24_ip_key()] ?? [], function ($t) { return $t > time() - N24_LOGIN_WINDOW; });
    return count($recent) >= N24_LOGIN_MAX_FAILS;
}

function n24_login_failed(): void
{
    $log = json_decode((string) @file_get_contents(N24_LOGIN_LOG), true) ?: [];
    foreach ($log as $k => $times) {
        $log[$k] = array_values(array_filter($times, function ($t) { return $t > time() - N24_LOGIN_WINDOW; }));
        if (!$log[$k]) unset($log[$k]);
    }
    $log[n24_ip_key()][] = time();
    @file_put_contents(N24_LOGIN_LOG, json_encode($log), LOCK_EX);
}

function n24_login(string $user, string $password): bool
{
    $c = n24_admin_config();
    $ok = $c && hash_equals(mb_strtolower($c['user']), mb_strtolower(trim($user))) && password_verify($password, $c['hash']);
    if (!$ok) {
        n24_login_failed();
        usleep(400000);
        return false;
    }
    session_regenerate_id(true);
    $_SESSION['user'] = $c['user'];
    $_SESSION['csrf'] = bin2hex(random_bytes(32));
    return true;
}

function n24_logout(): void
{
    $_SESSION = [];
    session_regenerate_id(true);
}
