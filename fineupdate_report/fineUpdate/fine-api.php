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
            f.id,
            f.member_id,
            m.name AS member_name,
            f.book_id,
            b.title AS book_title,
            f.amount,
            f.due_date,
            f.status,
            f.reason,
            f.notes
        FROM fines f
        LEFT JOIN members m ON f.member_id = m.id
        LEFT JOIN books b ON f.book_id = b.id
        ORDER BY f.id DESC
    ");
    echo json_encode(["success" => true, "data" => $stmt->fetchAll()]);
    exit;
}

/* =========================
   GET FINE HISTORY
========================= */
if ($action === "getFineHistory") {
    $stmt = $pdo->query("SELECT * FROM fine_history ORDER BY date DESC");
    echo json_encode(["success" => true, "data" => $stmt->fetchAll()]);
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
        // Previous status
        $prev = $pdo->prepare("SELECT status FROM fines WHERE id=?");
        $prev->execute([$data['fine_id']]);
        $previousStatus = $prev->fetchColumn() ?: '-';

        // Update fine
        $stmt = $pdo->prepare("
            UPDATE fines 
            SET amount=?, reason=?, status=?, notes=?
            WHERE id=?
        ");
        $stmt->execute([
            $data['amount'],
            $data['reason'],
            $data['status'],
            $data['notes'],
            $data['fine_id']
        ]);

        // Insert history
        $hist = $pdo->prepare("
            INSERT INTO fine_history
            (date, member_id, book_id, amount, previous_status, new_status, updated_by, notes)
            VALUES (CURDATE(), ?, ?, ?, ?, ?, 'Admin', ?)
        ");
        $hist->execute([
            $data['member_id'],
            $data['book_id'],
            $data['amount'],
            $previousStatus,
            $data['status'],
            $data['notes']
        ]);

        $pdo->commit();
        echo json_encode(["success" => true]);
    } catch (Exception $e) {
        $pdo->rollBack();
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }
    exit;
}

/* =========================
   MARK FINE PAID
========================= */
if ($action === "markFinePaid") {
    $data = json_decode(file_get_contents("php://input"), true);
    $fineId = $data['fine_id'] ?? null;

    if (!$fineId) {
        echo json_encode(["success" => false]);
        exit;
    }

    $pdo->beginTransaction();
    try {
        $prev = $pdo->prepare("SELECT * FROM fines WHERE id=?");
        $prev->execute([$fineId]);
        $fine = $prev->fetch();

        $pdo->prepare("UPDATE fines SET status='Paid' WHERE id=?")
            ->execute([$fineId]);

        $pdo->prepare("
            INSERT INTO fine_history
            (date, member_id, book_id, amount, previous_status, new_status, updated_by, notes)
            VALUES (CURDATE(), ?, ?, ?, ?, 'Paid', 'Admin', 'Marked paid')
        ")->execute([
            $fine['member_id'],
            $fine['book_id'],
            $fine['amount'],
            $fine['status']
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
   GET MEMBER INFO
========================= */
if ($action === "getMember") {
    $id = $_GET['memberId'] ?? '';
    $stmt = $pdo->prepare("SELECT name,email,phone FROM members WHERE id=?");
    $stmt->execute([$id]);
    $member = $stmt->fetch();

    echo json_encode([
        "success" => (bool)$member,
        "member"  => $member
    ]);
    exit;
}

/* =========================
   GET BOOK INFO
========================= */
if ($action === "getBook") {
    $id = $_GET['bookId'] ?? '';
    $stmt = $pdo->prepare("SELECT title,author,isbn FROM books WHERE id=?");
    $stmt->execute([$id]);
    $book = $stmt->fetch();

    echo json_encode([
        "success" => (bool)$book,
        "book"    => $book
    ]);
    exit;
}

echo json_encode(["success" => false, "message" => "Invalid action"]);
