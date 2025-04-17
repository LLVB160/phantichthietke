-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1:3308
-- Thời gian đã tạo: Th4 17, 2025 lúc 08:25 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `pttkhtttdb2`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
--

CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `categories`
--

INSERT INTO `categories` (`category_id`, `name`, `description`) VALUES
(1, 'Điện thoại', 'Các dòng smartphone chính hãng từ các thương hiệu lớn.'),
(2, 'iPad', 'Máy tính bảng iPad nhiều kích cỡ và cấu hình.'),
(3, 'Tai nghe', 'Tai nghe không dây, có dây, chống ồn,...'),
(4, 'Laptop', 'Laptop học tập, văn phòng và gaming.'),
(5, 'Tay cầm chơi game', 'Tay cầm console, tay cầm bluetooth đa năng.');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `order_date` datetime DEFAULT current_timestamp(),
  `total_amount` decimal(10,2) DEFAULT NULL,
  `status` enum('pending','shipped','cancelled') DEFAULT 'pending',
  `payment_method` enum('cash','bank transfer','credit card') DEFAULT 'cash'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `orders`
--

INSERT INTO `orders` (`order_id`, `user_id`, `order_date`, `total_amount`, `status`, `payment_method`) VALUES
(1, 1, '2024-01-05 09:00:00', 28990000.00, 'shipped', 'credit card'),
(2, 2, '2024-01-06 10:15:00', 5990000.00, 'pending', 'cash'),
(3, 3, '2024-01-08 11:20:00', 8490000.00, 'shipped', 'bank transfer'),
(4, 4, '2024-01-09 14:00:00', 1590000.00, 'cancelled', 'cash'),
(5, 5, '2024-01-10 16:30:00', 24990000.00, 'shipped', 'credit card'),
(6, 6, '2024-01-11 18:00:00', 4490000.00, 'pending', 'bank transfer'),
(7, 7, '2024-01-13 09:45:00', 16990000.00, 'shipped', 'cash'),
(8, 8, '2024-01-14 12:10:00', 990000.00, 'shipped', 'cash'),
(9, 9, '2024-01-15 13:15:00', 1890000.00, 'pending', 'credit card'),
(10, 10, '2024-01-16 14:25:00', 7790000.00, 'shipped', 'bank transfer'),
(11, 1, '2024-01-17 15:35:00', 8490000.00, 'pending', 'cash'),
(12, 2, '2024-01-18 16:40:00', 13900000.00, 'shipped', 'credit card'),
(13, 3, '2024-01-19 17:50:00', 3990000.00, 'cancelled', 'bank transfer'),
(14, 4, '2024-01-20 18:55:00', 28990000.00, 'shipped', 'credit card'),
(15, 5, '2024-01-21 19:10:00', 990000.00, 'pending', 'cash'),
(16, 6, '2024-01-22 20:20:00', 28990000.00, 'shipped', 'credit card'),
(17, 7, '2024-01-23 21:25:00', 14900000.00, 'pending', 'bank transfer'),
(18, 8, '2024-01-24 22:30:00', 4490000.00, 'shipped', 'cash'),
(19, 9, '2024-01-25 23:35:00', 1890000.00, 'cancelled', 'credit card'),
(20, 10, '2024-01-26 08:40:00', 5990000.00, 'pending', 'cash');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `order_details`
--

CREATE TABLE `order_details` (
  `order_detail_id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `order_details`
--

INSERT INTO `order_details` (`order_detail_id`, `order_id`, `product_id`, `quantity`, `price`, `total`) VALUES
(1, 1, 2, 1, 28990000.00, 28990000.00),
(2, 2, 3, 1, 5990000.00, 5990000.00),
(3, 3, 7, 1, 8490000.00, 8490000.00),
(4, 4, 8, 1, 1590000.00, 1590000.00),
(5, 5, 10, 1, 24990000.00, 24990000.00),
(6, 6, 18, 1, 4490000.00, 4490000.00),
(7, 7, 13, 1, 16990000.00, 16990000.00),
(8, 8, 17, 1, 990000.00, 990000.00),
(9, 9, 16, 1, 1890000.00, 1890000.00),
(10, 10, 4, 1, 7790000.00, 7790000.00),
(11, 11, 6, 1, 8490000.00, 8490000.00),
(12, 12, 20, 1, 13900000.00, 13900000.00),
(13, 13, 14, 1, 3990000.00, 3990000.00),
(14, 14, 1, 1, 28990000.00, 28990000.00),
(15, 15, 17, 1, 990000.00, 990000.00),
(16, 16, 9, 1, 28990000.00, 28990000.00),
(17, 17, 11, 1, 14900000.00, 14900000.00),
(18, 18, 18, 1, 4490000.00, 4490000.00),
(19, 19, 15, 1, 1890000.00, 1890000.00),
(20, 20, 3, 1, 5990000.00, 5990000.00);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `products`
--

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `supplier` varchar(255) DEFAULT NULL,
  `img_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `products`
--

INSERT INTO `products` (`product_id`, `category_id`, `name`, `description`, `price`, `quantity`, `supplier`, `img_url`) VALUES
(1, 1, 'iPhone 15 Pro Max', 'Điện thoại Apple cao cấp, chip A17, 256GB', 33990000.00, 30, 'Apple Việt Nam', 'https://example.com/iphone15.jpg'),
(2, 1, 'Samsung Galaxy S24 Ultra', 'Smartphone flagship của Samsung, 12GB RAM', 28990000.00, 25, 'Samsung', 'https://example.com/galaxyS24.jpg'),
(3, 1, 'Xiaomi Redmi Note 13', 'Smartphone tầm trung pin trâu', 5990000.00, 60, 'Xiaomi', 'https://example.com/redmi13.jpg'),
(4, 2, 'iPad Gen 9 10.2 inch', 'Máy tính bảng giá rẻ dùng học tập', 7790000.00, 40, 'Apple Việt Nam', 'https://example.com/ipadgen9.jpg'),
(5, 2, 'iPad Pro M2 11 inch', 'Hiệu năng cao, hỗ trợ bút Pencil 2', 22990000.00, 20, 'Apple', 'https://example.com/ipadpro11.jpg'),
(6, 3, 'AirPods Pro 2', 'Tai nghe Apple chống ồn chủ động', 5990000.00, 70, 'Apple', 'https://example.com/airpodspro2.jpg'),
(7, 3, 'Sony WH-1000XM5', 'Tai nghe không dây chống ồn tốt nhất', 8490000.00, 35, 'Sony', 'https://example.com/sonyxm5.jpg'),
(8, 3, 'JBL Tune 510BT', 'Tai nghe chụp tai bluetooth giá rẻ', 1590000.00, 90, 'JBL', 'https://example.com/jbl510bt.jpg'),
(9, 4, 'MacBook Air M2 2023', 'Laptop mỏng nhẹ, chip M2, SSD 512GB', 28990000.00, 18, 'Apple Việt Nam', 'https://example.com/macairm2.jpg'),
(10, 4, 'Asus TUF Gaming F15', 'Laptop gaming với RTX 4060', 24990000.00, 15, 'Asus', 'https://example.com/tufF15.jpg'),
(11, 4, 'Dell Inspiron 15', 'Laptop học tập văn phòng phổ thông', 14900000.00, 40, 'Dell', 'https://example.com/dell15.jpg'),
(12, 1, 'OPPO Reno10 5G', 'Điện thoại chụp hình tốt, thiết kế đẹp', 9490000.00, 30, 'OPPO', 'https://example.com/reno10.jpg'),
(13, 2, 'iPad Air 5', 'Màn hình 10.9 inch, chip M1, hỗ trợ Apple Pencil', 16990000.00, 22, 'Apple', 'https://example.com/ipadair5.jpg'),
(14, 3, 'Samsung Galaxy Buds2 Pro', 'Tai nghe không dây nhỏ gọn chống ồn', 3990000.00, 50, 'Samsung', 'https://example.com/buds2pro.jpg'),
(15, 5, 'Tay cầm Xbox Wireless Controller', 'Kết nối bluetooth, hỗ trợ Windows, Xbox', 1590000.00, 45, 'Microsoft', 'https://example.com/xboxpad.jpg'),
(16, 5, 'Tay cầm PS5 DualSense', 'Tay cầm chính hãng PS5, rung phản hồi lực', 1890000.00, 50, 'Sony', 'https://example.com/ps5pad.jpg'),
(17, 5, 'Tay cầm Gamesir T4 Pro', 'Tay cầm đa nền tảng, pin 800mAh', 990000.00, 60, 'Gamesir', 'https://example.com/t4pro.jpg'),
(18, 1, 'Realme C55', 'Pin 5000mAh, sạc nhanh 33W', 4490000.00, 70, 'Realme', 'https://example.com/realmec55.jpg'),
(19, 4, 'HP Pavilion 14', 'Laptop dành cho sinh viên, mỏng nhẹ', 15900000.00, 33, 'HP', 'https://example.com/hp14.jpg'),
(20, 2, 'iPad Mini 6', 'Màn hình 8.3 inch, chip A15 Bionic', 13900000.00, 27, 'Apple', 'https://example.com/ipadmini6.jpg');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `role` varchar(20) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `full_name` varchar(100) DEFAULT NULL,
  `phone` varchar(10) DEFAULT NULL CHECK (`phone` regexp '^[0-9]{10}$'),
  `address` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`user_id`, `username`, `password`, `email`, `role`, `created_at`, `full_name`, `phone`, `address`) VALUES
(1, 'minhnguyen', 'minh123', 'minhnguyen@gmail.com', 'customer', '2024-01-01 10:00:00', 'Nguyễn Văn Minh', '0912345678', '12 Lê Lợi, Quận 1, TP.HCM'),
(2, 'thuylinh', 'linh456', 'thuylinh@gmail.com', 'customer', '2024-01-05 09:30:00', 'Lê Thùy Linh', '0987654321', '45 Nguyễn Trãi, Hà Nội'),
(3, 'khoapham', 'khoa789', 'khoap@gmail.com', 'admin', '2023-12-15 14:20:00', 'Phạm Minh Khoa', '0909123456', '1A Hùng Vương, Đà Nẵng'),
(4, 'hoanglong', 'long111', 'hoanglong@gmail.com', 'employee', '2023-11-20 08:45:00', 'Trần Hoàng Long', '0922334455', '22 Phan Đăng Lưu, Huế'),
(5, 'dieuanh', 'anh222', 'dieuanh@gmail.com', 'warehouse_manager', '2024-02-10 16:00:00', 'Đặng Diệu Anh', '0977554433', '78 Hai Bà Trưng, Cần Thơ'),
(6, 'manhvu', 'vu321', 'manhvu@gmail.com', 'customer', '2023-12-10 13:20:00', 'Vũ Mạnh', '0911223344', '99 Trường Chinh, TP.HCM'),
(7, 'mytien', 'tien678', 'mytien@gmail.com', 'customer', '2023-10-12 07:50:00', 'Ngô Mỹ Tiên', '0933445566', '5 Phạm Văn Đồng, Hà Nội'),
(8, 'thanhdat', 'dat999', 'thanhdat@gmail.com', 'employee', '2024-03-01 17:00:00', 'Nguyễn Thanh Đạt', '0966332211', '68 CMT8, Đà Nẵng'),
(9, 'hanhchi', 'chiabc', 'hanhchi@gmail.com', 'customer', '2024-01-25 10:10:00', 'Hoàng Hạnh Chi', '0944221133', '4 Võ Thị Sáu, Huế'),
(10, 'quocbao', 'bao147', 'quocbao@gmail.com', 'customer', '2023-12-30 15:15:00', 'Đỗ Quốc Bảo', '0909445566', '100 Nguyễn Huệ, TP.HCM');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`);

--
-- Chỉ mục cho bảng `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `order_details`
--
ALTER TABLE `order_details`
  ADD PRIMARY KEY (`order_detail_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Chỉ mục cho bảng `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT cho bảng `order_details`
--
ALTER TABLE `order_details`
  MODIFY `order_detail_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT cho bảng `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Các ràng buộc cho bảng `order_details`
--
ALTER TABLE `order_details`
  ADD CONSTRAINT `order_details_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  ADD CONSTRAINT `order_details_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);

--
-- Các ràng buộc cho bảng `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
