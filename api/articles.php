<?php
require '../config/db.php';
$base = "SELECT a.*, c.name AS cat FROM articles a LEFT JOIN categories c ON c.id=a.category_id WHERE a.status='published'";

if (isset($_GET['id'])) {
    $id = (int)$_GET['id'];
    $stmt = $conn->prepare($base . " AND a.id=?");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc();
    $row ? out($row) : out(['error' => 'Article not found'], 404);
}

$sql = $base; $types = ''; $params = [];
$q = trim($_GET['q'] ?? ''); $cat = (int)($_GET['cat'] ?? 0); $date = $_GET['date'] ?? '';
if ($q !== '')    { $sql .= " AND (a.title LIKE ? OR a.content LIKE ?)"; $types .= 'ss'; $params[] = "%$q%"; $params[] = "%$q%"; }
if ($cat > 0)     { $sql .= " AND a.category_id=?"; $types .= 'i'; $params[] = $cat; }
if ($date !== '') { $sql .= " AND DATE(a.created_at)=?"; $types .= 's'; $params[] = $date; }
if (isset($_GET['featured'])) $sql .= " AND a.featured=1";
if (isset($_GET['breaking'])) $sql .= " AND a.breaking=1";
$sql .= " ORDER BY a.created_at DESC";
if (isset($_GET['limit'])) $sql .= " LIMIT " . (int)$_GET['limit'];

$stmt = $conn->prepare($sql);
if ($types) $stmt->bind_param($types, ...$params);
$stmt->execute();
out($stmt->get_result()->fetch_all(MYSQLI_ASSOC));