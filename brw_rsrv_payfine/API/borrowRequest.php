<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$dbhost = "localhost";
$dbname = "ulib";
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

    $userID = $_SESSION['user_id'];
    $bookISBN    = $input['bookISBN'];
    $borrow_date = $input['borrow_date'];
    $return_date = $input['return_date'];

    if (!$userID || !$bookISBN || !$borrow_date || !$return_date) {
        throw new Exception('Missing required fields: userID, bookISBN, borrowDate, and returnDate are required');
    }

    // Start transaction
    $pdo->beginTransaction();

    //Check if book exists
    $checkBook = $pdo->prepare("SELECT Copies, Title, Author FROM book WHERE ISBN = ?");
    $checkBook->execute([$bookISBN]);
    $book = $checkBook->fetch(PDO::FETCH_ASSOC);

    if (!$book) {
        throw new Exception('Book not found with ISBN: ' . $bookISBN);
    }

    if ($book['Copies'] <= 0) {
        throw new Exception('No copies available for borrowing');
    }

    //Insert borrow record
    $insertBorrow = $pdo->prepare("
        INSERT INTO borrowed ( user_id, ISBN, borrowDate, returnDate)
        VALUES (?, ?, ?, ?)
    ");
    $insertBorrow->execute([$userID, $bookISBN, $borrow_date, $return_date]);

    // Decrease book copies
    $updateBook = $pdo->prepare("UPDATE book SET Copies = Copies - 1 WHERE ISBN = ? AND Copies > 0");
    $updateBook->execute([$bookISBN]);

    if ($updateBook->rowCount() === 0) {
        throw new Exception('Failed to update book copies. No rows affected.');
    }

    $getUpdatedCopies = $pdo->prepare("SELECT Copies FROM book WHERE ISBN = ?");
    $getUpdatedCopies->execute([$bookISBN]);
    $updatedBook = $getUpdatedCopies->fetch(PDO::FETCH_ASSOC);

    $pdo->commit();

    echo json_encode([
    'success' => true,
    'message' => 'Book borrowed successfully',
    'remainingCopies' => $updatedBook['Copies']
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

exit;

}
?>