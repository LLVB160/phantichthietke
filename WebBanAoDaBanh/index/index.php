
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Football Kit</title>
        <link rel="stylesheet" href="index.css">
        <link rel="stylesheet" href="form.css">
        <link rel="stylesheet" href="responsive.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

    </head>
    <body>

        <header><!--Header-->
            <div class="header-top">
                <div class="container">
                    <!--đây hả-->
                    <div class="category-responsive">
                        <button class="category-responsive-btn" id="category-responsive-btn"><i class="fa fa-bars"></i></button>
                    </div>
                    <div class="header-top-left">
                        <div class="header-logo">
                            <a href="">
                                <img src="../img/logo.png" class="header-logo-img" onclick=hienthitrangchu();> 
                            </a>
                        </div>
                    </div>

                    <div class="header-top-center">
                        <form action="" class="form-search">
                            <span class="search-btn" onclick="searchProducts()"><i class="fa fa-search"></i></span>
                            <input type="text" class="form-search-input" id="form-search-input"
                                placeholder="Nhập tên sản phẩm...">
                            <button class="filter-btn" onclick="ThemDieuKienSearch(event)"><i class="fa fa-caret-down"></i>
                            </button>
                        </form>
                    </div>

                    <div class="header-top-right">
                        <ul class="header-top-right-list">
                            <li class="header-top-right-item open" onclick="openCart()">
                                <div class="cart-icon-menu">
                                    <i class="fa fa-cart-plus"></i>
                                    <span class="count-product-cart" id="count"> </span>
                                </div>
                                <span class="text-cart">Giỏ hàng</span>
                            </li>

                            <li class="header-top-right-item dropdown open" id="userdata">
                               
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <nav class="nav-header"><!--Nav dưới header-->
                <div class="container">
                    <ul id="menu-list" class="menu-list">
                        <li onclick=showPage(1);>
                            <a href="" class="menu-link">Sản Phẩm</a>
                        </li>
                        <li  onclick=loadOrdersTable();>
                            <a href="javascript:;" class="menu-link">Lịch Sử Mua Hàng</a>
                        </li>
                        <li onclick=hienthichinhsach();>
                            <a href="javascript:;" class="menu-link">Chính sách của chúng tôi</a>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>

        <!--đây hả-->
        <div id="category-overlay"></div>
        

        <div class="advanced-search">
            <div class="container">
                <div class="advanced-search-category">
                    <span>Phân loại </span>
                    <select name="" id="advanced-search-category-select" onchange="toggleSelectBox()">
                        <option value="all">Tất cả</option>
                        <option value="club">Câu lạc bộ</option>
                        <option value="nation">Quốc gia</option>
                    </select>
    
                    <span class="advanced-search-category-select-nation">Lựa chọn</span>
                    <select name="" class="advanced-search-category-select-nation nation">
                        <option value="none"></option>
                        <option value="EN">Anh</option>
                        <option value="PR">Pháp</option>
                        <option value="PO">Bồ Đào Nha</option>
                        <option value="AG">Argentina</option>
                        <option value="VN">Việt Nam</option>
                    </select>
    
    
                    <span class="advanced-search-category-select-club">Lựa chọn</span>
                    <select name="" class="advanced-search-category-select-club club">
                        <option value="none"></option>
                        <option value="MU">Manchester United</option>
                        <option value="MC">Manchester City</option>
                        <option value="BC">Barcelona</option>
                        <option value="RM">Real Marid</option>
                        <option value="AN">Al-Nassr</option>
                    </select>
    
    
                </div>
                <div class="advanced-search-price">
                    <span>Giá từ</span>
                    <input type="number" placeholder="tối thiểu" id="min-price">
                    <span>đến</span>
                    <input type="number" placeholder="tối đa" id="max-price">
                    <button id="advanced-search-price-btn" onclick="advancedSearch()"><i class="fa fa-search"></i></button>
                </div>
                <div class="advanced-search-control">
    
                    <button id="sort-ascending"><i class="fa fa-arrow-up"></i></button>
    
                    <button id="sort-descending"><i class="fa fa-arrow-down"></i></button>
    
                    <button id="reset-search" ><i class="fa fa-refresh"></i></button>
                </div>
            </div>
        </div>

        <main class="main-wrapper" id="main-wrapper"> <!--sản phẩm-->
            <div class="container">
                <div class="main-content" >
                    <div class="category" id="category"><!--danh mục phân loại bên trái-->
                        
                        <div class="category-content">
                            <button onclick=filterClub()>LOẠI SẢN PHẨM </button>

                        </div>
                        <ul class="category-club">
                            <li><a href="#">Điện thoại</a><i class="fas fa-times"></i></li>
                            <li><a href="#">Laptop</a><i class="fas fa-times"></i></li>
                            <li><a href="#">Tai nghe</a><i class="fas fa-times"></i></li>
                            <li><a href="#">Ipad</a><i class="fas fa-times"></i></li>
                            <li><a href="#">Tay cầm</a><i class="fas fa-times"></i></li>
                        </ul>
                        <div class="category-content">
                            <button>GIÁ BÁN</button>
                        </div>
                        <ul class="category-price">
                            <li><a href="#">&lt 500k</a><i class="fa-solid fa-xmark"></i></li>
                            <li><a href="#">500k - 1,5m</a><i class="fa-solid fa-xmark"></i></li>
                            <li><a href="#">1,5m - 5m</a><i class="fa-solid fa-xmark"></i></li>
                            <li><a href="#">5m - 10m</a><i class="fa-solid fa-xmark"></i></li>
                            <li><a href="#">&gt 10m</a><i class="fa-solid fa-xmark"></i></li>
                        </ul>
                    </div>
                    <div id="product-wrapper"></div><!--container chứa sản phẩm , gọi ra bằng js-->
                </div>
                
                <div class="pagination"><!--sửa nè-->
                    <div class="chevron"><button class="chevron-left"><i class="fa fa-chevron-left"></i></button></div>
                    <div class="pagination-btn"></div><!-- các nút phân trang tạo bên js -->
                    <div class="chevron"><button class="chevron-right"><i class="fa fa-chevron-right"></i></button></div>
                    
                </div>
                <div class="product-detail" style="display: none;"></div> <!-- hiển thị chi tiết sản phẩm -->
            </div>
        </main>
        <div class="order-detail" style="display: none;"></div> <!-- hiển thị chi tiết hóa đơn -->
                    
        <div id="user" class="modal "><!--form đki +đăng nhập-->
            <div id="login">
                <form name="loginform" id="form-1">
                    <button type="button" class="close" onclick="CloseForm()">+</button>
                    <h2>ĐĂNG NHẬP</h2>
                    <div class="login-info">
                        <div class="form-group">
                            <label for="username1">Tên đăng nhập:</label>
                            <input type="text" id="username1" >
                            <span id="form-message"></span>
                        </div>
                        <div class="form-group">
                            <label for="password">Mật khẩu:</label>
                            <input type="password" id="password" >
                            <span id="form-message"></span>
                        </div>
                        <button type="submit" id="btnlogin">ĐĂNG NHẬP</button>
                        <p>Bạn chưa có tài khoản?<a href="#" onclick="showSignup()">Đăng ký</a></p>
                    </div>
                </form>
            </div>
            <div id="signup">
                <form name="signupform" >
                    <h2>ĐĂNG KÝ</h2>
                    <button type="button" class="close" onclick="CloseForm()">+</button>
                    <div class="signup-info">
                        <div class="col">   
                            <div class="form-group">
                                <label for="fullname">Tên đăng nhập:</label>
                                <input type="text" id="fullname" >
                                <span id="form-message"></span>
                            </div>
                          <div class="flex">
                            <div class="form-group">
                                <label for="city">Thành phố:</label>
                                <select id="city" >
                                  <option value="">Chọn thành phố</option>
                                </select>
                              </div>
                              <div class="form-group">
                                <label for="district">Quận/Huyện:</label>
                                <select id="district" >
                                  <option value="">Chọn quận/huyện</option>
                                </select>
                              </div>
                          </div>
                              
                            <div class="form-group">
                                <label for="address">Địa chỉ chi tiết:</label>
                                <input type="text" id="address" >
                                <span id="form-message"></span>
                            </div>
                            <div class="form-group">
                                <label for="phone">Số điện thoại:</label>
                                <input type="tel" id="phone" >
                                <span id="form-message"></span>
                            </div>
                        </div>
                        <div class="col">
                            <div class="form-group">
                                <label for="mail">Email:</label>
                                <input type="email" id="mail" >
                                <span id="form-message"></span>
                            </div>
                            <div class="form-group">
                                <label for="password1">Mật khẩu:</label>
                                <input type="password" id="password1" >
                                <span id="form-message"></span>
                            </div>
                            <div class="form-group">
                                <label for="password2">Nhập lại mật khẩu:</label>
                                <input type="password" id="password2" >
                                <span id="form-message"></span>
                            </div>
                        </div>
                    </div>
                    <button id="btnsignup" onclick="handleSignup()">ĐĂNG KÝ</button>
                    <p>Bạn đã có tài khoản?<a href="#" onclick="showLogin()">Đăng nhập</a></p>
                </form>
            </div>
        </div>
        
        <div class="modal-cart"><!--Giỏ hàng-->
            <div class="cart-container">
                <div class="khach-hang"><!--cách thức thanh toán-->
                    <form>
                        <div class="form-group">
                            <label for="phuong-thuc-thanh-toan">Phương Thức Thanh Toán:</label>
                            <select id="phuong-thuc-thanh-toan" onchange="hienThiCongThanhToan()">
                                <option value="tien-mat">Tiền mặt</option>
                                <option value="chuyen-khoan">Chuyển khoản</option>
                                <option value="the">Thanh toán qua thẻ</option>
                            </select>
                        </div>
                        <div id="cong-thanh-toan" class="cong-thanh-toan hidden"><!--dùng thẻ-->
                            <h3>Thông Tin Thẻ</h3>
                            <div class="form-group">
                                <label for="so-the">Số Thẻ:</label>
                                <input type="text" id="so-the" placeholder="Nhập số thẻ" maxlength="16" required />
                            </div>
                            <div class="form-group">
                                <label for="ngay-het-han">Ngày Hết Hạn:</label>
                                <input type="month" id="ngay-het-han" required />
                            </div>
                            <div class="form-group">
                                <label for="cvv">CVV:</label>
                                <input type="password" id="cvv" placeholder="Nhập CVV" maxlength="3" required />
                            </div>
                        </div>
                    </form>
                </div>
                <div class="cart-header">
                    <h3 class="cart-header-title"><i class="fa fa-shopping-cart" style="color:white"></i>Giỏ hàng</h3>
                    <button class="cart-close" onclick="closeCart()"><i class="fa fa-times"></i></button>
                </div>
                <div class="cart-body">
                    <div class="gio-hang-trong">
                        <i class="fa fa-shopping-basket"></i>
                        <p>Không có sản phẩm nào trong giỏ hàng của bạn</p>
                    </div>
                    <ul class="cart-list">
                        
                    </ul>
                    
                </div>
                <div class="cart-footer">
                    <div class="cart-total-price">
                        <p class="text-tt">Tổng tiền:</p>
                        <p class="text-price">0đ</p>
                    </div>
                    <div class="cart-footer-payment">
                        <button class="them-sanpham"><i class="fa fa-plus"></i> Mua tiếp</button>
                        <button class="thanh-toan">Thanh toán</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="checkout-page">
            <div class="checkout-header">
                <div class="checkout-return">
                    <button onclick="closecheckout()"><i class="fa fa-chevron-left"></i></button>
                </div>
                <h2 class="checkout-title">Thanh toán</h2>
            </div>


           

            <main class="checkout-section order-container">
                <div class="checkout-col-left">
                    <div class="checkout-row">
                        <div class="checkout-col-title">Thông tin người nhận</div>
                        <div class="checkout-col-content">
                            <div class="content-group">

                                <form action="" class="info-nhan-hang"><!-- Lựa chọn địa chỉ -->
                                    <div class="form-group">
                                        <input type="radio" name="address-option" id="useAccountAddress" value="account" checked>
                                        <label>Sử dụng địa chỉ từ tài khoản</label>
                                    </div>
                                    <div class="form-group">
                                        <input type="radio" name="address-option" id="enterNewAddress" value="new">
                                        <label>Nhập địa chỉ giao hàng mới</label>
                                    </div>
                                    <!--------------------------------------------------------------------->
                                    <div class="form-address-container">
                                        <form>
                                          <div class="form-address">
                                            <label>Tên người nhận:</label>
                                            <input type="text" id="tennguoinhan" placeholder="Nhập tên người nhận" disabled />
                                          </div>
                                          <div class="form-address">
                                            <label>Địa chỉ nhà:</label>
                                            <input type="text" id="diachinha" placeholder="Nhập địa chỉ nhà" disabled />
                                          </div>
                                          <div class="form-address">
                                            <label>Số điện thoại:</label>
                                            <input type="tel" id="sodienthoai" placeholder="Nhập số điện thoại" disabled />
                                          </div>

                                          <div class="form-address1">
                                            <label>Thành phố:</label>
                                            <input type="text" id="text-address-city" placeholder="Thành Phố" disabled/>
                                          </div>
                                          <div class="form-address1">
                                            <label>Quận:</label>
                                            <input type="text" id="text-address-distric" placeholder="Quận" disabled/>
                                          </div>

                                          <div class="form-address2 hidden">
                                            <label for="cities">Thành phố:</label>
                                            <select id="cities"></select>
                                          </div>
                                          <div class="form-address2 hidden">
                                            <label for="districts">Quận:</label>
                                            <select id="districts" name="districts"></select>
                                          </div>
                                        </form>
                                      </div>
                                     
                                </form>
                            </div>
                        </div>
                      
                    </div>
                    
                </div>
                <div class="checkout-col-right">
                    <p class="checkout-content-label">Đơn hàng</p>
                    <div class="bill-total" id="list-order-checkout">
                    </div>
                    <div class="bill-payment">
                        <div class="total-bill-order">
                        </div>
                        <div class="policy-note">
                            Bằng việc bấm vào nút “Đặt hàng”, tôi đồng ý với <a href="#" target="_blank"> chính sách hoạt động </a>của chúng tôi.
                        </div>
                    </div>
                    <div class="total-checkout">
                        <div class="text">Tổng tiền</div>
                        <div class="price-bill">
                            <div class="price-final" id="checkout-cart-price-final">0</div>
                        </div>
                    </div>
                    <button class="preview-checkout-btn" onclick=showPreviewOrder();>Xem tổng quát đơn hàng</button>
                    <button class="complete-checkout-btn">Đặt hàng</button>
                </div>
            </main>
        </div>

        <div class="preview-order" style="display: none;" ></div><!-- hiển thị tổng quát hóa đơn trước khi thanh toán-->

        <footer class="footer"><!--Footer-->
            <div class="widget-area">
                <div class="container">
                    <div class="widget-row">
                        <div class="widget-row-col-1">
                            <h3 class="widget-title">Châm ngôn hành nghề</h3>
                            <div class="widget-row-col-content">
                                <p>Electronic Supplier trao niềm tin nhận tài lộc, đem đến cho khách hàng những mẫu áo/quần tuyệt nhất.</p>
                            </div>
                            <div class="widget-social">
                                <div class="widget-social-item">
                                    <a href="https://facebook.com" target="_blank">
                                        <i class="fa fa-facebook"></i>
                                    </a>
                                </div>
                                <div class="widget-social-item">
                                    <a href="https://youtube.com/@MixiGaming3con" target="_blank">
                                        <i class="fa fa-youtube"></i>
                                    </a>
                                </div>
                                <div class="widget-social-item">
                                    <a href="https://linkedin.com" target="_blank">
                                        <i class="fa fa-linkedin"></i>
                                    </a>
                                </div>
                                <div class="widget-social-item">
                                    <a href="https://instagram.com" target="_blank">
                                        <i class="fa fa-instagram"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="widget-row-col">
                            <h3 class="widget-title">Dịch vụ</h3>
                            <ul class="widget-contact">
                                <li class="widget-contact-item">
                                    <a href="">
                                        <span>Điều khoản sử dụng</span>
                                    </a>
                                </li>
                                <li class="widget-contact-item">
                                    <a href="">
                                        <span>Chính sách bảo mật thông tin</span>
                                    </a>
                                </li>
                                <li class="widget-contact-item">
                                    <a href="">
                                        <span>Chính sách bảo mật thanh toán</span>
                                    </a>
                                </li>
                                <li class="widget-contact-item">
                                    <a href="">
                                        <span>Giới thiệu về chúng tôi</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div class="widget-row-col-2">
                            <h3 class="widget-title">Liên hệ</h3>
                            <div class="contact">
                                <div class="contact-item">
                                    <div class="contact-item-icon">
                                        <i class="fa fa-map-marker"></i>
                                    </div>
                                    <div class="contact-content">
                                        <span>273 An Dương Vương, Phường 3, Quận 5, TP Hồ Chí Minh</span>
                                    </div>
                                </div>
                                <div class="contact-item">
                                    <div class="contact-item-icon">
                                        <i class="fa fa-phone"></i>
                                    </div>
                                    <div class="contact-content contact-item-phone">
                                        <span>0987654321</span>
                                    </div>
                                </div>
                                <div class="contact-item">
                                    <div class="contact-item-icon">
                                        <i class="fa fa-envelope"></i>
                                    </div>
                                    <div class="contact-content conatct-item-email">
                                        <span>electronic_equipment_supplier@gmail.com</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>

        <div class="copyright-wrap"><!--Thanh bản quyền dưới footer-->
            <div class="container">
                <div class="copyright-content">
                    <p>Copyright 2023 electronic quipment. All rights reserved.</p>
                </div>
            </div>
        </div>

        <script src="form.js"></script>
        <script src="index.js"></script>
        <script src="data.js"></script>
        <script>
            showPage(1);
        </script>

    </body>
</html>

