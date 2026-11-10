<?php
require '../config/db.php';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_login();
    $aid = (int)$_POST['article_id']; $body = trim($_POST['body'] ?? '');
    if ($body === '') out(['error' => 'Write something first'], 400);
    $stmt = $conn->prepare("INSERT INTO comments (article_id,user_id,body) VALUES (?,?,?)");
    $stmt->bind_param('iis', $aid, $_SESSION['user_id'], $body);
    $stmt->execute();
    out(['ok' => true]);
}
$aid = (int)($_GET['article_id'] ?? 0);
$stmt = $conn->prepare("SELECT cm.body, cm.created_at, u.name FROM comments cm JOIN users u ON u.id=cm.user_id WHERE cm.article_id=? ORDER BY cm.created_at DESC");
$stmt->bind_param('i', $aid);
$stmt->execute();
out($stmt->get_result()->fetch_all(MYSQLI_ASSOC));