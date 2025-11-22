// =====================
//  Project.js
// =====================

class Project {
  #viewCount = 0;

  constructor(id, title, description, techStack = [], category = "Uncategorized", image = "default-placeholder.jpg") {
    this.id = id;
    this.title = title;
    this.description = description;
    this.techStack = techStack;
    this.category = category;
    this.image = image;
  }

  incrementViews() {
    this.#viewCount++;
  }

  getViews() {
    return this.#viewCount;
  }
}

// ✅ Import static project data (Webpack handles JSON)
import projects from "../projects.json";

// ✅ Convert JSON -> Project instances, and fix image paths
window.allProjects = projects.map(
  p =>
    new Project(
      p.id,
      p.title,
      p.description,
      p.techStack,
      p.category,
      // Make sure images resolve correctly
      p.image ? new URL(`../${p.image}`, import.meta.url).toString() : ""
    )
);

// ✅ Display all projects
function displayProjects(list) {
  const container = document.getElementById("projectContainer");
  if (!container) {return;};

  container.innerHTML = "";

  list.forEach(project => {
    const card = document.createElement("div");
    card.classList.add("project-card");

    const title = document.createElement("h3");
    title.textContent = project.title;

    const img = document.createElement("img");
    img.src = project.image;
    img.alt = project.title;
    img.className = "project-image";

    const desc = document.createElement("p");
    desc.textContent = project.description;

    const tech = document.createElement("p");
    tech.innerHTML = `<strong>Technologies:</strong> ${project.techStack.join(", ")}`;

    const cat = document.createElement("p");
    cat.textContent = `Category: ${project.category}`;

    const btn = document.createElement("button");
    btn.textContent = "View Details";
    btn.addEventListener("click", () => loadProjectDetails(project.id));

    card.append(title, desc, tech, cat, img, btn);
    container.appendChild(card);
  });
}

// ✅ Details viewer
function loadProjectDetails(id) {
  const details = document.getElementById("projectDetails");
  if (!details) {return;};

  // 🔹 hide/remove the placeholder text above the details area
  const wrapper = document.getElementById("projectDetailsContainer");
  const placeholder = wrapper?.querySelector("p"); // "Select a project to view details."
  if (placeholder) {placeholder.remove();};

  const header = wrapper?.querySelector("h2"); // "Project Details" title
  if (header) {header.textContent = "Project Details";}; // keep it clean

  const project = window.allProjects.find(p => p.id === id);
  if (!project) {
    details.textContent = "Project not found.";
    return;
  }

  project.incrementViews();
  details.innerHTML = `
    <h2>${project.title}</h2>
    <img class="project-detail-image" src="${project.image}" alt="${project.title}">
    <p>${project.description}</p>
    <p><strong>Technologies:</strong> ${project.techStack.join(", ")}</p>
    <p>Category: ${project.category}</p>
    <p>👁️ Views: ${project.getViews()}</p>
  `;
}


// ✅ Category filter logic
document.addEventListener("DOMContentLoaded", () => {
  const dropdown = document.getElementById("filterDropdown");
  if (dropdown) {
    dropdown.addEventListener("change", e => {
      const val = e.target.value;
      const filtered =
        val === "All"
          ? window.allProjects
          : window.allProjects.filter(p => p.category === val);
      displayProjects(filtered);
    });
  }
  displayProjects(window.allProjects);
});

export { Project, displayProjects };
