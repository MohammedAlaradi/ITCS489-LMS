<?php
header('Content-Type: application/json');

$dbhost = "localhost";
$dbname = "lms_test";
$dbuser = "root";
$password = "";

try {
    $pdo = new PDO("mysql:host=$dbhost;dbname=$dbname;charset=utf8", $dbuser, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$sql = "SELECT b.ISBN, b.borrow_date, b.return_date,
bk.Title, bk.Author, bk.cover
        FROM borrow b
        JOIN book bk WHERE bk.ISBN = b.ISBN";
$stmt = $pdo->prepare($sql);
$stmt->execute();

echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}