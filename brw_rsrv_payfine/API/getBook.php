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
    
    // Get book ID from query parameter
    $bookId = $_GET['id'] ?? null;
    
    if (!$bookId) {
        http_response_code(400);
        echo json_encode(['error' => 'Book ID is required']);
        exit;
    }
    
    // Fetch specific book - adjust column names based on your database
    $sql = "SELECT * FROM book WHERE id = :id OR bookID = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':id' => $bookId]);
    $book = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($book) {
        echo json_encode($book);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Book not found']);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>