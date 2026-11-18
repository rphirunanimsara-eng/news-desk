<?php
require '../config/db.php';
require_login();
$title = trim($_POST['title'] ?? ''); $content = trim($_POST['content'] ?? '');
if ($title === '' || $content === '') out(['error' => 'Title and content are required'], 400);
$img = upload_image('image');
$excerpt = mb_substr($content, 0, 150);
$cat = (int)$_POST['category_id'];
$stmt = $conn->prepare("INSERT INTO articles (title,excerpt,content,category_id,image,author_id,status) VALUES (?,?,?,?,?,?, 'pending')");
$stmt->bind_param('sssisi', $title, $excerpt, $content, $cat, $img, $_SESSION['user_id']);
$stmt->execute();
out(['ok' => true]);