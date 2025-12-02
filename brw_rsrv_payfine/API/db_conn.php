<?php

$dbhost = "localhost";
$dbname = "lms_test";
$dbuser = "root";
$password = "";
try {
    $pdo = new PDO("mysql:host=$dbhost;dbname=$dbname;charset=utf8", $dbuser, $password);
    // Set the PDO error mode to exception
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "Connected successfully";

  } catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}

?>