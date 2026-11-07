<?php
// Contact form on the contact page of every language: sends the enquiry by email to
// info@n24.hr (info@ forwards to Tomislav). Reply-To is the visitor, so "Reply"
// answers them. The visitor's language is in the email, and the answers on the page
// are in that language. Answers JSON to the page's script; without JavaScript it
// redirects back to the form.

declare(strict_types=1);

ini_set('display_errors', '0'); // warnings must not break the JSON answer

const TO   = 'info@n24.hr';
const FROM = 'info@n24.hr';           // must be an address on this domain, or mail is marked as spam
const SITE = 'https://n24.hr';
const TOPICS = ['buy' => 'Buy', 'sell' => 'Sell', 'land' => 'Land and investment', 'other' => 'Something else'];

$wantsJson = strpos($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json') !== false;

// Texts of the visitor's language (api/views/i18n.json, written by the build).
$i18n = json_decode((string) @file_get_contents(__DIR__ . '/views/i18n.json'), true) ?: [];
$lang = (string) ($_POST['lang'] ?? '');
if (!isset($i18n['ui'][$lang])) {
    $lang = $i18n['default'] ?? 'hr';
}
$ui = $i18n['ui'][$lang] ?? [];
$t = $ui['contact'] ?? [];
$contactUrl = $ui['contact_url'] ?? '/kontakt/';
$msg = static function (string $key, string $fallback) use ($t): string {
    return (string) ($t[$key] ?? $fallback);
};

function done(bool $ok, string $msg, int $code = 200): void {
    global $wantsJson, $contactUrl;
    if ($wantsJson) {
        http_response_code($code);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => $ok, 'message' => $msg], JSON_UNESCAPED_UNICODE);
    } else {
        header('Location: ' . $contactUrl . '?' . ($ok ? 'sent=1' : 'error=1') . '#enquiry', true, 303);
    }
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Location: ' . $contactUrl, true, 303);
    exit;
}

$field = static fn(string $k, int $max): string =>
    mb_substr(trim(str_replace(["\r", "\0"], '', (string) ($_POST[$k] ?? ''))), 0, $max);

// Spam trap: a hidden field people never see or fill in. Bots get a fake "sent".
if ($field('website', 200) !== '') {
    done(true, $msg('sent', 'Thank you.'));
}

$name    = preg_replace('/[\n\t]+/', ' ', $field('name', 120));
$email   = $field('email', 200);
$phone   = preg_replace('/[\n\t]+/', ' ', $field('phone', 60));
$message = $field('message', 5000);
$topic   = TOPICS[$field('topic', 20)] ?? 'Something else';
$consent = !empty($_POST['consent']);

if (mb_strlen($name) < 2 || !filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($message) < 5 || !$consent) {
    done(false, $msg('invalid', 'Please fill in your name, email and message, and tick the box.'), 422);
}

// At most 5 enquiries per visitor (IP) per hour.
$dir = sys_get_temp_dir() . '/n24-contact';
@mkdir($dir, 0700, true);
$stamp = $dir . '/' . hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '') . 'n24');
$times = array_filter(
    array_map('intval', @file($stamp, FILE_IGNORE_NEW_LINES) ?: []),
    static fn(int $t): bool => $t > time() - 3600
);
if (count($times) >= 5) {
    done(false, $msg('too_many', 'Too many messages. Please call or WhatsApp +385 95 700 7001.'), 429);
}
$times[] = time();
@file_put_contents($stamp, implode("\n", $times));

$subject = 'Website enquiry: ' . $topic . ' - ' . $name;
$body = implode("\n", [
    'New enquiry from ' . SITE . $contactUrl,
    '',
    'Language: ' . ($ui['name'] ?? $lang),
    'Topic:   ' . $topic,
    'Name:    ' . $name,
    'Email:   ' . $email,
    'Phone:   ' . ($phone !== '' ? $phone : '-'),
    '',
    'Message:',
    $message,
    '',
    '--',
    'Sent ' . date('d.m.Y H:i') . '. Reply to this email to answer ' . $name . '.',
]);
$headers = implode("\r\n", [
    'From: N24 website <' . FROM . '>',
    'Reply-To: ' . mb_encode_mimeheader($name) . ' <' . $email . '>',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'X-Mailer: n24.hr',
]);

$sent = @mail(TO, mb_encode_mimeheader($subject, 'UTF-8'), $body, $headers, '-f' . FROM);

$sent
    ? done(true, $msg('sent', 'Thank you, your enquiry has been sent. Tomislav will reply by email.'))
    : done(false, $msg('failed', 'Sending failed. Please call or WhatsApp +385 95 700 7001.'), 500);
