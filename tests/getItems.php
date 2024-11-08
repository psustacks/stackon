<?php
include 'db_connect.php';
include 'getter.php';

header('Content-Type: application/json');

$tablename = $_GET['location'] ?? null;
$category = $_GET['category'] ?? null;
$area = $_GET['area'] ?? null;

if ($category && $area) {
    $data = getByCategoryAndArea($tablename, $category, $area);
    echo json_encode($data);
} else {
    echo json_encode([]);
}
?>