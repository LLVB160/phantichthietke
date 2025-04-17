<?php
include 'connect.php';

$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 6;
$offset = ($page - 1) * $limit;

// Thêm các tham số lọc
$category = isset($_GET['category']) ? $_GET['category'] : null;
$search = isset($_GET['search']) ? $_GET['search'] : null;

// Xây dựng câu truy vấn SQL động
$sql = "SELECT * FROM products WHERE 1=1";

// Lọc theo danh mục nếu có
if ($category) {
    $sql .= " AND category = '" . $conn->real_escape_string($category) . "'";
}

// Lọc theo từ khóa tìm kiếm nếu có
if ($search) {
    $sql .= " AND (name LIKE '%" . $conn->real_escape_string($search) . "%' OR description LIKE '%" . $conn->real_escape_string($search) . "%')";
}

// Thêm phân trang
$sql .= " LIMIT $limit OFFSET $offset";

$result = $conn->query($sql);

$products = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }
}

// Lấy tổng số sản phẩm (không áp dụng LIMIT/OFFSET)
$sql_total = "SELECT COUNT(*) AS total FROM products WHERE 1=1";

// Áp dụng cùng điều kiện lọc cho tổng số sản phẩm
if ($category) {
    $sql_total .= " AND category = '" . $conn->real_escape_string($category) . "'";
}
if ($search) {
    $sql_total .= " AND (name LIKE '%" . $conn->real_escape_string($search) . "%' OR description LIKE '%" . $conn->real_escape_string($search) . "%')";
}

$result_total = $conn->query($sql_total);
$total = $result_total->fetch_assoc()['total'];

$totalPages = ceil($total / $limit);

echo json_encode([
    'products' => $products,
    'totalPages' => $totalPages,
    'currentPage' => $page
]);
?>