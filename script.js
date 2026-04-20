const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxKP_gQjjcNtgMIXFURzpqU4Y5T_Bj6uUcku5V3XXVE2vNEkXPul5hKN1vLtfCIma6A/exec";
const MASTER_PWD = "mdin_03";

// 1. XỬ LÝ GỬI FORM (Có chặn trùng)
document.getElementById('regForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const status = document.getElementById('regStatus');
    status.innerText = "Đang kiểm tra dữ liệu... ⏳";

    const data = {
        action: "register",
        gameName: document.getElementById('gameName').value,
        gameId: document.getElementById('gameId').value,
        zaloName: document.getElementById('zaloName').value,
        phone: document.getElementById('phone').value
    };

    fetch(SCRIPT_URL, { method: 'POST', body: JSON.stringify(data) })
    .then(res => res.text())
    .then(result => {
        if (result === "Success") {
            status.innerText = "Đăng ký thành công! ✅";
            status.style.color = "#00ff88";
            this.reset();
        } else if (result === "Duplicate") {
            status.innerText = "Lỗi: ID Game hoặc SĐT này đã tồn tại! ❌";
            status.style.color = "#ffcc00";
        } else {
            status.innerText = "Lỗi hệ thống! ❌";
            status.style.color = "red";
        }
    })
    .catch(() => status.innerText = "Lỗi kết nối mạng! ❌");
});

// 2. HÀM TÌM KIẾM TRONG BẢNG ADMIN
function searchTable() {
    const filter = document.getElementById("searchInput").value.toUpperCase();
    const rows = document.querySelectorAll("#adminTable tbody tr");

    rows.forEach(row => {
        const text = row.innerText.toUpperCase();
        row.style.display = text.includes(filter) ? "" : "none";
    });
}

// 3. ĐĂNG NHẬP VÀ LOAD DỮ LIỆU (Giữ nguyên phần cũ)
function handleAdminLogin() {
    const password = document.getElementById('adminPassword').value;
    if (password === MASTER_PWD) {
        document.getElementById('registration-section').style.display = 'none';
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('admin-section').style.display = 'block';
        loadAdminData();
    } else {
        alert("Sai mật khẩu! ❌");
    }
}

function loadAdminData() {
    const body = document.getElementById('resultBody');
    body.innerHTML = "<tr><td colspan='6'>Đang tải...</td></tr>"; // Đổi colspan thành 6
    fetch(`${SCRIPT_URL}?key=${MASTER_PWD}`)
    .then(res => res.json())
    .then(data => {
        if (data.length === 0) {
            body.innerHTML = "<tr><td colspan='6'>Trống</td></tr>";
            return;
        }
        body.innerHTML = data.map((row, index) => {
            // Định dạng lại ngày tháng cho dễ nhìn (ví dụ: dd/mm/yyyy)
            const dateObj = new Date(row[4]); 
            const formattedDate = isNaN(dateObj) ? "Chưa có" : dateObj.toLocaleString('vi-VN');

            return `
                <tr>
                    <td>${row[0]}</td>
                    <td>${row[1]}</td>
                    <td>${row[2]}</td>
                    <td>${row[3]}</td>
                    <td>${formattedDate}</td> <td>
                        <button onclick="deleteUser(${index})" style="background:red; color:white; border:none; padding:5px; cursor:pointer; border-radius:4px;">Xóa</button>
                    </td>
                </tr>
            `;
        }).join('');
    });
}

function deleteUser(index) {
    if (!confirm("Xóa dòng này?")) return;
    fetch(SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify({ action: "deleteRow", rowIndex: index + 1, masterPwd: MASTER_PWD })
    }).then(() => {
        alert("Đã xóa! 🗑️");
        loadAdminData();
    });
}