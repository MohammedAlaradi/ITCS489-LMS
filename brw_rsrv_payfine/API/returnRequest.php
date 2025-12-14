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
    $ISBN = $input['ISBN'] ?? null;

    if (!$ISBN) {
        echo json_encode(["success" => false, "error" => "Missing ISBN"]);
        exit;
    }

    // Begin transaction
    $pdo->beginTransaction();

    //Delete from borrow table
    $stmt = $pdo->prepare("DELETE FROM borrow WHERE ISBN = ?");
    $successBorrowDelete = $stmt->execute([$ISBN]);

    //Update number of copies in book table
    $stmt2 = $pdo->prepare("UPDATE book SET Copies = Copies + 1 WHERE ISBN = ?");
    $successCopiesUpdate = $stmt2->execute([$ISBN]);

    //If both succeeded, commit
    if ($successBorrowDelete && $successCopiesUpdate) {
        $pdo->commit();
        echo json_encode(["success" => true]);
    } else {
        //Rollback on error
        $pdo->rollBack();
        echo json_encode(["success" => false, "error" => "Failed to update database"]);
    }

} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
