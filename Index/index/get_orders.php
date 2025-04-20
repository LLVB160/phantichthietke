<?php
header('Content-Type: application/json');
include 'connect.php';

$user_id = $_GET['user_id'];

// Truy vấn chính xác với JOIN giữa bảng orders và order_details
$sql = "SELECT o.order_id, o.order_date, o.total_amount, o.status, 
               od.product_id, od.quantity, od.price, od.total
        FROM orders o
        JOIN order_details od ON o.order_id = od.order_id
        WHERE o.user_id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$orders = [];
while($row = $result->fetch_assoc()) {
    $orders[] = $row;
}

echo json_encode($orders, JSON_UNESCAPED_UNICODE);

$stmt->close();
$conn->close();
?>