<?php
session_start();
header('Content-Type: application/json');

$dbhost = "localhost";
$dbname = "ulib";
$dbuser = "root";
$password = "";

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'User not logged in']);
    exit;
}

$userID = $_SESSION['user_id'];

try {
    $pdo = new PDO(
        "mysql:host=$dbhost;dbname=$dbname;charset=utf8",
        $dbuser,
        $password,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    $sql = "
        SELECT
            f.FinePatch        AS fine_id,
            f.ISBN,
            f.DueDate,
            f.FineRate,
            f.FineAmount,
            f.Status,
            f.Reason,
            bk.Title
        FROM fine f
        LEFT JOIN book bk ON bk.ISBN = f.ISBN
        WHERE f.UserID = :user_id
          AND f.Status IN ('Pending', 'Overdue')
        ORDER BY f.DueDate ASC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':user_id', $userID, PDO::PARAM_INT);
    $stmt->execute();

    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Database error',
        'details' => $e->getMessage()
    ]);
}
?>