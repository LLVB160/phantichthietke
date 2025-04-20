<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "Dữ liệu không hợp lệ."]);
    exit;
}

$username = $data['username'] ?? '';
$fullname = $data['fullname'] ?? '';
$address = $data['address'] ?? '';
$phone = $data['phone'] ?? '';
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

// Ghi log để kiểm tra giá trị của $password
error_log("Password nhận được: " . $password);

// Kiểm tra dữ liệu đầu vào
if (empty($username) || empty($fullname) || empty($address) || empty($phone) || empty($email) || empty($password)) {
    echo json_encode(["success" => false, "message" => "Vui lòng điền đầy đủ thông tin."]);
    exit;
}

// Kết nối cơ sở dữ liệu
include 'connect.php';

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Kết nối cơ sở dữ liệu thất bại: " . $conn->connect_error]);
    exit;
}

// Kiểm tra xem email đã tồn tại chưa
$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Email đã được sử dụng."]);
    exit;
}

// Thêm người dùng mới vào cơ sở dữ liệu
$stmt = $conn->prepare("INSERT INTO users (username, password, email, full_name, phone, address) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssssss", $username, $password, $email, $fullname, $phone, $address);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Đăng ký thành công."]);
} else {
    echo json_encode(["success" => false, "message" => "Lỗi khi đăng ký: " . $stmt->error]);
}

$conn->close();
?>