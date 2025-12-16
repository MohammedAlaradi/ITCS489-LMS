<?php
header("Content-Type: application/json");
require_once "db.php";

$action = $_GET['action'] ?? '';

/* =========================
   GET ALL FINES
========================= */
if ($action === "getFines") {
    $stmt = $pdo->query("
        SELECT 
            f.FinePatch,
            f.id AS user_id,
            CONCAT(u.FirstName,' ',u.LastName) AS user_name,
            f.ISBN,
            b.Title AS book_title,
            f.FineAmount,
            f.FineRate,
            f.Status,
            f.Notes
        FROM fine f
        JOIN users u ON f.id = u.id
        LEFT JOIN book b ON f.ISBN = b.ISBN
        ORDER BY f.FinePatch DESC
    ");

    echo json_encode([
        "success" => true,
        "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)
    ]);
    exit;
}

/* =========================
   GET FINE HISTORY
========================= */
if ($action === "getFineHistory") {
    $stmt = $pdo->query("
        SELECT 
            h.ChangeDate,
            h.FinePatch,
            CONCAT(u.FirstName,' ',u.LastName) AS user_name,
            h.ISBN,
            h.OldStatus,
            h.NewStatus,
            h.Amount,
            h.Notes,
            h.UpdatedBy
        FROM fine_history h
        JOIN users u ON h.id = u.id
        ORDER BY h.ChangeDate DESC
    ");

    echo json_encode([
        "success" => true,
        "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)
    ]);
    exit;
}

/* =========================
   UPDATE FINE
========================= */
if ($action === "updateFine") {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data) {
        echo json_encode(["success" => false, "message" => "Invalid data"]);
        exit;
    }

    $pdo->beginTransaction();

    try {
        // Get previous status
        $prevStmt = $pdo->prepare("
            SELECT Status 
            FROM fine 
            WHERE FinePatch = ?
        ");
        $prevStmt->execute([$data['FinePatch']]);
        $prev = $prevStmt->fetch(PDO::FETCH_ASSOC);

        // Update fine
        $stmt = $pdo->prepare("
            UPDATE fine
            SET 
                FineAmount = ?,
                FineRate   = ?,
                Status     = ?,
                Notes      = ?,
                ISBN       = ?
            WHERE FinePatch = ?
        ");

        $stmt->execute([
            $data['FineAmount'],
            $data['FineRate'],
            $data['Status'],
            $data['Notes'],
            $data['ISBN'],
            $data['FinePatch']
        ]);

        // Insert history
        $hist = $pdo->prepare("
            INSERT INTO fine_history
            (ChangeDate, FinePatch, id, ISBN, OldStatus, NewStatus, Amount, Notes, UpdatedBy)
            VALUES (CURDATE(), ?, ?, ?, ?, ?, ?, ?, 'Admin')
        ");

        $hist->execute([
            $data['FinePatch'],
            $data['id'],          // user id
            $data['ISBN'],
            $prev['Status'],
            $data['Status'],
            $data['FineAmount'],
            $data['Notes']
        ]);

        $pdo->commit();
        echo json_encode(["success" => true]);
    } catch (Exception $e) {
        $pdo->rollBack();
        echo json_encode([
            "success" => false,
            "message" => $e->getMessage()
        ]);
    }
    exit;
}

/* =========================
   MARK FINE AS PAID
========================= */
if ($action === "markFinePaid") {
    $data = json_decode(file_get_contents("php://input"), true);
    $finePatch = $data['FinePatch'] ?? null;

    if (!$finePatch) {
        echo json_encode(["success" => false, "message" => "FinePatch missing"]);
        exit;
    }

    $pdo->beginTransaction();

    try {
        $prevStmt = $pdo->prepare("
            SELECT id, ISBN, FineAmount, Status
            FROM fine
            WHERE FinePatch = ?
        ");
        $prevStmt->execute([$finePatch]);
        $fine = $prevStmt->fetch(PDO::FETCH_ASSOC);

        $pdo->prepare("
            UPDATE fine
            SET Status = 'Paid'
            WHERE FinePatch = ?
        ")->execute([$finePatch]);

        $pdo->prepare("
            INSERT INTO fine_history
            (ChangeDate, FinePatch, id, ISBN, OldStatus, NewStatus, Amount, Notes, UpdatedBy)
            VALUES (CURDATE(), ?, ?, ?, ?, 'Paid', ?, 'Marked as paid', 'Admin')
        ")->execute([
            $finePatch,
            $fine['id'],
            $fine['ISBN'],
            $fine['Status'],
            $fine['FineAmount']
        ]);

        $pdo->commit();
        echo json_encode(["success" => true]);
    } catch (Exception $e) {
        $pdo->rollBack();
        echo json_encode(["success" => false]);
    }
    exit;
}

/* =========================
   GET USER INFO
========================= */
if ($action === "getUser") {
    $id = $_GET['id'] ?? '';

    $stmt = $pdo->prepare("
        SELECT 
            FirstName,
            LastName,
            Email,
            PhoneNumber
        FROM users
        WHERE id = ?
    ");
    $stmt->execute([$id]);

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => (bool)$user,
        "user" => $user
    ]);
    exit;
}

/* =========================
   GET BOOK INFO
========================= */
if ($action === "getBook") {
    $isbn = $_GET['ISBN'] ?? '';

    $stmt = $pdo->prepare("
        SELECT Title, Author, ISBN
        FROM book
        WHERE ISBN = ?
    ");
    $stmt->execute([$isbn]);

    $book = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => (bool)$book,
        "book" => $book
    ]);
    exit;
}

echo json_encode([
    "success" => false,
    "message" => "Invalid action"
]);
