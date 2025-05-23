USE [master]
GO
/****** Object:  Database [PttkhtttDB]    Script Date: 4/17/2025 9:53:28 PM ******/
CREATE DATABASE [PttkhtttDB]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'PttkhtttDB', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.SQLEXPRESS\MSSQL\DATA\PttkhtttDB.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'PttkhtttDB_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.SQLEXPRESS\MSSQL\DATA\PttkhtttDB_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [PttkhtttDB] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [PttkhtttDB].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [PttkhtttDB] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [PttkhtttDB] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [PttkhtttDB] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [PttkhtttDB] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [PttkhtttDB] SET ARITHABORT OFF 
GO
ALTER DATABASE [PttkhtttDB] SET AUTO_CLOSE ON 
GO
ALTER DATABASE [PttkhtttDB] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [PttkhtttDB] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [PttkhtttDB] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [PttkhtttDB] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [PttkhtttDB] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [PttkhtttDB] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [PttkhtttDB] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [PttkhtttDB] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [PttkhtttDB] SET  ENABLE_BROKER 
GO
ALTER DATABASE [PttkhtttDB] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [PttkhtttDB] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [PttkhtttDB] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [PttkhtttDB] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [PttkhtttDB] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [PttkhtttDB] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [PttkhtttDB] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [PttkhtttDB] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [PttkhtttDB] SET  MULTI_USER 
GO
ALTER DATABASE [PttkhtttDB] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [PttkhtttDB] SET DB_CHAINING OFF 
GO
ALTER DATABASE [PttkhtttDB] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [PttkhtttDB] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [PttkhtttDB] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [PttkhtttDB] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [PttkhtttDB] SET QUERY_STORE = ON
GO
ALTER DATABASE [PttkhtttDB] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [PttkhtttDB]
GO
/****** Object:  Table [dbo].[categories]    Script Date: 4/17/2025 9:53:28 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[categories](
	[category_id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](100) NOT NULL,
	[description] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[category_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[order_details]    Script Date: 4/17/2025 9:53:28 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[order_details](
	[order_detail_id] [int] IDENTITY(1,1) NOT NULL,
	[order_id] [int] NULL,
	[product_id] [int] NULL,
	[quantity] [int] NULL,
	[price] [decimal](18, 2) NULL,
	[total] [decimal](18, 2) NULL,
PRIMARY KEY CLUSTERED 
(
	[order_detail_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[orders]    Script Date: 4/17/2025 9:53:28 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[orders](
	[order_id] [int] IDENTITY(1,1) NOT NULL,
	[user_id] [int] NULL,
	[order_date] [datetime] NULL,
	[total_amount] [decimal](18, 2) NULL,
	[status] [nvarchar](50) NULL,
	[payment_method] [nvarchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[order_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[products]    Script Date: 4/17/2025 9:53:28 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[products](
	[product_id] [int] IDENTITY(1,1) NOT NULL,
	[category_id] [int] NULL,
	[name] [nvarchar](100) NOT NULL,
	[description] [nvarchar](255) NULL,
	[price] [decimal](18, 2) NOT NULL,
	[quantity] [int] NOT NULL,
	[img_url] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[product_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[users]    Script Date: 4/17/2025 9:53:28 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[users](
	[user_id] [int] IDENTITY(1,1) NOT NULL,
	[username] [nvarchar](100) NOT NULL,
	[password] [nvarchar](255) NOT NULL,
	[email] [nvarchar](100) NULL,
	[role] [nvarchar](50) NOT NULL,
	[created_at] [datetime] NULL,
	[full_name] [nvarchar](255) NOT NULL,
	[phone] [nvarchar](10) NULL,
	[address] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[user_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[categories] ON 

INSERT [dbo].[categories] ([category_id], [name], [description]) VALUES (1, N'Điện thoại', N'Điện thoại')
INSERT [dbo].[categories] ([category_id], [name], [description]) VALUES (2, N'Máy tính', N'Máy tính')
INSERT [dbo].[categories] ([category_id], [name], [description]) VALUES (3, N'Máy tính bảng', N'Máy tính bảng')
INSERT [dbo].[categories] ([category_id], [name], [description]) VALUES (4, N'Phụ kiện ', N'Phụ kiện ')
INSERT [dbo].[categories] ([category_id], [name], [description]) VALUES (5, N'Smartwatch', N'Smartwatch')
SET IDENTITY_INSERT [dbo].[categories] OFF
GO
SET IDENTITY_INSERT [dbo].[products] ON 

INSERT [dbo].[products] ([product_id], [category_id], [name], [description], [price], [quantity], [img_url]) VALUES (1, 1, N'Điện thoại 1', N'Điện thoại 1', CAST(10000000.00 AS Decimal(18, 2)), 100, NULL)
INSERT [dbo].[products] ([product_id], [category_id], [name], [description], [price], [quantity], [img_url]) VALUES (3, 1, N'Điện thoại 2', N'Điện thoại 2', CAST(1000000.00 AS Decimal(18, 2)), 1000, NULL)
SET IDENTITY_INSERT [dbo].[products] OFF
GO
SET IDENTITY_INSERT [dbo].[users] ON 

INSERT [dbo].[users] ([user_id], [username], [password], [email], [role], [created_at], [full_name], [phone], [address]) VALUES (1, N'customer1', N'customer1', N'test1@gmail.com', N'customer', CAST(N'2025-04-16T07:37:00.000' AS DateTime), N'cus 1', NULL, NULL)
INSERT [dbo].[users] ([user_id], [username], [password], [email], [role], [created_at], [full_name], [phone], [address]) VALUES (2, N'admin1', N'admin1', N'admin1@gmail.com', N'admin', CAST(N'2025-04-16T07:39:00.000' AS DateTime), N'admin 1', NULL, NULL)
INSERT [dbo].[users] ([user_id], [username], [password], [email], [role], [created_at], [full_name], [phone], [address]) VALUES (3, N'employee1', N'employee1', N'employee1@gmail.com', N'employee', CAST(N'2025-04-16T07:40:00.000' AS DateTime), N'Employee 1', NULL, NULL)
INSERT [dbo].[users] ([user_id], [username], [password], [email], [role], [created_at], [full_name], [phone], [address]) VALUES (4, N'warehousemanager1', N'warehousemanager1', N'warehousemanager1@gmail.com', N'warehouse_manager', CAST(N'2025-04-16T07:41:00.000' AS DateTime), N'Warehouse Manager 1', NULL, NULL)
SET IDENTITY_INSERT [dbo].[users] OFF
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__users__F3DBC572D9237C8E]    Script Date: 4/17/2025 9:53:28 PM ******/
ALTER TABLE [dbo].[users] ADD UNIQUE NONCLUSTERED 
(
	[username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[orders] ADD  DEFAULT (getdate()) FOR [order_date]
GO
ALTER TABLE [dbo].[orders] ADD  DEFAULT (N'Pending') FOR [status]
GO
ALTER TABLE [dbo].[orders] ADD  DEFAULT (N'Cash') FOR [payment_method]
GO
ALTER TABLE [dbo].[users] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[order_details]  WITH CHECK ADD FOREIGN KEY([order_id])
REFERENCES [dbo].[orders] ([order_id])
GO
ALTER TABLE [dbo].[order_details]  WITH CHECK ADD FOREIGN KEY([product_id])
REFERENCES [dbo].[products] ([product_id])
GO
ALTER TABLE [dbo].[orders]  WITH CHECK ADD  CONSTRAINT [FK_orders_users] FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([user_id])
GO
ALTER TABLE [dbo].[orders] CHECK CONSTRAINT [FK_orders_users]
GO
ALTER TABLE [dbo].[products]  WITH CHECK ADD FOREIGN KEY([category_id])
REFERENCES [dbo].[categories] ([category_id])
GO
ALTER TABLE [dbo].[orders]  WITH CHECK ADD CHECK  (([payment_method]=N'Credit Card' OR [payment_method]=N'Bank Transfer' OR [payment_method]=N'Cash'))
GO
ALTER TABLE [dbo].[orders]  WITH CHECK ADD CHECK  (([status]=N'Cancelled' OR [status]=N'Shipped' OR [status]=N'Pending'))
GO
ALTER TABLE [dbo].[users]  WITH CHECK ADD CHECK  ((len([phone])=(10) AND NOT [phone] like '%[^0-9]%'))
GO
USE [master]
GO
ALTER DATABASE [PttkhtttDB] SET  READ_WRITE 
GO
