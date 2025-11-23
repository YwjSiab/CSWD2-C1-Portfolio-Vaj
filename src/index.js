// index.js

// ✅ Import global styles
import "./main.css";
import "./normalize.css";

// ✅ Import scripts and modules
import "./script.js";
import "./formhandler.js";
import "./security.js";
import "./project.js";
import "./tools.js";

// ✅ Import component scripts
import "./components/NavSidebar.js";
import "./components/CameraCapture.js";

import { bootProjects } from "./project.js";
import { bootForms } from "./formhandler.js";

bootProjects();
bootForms();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./serviceworker.js")
      .then(() => console.log("Service Worker registered"))
      .catch(err => console.error("Service Worker registration failed:", err));
  });
}
