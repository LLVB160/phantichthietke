<?php
header('Content-Type: application/json');
include 'connect.php';

$order_id = $_GET['order_id'];

$sql = "SELECT *
        FROM order_details 
        WHERE order_id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $order_id);
$stmt->execute();
$result = $stmt->get_result();

$details = [];
while($row = $result->fetch_assoc()) {
    $details[] = $row;
}

echo json_encode($details, JSON_UNESCAPED_UNICODE);

$stmt->close();
$conn->close();
?>