export function toast({
  text = "",
  duration = 30000,
  gravity = "top",
  position = "center",
}) {
  Toastify({
    text,
    duration, // thời gian hiển thị (ms)
    close: true, // hiển thị nút đóng
    gravity, // vị trí: "top" hoặc "bottom"
    position, // vị trí: "left", "center" hoặc "right"
    stopOnFocus: true, // dừng đếm ngược khi di chuột vào
    style: {
      background: "linear-gradient(to right, #1db954, #88f4ae)",
      minWidth: "200px",
      display: "flex",
      justifyContent: "space-between",
      fontSize: "14px",
      borderRadius: "12px",
      color: "#333",
    },
    onClick: function () {
      // hành động khi click vào toast
    },
  }).showToast();
}
