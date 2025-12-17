<?php
header("Content-Type: application/json");

$host = "localhost";
$db   = "ulib";
$user = "root";
$pass = "";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $data = json_decode(file_get_contents("php://input"), true);

    $isbn    = $data["isbn"] ?? "";
    $title   = $data["title"] ?? "";
    $author  = $data["author"] ?? "";
    $genre   = $data["genre"] ?? "";
    $year    = $data["year"] ?? 0;
    $edition = $data["edition"] ?? 0;
    $copies  = $data["copies"] ?? 0;

    if (!$isbn || !$title || !$author) {
        echo json_encode(["success" => false, "message" => "Missing fields"]);
        exit;
    }

    $sql = "INSERT INTO book (ISBN, Title, Author, Genre, YearofPublish, Edition, Copies)
            VALUES (?, ?, ?, ?, ?, ?, ?)";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$isbn, $title, $author, $genre, $year, $edition, $copies]);

    echo json_encode(["success" => true]);

} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
