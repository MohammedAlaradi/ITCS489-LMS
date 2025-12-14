<?php
$dbhost = "localhost";
$dbname = "ulib";
$dbuser = "root";
$password = "";

try {
    $pdo = new PDO("mysql:host=$dbhost;dbname=$dbname;charset=utf8", $dbuser, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $isbn = $_GET['isbn'] ?? null;
    if (!$isbn) {
        http_response_code(400);
        exit;
    }

    $sql = "SELECT Cover, MIME FROM book WHERE ISBN = :isbn";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':isbn' => $isbn]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$row || !$row['Cover']) {

        header("Content-Type: image/png");
        readfile("../ULiblogo.png");
        exit;
    }

    header("Content-Type: " . $row['MIME']);
    echo $row['Cover'];

} catch (PDOException $e) {
    http_response_code(500);
}
