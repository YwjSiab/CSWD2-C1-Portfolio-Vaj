// tools.js

// -------------- Bracket Matcher --------------
// Validates (), [], {} pairs and nesting
function isBalancedBrackets(input) {
  const pairs = { ")": "(", "]": "[", "}": "{" };
  const stack = [];
  for (const ch of input) {
    if (ch === "(" || ch === "[" || ch === "{"){ stack.push(ch);}
    else if (ch === ")" || ch === "]" || ch === "}") {
      if (stack.pop() !== pairs[ch]) {return false;}
    } else {
      // ignore non-bracket characters
    }
  }
  return stack.length === 0;
}

// -------------- Acronym Generator --------------
// Turns "Portable Network Graphics" => "PNG"
function toAcronym(phrase) {
  if (!phrase) {
    return "";
  }
  // split on anything that's not a letter/apostrophe; keep letters & digits
  const words = phrase
    .split(/[^A-Za-z0-9']+/)
    .filter(Boolean);
  return words.map(w => w[0]).join("").toUpperCase();
}

document.addEventListener("DOMContentLoaded", () => {
  // Bracket checker binding
  const brIn = document.getElementById("bracketsInput");
  const brBtn = document.getElementById("bracketsBtn");
  const brOut = document.getElementById("bracketsResult");
  if (brIn && brBtn && brOut) {
    brBtn.addEventListener("click", () => {
      const ok = isBalancedBrackets(brIn.value || "");
      brOut.textContent = ok ? "✔ Valid" : "❌ Invalid";
      brOut.style.color = ok ? "#16a34a" : "#dc2626";
    });
  }

  // Acronym generator binding
  const acIn = document.getElementById("acronymInput");
  const acBtn = document.getElementById("acronymBtn");
  const acOut = document.getElementById("acronymResult");
  if (acIn && acBtn && acOut) {
    acBtn.addEventListener("click", () => {
      const ac = toAcronym(acIn.value || "");
      acOut.textContent = ac ? `Acronym: ${ac}` : "Please enter a phrase.";
    });
  }
});

function initTools() {
  const bInput = document.getElementById("bracketsInput");
  const bBtn   = document.getElementById("bracketsBtn");
  const bOut   = document.getElementById("bracketsResult");

  const aInput = document.getElementById("acronymInput");
  const aBtn   = document.getElementById("acronymBtn");
  const aOut   = document.getElementById("acronymResult");

  // Only run on pages that actually have these controls
  const onProjectsPage = bInput && bBtn && bOut && aInput && aBtn && aOut;
  if (!onProjectsPage) {return;}

  bBtn.addEventListener("click", () => {
    const ok = isBalancedBrackets(bInput.value);
    bOut.textContent = ok ? "✅ Balanced" : "❌ Not balanced";
  });
  bInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); bBtn.click(); }
  });

  aBtn.addEventListener("click", () => {
    const ac = toAcronym(aInput.value);
    aOut.textContent = ac ? `Acronym: ${ac}` : "Enter a phrase";
  });
  aInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); aBtn.click(); }
  });

  window.__TOOLS_BOOTED__ = true; // for quick console checks
}

// robust auto-run
export function bootTools() {
  if (document.readyState !== "loading") {initTools();}
  else {document.addEventListener("DOMContentLoaded", initTools, { once: true });}
}

// Exported in case you ever want to test them
export { isBalancedBrackets, toAcronym };
