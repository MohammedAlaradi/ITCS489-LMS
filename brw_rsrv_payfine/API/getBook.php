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

    
    $bookISBN = $_GET['isbn'] ?? null;

    if (!$bookISBN) {
        http_response_code(400);
        echo json_encode(['error' => 'Book ISBN is required']);
        exit;
    }

    
    $sql = "SELECT ISBN, Title, Author, Edition,  Genre, YearofPublish, Copies
            FROM book WHERE ISBN = :isbn";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':isbn' => $bookISBN]);
    $book = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($book) {
        
        $book['Cover'] = "../API/getCover.php?isbn=" . $book['ISBN'];
        echo json_encode($book);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Book not found']);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error']);
}
