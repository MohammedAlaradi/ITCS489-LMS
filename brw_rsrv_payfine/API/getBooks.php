<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$dbhost = "localhost";
$dbname = "lms_test";
$dbuser = "root";
$password = "";

try {
    $pdo = new PDO("mysql:host=$dbhost;dbname=$dbname;charset=utf8", $dbuser, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    
    $sql = "SELECT ISBN, Title, Author, Genre, YearofPublish, Copies FROM book";
    $stmt = $pdo->query($sql);
    $books = $stmt->fetchAll(PDO::FETCH_ASSOC);

    
    foreach ($books as &$book) {
        $book['Cover'] = "../API/getCover.php?isbn=" . $book['ISBN'];
    }

    echo json_encode($books);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error']);
}
