document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (header && menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = header.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        header.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 992) {
        header.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  const themeToggle = document.getElementById("theme-toggle");

  function applyTheme() {
    const isDark = localStorage.getItem("theme") === "dark";
    if (isDark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }

  if (themeToggle) {
    applyTheme();
    themeToggle.addEventListener("click", () => {
      const isDark = document.body.classList.toggle("dark");
      localStorage.setItem("theme", isDark ? "dark" : "light");
      themeToggle.textContent = isDark ? "Light Mode" : "Dark Mode";
    });
    themeToggle.textContent = document.body.classList.contains("dark")
      ? "Light Mode"
      : "Dark Mode";
  }

  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    const ADMIN_PASSWORD = "admin123";

    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const password = document.getElementById("admin-password").value;

      if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem("adminLoggedIn", "true");
        login();
      } else {
        alert("Invalid password!");
      }
    });

    function login() {
      document.getElementById("login-container").classList.add("is-hidden");
      document
        .getElementById("dashboard-container")
        .classList.remove("is-hidden");
      displayMessages();
    }

    function logout() {
      sessionStorage.removeItem("adminLoggedIn");
      document.getElementById("login-container").classList.remove("is-hidden");
      document
        .getElementById("dashboard-container")
        .classList.add("is-hidden");
      document.getElementById("admin-password").value = "";
    }

    function displayMessages() {
      const allMessages = JSON.parse(localStorage.getItem("allMessages")) || [];
      const messagesList = document.getElementById("messages-list");
      const noMessages = document.getElementById("no-messages");

      if (allMessages.length === 0) {
        messagesList.classList.add("is-hidden");
        noMessages.classList.remove("is-hidden");
        return;
      }

      messagesList.classList.remove("is-hidden");
      noMessages.classList.add("is-hidden");
      messagesList.innerHTML = "";

      allMessages.forEach((msg, index) => {
        const messageCard = document.createElement("div");
        messageCard.className = "message-card";
        messageCard.innerHTML = `
          <div class="message-header">
            <strong>${msg.name}</strong>
            <span class="message-time">${msg.timestamp}</span>
          </div>
          <div class="message-email">
            <strong>Email:</strong> ${msg.email}
          </div>
          <div class="message-room">
            <strong>Room:</strong> ${msg.room}
          </div>
          <div class="message-body">
            <strong>Message:</strong>
            <p>${msg.message}</p>
          </div>
          <button class="btn-delete" data-index="${index}">Delete</button>
        `;
        messagesList.appendChild(messageCard);
      });
    }

    function deleteMessage(index) {
      const allMessages = JSON.parse(localStorage.getItem("allMessages")) || [];
      allMessages.splice(index, 1);
      localStorage.setItem("allMessages", JSON.stringify(allMessages));
      displayMessages();
    }

    const messagesList = document.getElementById("messages-list");
    if (messagesList) {
      messagesList.addEventListener("click", (event) => {
        const target = event.target.closest(".btn-delete");
        if (!target) {
          return;
        }
        const index = Number(target.dataset.index);
        if (!Number.isNaN(index)) {
          deleteMessage(index);
        }
      });
    }

    const clearMessages = document.getElementById("clear-messages");
    if (clearMessages) {
      clearMessages.addEventListener("click", () => {
        if (confirm("Are you sure you want to clear all messages?")) {
          localStorage.removeItem("allMessages");
          displayMessages();
          alert("All messages cleared!");
        }
      });
    }

    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", logout);
    }

    if (sessionStorage.getItem("adminLoggedIn") === "true") {
      login();
    }
  }

  const roomButtons = document.querySelectorAll(".book-room");
  if (roomButtons.length > 0) {
    roomButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const roomname = button.dataset.room;
        if (!roomname) {
          return;
        }
        localStorage.setItem("selectedRoom", roomname);
        alert(
          "You have selected the " +
            roomname +
            ". Please proceed to contact us for booking.",
        );
        window.location.href = "contact.html";
      });
    });
  }

  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const message = document.getElementById("messages").value;
      const selectedRoom =
        localStorage.getItem("selectedRoom") || "Not specified";

      localStorage.setItem("name", name);
      localStorage.setItem("email", email);
      localStorage.setItem("message", message);
      localStorage.setItem("room", selectedRoom);

      const allMessages = JSON.parse(localStorage.getItem("allMessages")) || [];
      allMessages.push({
        name: name,
        email: email,
        message: message,
        room: selectedRoom,
        timestamp: new Date().toLocaleString(),
      });
      localStorage.setItem("allMessages", JSON.stringify(allMessages));

      alert("Message sent! View your messages on the Messages page.");
      contactForm.reset();
      window.location.href = "meesages.html";
    });
  }

  const messageDisplay = document.getElementById("message-display");
  if (messageDisplay) {
    const name = localStorage.getItem("name") || "No name";
    const email = localStorage.getItem("email") || "No email";
    const message = localStorage.getItem("message") || "No message";
    const room = localStorage.getItem("room") || "Not specified";

    const messageCard = `
      <div class="message-info-box">
        <h3><i class="fa-solid fa-user"></i> Your Information</h3>
        <div class="info-item">
          <label>Name:</label>
          <span>${name}</span>
        </div>
        <div class="info-item">
          <label>Email:</label>
          <span>${email}</span>
        </div>
        <div class="info-item">
          <label>Room Selected:</label>
          <span class="room-highlight">${room}</span>
        </div>
      </div>
      <div class="message-content-box">
        <h3><i class="fa-solid fa-envelope"></i> Your Message</h3>
        <p>${message}</p>
      </div>
    `;

    messageDisplay.innerHTML = messageCard;
  }
});
