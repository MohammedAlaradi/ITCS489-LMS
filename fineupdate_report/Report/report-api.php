<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

require "db.php";

$method = $_SERVER["REQUEST_METHOD"];

if ($method === "GET") {
    if (isset($_GET["id"])) {
        $stmt = $pdo->prepare("SELECT * FROM reports WHERE id=?");
        $stmt->execute([$_GET["id"]]);
        echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
    } else {
        $stmt = $pdo->query("SELECT * FROM reports ORDER BY generated_on DESC");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }
}

if ($method === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);

    $stmt = $pdo->prepare(
        "INSERT INTO reports (id,type,date_range,generated_on,records)
         VALUES (?,?,?,?,?)"
    );

    $stmt->execute([
        $data["id"],
        $data["type"],
        $data["dateRange"],
        $data["generatedOn"],
        $data["records"]
    ]);

    echo json_encode(["success" => true]);
}

if ($method === "DELETE") {
    $id = $_GET["id"] ?? "";
    $stmt = $pdo->prepare("DELETE FROM reports WHERE id=?");
    $stmt->execute([$id]);
    echo json_encode(["deleted" => true]);
}
