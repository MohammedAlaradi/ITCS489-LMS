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
    $isbn = $data["isbn"] ?? "";

    if (!$isbn) {
        echo json_encode(["success" => false, "message" => "ISBN required"]);
        exit;
    }

    $stmt = $pdo->prepare("DELETE FROM book WHERE ISBN=?");
    $stmt->execute([$isbn]);

    echo json_encode(["success" => true]);

} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
