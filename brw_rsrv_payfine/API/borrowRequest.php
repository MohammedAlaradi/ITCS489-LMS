<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$dbhost = "localhost";
$dbname = "lms_test";
$dbuser = "root";
$password = "";

try {
    $pdo = new PDO("mysql:host=$dbhost;dbname=$dbname;charset=utf8", $dbuser, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get POST data
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        throw new Exception('No input data received');
    }

    $bookISBN    = $input['bookISBN'] ?? null;
    $borrow_date = $input['borrow_date'] ?? null;
    $return_date = $input['return_date'] ?? null;

    if (!$bookISBN || !$borrow_date || !$return_date) {
        throw new Exception('Missing required fields: bookISBN, borrow_date, and return_date are required');
    }

    // Start transaction
    $pdo->beginTransaction();

    // 1. Check if book exists (❗ FIXED placeholder usage)
    $checkBook = $pdo->prepare("SELECT Copies, Title, Author FROM book WHERE ISBN = ?");
    $checkBook->execute([$bookISBN]);
    $book = $checkBook->fetch(PDO::FETCH_ASSOC);

    if (!$book) {
        throw new Exception('Book not found with ISBN: ' . $bookISBN);
    }

    if ($book['Copies'] <= 0) {
        throw new Exception('No copies available for borrowing');
    }

    // 2. Insert borrow record (❗ FIXED placeholders + removed broken variable interpolation)
    $insertBorrow = $pdo->prepare("
        INSERT INTO borrow (ISBN, borrow_date, return_date)
        VALUES (?, ?, ?)
    ");
    $insertBorrow->execute([$bookISBN, $borrow_date, $return_date]);

    // 3. Decrease book copies (❗ Placeholder FIXED)
    $updateBook = $pdo->prepare("UPDATE book SET Copies = Copies - 1 WHERE ISBN = ? AND Copies > 0");
    $updateBook->execute([$bookISBN]);

    if ($updateBook->rowCount() === 0) {
        throw new Exception('Failed to update book copies. No rows affected.');
    }

    // 4. Get updated copies (❗ FIXED incorrect variable)
    $getUpdatedCopies = $pdo->prepare("SELECT Copies FROM book WHERE ISBN = ?");
    $getUpdatedCopies->execute([$bookISBN]);
    $updatedBook = $getUpdatedCopies->fetch(PDO::FETCH_ASSOC);

    $pdo->commit();

    echo json_encode([
        'success' => true,
        'message' => 'Book borrowed successfully',
        'data' => [
            'bookISBN'        => $bookISBN,
            'bookTitle'       => $book['Title'],
            'borrow_date'     => $borrow_date,
            'return_date'     => $return_date,
            'remainingCopies' => $updatedBook['Copies']
        ]
    ]);

} catch (Exception $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>