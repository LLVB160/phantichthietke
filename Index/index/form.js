document.getElementById("form-1").addEventListener("submit", (event) => {
  event.preventDefault(); // Ngăn chặn form tự động gửi
  logic.handleLogin(event); // Gọi hàm xử lý đăng nhập
});
document.getElementById("form-signup").addEventListener("submit", (event) => {
    event.preventDefault();
    logic.handleSignup(event);
  });

// Hàm đóng form
function closeform_login() {
    const form = document.getElementById("login");
    if (form) {
        form.style.display = "none"; // Ẩn form đăng nhập
    }
}

// Hiển thị form đăng ký
function showSignup() {
  const loginform = document.getElementById("login");
  const signupform = document.getElementById("signup");

  if (loginform) loginform.style.display = "none";
  if (signupform) signupform.style.display = "block";
}

// Hiển thị form đăng nhập
function showLogin() {
  const loginform = document.getElementById("login");
  const signupform = document.getElementById("signup");

  if (loginform) loginform.style.display = "block";
  if (signupform) signupform.style.display = "none";
}

// Lấy các phần tử cần thiết
const usernameInput = document.getElementById("fullname");
const addressInput = document.getElementById("address");
const phoneInput = document.getElementById("phone");
const emailInput = document.getElementById("mail");
const passwordInput = document.getElementById("password1");
const confirmPasswordInput = document.getElementById("password2");
const loginUsernameInput = document.getElementById("username1");
const loginPasswordInput = document.getElementById("password");

const btnSignup = document.getElementById("btnsignup");
const btnLogin = document.getElementById("btnlogin");

document.getElementById("form-1").addEventListener("submit", (event) => {
  event.preventDefault(); // Ngăn chặn form tự động gửi
  logic.handleLogin(event); // Gọi hàm xử lý đăng nhập
});
// Quản lý logic tài khoản
const logic = {
  clearSignupForm() {
      usernameInput.value = "";
      addressInput.value = "";
      phoneInput.value = "";
      emailInput.value = "";
      passwordInput.value = "";
      confirmPasswordInput.value = "";
  },

  handleSignup(event) {
    event.preventDefault();

    // Lấy giá trị từ các trường trong form
    const username = document.getElementById("username").value.trim();
    const fullname = document.getElementById("fullname").value.trim();
    const address = document.getElementById("address").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("mail").value.trim();
    const password = document.getElementById("password1").value.trim();
    const confirmPassword = document.getElementById("password2").value.trim();

    // Kiểm tra dữ liệu đầu vào
    if (!username) return alert("Vui lòng nhập tên đăng nhập!");
    if (!fullname) return alert("Vui lòng nhập tên đầy đủ!");
    if (!address) return alert("Vui lòng nhập địa chỉ!");
    if (!phone) return alert("Vui lòng nhập số điện thoại!");
    if (!email) return alert("Vui lòng nhập email!");
    if (!password) return alert("Vui lòng nhập mật khẩu!");
    if (password !== confirmPassword) return alert("Mật khẩu không khớp!");

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return alert("Email không hợp lệ!");
    }

    // Kiểm tra định dạng số điện thoại (chỉ cho phép số và độ dài từ 10-11 ký tự)
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(phone)) {
        return alert("Số điện thoại không hợp lệ! Vui lòng nhập 10-11 chữ số.");
    }

    // Kiểm tra độ dài mật khẩu (ít nhất 6 ký tự)
    if (password.length < 6) {
        return alert("Mật khẩu phải có ít nhất 6 ký tự!");
    }

    console.log("Password trước khi gửi:", password);

    // Gửi dữ liệu đăng ký đến API
    fetch('signup.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username,
            fullname,
            address,
            phone,
            email,
            password
        })
    })
        .then(response => {
            console.log("Phản hồi từ máy chủ:", response);
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log("Phản hồi JSON từ API:", data);
            if (data.success) {
                alert("Đăng ký thành công");
                showLogin();
            } else {
                alert("Lỗi: " + data.message);
            }
        })
        .catch(error => {
            console.error("Lỗi khi gửi yêu cầu đăng ký:", error);
            alert("Đã xảy ra lỗi khi đăng ký.");
        });
},


  handleLogin(event) {
    event.preventDefault();

    // Kiểm tra dữ liệu đầu vào
    if (!loginUsernameInput.value) return alert("Vui lòng nhập tài khoản");
    if (!loginPasswordInput.value) return alert("Vui lòng nhập mật khẩu");

    // Gửi yêu cầu đăng nhập đến API
    fetch('login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: loginUsernameInput.value,
            password: loginPasswordInput.value
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Phản hồi từ API:", data); // Ghi log phản hồi từ API
        if (data.success && data.user) {
            // Lưu thông tin người dùng vào localStorage
            localStorage.setItem('currentuser', JSON.stringify({
                user_id: data.user.user_id,
                username: data.user.username,
                fullname: data.user.fullname || data.user.username // Dùng fullname nếu có, nếu không thì dùng username
            }));

            alert("Đăng nhập thành công");            

            // Cập nhật giao diện hiển thị thông tin người dùng
            const display = document.getElementById('userdata');
            const currUser = data.user;
            let userDisPlay = `
                <i class="fas fa-user-circle"></i>
                <div class="auth-container">
                    <span class="text-tk">Xin chào ${currUser.username}</span>
                </div>
                <ul class="header-top-right-menu">
                    <li>
                        <a id="iconsigout" href="javascript:;"><i class="fa fa-user-plus"></i> Đăng xuất</a>
                    </li>
                </ul>
            `;
            display.innerHTML = userDisPlay;

            // Thêm sự kiện cho nút đăng xuất
            const signout = document.getElementById('iconsigout');
            if (signout) {
                signout.addEventListener('click', () => {
                    localStorage.removeItem('currentuser');
                    window.location.reload();
                });
            }

            // Đóng form đăng nhập
            closeform_login();
            location.reload();

        } else {
            alert(data.message || "Sai tên đăng nhập hoặc mật khẩu");
        }
    })
    .catch(error => {
        console.error("Lỗi khi gửi yêu cầu đăng nhập:", error);
        alert("Đã xảy ra lỗi khi đăng nhập.");
    });
}
};

// Gắn sự kiện cho các nút
btnSignup.addEventListener("click", (event) => logic.handleSignup(event));
