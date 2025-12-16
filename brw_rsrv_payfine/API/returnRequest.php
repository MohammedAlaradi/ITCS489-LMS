<?php
session_start();
header('Content-Type: application/json');

$dbhost = "localhost";
$dbname = "ulib";
$dbuser = "root";
$password = "";

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "error" => "User not logged in"]);
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
    $ISBN = $input['ISBN'] ?? null;

    if (!$ISBN) {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "Missing ISBN"]);
        exit;
    }

    $pdo->beginTransaction();

    // 1. Delete ONLY this user's borrowed record
    $deleteStmt = $pdo->prepare("
        DELETE FROM borrowed
        WHERE ISBN = :isbn AND user_id = :user_id
        LIMIT 1
    ");
    $deleteStmt->execute([
        ':isbn'    => $ISBN,
        ':user_id'=> $userID
    ]);

    if ($deleteStmt->rowCount() === 0) {
        $pdo->rollBack();
        echo json_encode([
            "success" => false,
            "error" => "Borrow record not found for this user"
        ]);
        exit;
    }

    // 2. Increase book copies
    $updateStmt = $pdo->prepare("
        UPDATE book
        SET Copies = Copies + 1
        WHERE ISBN = :isbn
    ");
    $updateStmt->execute([':isbn' => $ISBN]);

    $pdo->commit();
    echo json_encode(["success" => true]);

} catch (PDOException $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Database error",
        "details" => $e->getMessage()
    ]);
}
?>