<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Kết nối cơ sở dữ liệu
include 'connect.php';

// Kiểm tra kết nối
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Kết nối cơ sở dữ liệu thất bại: " . $conn->connect_error]);
    exit;
}

// Nhận dữ liệu từ yêu cầu
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "Dữ liệu không hợp lệ."]);
    exit;
}

// Lấy thông tin từ dữ liệu yêu cầu
$user_id = $data['user_id'] ?? null;
$total_amount = $data['total_amount'] ?? 0;
$payment_method = $data['payment_method'] ?? '';
$status = $data['status'] ?? 'pending';
$items = $data['items'] ?? [];

// Kiểm tra dữ liệu đầu vào
if (empty($user_id) || empty($total_amount) || empty($payment_method) || empty($items)) {
    echo json_encode(["success" => false, "message" => "Vui lòng cung cấp đầy đủ thông tin đơn hàng."]);
    exit;
}

// Kiểm tra xem user_id có tồn tại không
$checkUserQuery = "SELECT COUNT(*) AS count FROM users WHERE user_id = ?";
$stmt = $conn->prepare($checkUserQuery);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();

if ($row['count'] == 0) {
    echo json_encode(["success" => false, "message" => "Người dùng không tồn tại."]);
    exit;
}

// Thêm đơn hàng vào bảng orders
$orderQuery = "INSERT INTO orders (user_id, total_amount, payment_method) VALUES (?, ?, ?)";
$stmt = $conn->prepare($orderQuery);
$stmt->bind_param("ids", $user_id, $total_amount, $payment_method);

if ($stmt->execute()) {
    $order_id = $stmt->insert_id; // Lấy ID của đơn hàng vừa thêm

    // Thêm chi tiết đơn hàng vào bảng order_details
    foreach ($items as $item) {
        $product_id = $item['product_id'] ?? null;
        $quantity = $item['quantity'] ?? 0;
        $price = $item['price'] ?? 0;
        $total = $item['total'] ?? 0;

        if (empty($product_id) || $quantity <= 0 || $price <= 0 || $total <= 0) {
            echo json_encode(["success" => false, "message" => "Thông tin sản phẩm không hợp lệ."]);
            exit;
        }

        $detailQuery = "INSERT INTO order_details (order_id, product_id, quantity, price, total) VALUES (?, ?, ?, ?, ?)";
        $stmtDetail = $conn->prepare($detailQuery);
        $stmtDetail->bind_param("iiidd", $order_id, $product_id, $quantity, $price, $total);

        if (!$stmtDetail->execute()) {
            echo json_encode(["success" => false, "message" => "Lỗi khi lưu chi tiết đơn hàng: " . $stmtDetail->error]);
            exit;
        }
    }

    echo json_encode(["success" => true, "message" => "Đơn hàng đã được tạo thành công.", "order_id" => $order_id]);
} else {
    echo json_encode(["success" => false, "message" => "Lỗi khi lưu đơn hàng: " . $stmt->error]);
}

$conn->close();
?>