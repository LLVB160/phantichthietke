<?php
$host = 'localhost'; // Địa chỉ máy chủ MySQL
$user = 'root';      // Tên người dùng MySQL
$password = '';      // Mật khẩu MySQL (để trống nếu không có)
$dbname = 'pttkhtttdb2'; // Tên cơ sở dữ liệu
$port = 3308;        // Cổng MySQL (3308 theo cấu hình của bạn)

$conn = new mysqli($host, $user, $password, $dbname, $port);

// Kiểm tra kết nối
if ($conn->connect_error) {
    die("Kết nối thất bại: " . $conn->connect_error);
}
?>