<?php
include 'db_connect.php';

header('Content-Type: application/json');

$table_name = $_POST['location'];
$item_id = $_POST['item_id'] ?? null;
$item_name = $_POST['item_name'];
$unit_size = $_POST['unit_size'];
$order_quantity = $_POST['order_quantity'];
$category = $_POST['category'];
$area = $_POST['area'];


if ($table_name && $category && $area && $item_name) {
    // Prepare the SQL statement
    $sql = "INSERT INTO `$table_name` (`Item_ID`,`Name`,`Unit_Size`,`Order_Quantity`,`Category`, `Area`) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssiss", $item_id, $item_name, $unit_size, $order_quantity, $category, $area);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Item added successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to add item']);
    }
    
    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
}

$conn->close();
?>
