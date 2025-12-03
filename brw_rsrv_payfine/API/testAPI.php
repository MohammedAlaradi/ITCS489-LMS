<?php

header('Content-Type: application/json; charset=utf-8');

$dbhost = "localhost";
$dbname = "lms_test";
$dbuser = "root";
$password = "";

try {
  $pdo = new PDO("mysql:host=$dbhost;dbname=$dbname;charset=utf8", $dbuser, $password);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  $sql = "SELECT * FROM book";
  $stmt = $pdo->query($sql);
  $stmt->setFetchMode(PDO::FETCH_ASSOC);
  $rows = $stmt->fetchAll();

  // foreach ($rows as $row) {
  //   echo "ISBN: " . $row['ISBN'] . ", Title: " . $row['Title'] . ", Author: " . $row['Author'] . " - Edition: ".$row['Edition'].
  //         " - Publisher: ". $row['Publisher'] . " - Year of Publish: ". $row['YearofPublish']. " - Genre: ".$row['Genre']." - Copies: ".$row['Copies']."\n";
  // }
  $bookList = $rows;

  echo json_encode($bookList, JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(['error' => 'Connection failed', 'message' => $e->getMessage()]);
}



?>