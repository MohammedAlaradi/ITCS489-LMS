<?php
session_start();
header('Content-Type: application/json');

$dbhost = "localhost";
$dbname = "ulib";
$dbuser = "root";
$password = "";

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
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
    $fineID = $input['fine_id'] ?? null;

    if (!$fineID) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing fine_id']);
        exit;
    }

    $pdo->beginTransaction();

    // Ensure fine belongs to this user and is unpaid
    $check = $pdo->prepare("
        SELECT Status
        FROM fine
        WHERE FinePatch = :fine_id AND UserID = :user_id
        LIMIT 1
    ");
    $check->execute([
        ':fine_id' => $fineID,
        ':user_id' => $userID
    ]);

    $fine = $check->fetch(PDO::FETCH_ASSOC);

    if (!$fine || $fine['Status'] === 'Paid') {
        $pdo->rollBack();
        echo json_encode([
            'success' => false,
            'message' => 'Fine not found or already paid'
        ]);
        exit;
    }

    // Mark fine as paid
    $update = $pdo->prepare("
        UPDATE fine
        SET Status = 'Paid'
        WHERE FinePatch = :fine_id
    ");
    $update->execute([':fine_id' => $fineID]);

    $pdo->commit();

    echo json_encode([
        'success' => true,
        'message' => 'Fine paid successfully'
    ]);

} catch (PDOException $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error',
        'details' => $e->getMessage()
    ]);
}
?>