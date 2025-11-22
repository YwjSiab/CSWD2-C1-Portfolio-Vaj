import { describe, it, expect } from "vitest";
import { Project } from "../src/project.js";

describe("Project class", () => {
  it("creates a valid project with title and description", () => {
    const proj = new Project(1, "Zoo Tracker", "Tracks animals", ["JS"], "Web", "lion.png");
    expect(proj.title).toBe("Zoo Tracker");
    expect(proj.techStack).toContain("JS");
  });

  it("increments and retrieves views correctly", () => {
    const proj = new Project(2, "Portfolio", "My work", ["HTML"]);
    proj.incrementViews();
    proj.incrementViews();
    expect(proj.getViews()).toBe(2);
  });

  it("detects if technology is used", () => {
    const proj = new Project(3, "Test", "desc", ["React"]);
    expect(proj.usesTechnology("React")).toBe(true);
    expect(proj.usesTechnology("Vue")).toBe(false);
  });
});
