<?php
require '../config/db.php';
$stmt = $conn->prepare("SELECT * FROM users WHERE email=?");
$stmt->bind_param('s', $_POST['email']);
$stmt->execute();
$u = $stmt->get_result()->fetch_assoc();
if ($u && password_verify($_POST['password'], $u['password'])) {
    $_SESSION['user_id'] = $u['id'];
    $_SESSION['name'] = $u['name'];
    $_SESSION['role'] = $u['role'];
    out(['ok' => true, 'role' => $u['role']]);
}
out(['error' => 'Wrong email or password.'], 401);