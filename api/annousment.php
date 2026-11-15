<?php
require '../config/db.php';
out($conn->query("SELECT * FROM announcements ORDER BY created_at DESC LIMIT 5")->fetch_all(MYSQLI_ASSOC));