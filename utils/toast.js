export function toast({
  text = "",
  duration = 3000,
  gravity = "top",
  position = "center",
}) {
  Toastify({
    text,
    duration,
    close: true,
    gravity,
    position,
    stopOnFocus: true,
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
