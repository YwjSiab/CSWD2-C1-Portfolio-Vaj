// ================================
// script.js — main entry point for Portfolio
// ================================

import { displayProjects } from "./project.js";
import { addProjectForm } from "./formhandler.js";
import { generateCSRFToken } from "./security.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    console.log("🚀 Portfolio Loaded Successfully");

    // =============================
    // 1️⃣ Initialize security & forms
    // =============================
    generateCSRFToken();
    addProjectForm();

    // =============================
    // 2️⃣ Enable geolocation (optional)
    // =============================
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          console.log(`📍 Location: ${pos.coords.latitude}, ${pos.coords.longitude}`);
        },
        err => {
          console.warn("⚠️ Geolocation error:", err.message);
        }
      );
    }

    // =============================
    // 3️⃣ Notifications API (welcome message)
    // =============================
    if ("Notification" in window) {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification("✅ Portfolio Ready", {
            body: "You can now use this app offline!",
            icon: "/icon-192.png"
          });
        }
      });
    }

    // =============================
    // 4️⃣ Touch feedback for cards
    // =============================
    document.querySelectorAll(".project-card").forEach(card => {
      card.addEventListener("touchstart", () => {
        card.classList.add("touched");
        if (navigator.vibrate) {navigator.vibrate(50);};
      });
    });

    // =============================
    // 5️⃣ Register Service Worker
    // =============================
    if ("serviceWorker" in navigator) {
      // During dev, ensure no stale cache
      if (process.env.NODE_ENV !== "production") {
        navigator.serviceWorker
          .getRegistrations()
          .then(regs => regs.forEach(r => r.unregister()));
      }

      navigator.serviceWorker
        .register("/serviceworker.js")
        .then(() => console.log("✅ Service Worker registered"))
        .catch(err => console.error("❌ SW registration failed:", err));
    }

    // =============================
    // 6️⃣ Handle PWA install prompt
    // =============================
    let deferredPrompt;
    window.addEventListener("beforeinstallprompt", e => {
      e.preventDefault();
      deferredPrompt = e;
      const installBtn = document.querySelector("#installBtn");
      if (installBtn) {
        installBtn.style.display = "block";
        installBtn.addEventListener("click", () => {
          deferredPrompt.prompt();
        });
      }
    });

    // =============================
    // 7️⃣ Optional manual refresh of displayed projects
    // (Project list is rendered automatically by project.js)
    // =============================
    if (window.allProjects && window.allProjects.length > 0) {
      displayProjects(window.allProjects);
    }

    console.log("✨ App initialization complete.");

  } catch (err) {
    console.error("❌ Error during page initialization:", err);
  }
});
