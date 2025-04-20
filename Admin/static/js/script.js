const selects = document.querySelectorAll('.status-select');


selects.forEach(select => {
    select.addEventListener('change', function () {
        const newStatus = this.value;
        const orderId = this.dataset.id;

        const confirmChange = confirm("Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng?");
        if (!confirmChange) {
            // Reload lại trang để quay về giá trị cũ
            location.reload();
            return;
        }

        // Gửi yêu cầu POST để cập nhật trạng thái
        fetch(`/update-order-status/${orderId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus })
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message || "Cập nhật thành công!");
        })
        .catch(err => {
            alert("Có lỗi xảy ra khi cập nhật.");
            console.error(err);
        });
    });
});
