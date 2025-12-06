<?php
header('Content-Type: application/json');

$dbhost = "localhost";
$dbname = "lms_test";
$dbuser = "root";
$password = "";

try {
    $pdo = new PDO("mysql:host=$dbhost;dbname=$dbname;charset=utf8", $dbuser, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $input = json_decode(file_get_contents("php://input"), true);

    $ISBN = $input['bookISBN'] ?? null;
    $reserveStart = $input['reserve_start'] ?? null;
    $reserveEnd = $input['reserve_end'] ?? null;

    if (!$ISBN || !$reserveStart || !$reserveEnd) {
        echo json_encode([
            "success" => false,
            "message" => "Missing required parameters"
        ]);
        exit;
    }

    $stmt = $pdo->prepare("
        INSERT INTO reserve (ISBN, reserve_start, reserve_end)
        VALUES (?, ?, ?)
    ");

    $success = $stmt->execute([$ISBN, $reserveStart, $reserveEnd]);

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