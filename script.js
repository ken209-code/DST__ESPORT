const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxKP_gQjjcNtgMIXFURzpqU4Y5T_Bj6uUcku5V3XXVE2vNEkXPul5hKN1vLtfCIma6A/exec";
const MASTER_PWD = "mdin_03";

// 1. Xử lý gửi Form Đăng ký
document.getElementById('regForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const status = document.getElementById('regStatus');
    status.innerText = "Đang xử lý dữ liệu... ⏳";

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
            status.style.color = "#4CAF50";
            status.innerText = "Đăng ký thành công! ✅";
            this.reset();
        } else {
            status.style.color = "#f44336";
            status.innerText = "Lỗi hệ thống! ❌";
        }
    })
    .catch(() => {
        status.style.color = "#f44336";
        status.innerText = "Lỗi kết nối mạng! ❌";
    });
});

// 2. Đăng nhập Admin
function handleAdminLogin() {
    const password = document.getElementById('adminPassword').value;
    if (password === MASTER_PWD) {
        document.getElementById('registration-section').style.display = 'none';
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('admin-section').style.display = 'block';
        loadAdminData();
    } else {
        alert("Mật khẩu Admin không chính xác! ❌");
    }
}

// 3. Tải dữ liệu Admin
function loadAdminData() {
    const body = document.getElementById('resultBody');
    body.innerHTML = "<tr><td colspan='5'>Đang tải dữ liệu...</td></tr>";

    fetch(`${SCRIPT_URL}?key=${MASTER_PWD}`)
    .then(res => res.json())
    .then(data => {
        if (data.length === 0) {
            body.innerHTML = "<tr><td colspan='5'>Chưa có dữ liệu.</td></tr>";
            return;
        }
        body.innerHTML = data.map((row, index) => `
            <tr>
                <td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td><td>${row[3]}</td>
                <td><button onclick="deleteUser(${index})" style="background:red; color:white; border:none; padding:5px; cursor:pointer;">Xóa</button></td>
            </tr>
        `).join('');
    });
}

// 4. Xóa dữ liệu
function deleteUser(index) {
    if (!confirm("Bạn có chắc chắn muốn xóa?")) return;
    
    fetch(SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify({ action: "deleteRow", rowIndex: index + 1, masterPwd: MASTER_PWD })
    })
    .then(() => {
        alert("Đã xóa thành công! 🗑️");
        loadAdminData();
    });
}