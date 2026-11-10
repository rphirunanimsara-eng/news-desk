<?php
require '../config/db.php';
out([
    'logged_in' => isset($_SESSION['user_id']),
    'name'      => $_SESSION['name'] ?? '',
    'role'      => $_SESSION['role'] ?? ''
]);