<?php
header('Content-Type: application/json');

$dbhost = "localhost";
$dbname = "ulib";
$dbuser = "root";
$password = "";

try {
    $pdo = new PDO("mysql:host=$dbhost;dbname=$dbname;charset=utf8", $dbuser, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $input = json_decode(file_get_contents("php://input"), true);

    $userID = $_SESSION['user_id'];
    $ISBN = $input['bookISBN'];
    $reserveStart = $input['reserve_start'];
    $reserveEnd = $input['reserve_end'];

    if (!$userID || !$ISBN || !$reserveStart || !$reserveEnd) {
        echo json_encode([
            "success" => false,
            "message" => "Missing required parameters"
        ]);
        exit;
    }

    $stmt = $pdo->prepare("
        INSERT INTO reserved (UserID, ISBN, ReserveDate, ReturnDate)
        VALUES (?, ?, ?, ?)
    ");

    $success = $stmt->execute([$userID, $ISBN, $reserveStart, $reserveEnd]);

    echo json_encode([
        "success" => $success,
        "message" => $success ? "Reservation saved" : "Failed to reserve"
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}