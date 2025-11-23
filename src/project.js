// ============================
//   Project.js (FINAL VERSION)
// ============================

import projects from "../projects.json";

// ----------------------------
//  Project Class
// ----------------------------
class Project {
  #viewCount = 0;

  constructor(id, title, description, techStack = [], category = "Uncategorized", image = "") {
    this.id = id;
    this.title = title;
    this.description = description;
    this.techStack = techStack;
    this.category = category;
    this.image = image;
  }

  view() {
    this.#viewCount++;
  }

  getViews() {
    return this.#viewCount;
  }
}

// ----------------------------
// Build project list
// ----------------------------
function buildProjectList() {
  window.allProjects = (projects || []).map(p => {
    return new Project(
      p.id,
      p.title,
      p.description || "",
      Array.isArray(p.techStack) ? p.techStack : [],
      p.category || "Uncategorized",
      p.image ? new URL(`../${p.image}`, import.meta.url).toString() : ""
    );
  });
}

// ----------------------------
// Render Project Details
// ----------------------------
function loadProjectDetails(id) {
  const wrapper = document.getElementById("projectDetailsContainer");
  const details = document.getElementById("projectDetails");

  if (!wrapper || !details) {return;}

  const header = wrapper.querySelector("h2");
  const placeholder = wrapper.querySelector("p");

  const project = window.allProjects.find(p => p.id === id);
  if (!project) {return;}

  if (header) {header.textContent = "Project Details";}
  if (placeholder && placeholder.parentElement === wrapper) {placeholder.remove();}

  project.view();

  details.innerHTML = `
    <h3>${project.title}</h3>
    <p>${project.description}</p>

    <p><strong>Technologies:</strong> ${project.techStack.join(", ")}</p>
    <p><strong>Category:</strong> ${project.category}</p>

    ${project.image ? `<img src="${project.image}" class="project-image" alt="${project.title}">` : ""}

    <p class="muted">Viewed ${project.getViews()} time(s)</p>
  `;
}

// ----------------------------
// Render Project Cards
// ----------------------------
function displayProjects(list) {
  const container = document.getElementById("projectContainer");
  if (!container) {return;}

  container.innerHTML = "";

  if (!Array.isArray(list) || list.length === 0) {
    container.innerHTML = `<p>No projects match this filter.</p>`;
    return;
  }

  list.forEach(project => {
    const card = document.createElement("div");
    card.className = "project-card";

    card.innerHTML = `
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      <p><strong>Technologies:</strong> ${project.techStack.join(", ")}</p>
      <p><strong>Category:</strong> ${project.category}</p>
      ${project.image ? `<img src="${project.image}" class="project-image" alt="${project.title}">` : ""}
      <button type="button" class="view-btn">View Details</button>
    `;

    card.querySelector(".view-btn").addEventListener("click", () => loadProjectDetails(project.id));

    container.appendChild(card);
  });
}

// ----------------------------
// Initialize Projects Page
// ----------------------------
function initProjectsPage() {
  if (!window.allProjects) {buildProjectList();}

  const dropdown = document.getElementById("filterDropdown");
  if (dropdown) {
    dropdown.addEventListener("change", e => {
      const value = e.target.value;
      const filtered =
        value === "All"
          ? window.allProjects
          : window.allProjects.filter(p => p.category === value);

      displayProjects(filtered);
    });
  }

  displayProjects(window.allProjects);
}

// ----------------------------
// Auto-start logic
// ----------------------------
function bootProjects() {
  buildProjectList();
  initProjectsPage();
  window.__PROJECTS_BOOTED__ = true;
}

// Run immediately on import (Webpack-friendly)
if (document.readyState !== "loading") {bootProjects();}
else {document.addEventListener("DOMContentLoaded", bootProjects, { once: true });}

// Export if needed
export { bootProjects, displayProjects, loadProjectDetails, Project };
