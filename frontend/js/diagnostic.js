// ============================================================
// FILE UPLOAD FIX & DIAGNOSTIC
// ============================================================

console.log("=== DIAGNOSTIC: File Upload Click Issue ===");

// Check 1: DOM Elements
const fileInput = document.getElementById("fileInput");
const uploadZone = document.getElementById("uploadZone");

console.log("✓ Check 1: DOM Elements");
console.log("  fileInput found:", !!fileInput);
console.log("  uploadZone found:", !!uploadZone);

if (fileInput) {
  console.log("  fileInput type:", fileInput.type);
  console.log("  fileInput display:", window.getComputedStyle(fileInput).display);
  console.log("  fileInput visibility:", window.getComputedStyle(fileInput).visibility);
  console.log("  fileInput pointer-events:", window.getComputedStyle(fileInput).pointerEvents);
}

if (uploadZone) {
  console.log("  uploadZone cursor:", window.getComputedStyle(uploadZone).cursor);
  console.log("  uploadZone pointer-events:", window.getComputedStyle(uploadZone).pointerEvents);
}

// Check 2: Event Listeners
console.log("\n✓ Check 2: Event Listeners");
if (uploadZone && fileInput) {
  console.log("  uploadZone click handler:", !!uploadZone.onclick);
  console.log("  uploadZone drag handlers:", {
    dragover: !!uploadZone.ondragover,
    dragleave: !!uploadZone.ondragleave,
    drop: !!uploadZone.ondrop
  });
}

// Check 3: Test Click Programmatically
console.log("\n✓ Check 3: Test Click Functionality");
if (fileInput) {
  // Add a test listener
  fileInput.addEventListener("click", () => {
    console.log("✅ FILE INPUT CLICK DETECTED!");
  });

  // Try clicking
  console.log("  Attempting to click fileInput...");
  try {
    fileInput.click();
    console.log("  ✅ Click executed without errors");
  } catch (e) {
    console.error("  ❌ Click failed:", e);
  }
}

console.log("\n=== DIAGNOSTIC COMPLETE ===\n");
