async function processImage() {
    const fileInput = document.getElementById("uploadImage").files[0];
    if (!fileInput) {
        alert("Vui lòng chọn một ảnh để xử lý.");
        return;
    }

    const formData = new FormData();
    formData.append("image_file", fileInput);
    formData.append("size", "auto");

    try {
        const response = await fetch("https://api.remove.bg/v1.0/removebg", {
            method: "POST",
            headers: {
                "X-Api-Key": "aTudAUhHFKFwFT1J5pBVfA5C"  // Thay thế với API Key của bạn
            },
            body: formData
        });
        
        const result = await response.blob();
        const imgURL = URL.createObjectURL(result);

        // Hiển thị ảnh đã xoá nền
        document.getElementById("resultContainer").innerHTML = `<img src="${imgURL}" id="processedImage">`;
    } catch (error) {
        console.error("Error processing image:", error);
        alert("Đã có lỗi xảy ra khi xử lý ảnh.");
    }
}

function changeBackground() {
    const image = document.getElementById("processedImage");
    if (!image) {
        alert("Không có ảnh nào để thay đổi nền.");
        return;
    }

    const selectedColor = document.getElementById("backgroundColor").value;
    image.style.backgroundColor = selectedColor;
}

function resizeImage() {
    const image = document.getElementById("processedImage");
    if (!image) {
        alert("Không có ảnh nào để thay đổi kích thước.");
        return;
    }

    const width = document.getElementById("resizeWidth").value;
    const height = document.getElementById("resizeHeight").value;
    const unit = document.getElementById("unit").value;

    if (!width || !height) {
        alert("Vui lòng nhập đầy đủ chiều rộng và chiều cao.");
        return;
    }

    // Đổi đơn vị từ cm hoặc mm sang px (giả sử 1 cm = 37.8px, 1 mm = 3.78px)
    let widthInPx, heightInPx;
    if (unit === "cm") {
        widthInPx = width * 37.8;
        heightInPx = height * 37.8;
    } else {
        widthInPx = width * 3.78;
        heightInPx = height * 3.78;
    }

    // Đặt kích thước mới cho ảnh
    image.style.width = `${widthInPx}px`;
    image.style.height = `${heightInPx}px`;
}

function downloadImage() {
    const image = document.getElementById("processedImage");
    if (!image) {
        alert("Không có ảnh nào để tải xuống.");
        return;
    }

    const quality = document.getElementById("quality").value;
    const backgroundColor = document.getElementById("backgroundColor").value;
    const width = parseFloat(image.style.width);
    const height = parseFloat(image.style.height);

    // Tạo canvas với kích thước và màu nền tùy chỉnh
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    // Vẽ nền màu
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Vẽ ảnh đã xoá nền lên canvas
    const img = new Image();
    img.src = image.src;

    img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Tải ảnh với chất lượng tùy chọn
        const downloadQuality = quality === "high" ? 1.0 : 0.7; // 1.0 là chất lượng cao, 0.7 là mặc định
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png", downloadQuality);
        link.download = "processed-image.png";
        link.click();
    };
}
