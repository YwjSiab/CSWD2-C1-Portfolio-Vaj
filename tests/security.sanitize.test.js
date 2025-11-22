import { describe, it, expect } from "vitest";
import { sanitizeInput } from "../src/security.js";

describe("sanitizeInput", () => {
  it("removes HTML tags and escapes dangerous characters", () => {
    const dirty = `<script>alert('xss')</script> Hello & <b>World</b>`;
    const clean = sanitizeInput(dirty);

    // tags are removed
    expect(clean).not.toMatch(/<\s*script/i);
    expect(clean).not.toMatch(/<\s*b\s*>/i);
    expect(clean).not.toContain("&lt;b&gt;"); // no escaped <b> either

    // special chars are escaped
    expect(clean).toContain("Hello &amp; World");
    expect(clean).toContain("alert(&#039;xss&#039;)");
    // and nothing raw like < or >
    expect(clean).not.toContain("<");
    expect(clean).not.toContain(">");
  });

  it("returns empty string safely on error", () => {
    const clean = sanitizeInput(null);
    expect(clean).toBe("");
  });
});
