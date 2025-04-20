document.addEventListener("DOMContentLoaded", function () {
    updateAmount();
    updateCartTotal();
});
let currUser = JSON.parse(localStorage.getItem('currentuser'));


document.addEventListener("DOMContentLoaded", function () {
    // Gọi API để lấy danh sách sản phẩm từ cơ sở dữ liệu
    fetch('get_products.php?page=1&limit=100') // Thay URL này bằng API của bạn
        .then(response => response.json())
        .then(data => {
            if (data.products && data.products.length > 0) {
                // Xóa mảng products cũ trong localStorage
                localStorage.removeItem('products');

                // Lưu danh sách sản phẩm mới vào localStorage
                localStorage.setItem('products', JSON.stringify(data.products));
                console.log("Danh sách sản phẩm mới đã được lưu vào localStorage:", data.products);
            } else {
                console.error("Không có sản phẩm nào được trả về từ API.");
            }
        })
        .catch(error => {
            console.error("Lỗi khi lấy danh sách sản phẩm từ API:", error);
        });
    
        showPage(1);
});
// Hàm để xử lý sự kiện click trên các thẻ <li>
function activateListItem(listSelector) {
    const listItems = document.querySelectorAll(listSelector);

    listItems.forEach(item => {
        item.addEventListener('click', function () {
            // Xóa lớp 'active' khỏi tất cả các thẻ <li> trong danh sách
            listItems.forEach(li => li.classList.remove('active'));

            this.classList.add('active');
        });
    });
}

activateListItem('.category-club li');
activateListItem('.category-price li');



LoadCount = () => {
    let countCart = document.getElementById('count');
    let length = JSON.parse(localStorage.getItem('carts'));
    countCart.innerText = length == null ? 0 : length.length;
}

document.addEventListener("DOMContentLoaded", function () {

    kiemtradiachi();
    loadCitiesorder();
     document.querySelector('.category-responsive-btn').addEventListener('click', () => {
        
        document.querySelector('.category').style.transform = 'translateX(0)';
        document.querySelector('#category-overlay').style.display = 'block';
    });

    document.querySelector('#category-overlay').addEventListener('click', () => {
        document.querySelector('.category').style.transform = 'translateX(-1220%)';
        document.querySelector('#category-overlay').style.display = 'none';
    });

    let resizeTimeout;
    window.addEventListener('resize', () => {// Xóa timeout trước đó (nếu có)
        clearTimeout(resizeTimeout);// Đặt timeout mới để tránh reload liên tục khi kéo
        resizeTimeout = setTimeout(() => {
            const width = window.innerWidth;// Kiểm tra điều kiện kích thước
            if (width > 800) {
                location.reload(); // Tự reload trang
                //document.querySelector('.category').style.transform = 'translateX(0)';
            }
        }, 200); // Thời gian chờ để tránh reload quá nhanh
    });
});

LoadCount();

function openCart() { //mở giỏ
    let currentuser = JSON.parse(localStorage.getItem('currentuser'));// Lấy người dùng hiện tại
    if (!currentuser || !currentuser.username) {
        alert("Vui lòng đăng nhập để xem giỏ hàng.");
        return;
    }
    else {
        showCart();/*gọi hàm show giỏ*/
        document.querySelector('.modal-cart').classList.add('open');
        //body.style.overflow = "hidden";
    }

}

function closeCart() {//đóng giỏ
    document.querySelector('.modal-cart').classList.remove('open');
    //body.style.overflow = "auto";
    updateAmount();
}

function increasingNumber(productId) {
    const currentUser = JSON.parse(localStorage.getItem('currentuser'));
    if (!currentUser || !currentUser.username) {
        alert("Vui lòng đăng nhập để thay đổi số lượng.");
        return;
    }

    const username = currentUser.username;
    const carts = JSON.parse(localStorage.getItem('carts')) || {};
    let cart = carts[username] || [];

    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.product_id === productId);

    if (!product) {
        alert("Sản phẩm không tồn tại trong kho.");
        return;
    }

    let cartItem = cart.find(item => item.product_id === productId);
    if (cartItem) {
        if (cartItem.soluong + 1 > product.quantity) {
            alert("Không đủ sản phẩm trong kho.");
            return;
        }
        cartItem.soluong += 1;
    } else {
        alert("Sản phẩm không tồn tại trong giỏ hàng.");
        return;
    }

    carts[username] = cart;
    localStorage.setItem('carts', JSON.stringify(carts));
    showCart();
    updateCartTotal();
    LoadCount(); // Cập nhật số lượng sản phẩm trong giỏ hàng
}

function decreasingNumber(productId) {
    const currentUser = JSON.parse(localStorage.getItem('currentuser'));
    if (!currentUser || !currentUser.username) {
        alert("Vui lòng đăng nhập để thay đổi số lượng.");
        return;
    }

    const username = currentUser.username;
    const carts = JSON.parse(localStorage.getItem('carts')) || {};
    let cart = carts[username] || [];

    let cartItem = cart.find(item => item.product_id === productId);
    if (cartItem) {
        if (cartItem.soluong > 1) {
            cartItem.soluong -= 1;
        } else {
            cart = cart.filter(item => item.product_id !== productId); // Xóa sản phẩm khỏi giỏ hàng
        }
    } else {
        alert("Sản phẩm không tồn tại trong giỏ hàng.");
        return;
    }

    carts[username] = cart;
    localStorage.setItem('carts', JSON.stringify(carts));
    showCart();
    updateCartTotal();
    LoadCount(); // Cập nhật số lượng sản phẩm trong giỏ hàng
}

function hienThiCongThanhToan() {// hiển thị các phương thức thanh toán
    const phuongThuc = document.getElementById("phuong-thuc-thanh-toan").value;
    const congThanhToan = document.getElementById("cong-thanh-toan");

    if (phuongThuc === "credit card") {
        congThanhToan.classList.remove("hidden");
    }
    else if (phuongThuc === "bank transfer") {
        congThanhToan.classList.add("hidden");
    }
    else {
        congThanhToan.classList.add("hidden");
    }
}

let nutthanhtoan = document.querySelector('.thanh-toan')
let checkoutpage = document.querySelector('.checkout-page');
nutthanhtoan.addEventListener('click', () => {
    let cart = JSON.parse(localStorage.getItem('carts'));
    if (!cart) {
        alert("Không thể thanh toán do không có sản phẩm!");
        return;
    }
    if (!currUser) {
        alert("Không thể thanh toán do chưa đăng nhập!");
        return;
    }
    checkoutpage.classList.add('active');
    thanhtoanpage();
    closeCart();
    //body.style.overflow = "hidden"
})

function closecheckout() {
    const checkoutpage = document.querySelector('.checkout-page');
    checkoutpage.classList.remove('active');
    document.body.style.overflow = "auto"; // Cho phép cuộn trang trở lại
}

let priceFinal = document.getElementById("checkout-cart-price-final");

function thanhtoanpage() {
    let totalBillOrder = document.querySelector('.total-bill-order');
    let totalBillOrderHtml;

    showProductCart(); // Hiển thị sản phẩm trong giỏ hàng

    totalBillOrderHtml = `
        <div class="priceFlx">
            <div class="text">
                Tiền hàng 
                <span class="count">${getAmountCart()} món</span>
            </div>
            <div class="price-detail">
                <span id="checkout-cart-total">${vnd(getCartTotal())}</span>
            </div>
        </div>`;

    let priceFinal = document.getElementById("checkout-cart-price-final");
    priceFinal.innerText = vnd(getCartTotal()); // Tổng tiền

    totalBillOrder.innerHTML = totalBillOrderHtml;

    document.querySelector(".complete-checkout-btn").onclick = () => {
        createNewOrder('carts', currUser);
    };
}
function vnd(price) {
    if (price == null || isNaN(price)) {
        return 'Giá không hợp lệ';
    }
    return Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

function showProductCart() {
    const carts = JSON.parse(localStorage.getItem('carts')) || {};
    const currentUser = JSON.parse(localStorage.getItem('currentuser'));
    if (!currentUser || !currentUser.username) {
        alert("Vui lòng đăng nhập để xem giỏ hàng.");
        return;
    }

    const username = currentUser.username;
    const cart = carts[username] || []; // Lấy giỏ hàng của người dùng hiện tại

    if (cart.length === 0) {
        alert("Giỏ hàng của bạn đang trống.");
        return;
    }

    let listOrder = document.getElementById("list-order-checkout");
    let listOrderHtml = '';

    cart.forEach(item => {
        let product = getProduct(item);
        listOrderHtml += `
            <div class="book-total">
                <div class="count">${product.soluong}x</div>
                <div class="info-book">
                    <div class="name-book">${product.name}</div>
                </div>
            </div>`;
    });

    listOrder.innerHTML = listOrderHtml;
}

function showCart() {
    const currentUser = JSON.parse(localStorage.getItem('currentuser'));
    if (!currentUser || !currentUser.username) {
        alert("Vui lòng đăng nhập để xem giỏ hàng.");
        return;
    }

    const username = currentUser.username;
    const carts = JSON.parse(localStorage.getItem('carts')) || {};
    const cart = carts[username] || [];

    if (cart.length === 0) {
        document.querySelector('.gio-hang-trong').style.display = 'flex';
        return;
    }

    document.querySelector('.gio-hang-trong').style.display = 'none';
    document.querySelector('button.thanh-toan').classList.remove('disabled');

    let productcarthtml = '';
    cart.forEach(item => {
        let product = getProduct(item);
        productcarthtml += `
            <li class="cart-item" data-id="${product.product_id}">
                <div class="cart-item-image">
                    <img src="${product.img_url}" alt="${product.name}" />
                </div>
                <div class="cart-item-info">
                    <p class="cart-item-title">${product.name}</p>
                    <span class="cart-item-price price" data-price="${product.price}">
                        ${(parseInt(product.price)).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </span>
                </div>
                <div class="cart-item-control">
                    <button class="cart-item-delete" onclick="deleteCartItem('${product.product_id}')">Xóa</button>
                    <div class="buttons_added">
                        <input class="minus is-form" type="button" value="-" onclick="decreasingNumber('${product.product_id}')">
                        <input class="input-qty" max="100" min="1" name="" type="number" value="${item.soluong}" readonly>
                        <input class="plus is-form" type="button" value="+" onclick="increasingNumber('${product.product_id}')">
                    </div>
                </div>
            </li>`;
    });

    document.querySelector('.cart-list').innerHTML = productcarthtml;
    updateCartTotal();
}

function deleteCartItem(productId) {
    const currentUser = JSON.parse(localStorage.getItem('currentuser'));
    if (!currentUser || !currentUser.username) {
        alert("Vui lòng đăng nhập để xóa sản phẩm.");
        return;
    }

    const username = currentUser.username;
    const carts = JSON.parse(localStorage.getItem('carts')) || {};
    let cart = carts[username] || [];

    cart = cart.filter(item => item.product_id !== productId);

    carts[username] = cart;
    localStorage.setItem('carts', JSON.stringify(carts));
    showCart();
    updateCartTotal();
    LoadCount();
}

function updateCartTotal() {
    const total = getCartTotal();
    document.querySelector('.text-price').innerText = total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

function getCartTotal() {
    const currentUser = JSON.parse(localStorage.getItem('currentuser'));
    if (!currentUser || !currentUser.username) {
        return 0; // Nếu không có người dùng hiện tại, trả về 0
    }

    const carts = JSON.parse(localStorage.getItem('carts')) || {};
    const cart = carts[currentUser.username] || []; // Lấy giỏ hàng của người dùng hiện tại

    let total = 0;

    cart.forEach(item => {
        const product = getProduct(item);
        total += parseInt(product.soluong) * parseInt(product.price);
    });

    return total;
}

function getProduct(item) {/*lấy ra sản phẩm*/
    let products = JSON.parse(localStorage.getItem('products'));
    let infoProductCart = products.find(sp => item.id == sp.id)
    let product = {
        ...infoProductCart,
        ...item
    }
    return product;
}

function getAmountCart() { /*lấy số lượng mặt hàng*/
    let carts = JSON.parse(localStorage.getItem('carts')) || {};
    const currentUser = JSON.parse(localStorage.getItem('currentuser'));
    if (!currentUser || !currentUser.username) {
        return 0; // Nếu không có người dùng hiện tại, trả về 0
    }

    const cart = carts[currentUser.username] || [];
    let amount = 0;

    cart.forEach(element => {
        amount += parseInt(element.soluong);
    });

    return amount;
}

function updateAmount() { /*cập nhật giá*/
    if (localStorage.getItem('currentuser') != null) {
        let amount = getAmountCart();
        document.querySelector('.count-product-cart').innerText = amount;
    } else {
        document.querySelector('.count-product-cart').innerText = 0; // Nếu không có người dùng, hiển thị 0
    }
}

function saveAmountCart() {
    let cartAmountbtn = document.querySelectorAll(".cart-item-control .is-form");
    let listProduct = document.querySelectorAll('.cart-item');
    let currentUser = JSON.parse(localStorage.getItem('currentuser'));
    let cart = JSON.parse(localStorage.getItem('carts'));

    cartAmountbtn.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            let id = listProduct[parseInt(index / 2)].getAttribute("data-id");
            let productId = cart.find(item => {
                return item.masp == id;
            });
            productId.soLuong = parseInt(listProduct[parseInt(index / 2)].querySelector(".input-qty").value);
            localStorage.setItem('currentuser', JSON.stringify(currentUser));
            updateCartTotal();
        })
    });
}

function closeModal() {
    modalContainer.forEach(item => {
        item.classList.remove('open');
    });
    console.log(modalContainer)
    body.style.overflow = "auto";
}

function addToCart(productId) {
    // Lấy danh sách sản phẩm từ localStorage
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(item => item.product_id === productId);

    if (!product) {
        alert("Sản phẩm không tồn tại trong kho.");
        return;
    }

    // Lấy thông tin currentuser
    const currentUser = JSON.parse(localStorage.getItem('currentuser'));
    if (!currentUser || !currentUser.username) {
        alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
        return;
    }
    const username = currentUser.username;

    // Kiểm tra số lượng tồn kho
    if (product.stock <= 0) {
        alert("Sản phẩm đã hết hàng trong kho.");
        return;
    }

    // Lấy giỏ hàng từ localStorage
    let carts = JSON.parse(localStorage.getItem('carts')) || {};
    let cart = carts[username] || [];

    // Kiểm tra sản phẩm đã tồn tại trong giỏ hàng chưa
    let existingProduct = cart.find(item => item.product_id === productId);

    if (existingProduct) {
        // Nếu sản phẩm đã tồn tại, kiểm tra tồn kho trước khi tăng số lượng
        if (existingProduct.soluong + 1 > product.quantity) {
            alert("Không đủ sản phẩm trong kho để thêm vào giỏ hàng.");
            return;
        }
        existingProduct.soluong += 1;
    } else {
        // Nếu sản phẩm chưa tồn tại, thêm mới vào giỏ hàng
        cart.push({ ...product, soluong: 1 });
    }

    // Lưu giỏ hàng vào localStorage
    carts[username] = cart;
    localStorage.setItem('carts', JSON.stringify(carts));
    alert("Thêm sản phẩm vào giỏ hàng thành công!");
    LoadCount(); // Cập nhật số lượng sản phẩm trong giỏ hàng
}

const products_1 = JSON.parse(localStorage.getItem('products')) || [];
let filteredProducts = products_1;
let currentPage = 1;
const itemsPerPage = 6;//số sản phẩm trên 1 trang

let totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

function renderPagination(totalPages, currentPage) {
    const paginationContainer = document.querySelector(".pagination-btn");
    paginationContainer.innerHTML = ""; // Xóa nội dung cũ trước khi thêm mới

    let paginationHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <button class="${i === currentPage ? 'active' : ''}" onclick="showPage(${i})">
                ${i}
            </button>
        `;
    }

    paginationContainer.innerHTML = paginationHTML;

    // Hiển thị hoặc ẩn các nút điều hướng
    document.querySelector('.chevron-left').style.display = currentPage > 1 ? 'flex' : 'none';
    document.querySelector('.chevron-right').style.display = currentPage < totalPages ? 'flex' : 'none';
}

function showPage(page, products = filteredProducts) {
    currentPage = page;
    const itemsPerPage = 6; // Số sản phẩm trên mỗi trang
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Lấy danh sách sản phẩm hiển thị trên trang hiện tại
    const productsToShow = products.slice(startIndex, endIndex);
    const productList = document.querySelector("#product-wrapper");

    let productsHTML = "";

    productsToShow.forEach(product => {
        const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price);
        productsHTML += `
            <div class="product-item">
                <div class="container-product-item">
                    <img src="${product.img_url}" alt="${product.name}">
                    <button class="buyButton" onclick="addToCart('${product.product_id}')">MUA NGAY</button> 
                    <button class="detailProduct" onclick="showProductDetail('${product.product_id}')">CHI TIẾT</button> 
                </div>
                <div class="product-info" style="color:#322A2A">
                    <p><strong>Tên sản phẩm:</strong> ${product.name}</p>
                    <p><strong>Giá:</strong> ${formattedPrice}</p>
                </div>
            </div>
        `;
    });

    productList.innerHTML = productsHTML;

    // Cập nhật phân trang
    const totalPages = Math.ceil(products.length / itemsPerPage);
    renderPagination(totalPages, page);
}


document.querySelector(".chevron-left").onclick = prevPage; // nút lên 1 trang
document.querySelector(".chevron-right").onclick = nextPage; // nút giảm 1 trang

function prevPage() {
    if (currentPage > 1) {
        currentPage -= 1;
        showPage(currentPage);
    }
}

function nextPage() {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage += 1;
        showPage(currentPage);
    }
}

function searchProducts() {
    // Lấy giá trị từ ô tìm kiếm và chuẩn hóa (bỏ khoảng trắng thừa, chuyển sang chữ thường)
    const searchTerm = document.getElementById("form-search-input").value.trim().toLowerCase();
    
    // Lấy danh sách sản phẩm từ localStorage
    const products = JSON.parse(localStorage.getItem('products')) || [];
    
    // Nếu không có từ khóa tìm kiếm, hiển thị tất cả sản phẩm
    if (!searchTerm) {
        filteredProducts = [...products]; // Tạo bản sao của mảng sản phẩm
        showPage(1);
        return;
    }

    // Tách từ khóa thành các từ riêng biệt để tìm kiếm đa từ
    const searchTerms = searchTerm.split(' ').filter(term => term.length > 0);

    // Lọc sản phẩm theo từ khóa
    filteredProducts = products.filter(product => {
        // Chuẩn hóa tên sản phẩm và mô tả để so sánh
        const productName = product.name.toLowerCase();
        const productDesc = product.description ? product.description.toLowerCase() : '';
        
        // Kiểm tra xem tất cả các từ khóa có xuất hiện trong tên hoặc mô tả sản phẩm không
        return searchTerms.every(term => 
            productName.includes(term) || 
            productDesc.includes(term)
        );
    });

    // Reset các bộ lọc khác
    resetOtherFilters();
    
    // Hiển thị kết quả
    showPage(1);
    
    // Hiển thị thông báo nếu không tìm thấy sản phẩm
    if (filteredProducts.length === 0) {
        displayNoResultsMessage(searchTerm);
    }
}

// Hàm hỗ trợ reset các bộ lọc khác
function resetOtherFilters() {
    document.querySelector('#advanced-search-category-select').value = "all";
    toggleSelectBox();
    document.getElementById('min-price').value = "";
    document.getElementById('max-price').value = "";
    
    // Xóa active class từ các danh mục
    document.querySelectorAll(".category-club li.active, .category-price li.active").forEach(item => {
        item.classList.remove("active");
    });
}

// Hàm hiển thị thông báo khi không tìm thấy sản phẩm
function displayNoResultsMessage(searchTerm) {
    const productWrapper = document.getElementById("product-wrapper");
    productWrapper.innerHTML = `
        <div class="no-results">
            <i class="fas fa-search"></i>
            <p>Không tìm thấy sản phẩm nào phù hợp với từ khóa "<strong>${searchTerm}</strong>"</p>
            <button onclick="resetSearch()">Hiển thị tất cả sản phẩm</button>
        </div>
    `;
}

// Hàm reset tìm kiếm
function resetSearch() {
    document.getElementById("form-search-input").value = "";
    searchProducts();
}

function toggleSelectBox() {// hàm này chỉ để ẩn hiện lúc chọn cái Quốc gia hoặc câu lạc bộ
    const selected = document.querySelector('#advanced-search-category-select').value;

    let clubElements = document.getElementsByClassName('advanced-search-category-select-club');
    let nationElements = document.getElementsByClassName('advanced-search-category-select-nation');

    if (selected === "all") {

        for (let i = 0; i < clubElements.length; i++) {
            clubElements[i].style.display = 'none';
        }
        for (let i = 0; i < nationElements.length; i++) {
            nationElements[i].style.display = 'none';
        }
    }
    else if (selected === "club") {
        for (let i = 0; i < clubElements.length; i++) {
            clubElements[i].style.display = 'inline';
        }
        for (let i = 0; i < nationElements.length; i++) {
            nationElements[i].style.display = 'none';
        }
    }
    else if (selected === "nation") {
        for (let i = 0; i < nationElements.length; i++) {
            nationElements[i].style.display = 'inline';
        }
        for (let i = 0; i < clubElements.length; i++) {
            clubElements[i].style.display = 'none';
        }
    }
}
function filterClub(selectedCategoryId) {
    console.log("Category ID được chọn:", selectedCategoryId);

    // Lấy danh sách sản phẩm từ localStorage
    const products = JSON.parse(localStorage.getItem('products')).map(product => ({
        ...product,
        category_id: Number(product.category_id) // Ép kiểu category_id thành số
    }));
    localStorage.setItem('products', JSON.stringify(products));
    console.log("Dữ liệu sản phẩm trong localStorage:", products);

    if (!products || !products.length) {
        console.error("Không có sản phẩm nào trong localStorage.");
        return;
    }

    // Ép kiểu selectedCategoryId thành số
    selectedCategoryId = Number(selectedCategoryId);

    // Lọc sản phẩm theo category_id
    filteredProducts = products.filter(product => {
        console.log(`So sánh: ${product.category_id} (${typeof product.category_id}) === ${selectedCategoryId} (${typeof selectedCategoryId})`);
        return product.category_id === selectedCategoryId;
    });

    // Kiểm tra kết quả lọc
    console.log("Sản phẩm sau khi lọc:", filteredProducts);

    // Hiển thị danh sách sản phẩm đã lọc
    showPage(1, filteredProducts);
}
function filterPrice(min, max) {
    filteredProducts = products_1.filter(product =>
        product.price >= min && product.price <= max
    );
    showPage(1); // Hiển thị trang đầu tiên với danh sách đã lọc
}
function advancedSearch() {
    // Lấy danh sách sản phẩm từ localStorage
    const products = JSON.parse(localStorage.getItem('products')) || [];
    filteredProducts = products;

    // Lọc theo loại sản phẩm (câu lạc bộ)
    const categorySelect = document.querySelector('#advanced-search-category-select');
    const clubSelect = document.querySelector('.advanced-search-category-select-club.club');
    if (categorySelect.value === 'club' && clubSelect.value !== 'none') {
        const selectedCategory = clubSelect.value;
        filteredProducts = filteredProducts.filter(product =>
            product.category_id === selectedCategory
        );
    }

    // Lọc theo giá
    let minPrice = document.getElementById('min-price').value.trim();
    let maxPrice = document.getElementById('max-price').value.trim();

    if (minPrice !== '') {
        minPrice = parseFloat(minPrice);
        filteredProducts = filteredProducts.filter(product =>
            product.price >= minPrice
        );
    }

    if (maxPrice !== '') {
        maxPrice = parseFloat(maxPrice);
        filteredProducts = filteredProducts.filter(product =>
            product.price <= maxPrice
        );
    }

    // Lọc theo từ khóa tìm kiếm
    const searchInput = document.getElementById("form-search-input").value.toLowerCase();
    if (searchInput !== '') {
        filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(searchInput)
        );
    }

    // Hiển thị kết quả trên trang đầu tiên
    showPage(1, filteredProducts);
}

document.querySelector('#reset-search').addEventListener("click", function () {//nút reset trong tìm kiếm nâng cao
    filteredProducts = JSON.parse(localStorage.getItem('products'));
    // xóa hết dữ liệu mấy cái lựa chọn ở tìm kiếm nâng cao
    document.querySelector('#advanced-search-category-select').value = "all";
    toggleSelectBox();
    document.getElementById('min-price').value = "";
    document.getElementById('max-price').value = "";
    document.querySelector('#form-search-input').value = "";
    // dưới này là để tránh chọn danh mục xong mới dùng search nâng cao nên cần xóa danh mục
    document.querySelectorAll(".category-nation li.active").forEach(item => {
        item.classList.remove("active");
    });

    document.querySelectorAll(".category-club li.active").forEach(item => {
        item.classList.remove("active");
    });

    document.querySelectorAll(".category-price li.active").forEach(item => {
        item.classList.remove("active");
    });

    selectedNations = [];
    selectedClubs = [];
    selectedPriceRanges = [];
    showPage(1);
});

document.querySelector('#sort-ascending').addEventListener("click", function () {
    filteredProducts.sort((a, b) => a.price - b.price);
    showPage(1); // Hiển thị trang đầu tiên với danh sách đã sắp xếp
});
document.querySelector('#sort-descending').addEventListener("click", function () {
    filteredProducts.sort((a, b) => b.price - a.price); // Sắp xếp theo giá giảm dần
    showPage(1); // Hiển thị trang đầu tiên với danh sách đã sắp xếp
});
// ------------------------------------------ DANH MỤC -------------------------------------------------------------------------------------------

let selectedNations = []; // mảng lưu các lựa chọn ÁO THEO QUỐC GIA 
let selectedClubs = []; // mảng lưu các lựa chọn ÁO THEO CÂU LẠC BỘ
let selectedPriceRanges = []; // Mảng để lưu các khoảng giá 



// Gắn sự kiện click cho danh mục mùa giải

function toggleClub(Club) {// Hàm xử lý khi click vào mùa giải
    const index = selectedClubs.indexOf(Club);
    if (index === -1) {
        selectedClubs.push(Club);
    } else {
        selectedClubs.splice(index, 1);
    }
    filterProducts();
}

function togglePriceRange(priceRange) {// hàm xử lý khi click vào khoảng giá
    const index = selectedPriceRanges.indexOf(priceRange);
    if (index === -1) {
        selectedPriceRanges.push(priceRange);
    } else {
        selectedPriceRanges.splice(index, 1);
    }
    filterProducts();
}

function filterProducts() {//lọc tìm sản phẩm theo category
    filteredProducts = products_1;
    if (selectedClubs.length > 0) {
        filteredProducts = filteredProducts.filter(product =>
            selectedClubs.includes(product.team)
        );
    }
    showPage(1);
}
// ------------------------------------------------------------- HẾT DANH MỤC -----------------------------------------------------------------

let display = document.getElementById('userdata');
let userDisPlay = '';

if (!currUser) {
    // Nếu chưa đăng nhập
    userDisPlay += `
        <i class="fa fa-user-circle"></i>
        <div class="auth-container">
            <span class="text-tk">Tài khoản <i class="fa fa-caret-down"></i></span>
        </div>
        <ul class="header-top-right-menu">
            <li>
                <a id="iconlogin" href="javascript:;"><i class="fa fa-user"></i> Đăng nhập</a>
            </li>
            <li>
                <a id="iconsignup" href="javascript:;"><i class="fa fa-user-plus"></i> Đăng ký</a>
            </li>
        </ul>
    `;
} else {
    // Nếu đã đăng nhập
    userDisPlay += `
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
}

display.innerHTML = userDisPlay;

const loginDiv = document.getElementById('user');
const toggleButton = document.getElementById('iconlogin');
const signupButton = document.getElementById('iconsignup');

let loginForm = document.getElementById('login');
let signupForm = document.getElementById('signup');
let signout = document.getElementById('iconsigout');

if (signout) {
    signout.addEventListener('click', () => {
        const currentUser = JSON.parse(localStorage.getItem('currentuser'));
        if (currentUser && currentUser.username) {
            const carts = JSON.parse(localStorage.getItem('carts')) || {};
            delete carts[currentUser.username];
            localStorage.setItem('carts', JSON.stringify(carts));
        }
        localStorage.removeItem('currentuser');
        window.location.reload();
    });
}

toggleButton.addEventListener('click', () => {
    loginDiv.classList.add('user-open');
    signupForm.style.display = 'none';
    loginForm.style.display = 'block';
});

signupButton.addEventListener('click', () => {
    loginDiv.classList.add('user-open');
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
});

CloseForm = () => {
    loginDiv.classList.remove('user-open');
}

/*-------------------------------------HUỲNH TẤN DƯƠNG-------------------------------------------------------------------------------- */
function ThemDieuKienSearch() {/*mở tìm kiếm nâng cao*/
    event.preventDefault();
    document.querySelector(".advanced-search").classList.toggle("open")
}

function hienthichinhsach() {
    const mainWrapper = document.getElementById("main-wrapper");
    mainWrapper.innerHTML = `
        <div class="policy-container">
            <h2>Chính Sách Hoạt Động của EES</h2>
            <div class="policy-section">
                <h3>1. Chính Sách Bảo Hành</h3>
                <p>
                    - Tất cả các sản phẩm được mua tại EES đều được bảo hành chính hãng từ 6 đến 24 tháng tùy theo loại sản phẩm.<br>
                    - Khách hàng cần giữ hóa đơn mua hàng hoặc thông tin đơn hàng để được hỗ trợ bảo hành.<br>
                    - Các sản phẩm bị lỗi do nhà sản xuất sẽ được đổi mới hoặc sửa chữa miễn phí.
                </p>
            </div>
            <div class="policy-section">
                <h3>2. Chính Sách Đổi Trả</h3>
                <p>
                    - Sản phẩm có thể được đổi trả trong vòng 7 ngày kể từ ngày nhận hàng nếu đáp ứng các điều kiện sau:<br>
                    &nbsp;&nbsp;+ Sản phẩm còn nguyên tem, hộp, và chưa qua sử dụng.<br>
                    &nbsp;&nbsp;+ Có đầy đủ hóa đơn và phụ kiện đi kèm.<br>
                    - Các sản phẩm không đáp ứng điều kiện đổi trả sẽ không được chấp nhận.
                </p>
            </div>
            <div class="policy-section">
                <h3>3. Chính Sách Giao Hàng</h3>
                <p>
                    - EES hỗ trợ giao hàng toàn quốc với thời gian giao hàng từ 2-5 ngày làm việc.<br>
                    - Miễn phí giao hàng cho đơn hàng từ 500.000đ trở lên.<br>
                    - Khách hàng có thể kiểm tra hàng trước khi thanh toán.
                </p>
            </div>
            <div class="policy-section">
                <h3>4. Chính Sách Thanh Toán</h3>
                <p>
                    - EES hỗ trợ các phương thức thanh toán sau:<br>
                    &nbsp;&nbsp;+ Thanh toán tiền mặt khi nhận hàng (COD).<br>
                    &nbsp;&nbsp;+ Chuyển khoản ngân hàng.<br>
                    &nbsp;&nbsp;+ Thanh toán qua thẻ tín dụng/thẻ ghi nợ.<br>
                    - Tất cả các giao dịch thanh toán đều được bảo mật tuyệt đối.
                </p>
            </div>
            <div class="policy-section">
                <h3>5. Chính Sách Bảo Mật Thông Tin</h3>
                <p>
                    - EES cam kết bảo mật thông tin cá nhân của khách hàng.<br>
                    - Thông tin của khách hàng chỉ được sử dụng để xử lý đơn hàng và hỗ trợ dịch vụ.<br>
                    - EES không chia sẻ thông tin khách hàng với bên thứ ba nếu không có sự đồng ý của khách hàng.
                </p>
            </div>
            <div class="policy-section">
                <h3>6. Liên Hệ Hỗ Trợ</h3>
                <p>
                    - Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi qua:<br>
                    &nbsp;&nbsp;+ Hotline: 0987654321<br>
                    &nbsp;&nbsp;+ Email: electronic_equipment_supplier@gmail.com<br>
                    &nbsp;&nbsp;+ Địa chỉ: 273 An Dương Vương, Phường 3, Quận 5, TP Hồ Chí Minh.
                </p>
            </div>
        </div>
    `;
}

function showProductDetail(productId) {
    // Lấy danh sách sản phẩm từ localStorage
    const products = JSON.parse(localStorage.getItem('products')) || [];
    // Tìm sản phẩm theo ID
    const product = products.find(item => item.product_id === productId);
    const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price);
    if (product) {
        const detailDiv = document.querySelector(".product-detail");
        detailDiv.innerHTML = ` 
            <div class="detail-container">
                <h3>THÔNG TIN CHI TIẾT SẢN PHẨM</h3>
                <img src="${product.img_url}" alt="${product.name}">
                <p><strong>Mã sản phẩm:</strong> ${product.product_id}</p>
                <p><strong>Tên sản phẩm:</strong> ${product.name}</p>
                <p><strong>Mô tả:</strong> ${product.description}</p>
                <p><strong>Giá:</strong> ${formattedPrice}</p>
                <p><strong>Còn lại:</strong> ${product.quantity}</p>
                <button onclick="addToCart('${product.product_id}')">MUA NGAY</button>
                <button onclick="closeDetail()">Đóng</button>
            </div>
        `;
        detailDiv.style.display = "block"; // Hiển thị div chi tiết sản phẩm
        document.body.classList.add('no-scroll'); // Ngăn cuộn trang khi hiển thị chi tiết
    } else {
        alert("Không tìm thấy thông tin sản phẩm.");
    }
}
function closeDetail() { //đóng chi tiết sản phẩm
    const detailDiv = document.querySelector(".product-detail");
    detailDiv.style.display = "none"; // Ẩn div chi tiết
    document.body.classList.remove('no-scroll');
}

function loadOrdersTable() {
    const currentUser = JSON.parse(localStorage.getItem('currentuser'));
    if (!currentUser || !currentUser.user_id) {
        alert("Vui lòng đăng nhập để xem lịch sử đơn hàng");
        return;
    }

    fetch(`get_orders.php?user_id=${currentUser.user_id}`)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            const tableContainer = document.querySelector(".main-wrapper .container");
            
            if (!data || data.length === 0) {
                tableContainer.innerHTML = "<p>Bạn chưa có đơn hàng nào</p>";
                return;
            }

            // Nhóm các sản phẩm cùng đơn hàng
            const ordersMap = data.reduce((map, item) => {
                if (!map[item.order_id]) {
                    map[item.order_id] = {
                        order_date: item.order_date,
                        total_amount: item.total_amount,
                        status: item.status,
                        items: []
                    };
                }
                map[item.order_id].items.push({
                    product_id: item.product_id,
                    quantity: item.quantity,
                    price: item.price,
                    total: item.total
                });
                return map;
            }, {});

            // Tạo bảng hiển thị
            let tableHTML = `
                <table class="orders-table">
                    <tr>
                        <th>Mã Đơn</th>
                        <th>Ngày đặt</th>
                        <th>Số sản phẩm</th>
                        <th>Tổng tiền</th>
                        <th>Trạng thái</th>
                        <th>Chi tiết</th>
                    </tr>
            `;
            Object.entries(ordersMap).forEach(([orderId, order]) => {
                const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total_amount);
                tableHTML += `
                    <tr>
                        <td>${orderId}</td>
                        <td>${new Date(order.order_date).toLocaleDateString()}</td>
                        <td>${order.items.length}</td>
                        <td>${formattedPrice}</td>
                        <td>${getStatusText(order.status)}</td>
                        <td><button onclick="showOrderDetails(${orderId})">Xem</button></td>
                    </tr>
                `;
            });

            tableHTML += "</table>";
            tableContainer.innerHTML = tableHTML;
        })
        .catch(error => {
            console.error("Lỗi khi tải đơn hàng:", error);
            alert("Có lỗi xảy ra khi tải đơn hàng: " + error.message);
        });
}

// Hàm hỗ trợ hiển thị trạng thái
function getStatusText(status) {
    const statusMap = {
        'pending': 'Đang xử lý',
        'processing': 'Đang giao',
        'completed': 'Hoàn thành',
        'cancelled': 'Đã hủy'
    };
    return statusMap[status] || status;
}

function showOrderDetails(orderId) {
    fetch(`get_order_details.php?order_id=${orderId}`)
        .then(response => response.json())
        .then(data => {
            const detailDiv = document.querySelector(".order-detail");
            
            let itemsHTML = data.map(item => `
                <tr>
                    <td>${item.product_id}</td>
                    <td>${item.quantity}</td>
                    <td>${vnd(item.price)}</td>
                    <td>${vnd(item.total)}</td>
                </tr>
            `).join('');

            detailDiv.innerHTML = `
                <div class="detail-container">
                    <h3>Chi tiết đơn hàng #${orderId}</h3>
                    <table>
                        <tr>
                            <th>Mã SP</th>
                            <th>Số lượng</th>
                            <th>Đơn giá</th>
                            <th>Thành tiền</th>
                        </tr>
                        ${itemsHTML}
                    </table>
                    <button onclick="closeOrderDetail()">Đóng</button>
                </div>
            `;
            detailDiv.style.display = "block";
        })
        .catch(error => {
            console.error("Lỗi khi tải chi tiết đơn hàng:", error);
            alert("Không thể tải chi tiết đơn hàng");
        });
}

function closeOrderDetail() {//đóng chi tiết hóa đơn
    const detailDiv = document.querySelector(".order-detail");
    detailDiv.style.display = "none";
    document.body.classList.remove('no-scroll');
}

function cancerOrderDetail(madonhang) {//hủy đơn
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const orderDetails = JSON.parse(localStorage.getItem('orderDetails')) || [];
    const products = JSON.parse(localStorage.getItem('products')) || [];

    // Tìm đơn hàng tương ứng
    const orderIndex = orders.findIndex(item => item.madonhang === madonhang);

    if (orderIndex === -1) {
        console.error('Đơn hàng không tồn tại!');
        return;
    }
    if (orders[orderIndex].tthd === 'chưa xử lý') {
        orders[orderIndex].tthd = 'đã hủy';// Cập nhật trạng thái đơn hàng
        const details = orderDetails.filter(detail => detail.madonhang === madonhang);
        details.forEach(detail => {
            const productIndex = products.findIndex(product => product.masp === detail.masp);
            if (productIndex !== -1) {
                products[productIndex].stock += detail.soluong;
            }
        });
        localStorage.setItem('orders', JSON.stringify(orders));
        localStorage.setItem('products', JSON.stringify(products));
        closeOrderDetail();
        loadOrdersTable();
        alert(`Đơn hàng ${madonhang} đã được hủy.`);
    }
    else {
        alert(`Không thể hủy đơn hàng ${madonhang}.`);
    }
}

function checkfillAddress(){// kiểm tra các text input/combobox được chọn chưa
    const tenNguoiNhan = document.getElementById("tennguoinhan");
    const soDienThoai = document.getElementById("sodienthoai");
    const diaChiNha = document.getElementById("diachinha");
    const districts = document.getElementById("districts");
    const enterNewAddresss = document.getElementById("enterNewAddress");

    if (!tenNguoiNhan.value.trim()){
        alert("Vui lòng nhập tên người nhận.");
        tenNguoiNhan.focus();
        return 0;
    }
    if (!diaChiNha.value.trim()) {
        alert("Vui lòng nhập địa chỉ nhà.");
        diaChiNha.focus();
        return 0;
    }
    if (!soDienThoai.value.trim()) {
        alert("Vui lòng nhập số điện thoại.");
        soDienThoai.focus();
        return 0;
    }
    
    if (enterNewAddresss.checked) {
        if (districts.value.trim() === "Chọn quận/huyện") {
            alert("Vui lòng chọn quận");
            districts.focus();
            return 0;
        }
        return 1;
    }
    return 1;
}

function createNewOrder(cartKey, customerID) {
    // Kiểm tra người dùng đã đăng nhập chưa
    if (!customerID) {
        alert('Hãy đăng nhập trước!');
        return;
    }

    const carts = JSON.parse(localStorage.getItem('carts')) || {};
    const currentUser = JSON.parse(localStorage.getItem('currentuser'));
    const cart = carts[currentUser.username] || [];

    if (cart.length === 0) {
        alert("Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm vào giỏ hàng trước khi đặt hàng.");
        return;
    }

    // Kiểm tra địa chỉ đã được điền đầy đủ chưa
    if (checkfillAddress() !== 1) {
        return;
    }
    // Tính tổng tiền
    const totalAmount = cart.reduce((total, item) => total + item.price * item.soluong, 0);

    // Lấy phương thức thanh toán
    const paymentMethod = document.getElementById("phuong-thuc-thanh-toan").value;

    // Lấy thông tin địa chỉ giao hàng
    const tenNguoiNhan = document.getElementById("tennguoinhan").value.trim();
    const soDienThoai = document.getElementById("sodienthoai").value.trim();
    const diaChiNha = document.getElementById("diachinha").value.trim();
    const districts = document.getElementById("districts").value;
    const cities = document.getElementById("cities").value;
    const addressOd = `${diaChiNha}, ${districts}, ${cities}`;

    // Kiểm tra dữ liệu đầu vào
    if (!tenNguoiNhan || !soDienThoai || !diaChiNha || districts === "Chọn quận/huyện" || cities === "Chọn thành phố") {
        alert("Vui lòng điền đầy đủ thông tin địa chỉ giao hàng.");
        return;
    }

    // Tạo dữ liệu đơn hàng
    const orderData = {
        user_id: customerID.user_id,
        total_amount: totalAmount,
        payment_method: paymentMethod,
        status: 'pending', // Trạng thái mặc định là "pending"
        address: {
            nguoinhan: tenNguoiNhan,
            sdt: soDienThoai,
            diachi: addressOd
        },
        items: cart.map(item => ({
            product_id: item.product_id,
            quantity: item.soluong,
            price: item.price,
            total: item.soluong * item.price
        }))
    };

    // Gửi dữ liệu đơn hàng đến API PHP để lưu vào cơ sở dữ liệu
    fetch('create_order.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
    })
        .then(response => {
            console.log("Phản hồi từ máy chủ:", response);
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            return response.json(); // Đọc phản hồi dưới dạng JSON
        })
        .then(data => {
            console.log("Phản hồi JSON từ API:", data);
            if (data.success) {
                alert("Đơn hàng đã được tạo thành công! Mã đơn hàng: " + data.order_id);

                // Xóa các sản phẩm đã đặt hàng khỏi giỏ hàng
                carts[currentUser.username] = [];
                localStorage.setItem('carts', JSON.stringify(carts));

                // Cập nhật số lượng sản phẩm trong giỏ hàng
                LoadCount();

                // Đóng trang đặt hàng
                closecheckout();

                // Tải lại trang
                location.reload();
            } else {
                alert("Lỗi: " + data.message);
            }
        })
        .catch(error => {
            console.error("Lỗi khi gửi yêu cầu tạo đơn hàng:", error);
            alert("Đã xảy ra lỗi khi tạo đơn hàng. Vui lòng thử lại sau.");
        });
}

function checkCartAndToggleButton(cartKey, buttonID) {/*Kiểm tra trong giỏ có sản phẩm ko r mới cho thanh toán */
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    if (cart.length <= 0) {
        LoadCount();
        alert("Không có sản phẩm trong giỏ\n Vui lòng thêm sản phẩm vào giỏ");
        closeCart();
    } else {
        createNewOrder('carts', currUser);/*tạo mới hóa đơn và chi tiết hóa đơn */
    }
}

function handleAddressOption(newOrderID) {// kiểm tra radio button để gọi hàm nhập địa chỉ mới hoặc từ thông tin khách hàng
    const selectedOption = document.querySelector('input[name="address-option"]:checked').value;
    switch (selectedOption) {
        case "new":// địa chỉ mới
            enterNewAddress(newOrderID);
            break;
        default:
            break;
    }
}


function enterNewAddress(newOrderID) {
    // Lấy thông tin từ các trường nhập liệu
    const nguoinhan = document.getElementById("tennguoinhan").value.trim();
    const sdtngnhan = document.getElementById("sodienthoai").value.trim();
    const dchi = document.getElementById("diachinha").value.trim();
    const quan = document.getElementById("districts").value;
    const tinh = document.getElementById("cities").value;

    // Kiểm tra các trường nhập liệu
    if (!nguoinhan) {
        alert("Vui lòng nhập tên người nhận.");
        document.getElementById("tennguoinhan").focus();
        return;
    }
    if (!sdtngnhan) {
        alert("Vui lòng nhập số điện thoại.");
        document.getElementById("sodienthoai").focus();
        return;
    }
    if (!dchi) {
        alert("Vui lòng nhập địa chỉ nhà.");
        document.getElementById("diachinha").focus();
        return;
    }
    if (quan === "Chọn quận/huyện") {
        alert("Vui lòng chọn quận/huyện.");
        document.getElementById("districts").focus();
        return;
    }
    if (tinh === "Chọn thành phố") {
        alert("Vui lòng chọn thành phố.");
        document.getElementById("cities").focus();
        return;
    }

    // Tạo đối tượng địa chỉ mới
    const newAddressOrder = {
        nguoinhan: nguoinhan,
        sdtngnhan: sdtngnhan,
        diachi: dchi,
        quan: quan,
        tinh: tinh,
        madonhang: newOrderID
    };

    // Lưu địa chỉ mới vào localStorage
    let addressOrders = JSON.parse(localStorage.getItem("addressOrders")) || [];
    addressOrders.push(newAddressOrder);
    localStorage.setItem("addressOrders", JSON.stringify(addressOrders));

    alert("Địa chỉ mới đã được lưu thành công!");
}

function showPreviewOrder() {
    if (checkfillAddress() === 1) {
        const carts = JSON.parse(localStorage.getItem("carts")) || {};
        const currentUser = JSON.parse(localStorage.getItem("currentuser"));
        if (!currentUser || !currentUser.username) {
            alert("Vui lòng đăng nhập để xem trước hóa đơn.");
            return;
        }

        const cart = carts[currentUser.username] || [];
        if (cart.length === 0) {
            alert("Giỏ hàng của bạn đang trống.");
            return;
        }

        const tenNguoiNhan = document.getElementById("tennguoinhan").value.trim();
        const soDienThoai = document.getElementById("sodienthoai").value.trim();
        const diaChiNha = document.getElementById("diachinha").value.trim();
        const enterNewAddresss = document.getElementById("enterNewAddress").checked;

        let districts = '';
        let cities = '';

        if (enterNewAddresss) {
            // Lấy từ combobox khi nhập địa chỉ mới
            districts = document.getElementById("districts").value;
            cities = document.getElementById("cities").value;
        } else {
            // Lấy từ thông tin người dùng (text input bị disabled)
            districts = document.getElementById("text-address-distric").value;
            cities = document.getElementById("text-address-city").value;
        }

        const addressOd = `${diaChiNha}, ${districts}, ${cities}`;

        let totalPrice = 0;
        const tableRows = cart.map(detail => {
            totalPrice += detail.price * detail.soluong; // Tính tổng tiền
            return `
                <tr>
                    <td>${detail.product_id}</td>
                    <td>${detail.soluong}</td>
                    <td>${detail.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                    <td>${(detail.soluong * detail.price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                </tr>
            `;
        }).join('');

        const detailDiv = document.querySelector(".preview-order");
        detailDiv.innerHTML = `
            <div class="detail-container">
                <div id="chitiet-tren">
                    <div class="header-chitiettren">
                        <h3>TỔNG QUÁT HÓA ĐƠN</h3>
                        <button onclick="closePreviewOrder();">Đóng</button>
                    </div>
                    <p><strong>Khách nhận hàng:</strong> ${tenNguoiNhan}</p>
                    <p><strong>Số điện thoại:</strong> ${soDienThoai}</p>
                    <p><strong>Địa chỉ giao hàng:</strong> ${addressOd}</p>
                    <p><strong>Tổng tiền:</strong> ${totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                </div>

                <div id="chitiet-duoi">
                    <table id="orderDe" border="1" cellspacing="0" cellpadding="5" style="width: 100%; text-align: left;">
                        <thead>
                            <tr>
                                <th>Mã sản phẩm</th>
                                <th>Số lượng</th>
                                <th>Đơn giá</th>
                                <th>Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRows}
                        </tbody>
                    </table>
                </div>
            </div>`;
        detailDiv.style.display = "block"; // Hiển thị div
        document.body.classList.add('no-scroll');
    }
}

function closePreviewOrder() { //đóng xem trước hóa đơn
    const detailDiv = document.querySelector(".preview-order");
    detailDiv.style.display = "none"; // Ẩn div chi tiết
    document.body.classList.remove('no-scroll');
}

function kiemtradiachi() {
    const newAddressOption = document.getElementById("enterNewAddress");
    const formAddress2Elements = document.querySelectorAll(".form-address2");

    // Mặc định hiển thị form nhập địa chỉ mới
    formAddress2Elements.forEach(element => {
        element.classList.remove("hidden");
        element.style.display = "block";
    });

    // Kích hoạt các trường nhập liệu
    document.getElementById("tennguoinhan").value = "";
    document.getElementById("tennguoinhan").disabled = false;
    document.getElementById("sodienthoai").value = "";
    document.getElementById("sodienthoai").disabled = false;
    document.getElementById("diachinha").value = "";
    document.getElementById("diachinha").disabled = false;
}

function loadCitiesorder() {
    const diachiData = JSON.parse(localStorage.getItem('diachiData'));
    const citySelect = document.getElementById('cities');
    diachiData.regions.forEach(region => {
        const option = document.createElement('option');
        option.value = region.city;
        option.textContent = region.city;
        citySelect.appendChild(option);
    });
    loadDistrictsorder("Hồ Chí Minh", diachiData);
    citySelect.addEventListener('change', function () {
        loadDistrictsorder(this.value, diachiData);
    });
}

function loadDistrictsorder(selectedCity, diachiData) {
    const districtSelect = document.getElementById('districts');
    districtSelect.innerHTML = '<option value="Chọn quận/huyện">Chọn quận/huyện</option>';
    const selectedRegion = diachiData.regions.find(region => region.city === selectedCity);
    if (selectedRegion) {
        selectedRegion.districts.forEach(district => {
            const option = document.createElement('option');
            option.value = district.quan;
            option.textContent = district.quan;
            districtSelect.appendChild(option);
        });
    }
}

/*-------------------------------------------------------------------------------------*/
