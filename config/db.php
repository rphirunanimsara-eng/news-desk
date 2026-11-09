<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

$conn = new mysqli('localhost', 'root', '', 'newsdesk');
if ($conn->connect_error) { http_response_code(500); die(json_encode(['error' => 'Database error'])); }
$conn->set_charset('utf8mb4');

function out($data, $code = 200) { http_response_code($code); echo json_encode($data); exit; }
function require_login() { if (!isset($_SESSION['user_id'])) out(['error' => 'Please login first'], 401); }
function require_admin() { if (($_SESSION['role'] ?? '') !== 'admin') out(['error' => 'Admin only'], 403); }

function upload_image($field) {
    if (empty($_FILES[$field]['name']) || $_FILES[$field]['error'] !== 0) return null;
    $ext = strtolower(pathinfo($_FILES[$field]['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, ['jpg', 'jpeg', 'png', 'webp'])) return null;
    if ($_FILES[$field]['size'] > 5 * 1024 * 1024) return null;
    $name = uniqid('img_') . '.' . $ext;
    move_uploaded_file($_FILES[$field]['tmp_name'], __DIR__ . '/../assets/uploads/' . $name);
    return $name;
}