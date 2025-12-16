<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

require "db.php";

$method = $_SERVER["REQUEST_METHOD"];

/* =========================
   GET REPORTS
========================= */
if ($method === "GET") {

    // Get single report
    if (isset($_GET["fid"])) {
        $stmt = $pdo->prepare("
            SELECT 
                fid,
                type,
                date_range,
                generated_on,
                records
            FROM reports
            WHERE fid = ?
        ");
        $stmt->execute([$_GET["fid"]]);
        echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
        exit;
    }

    // Get all reports
    $stmt = $pdo->query("
        SELECT 
            fid,
            type,
            date_range,
            generated_on,
            records
        FROM reports
        ORDER BY generated_on DESC
    ");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}

/* =========================
   CREATE REPORT
========================= */
if ($method === "POST") {

    $data = json_decode(file_get_contents("php://input"), true);

    if (
        empty($data["type"]) ||
        empty($data["dateRange"]) ||
        !isset($data["records"])
    ) {
        echo json_encode([
            "success" => false,
            "message" => "Missing required fields"
        ]);
        exit;
    }

    $stmt = $pdo->prepare("
        INSERT INTO reports (type, date_range, generated_on, records)
        VALUES (?, ?, NOW(), ?)
    ");

    $stmt->execute([
        $data["type"],
        $data["dateRange"],
        $data["records"]
    ]);

    echo json_encode([
        "success" => true,
        "fid" => $pdo->lastInsertId()
    ]);
    exit;
}

/* =========================
   DELETE REPORT
========================= */
if ($method === "DELETE") {

    $fid = $_GET["fid"] ?? null;

    if (!$fid) {
        echo json_encode([
            "success" => false,
            "message" => "Report fid required"
        ]);
        exit;
    }

    $stmt = $pdo->prepare("DELETE FROM reports WHERE fid = ?");
    $stmt->execute([$fid]);

    echo json_encode([
        "success" => true,
        "deleted_fid" => $fid
    ]);
    exit;
}

echo json_encode([
    "success" => false,
    "message" => "Invalid request"
]);
