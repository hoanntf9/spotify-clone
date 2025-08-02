import httpRequest from "./../../utils/httpRequest.js";
import endpoints from "./../../utils/endpoints.js";
import { clearStorage, setItemStorage } from "./../../utils/storage.js";
import { toast } from "./../../utils/toast.js";

// Auth Modal Functionality
document.addEventListener("DOMContentLoaded", function () {
  // Get DOM elements
  const signupBtn = document.querySelector(".signup-btn");
  const loginBtn = document.querySelector(".login-btn");
  const authModal = document.querySelector("#authModal");
  const modalClose = document.querySelector("#modalClose");
  const signupForm = document.querySelector("#signupForm");
  const loginForm = document.querySelector("#loginForm");
  const showLoginBtn = document.querySelector("#showLogin");
  const showSignupBtn = document.querySelector("#showSignup");
  const authButtons = document.querySelector(".auth-buttons");

  bindTogglePassword();

  // Function to show signup form
  function showSignupForm() {
    signupForm.style.display = "block";
    loginForm.style.display = "none";
  }

  // Function to show login form
  function showLoginForm() {
    signupForm.style.display = "none";
    loginForm.style.display = "block";
  }

  // Function to open modal
  function openModal() {
    authModal.classList.add("show");
    document.body.style.overflow = "hidden"; // Prevent background scrolling
  }

  // Open modal with Sign Up form when clicking Sign Up button
  signupBtn.addEventListener("click", function () {
    showSignupForm();
    openModal();
  });

  // Open modal with Login form when clicking Login button
  loginBtn.addEventListener("click", function () {
    showLoginForm();
    openModal();
  });

  // Close modal function
  function closeModal() {
    authModal.classList.remove("show");
    document.body.style.overflow = "auto"; // Restore scrolling
  }

  // Close modal when clicking close button
  modalClose.addEventListener("click", closeModal);

  // Close modal when clicking overlay (outside modal container)
  authModal.addEventListener("click", function (e) {
    if (e.target === authModal) {
      closeModal();
    }
  });

  // Close modal with Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && authModal.classList.contains("show")) {
      closeModal();
    }
  });

  // Switch to Login form
  showLoginBtn.addEventListener("click", function () {
    showLoginForm();
  });

  // Switch to Signup form
  showSignupBtn.addEventListener("click", function () {
    showSignupForm();
  });

  // Tạo chức năng đăng nhập
  loginForm
    .querySelector(".auth-form-content")
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      const authButtons = document.querySelector(".auth-buttons");
      const userMenu = document.querySelector(".user-menu");
      const email = document.querySelector("#loginEmail").value;
      const password = document.querySelector("#loginPassword").value;

      const credentials = {
        email,
        password,
      };

      try {
        const { access_token, message, user } = await httpRequest.post(
          endpoints.authLogin,
          credentials
        );

        if (user) {
          toast({
            text: message,
            duration: 1000,
          });

          setItemStorage("accessToken", access_token);
          setItemStorage("user", user);
          this.reset();
          closeModal();

          authButtons.classList.remove("show");
          userMenu.classList.add("show");
        }
      } catch (error) {
        console.log(error);
      }
    });

  // Tạo chức năng đăng ký
  signupForm
    .querySelector(".auth-form-content")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.querySelector("#signupEmail").value;
      const password = document.querySelector("#signupPassword").value;

      const credentials = {
        email,
        password,
      };

      try {
        const { user, access_token, message } = await httpRequest.post(
          endpoints.authRegister,
          credentials
        );

        if (user) {
          toast({
            text: message,
            duration: 3000,
            gravity: "top",
            position: "center",
          });

          setItemStorage("accessToken", access_token);
          showLoginForm();
          authButtons.classList.add("show");
        }
      } catch (error) {
        const errorCode = error?.response?.error?.code;
        const errorMessage = error?.response?.error?.message;

        if (errorCode === "EMAIL_EXISTS") {
          toast({
            text: errorMessage || "Email Exists",
            duration: 3000,
          });

          console.log("EMAIL_EXISTS");
        }
      }
    });
});

// User Menu Dropdown Functionality
document.addEventListener("DOMContentLoaded", function () {
  const userAvatar = document.getElementById("userAvatar");
  const userDropdown = document.getElementById("userDropdown");
  const logoutBtn = document.querySelector("#logoutBtn");

  // Toggle dropdown when clicking avatar
  userAvatar.addEventListener("click", function (e) {
    e.stopPropagation();
    userDropdown.classList.toggle("show");
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", function (e) {
    if (!userAvatar.contains(e.target) && !userDropdown.contains(e.target)) {
      userDropdown.classList.remove("show");
    }
  });

  // Close dropdown when pressing Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && userDropdown.classList.contains("show")) {
      userDropdown.classList.remove("show");
    }
  });

  // Handle logout button click
  logoutBtn.addEventListener("click", async function () {
    // Close dropdown first
    userDropdown.classList.remove("show");

    // callAPI logout
    const { message } = await httpRequest.post(endpoints.authLogout);

    if (message) {
      toast({
        text: "Logout successfully",
        duration: 3000,
      });

      clearStorage();
      window.location.href = "/";
    }
  });
});

// Other functionality
document.addEventListener("DOMContentLoaded", async function () {
  // TODO: Implement other functionality here
  // Player Start

  // Gọi dữ liệu danh sách bài hát từ api
  const { tracks } = await httpRequest.get(endpoints.tracks);
  if (tracks.length) {
    player._tracks = tracks;
  }

  player.start();
});

const player = {
  NEXT: 1,
  PREV: -1,
  PREV_THROTTLE: 2,
  _tracklistElement: document.querySelector(".track-list"),
  _togglePlayElement: document.querySelector(".btn-toggle-play"),
  _audioElement: document.querySelector(".audio"),
  _artistNameElement: document.querySelector(".artist-name"),
  _monthlyListenersElement: document.querySelector(".monthly-listeners"),
  _heroImageElement: document.querySelector(".hero-image"),
  _playIconElement: document.querySelector(".play-icon"),
  _progressElement: document.querySelector(".progress-bar"),
  _timeStartElement: document.querySelector(".time-start"),
  _timeEndElement: document.querySelector(".time-end"),
  _prevElement: document.querySelector(".btn-prev"),
  _nextElement: document.querySelector(".btn-next"),
  _songs: [],
  _currentIndex: 0,
  _isPlaying: false,
  start() {
    this._render();
    this._handlePlayback();

    // DOM events
    this._togglePlayElement.onclick = this._togglePlay.bind(this);

    this._audioElement.onplay = () => {
      this._playIconElement.classList.remove("fa-play");
      this._playIconElement.classList.add("fa-pause");
      this._isPlaying = true;

      this._render();
    };

    this._audioElement.onpause = () => {
      this._playIconElement.classList.remove("fa-pause");
      this._playIconElement.classList.add("fa-play");
      this._isPlaying = false;

      this._render();
    };

    this._prevElement.onclick = this._handleControl.bind(this, this.PREV);
    this._nextElement.onclick = this._handleControl.bind(this, this.NEXT);

    this._audioElement.ontimeupdate = () => {
      // Kiểm tra người dùng có đang tua (seek) video hay không!
      if (this._progressElement.seeking) {
        return;
      }

      // Lấy thời gian hiện tại của bài hát đang phát được tính bằng (s)
      const currentTime = this._audioElement.currentTime;

      // Lấy tổng thời lượng của bài hát tính bằng (s)
      const duration = this._audioElement.duration;

      // Tính phần trăm bài hát đã phát xong (%)
      const progress = (currentTime / duration) * 100;

      // Cập nhật giá trị vào thanh tiến trình
      this._progressElement.value = progress || 0;

      // Update start time khi phát nhạc
      this._timeStartElement.textContent = this._formatTime(currentTime);

      // Cập nhật màu vào thanh tiến trình
      this._updateProgressBarColor(progress || 0);
    };

    // Khi kéo thanh progress (liên tục cập nhật màu)
    this._progressElement.addEventListener("input", () => {
      const nextStep = +this._progressElement.value;
      this._updateProgressBarColor(nextStep);
    });

    this._progressElement.onmousedown = () => {
      this._progressElement.seeking = true;
    };

    this._progressElement.onmouseup = () => {
      const nextStep = +this._progressElement.value;

      this._audioElement.currentTime =
        (this._audioElement.duration / 100) * nextStep;

      this._progressElement.seeking = false;
    };
  },
  _formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  },
  _handleControl(step) {
    this._isPlaying = true;

    const shouldReset = this._audioElement.currentTime > this.PREV_THROTTLE;

    if (step === this.PREV && shouldReset) {
      this._audioElement.currentTime = 0;
      return;
    }

    this._currentIndex += step;
    this._handleForNewIndex();
  },
  _handleForNewIndex() {
    this._currentIndex =
      (this._currentIndex + this._tracks.length) % this._tracks.length;
    this._handlePlayback();
    this._render();
  },
  _escapeHtml(str) {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#x27;",
      "/": "&#x2F;",
    };
    return String(str).replace(/[&<>"'\/]/g, (char) => map[char]);
  },
  _updateProgressBarColor(value) {
    const progress = Math.min(100, Math.max(0, Number(value.toFixed(2)))) + 0.5;

    this._progressElement.style.background = `linear-gradient(to right, var(--accent-primary) 0%, var(--accent-primary) ${progress}%, #ccc ${progress}%, #ccc 100%)`;
  },
  _getCurrentSong() {
    return this._tracks[this._currentIndex];
  },
  _togglePlay() {
    // Khi click vào nút play thì toggle song
    if (this._audioElement.paused) {
      this._audioElement.play();
    } else {
      this._audioElement.pause();
    }
  },
  _handlePlayback() {
    const currentSong = this._getCurrentSong(this._currentIndex);
    this._artistNameElement.textContent = currentSong.title;
    this._monthlyListenersElement = currentSong.views;
    this._heroImageElement.src = currentSong.artist_image_url;

    this._audioElement.src = currentSong.audio_url;

    // oncanplay
    this._audioElement.oncanplay = () => {
      if (this._isPlaying) {
        this._audioElement.play();
      }

      // Hiển thị thời gian kết thúc bằng thời lượng bài hát đã cho trước
      this._timeEndElement.textContent = this._formatTime(
        this._audioElement.duration || 0
      );
    };
  },
  _getValidImageUrl(urlImage) {
    const allowedExtensions = ["jpg", "jpeg", "png", "gif", "svg", "webp"];
    const extension = urlImage.split(".").pop().toLowerCase();
    const img = allowedExtensions.includes(extension);
    return img ? urlImage : "placeholder.svg";
  },
  _render() {
    const html = this._tracks
      .map((track, index) => {
        const isCurrentSongPlaying =
          index === this._currentIndex && this._isPlaying;
        return `
        <div class="track-item ${isCurrentSongPlaying ? "playing" : ""}">
          <div class="track-number">${
            isCurrentSongPlaying
              ? `<div class="equalizer">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              `
              : index + 1
          }</div>

          <div class="track-image">
            <img
              src=${this._escapeHtml(this._getValidImageUrl(track.image_url))}
              alt="${this._escapeHtml(track.name)}"
              width="40"
              height="40"
            />
          </div>

          <div class="track-info">
            <div class="track-name ${
              isCurrentSongPlaying ? "active" : ""
            }">${this._escapeHtml(track.title)}</div>
            <div class="track-singer">${this._escapeHtml(
              track.artist_name
            )}</div>
          </div>

          <div class="track-duration">${this._escapeHtml(
            this._formatTime(track.duration)
          )}</div>

          <button class="track-menu-btn">
            <i class="fas fa-ellipsis-h"></i>
          </button>
        </div>
      `;
      })
      .join("");

    this._tracklistElement.innerHTML = html;
  },
};

document.addEventListener("DOMContentLoaded", async function () {
  const authButtons = document.querySelector(".auth-buttons");
  const userMenu = document.querySelector(".user-menu");

  try {
    const { user } = await httpRequest.get(endpoints.usersMe);
    userMenu.classList.add("show");
  } catch (error) {
    authButtons.classList.add("show");
  }
});

function bindTogglePassword() {
  const eyeToggles = document.querySelectorAll(".input-with-eye .eye-toggle");
  eyeToggles.forEach((toggle) => {
    const icon = toggle.querySelector(".icon-eye");

    toggle.addEventListener("click", () => {
      const input = toggle.closest(".input-with-eye").querySelector("input");
      const typePasswordInput = input.type;

      input.type = typePasswordInput === "password" ? "text" : "password";

      icon.classList.toggle("fa-eye");
      icon.classList.toggle("fa-eye-slash");

      input.focus();
    });
  });
}
