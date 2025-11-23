// ============================
// formhandler.js (FINAL VERSION)
// Supports:
//   ✔ Contact.html form
//   ✔ Submit a New Project (Projects.html)
// ============================


// ------------------------------------
//  CONTACT FORM (Contact.html)
// ------------------------------------
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) {return;} // not on Contact page

  const success = document.getElementById("formSuccess");
  const error = document.getElementById("formError");
  const phoneInput = document.getElementById("phone");

  // Strict NANP phone validator
  function cleanUsPhone(raw) {
    if (!raw) {return null;}
    let d = String(raw).replace(/\D/g, "");

    // allow leading 1
    if (d.length === 11 && d.startsWith("1")) {d = d.slice(1);}

    // must be exactly 10 digits
    if (d.length !== 10) {return null;}

    const area = d.slice(0, 3);
    const exch = d.slice(3, 6);

    // NANP: area + exchange cannot start with 0 or 1
    if (/[01]/.test(area[0]) || /[01]/.test(exch[0])) {return null;}

    return {
      digits: d,
      pretty: `(${area}) ${exch}-${d.slice(6)}`
    };
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    success.style.display = "none";
    error.style.display = "none";

    if (phoneInput) {
      const cleaned = cleanUsPhone(phoneInput.value);
      if (!cleaned) {
        error.textContent = "Please enter a valid US phone number.";
        error.style.display = "block";
        return;
      }
      phoneInput.value = cleaned.pretty;
    }

    // simulate a successful send
    success.textContent = "Message sent!";
    success.style.display = "block";
    form.reset();
  });
}



// ------------------------------------
//  SUBMIT A NEW PROJECT (Projects.html)
// ------------------------------------
function initProjectSubmission() {
  const host = document.getElementById("projectSubmission");
  if (!host) {return;} // not on Projects page
  if (host.dataset.mounted) {return;} // avoid double mount
  host.dataset.mounted = "1";

  host.insertAdjacentHTML("beforeend", `
    <form id="addProjectForm" class="stack" style="max-width:520px;margin-top:8px;">
      <label>Title <input id="pTitle" required></label>

      <label>Category
        <select id="pCategory">
          <option>Web Development</option>
          <option>Responsive Design</option>
          <option>UI/UX Design</option>
        </select>
      </label>

      <label>Technologies (comma separated)
        <input id="pTech" placeholder="HTML, CSS, JS">
      </label>

      <label>Description
        <textarea id="pDesc" rows="3"></textarea>
      </label>

      <label>Image (optional)
        <input id="pImage" placeholder="images/project.png">
      </label>

      <button type="submit">Add Project</button>

      <p id="projSuccess" style="color:#32CD32;font-weight:bold;display:none;margin-top:6px;"></p>
      <p id="projError" style="color:#ffd700;font-weight:bold;display:none;margin-top:6px;"></p>
    </form>
  `);

  const form = document.getElementById("addProjectForm");
  const success = document.getElementById("projSuccess");
  const error = document.getElementById("projError");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    success.style.display = "none";
    error.style.display = "none";

    const title = document.getElementById("pTitle").value.trim();
    const category = document.getElementById("pCategory").value.trim();
    const tech = document.getElementById("pTech").value.trim();
    const desc = document.getElementById("pDesc").value.trim();
    const image = document.getElementById("pImage").value.trim();

    if (!title) {
      error.textContent = "Title is required.";
      error.style.display = "block";
      return;
    }

    const newProj = {
      id: Date.now(),
      title,
      description: desc,
      techStack: tech ? tech.split(",").map(s => s.trim()).filter(Boolean) : [],
      category,
      image
    };

    // append card immediately
    const list = document.getElementById("projectContainer");
    const details = document.getElementById("projectDetails");

    if (list) {
      const card = document.createElement("div");
      card.className = "project-card";
      card.innerHTML = `
        <h3>${newProj.title}</h3>
        <p>${newProj.description}</p>
        <p><strong>Technologies:</strong> ${newProj.techStack.join(", ")}</p>
        <p><strong>Category:</strong> ${newProj.category}</p>
        ${newProj.image ? `<img src="${newProj.image}" class="project-image" alt="${newProj.title}">` : ""}
        <button type="button" class="view-btn">View Details</button>
      `;

      // details panel click
      card.querySelector(".view-btn").addEventListener("click", () => {
        if (details) {
          details.innerHTML = `
            <h3>${newProj.title}</h3>
            <p>${newProj.description}</p>
            <p><strong>Technologies:</strong> ${newProj.techStack.join(", ")}</p>
            <p><strong>Category:</strong> ${newProj.category}</p>
            ${newProj.image ? `<img src="${newProj.image}" class="project-image" alt="${newProj.title}">` : ""}
          `;
        }
      });

      list.appendChild(card);
    }

    success.textContent = "Project added!";
    success.style.display = "block";
    form.reset();
  });
}



// ------------------------------------
//  Robust Auto-start (works with defer)
// ------------------------------------
function bootForms() {
  initContactForm();
  initProjectSubmission();
}

if (document.readyState !== "loading") {bootForms();}
else {document.addEventListener("DOMContentLoaded", bootForms, { once: true });}

export { bootForms };
