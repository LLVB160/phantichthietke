<?php
$host = 'localhost'; // Địa chỉ máy chủ MySQL
$user = 'root';      // Tên người dùng MySQL
$password = '';      // Mật khẩu MySQL (để trống nếu không có)
$dbname = 'pttkhtttdb2'; // Tên cơ sở dữ liệu

$conn = new mysqli($host, $user, $password, $dbname);

// Kiểm tra kết nối
if ($conn->connect_error) {
    die("Kết nối thất bại: " . $conn->connect_error);
}
?>