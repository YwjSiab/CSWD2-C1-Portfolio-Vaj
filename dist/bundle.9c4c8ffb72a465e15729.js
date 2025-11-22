/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/components/CameraCapture.js":
/*!*****************************************!*\
  !*** ./src/components/CameraCapture.js ***!
  \*****************************************/
/***/ (() => {

eval("{// components/CameraCapture.js\r\nclass CameraCapture extends HTMLElement {\r\n  #stream = null;\r\n\r\n  connectedCallback() {\r\n    // configurable input name (defaults to \"photoDataUrl\")\r\n    const inputName = this.getAttribute(\"input-name\") || \"photoDataUrl\";\r\n    const shutterSrc = this.getAttribute(\"shutter-src\") || \"shutter.mp3\";\r\n\r\n    this.innerHTML = `\r\n      <div class=\"camera-capture\">\r\n        <div class=\"camera-row\">\r\n          <video autoplay playsinline muted></video>\r\n          <canvas aria-label=\"snapshot\" hidden></canvas>\r\n        </div>\r\n\r\n        <div class=\"camera-controls\">\r\n          <button type=\"button\" id=\"startBtn\">Start Camera</button>\r\n          <button type=\"button\" id=\"snapBtn\" disabled>Take Photo</button>\r\n          <button type=\"button\" id=\"retakeBtn\" disabled>Retake</button>\r\n          <button type=\"button\" id=\"stopBtn\" disabled>Stop</button>\r\n        </div>\r\n\r\n        <div class=\"camera-preview\">\r\n          <img id=\"preview\" alt=\"Your snapshot will appear here\" />\r\n        </div>\r\n\r\n        <input type=\"hidden\" name=\"${inputName}\" id=\"${inputName}\" />\r\n        <audio id=\"shutter\" preload=\"auto\" src=\"${shutterSrc}\"></audio>\r\n\r\n        <p id=\"camMsg\" class=\"cam-msg\" role=\"status\"></p>\r\n      </div>\r\n    `;\r\n\r\n    // elements\r\n    this.$ = {\r\n      video: this.querySelector(\"video\"),\r\n      canvas: this.querySelector(\"canvas\"),\r\n      start:  this.querySelector(\"#startBtn\"),\r\n      snap:   this.querySelector(\"#snapBtn\"),\r\n      retake: this.querySelector(\"#retakeBtn\"),\r\n      stop:   this.querySelector(\"#stopBtn\"),\r\n      preview:this.querySelector(\"#preview\"),\r\n      hidden: this.querySelector(`input[type=hidden]`),\r\n      msg:    this.querySelector(\"#camMsg\"),\r\n      shutter:this.querySelector(\"#shutter\"),\r\n    };\r\n\r\n    // events\r\n    this.$.start.addEventListener(\"click\", () => this.start());\r\n    this.$.snap.addEventListener(\"click\",  () => this.snap());\r\n    this.$.retake.addEventListener(\"click\",() => this.retake());\r\n    this.$.stop.addEventListener(\"click\",  () => this.stop());\r\n\r\n    // if permissions already granted, auto-start\r\n    if (navigator.permissions && navigator.permissions.query) {\r\n      navigator.permissions.query({ name: \"camera\" }).then((p) => {\r\n        if (p.state === \"granted\") this.start();\r\n      }).catch(()=>{ /* ignore */ });\r\n    }\r\n  }\r\n\r\n  async start() {\r\n    try {\r\n      if (!navigator.mediaDevices?.getUserMedia) {\r\n        this.note(\"Camera not supported in this browser.\");\r\n        return;\r\n      }\r\n      this.note(\"Starting camera…\");\r\n      this.#stream = await navigator.mediaDevices.getUserMedia({\r\n        video: { facingMode: \"user\", width: { ideal: 640 }, height: { ideal: 480 } },\r\n        audio: false\r\n      });\r\n      this.$.video.srcObject = this.#stream;\r\n      this.$.snap.disabled = false;\r\n      this.$.stop.disabled = false;\r\n      this.$.retake.disabled = true;\r\n      this.$.canvas.hidden = true;\r\n      this.note(\"Camera ready.\");\r\n    } catch (err) {\r\n      this.note(\"Camera error: \" + (err?.message || err));\r\n    }\r\n  }\r\n\r\n  snap() {\r\n    try {\r\n      if (!this.#stream) return;\r\n      const vw = this.$.video.videoWidth || 640;\r\n      const vh = this.$.video.videoHeight || 480;\r\n\r\n      // draw frame\r\n      this.$.canvas.width = vw;\r\n      this.$.canvas.height = vh;\r\n      const ctx = this.$.canvas.getContext(\"2d\");\r\n      ctx.drawImage(this.$.video, 0, 0, vw, vh);\r\n\r\n      // encode (quality ~0.9 jpeg)\r\n      const dataUrl = this.$.canvas.toDataURL(\"image/jpeg\", 0.9);\r\n\r\n      // store + preview\r\n      this.$.hidden.value = dataUrl;\r\n      this.$.preview.src = dataUrl;\r\n\r\n      // sound (optional)\r\n      this.$.shutter.currentTime = 0;\r\n      this.$.shutter.play().catch(()=>{ /* ignore */ });\r\n\r\n      // toggle buttons\r\n      this.$.retake.disabled = false;\r\n      this.$.snap.disabled = true;\r\n\r\n      // simple ~1.5MB guard\r\n      const approxBytes = Math.ceil((dataUrl.length - 'data:image/jpeg;base64,'.length) * 3/4);\r\n      if (approxBytes > 1_500_000) {\r\n        this.note(\"Snapshot is large (~\" + Math.round(approxBytes/1024) + \" KB). Consider retaking.\");\r\n      } else {\r\n        this.note(\"Photo captured.\");\r\n      }\r\n    } catch (err) {\r\n      this.note(\"Snap failed: \" + (err?.message || err));\r\n    }\r\n  }\r\n\r\n  retake() {\r\n    this.$.hidden.value = \"\";\r\n    this.$.preview.removeAttribute(\"src\");\r\n    this.$.snap.disabled = false;\r\n    this.$.retake.disabled = true;\r\n    this.note(\"Ready to retake.\");\r\n  }\r\n\r\n  stop() {\r\n    try {\r\n      this.#stream?.getTracks().forEach(t => t.stop());\r\n      this.#stream = null;\r\n      this.$.video.srcObject = null;\r\n      this.$.snap.disabled = true;\r\n      this.$.stop.disabled = true;\r\n      this.$.retake.disabled = true;\r\n      this.note(\"Camera stopped.\");\r\n    } catch (err) {\r\n      this.note(\"Stop failed.\");\r\n    }\r\n  }\r\n\r\n  note(text) {\r\n    this.$.msg.textContent = text;\r\n  }\r\n}\r\n\r\ncustomElements.define(\"camera-capture\", CameraCapture);\r\n\n\n//# sourceURL=webpack://portfolio-project-vaj/./src/components/CameraCapture.js?\n}");

/***/ }),

/***/ "./src/components/NavSidebar.js":
/*!**************************************!*\
  !*** ./src/components/NavSidebar.js ***!
  \**************************************/
/***/ (() => {

eval("{// components/NavSidebar.js\r\nclass NavSidebar extends HTMLElement {\r\n  connectedCallback() {\r\n    // Light DOM (no Shadow DOM) so page CSS can style it\r\n    this.innerHTML = `\r\n      <div class=\"sidebar-box\">\r\n        <nav>\r\n        <aside class=\"sidebar-box\">\r\n          <h2> \r\n            <span class=\"asideText\">Links to My</span>\r\n          </h2>\r\n          <ul>\r\n            <li><a href=\"index.html\"><strong>Home</strong></a></li>\r\n            <li><a href=\"Resume.html\">Resume</a></li>\r\n            <li><a href=\"Projects.html\">Projects</a></li>\r\n            <li><a href=\"Contact.html\">Contact</a></li>\r\n          </ul>\r\n          </aside>\r\n        </nav>\r\n      </div>\r\n    `;\r\n  }\r\n}\r\ncustomElements.define(\"nav-sidebar\", NavSidebar);\r\n\n\n//# sourceURL=webpack://portfolio-project-vaj/./src/components/NavSidebar.js?\n}");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _main_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./main.css */ \"./src/main.css\");\n/* harmony import */ var _normalize_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./normalize.css */ \"./src/normalize.css\");\n/* harmony import */ var _components_NavSidebar_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/NavSidebar.js */ \"./src/components/NavSidebar.js\");\n/* harmony import */ var _components_NavSidebar_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_components_NavSidebar_js__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _components_CameraCapture_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/CameraCapture.js */ \"./src/components/CameraCapture.js\");\n/* harmony import */ var _components_CameraCapture_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_components_CameraCapture_js__WEBPACK_IMPORTED_MODULE_3__);\n// index.js\r\n\r\n// ✅ Import global styles\r\n\r\n\r\n\r\n// ✅ Import scripts and modules\r\n\r\n\r\n\r\n\r\n\r\n\r\n// ✅ Import component scripts\r\n\r\n\r\n\r\nif (\"serviceWorker\" in navigator) {\r\n  window.addEventListener(\"load\", () => {\r\n    navigator.serviceWorker.register(\"./serviceworker.js\")\r\n      .then(() => console.log(\"Service Worker registered\"))\r\n      .catch(err => console.error(\"Service Worker registration failed:\", err));\r\n  });\r\n}\r\n\n\n//# sourceURL=webpack://portfolio-project-vaj/./src/index.js?\n}");

/***/ }),

/***/ "./src/main.css":
/*!**********************!*\
  !*** ./src/main.css ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("{__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://portfolio-project-vaj/./src/main.css?\n}");

/***/ }),

/***/ "./src/normalize.css":
/*!***************************!*\
  !*** ./src/normalize.css ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("{__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://portfolio-project-vaj/./src/normalize.css?\n}");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;