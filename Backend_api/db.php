<?php
// db.php – DO NOT echo anything here
$DB_HOST = "127.0.0.1";
$DB_PORT = 3306;
$DB_NAME = "journal_db";
$DB_USER = "journal_user";
$DB_PASS = "Kamalsharma@264";

try {
    $dsn = "mysql:host=$DB_HOST;port=$DB_PORT;dbname=$DB_NAME;charset=utf8mb4";
    $pdo = new PDO($dsn, $DB_USER, $DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (PDOException $e) {
    // Throw so the caller can JSON-encode a proper error
    throw $e;
}
