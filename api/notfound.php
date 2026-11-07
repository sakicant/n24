<?php
// ErrorDocument 404 (see .htaccess): the "page not found" page in the language of
// the address that was asked for (/de/... gets the German one, / the Croatian one).
ini_set('display_errors', '0');
$path = (string) parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$lang = preg_match('#^/(en|de|pl|cs|sk)(/|$)#', $path, $m) ? $m[1] : '';
$file = dirname(__DIR__) . ($lang ? '/' . $lang : '') . '/404.html';
http_response_code(404);
header('Content-Type: text/html; charset=utf-8');
readfile(is_file($file) ? $file : dirname(__DIR__) . '/404.html');
