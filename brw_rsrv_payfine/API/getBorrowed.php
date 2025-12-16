<?php
header('Content-Type: application/json');

$dbhost = "localhost";
$dbname = "ulib";
$dbuser = "root";
$password = "";

if (!isset($_SESSION['user_id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing userID']);
    exit;
}

$userID = $_SESSION['user_id'];

try {
    $pdo = new PDO("mysql:host=$dbhost;dbname=$dbname;charset=utf8",$dbuser, $password,[PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);

    $sql = "
        SELECT
            b.ISBN,
            b.borrowDate AS borrow_date,
            b.returnDate AS return_date,
            bk.Title,
            bk.Author
        FROM borrowed b
        JOIN book bk ON bk.ISBN = b.ISBN
        WHERE b.userID = :userID
        ORDER BY b.borrowDate DESC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':userID', $userID, PDO::PARAM_INT);
    $stmt->execute();

    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error']);
}
