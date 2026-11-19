<?php
require '../config/db.php';
out($conn->query("SELECT * FROM categories ORDER BY name")->fetch_all(MYSQLI_ASSOC));