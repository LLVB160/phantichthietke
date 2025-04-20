<?php
// filepath: d:\Xampp\htdocs\phantichthietke\WebBanAoDaBanh\index\login.php

// Hiển thị lỗi (chỉ nên bật trong môi trường phát triển)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Kết nối đến cơ sở dữ liệu
include 'connect.php';

// Lấy dữ liệu từ client
$data = json_decode(file_get_contents("php://input"), true);

// Kiểm tra dữ liệu đầu vào
if (!isset($data['username']) || !isset($data['password'])) {
    echo json_encode(["success" => false, "message" => "Dữ liệu không hợp lệ."]);
    exit;
}

$username = $data['username'];
$password = $data['password'];

// Ghi log dữ liệu nhận được (chỉ dùng để debug)
file_put_contents("login_log.txt", "Dữ liệu nhận được: " . print_r($data, true), FILE_APPEND);

try {
    // Truy vấn kiểm tra thông tin đăng nhập
    $sql = "SELECT * FROM users WHERE username = ? AND password = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $username, $password);
    $stmt->execute();
    $result = $stmt->get_result();

    // Kiểm tra kết quả truy vấn
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        unset($user['password']); // Ẩn mật khẩu trước khi trả về

        // Ghi log kết quả truy vấn (chỉ dùng để debug)
        file_put_contents("login_log.txt", "Kết quả truy vấn: " . print_r($user, true), FILE_APPEND);

        echo json_encode(["success" => true, "user" => $user]);
    } else {
        echo json_encode(["success" => false, "message" => "Sai tên đăng nhập hoặc mật khẩu."]);
    }

    $stmt->close();
} catch (Exception $e) {
    // Xử lý lỗi truy vấn hoặc kết nối
    file_put_contents("login_log.txt", "Lỗi: " . $e->getMessage(), FILE_APPEND);
    echo json_encode(["success" => false, "message" => "Đã xảy ra lỗi khi xử lý yêu cầu."]);
}

// Đóng kết nối cơ sở dữ liệu
$conn->close();
?>