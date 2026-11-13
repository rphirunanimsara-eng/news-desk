<?php
require '../config/db.php';
$name = trim($_POST['name'] ?? ''); $email = trim($_POST['email'] ?? ''); $pass = $_POST['password'] ?? '';
if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($pass) < 6) {
    out(['error' => 'Fill all fields. Password needs at least 6 characters.'], 400);
}
$hash = password_hash($pass, PASSWORD_DEFAULT);
$stmt = $conn->prepare("INSERT INTO users (name,email,password) VALUES (?,?,?)");
$stmt->bind_param('sss', $name, $email, $hash);
if ($stmt->execute()) out(['ok' => true]);
out(['error' => 'That email is already registered.'], 400);