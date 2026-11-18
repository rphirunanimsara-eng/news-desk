<?php
require '../config/db.php';
require_admin();
$action = $_REQUEST['action'] ?? '';
$id = (int)($_REQUEST['id'] ?? 0);

switch ($action) {
    case 'stats':
        $n = fn($sql) => (int)$conn->query($sql)->fetch_row()[0];
        out([
            'published' => $n("SELECT COUNT(*) FROM articles WHERE status='published'"),
            'pending'   => $n("SELECT COUNT(*) FROM articles WHERE status='pending'"),
            'students'  => $n("SELECT COUNT(*) FROM users WHERE role='student'"),
            'comments'  => $n("SELECT COUNT(*) FROM comments")
        ]);

    case 'articles':
        out($conn->query("SELECT a.*, c.name cat FROM articles a LEFT JOIN categories c ON c.id=a.category_id ORDER BY a.status='pending' DESC, a.created_at DESC")->fetch_all(MYSQLI_ASSOC));

    case 'article':
        out($conn->query("SELECT * FROM articles WHERE id=$id")->fetch_assoc());

    case 'save_article':
        $title = $_POST['title']; $excerpt = $_POST['excerpt']; $content = $_POST['content'];
        $cat = (int)$_POST['category_id']; $status = $_POST['status'];
        $featured = isset($_POST['featured']) ? 1 : 0; $breaking = isset($_POST['breaking']) ? 1 : 0;
        $old = $id ? $conn->query("SELECT image FROM articles WHERE id=$id")->fetch_row()[0] : null;
        $img = upload_image('image') ?: $old;      // keep old picture if no new one
        if ($id) {
            $stmt = $conn->prepare("UPDATE articles SET title=?,excerpt=?,content=?,category_id=?,image=?,status=?,featured=?,breaking=? WHERE id=?");
            $stmt->bind_param('sssissiii', $title, $excerpt, $content, $cat, $img, $status, $featured, $breaking, $id);
        } else {
            $stmt = $conn->prepare("INSERT INTO articles (title,excerpt,content,category_id,image,status,featured,breaking,author_id) VALUES (?,?,?,?,?,?,?,?,?)");
            $stmt->bind_param('sssissiii', $title, $excerpt, $content, $cat, $img, $status, $featured, $breaking, $_SESSION['user_id']);
        }
        $stmt->execute();
        out(['ok' => true]);

    case 'set_status':
        $stmt = $conn->prepare("UPDATE articles SET status=? WHERE id=?");
        $stmt->bind_param('si', $_POST['status'], $id);
        $stmt->execute();
        out(['ok' => true]);

    case 'delete_article':
        $conn->query("DELETE FROM articles WHERE id=$id");
        out(['ok' => true]);

    case 'add_category':
        $stmt = $conn->prepare("INSERT INTO categories (name) VALUES (?)");
        $stmt->bind_param('s', $_POST['name']);
        $stmt->execute();
        out(['ok' => true]);

    case 'delete_category':
        $conn->query("DELETE FROM categories WHERE id=$id");
        out(['ok' => true]);

    case 'announcements':
        out($conn->query("SELECT * FROM announcements ORDER BY created_at DESC")->fetch_all(MYSQLI_ASSOC));

    case 'add_announcement':
        $stmt = $conn->prepare("INSERT INTO announcements (title) VALUES (?)");
        $stmt->bind_param('s', $_POST['title']);
        $stmt->execute();
        out(['ok' => true]);

    case 'delete_announcement':
        $conn->query("DELETE FROM announcements WHERE id=$id");
        out(['ok' => true]);

    case 'comments':
        out($conn->query("SELECT cm.id, cm.body, u.name, a.title FROM comments cm JOIN users u ON u.id=cm.user_id JOIN articles a ON a.id=cm.article_id ORDER BY cm.created_at DESC")->fetch_all(MYSQLI_ASSOC));

    case 'delete_comment':
        $conn->query("DELETE FROM comments WHERE id=$id");
        out(['ok' => true]);

    default:
        out(['error' => 'Unknown action'], 400);
}