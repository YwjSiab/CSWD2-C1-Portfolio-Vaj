import { describe, it, expect } from "vitest";

// simplified replica of your contact form validation conditions
function validateContact({ name, email, message }) {
  const nameRegex = /^[A-Za-z\s]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name || !email || !message) {
    return false;
  }
  if (!nameRegex.test(name)) {
    return false;
  }
  if (!emailRegex.test(email)) {
    return false;
  }
  if (message.length < 10) {
    return false;
  }

  return true;
}


describe("Contact form validation", () => {
  it("accepts valid input", () => {
    const result = validateContact({
      name: "John Doe",
      email: "john@example.com",
      message: "This is a valid message."
    });
    expect(result).toBe(true);
  });

  it("rejects invalid input", () => {
    const result = validateContact({
      name: "John123",
      email: "bademail",
      message: "short"
    });
    expect(result).toBe(false);
  });
});
