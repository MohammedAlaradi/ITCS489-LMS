<?php
session_start();
header('Content-Type: application/json');

$dbhost = "localhost";
$dbname = "ulib";
$dbuser = "root";
$password = "";

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "User not logged in"
    ]);
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

    $input = json_decode(file_get_contents("php://input"), true);

    $ISBN         = $input['bookISBN']      ?? null;
    $reserveStart = $input['reserve_start'] ?? null;
    $reserveEnd   = $input['reserve_end']   ?? null;

    if (!$ISBN || !$reserveStart || !$reserveEnd) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Missing required parameters"
        ]);
        exit;
    }


    $checkStmt = $pdo->prepare("
        SELECT 1 FROM reserved
        WHERE user_id = :user_id AND ISBN = :isbn
        LIMIT 1
    ");
    $checkStmt->execute([
        ':user_id' => $userID,
        ':isbn'    => $ISBN
    ]);

    if ($checkStmt->fetch()) {
        echo json_encode([
            "success" => false,
            "message" => "You already reserved this book"
        ]);
        exit;
    }

    // Insert reservation
    $insertStmt = $pdo->prepare("
        INSERT INTO reserved (user_id, ISBN, reserveDate, returnDate)
        VALUES (:user_id, :isbn, :reserveDate, :returnDate)
    ");

    $insertStmt->execute([
        ':user_id'    => $userID,
        ':isbn'       => $ISBN,
        ':reserveDate'=> $reserveStart,
        ':returnDate' => $reserveEnd
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Reservation saved successfully"
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error",
        "details" => $e->getMessage()
    ]);
}
?>