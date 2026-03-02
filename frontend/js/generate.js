// ============================================================
// CRITICAL: UNREGISTER SERVICE WORKERS & PREVENT AUTO-RELOAD
// ============================================================

console.clear();
console.log("%c🔍 AI-QGen Debugging Session Started", "font-size: 16px; color: #4CAF50; font-weight: bold;");

// Unregister all service workers
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    console.log(`🔧 Found ${registrations.length} service worker(s)`);
    for (let registration of registrations) {
      // Tell service worker to skip waiting
      if (registration.waiting) {
        registration.waiting.postMessage({ type: "SKIP_WAITING" });
      }

      registration.unregister();
      console.log("🔧 Unregistered service worker:", registration);
    }
  });

  // Listen for new service workers
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    console.error("🚫 Service worker controller changed - BLOCKING RELOAD");
  });
}

// Disable page visibility change reload (hot reload)
document.addEventListener("visibilitychange", (e) => {
  e.preventDefault();
  console.log("📱 Page visibility changed - blocked reload");
});

// AGGRESSIVE: Block ALL reload attempts
window.addEventListener("beforeunload", (e) => {
  console.error("🚫 RELOAD ATTEMPT BLOCKED - Denying beforeunload");
  e.preventDefault();
  e.returnValue = '';
  return false;
}, true); // Use capture phase to catch early

// Block refresh keys
document.addEventListener("keydown", (e) => {
  if (e.key === "F5" || (e.ctrlKey && e.key === "r") || (e.metaKey && e.key === "r")) {
    console.log("🚫 Refresh key blocked:", e.key);
    e.preventDefault();
    return false;
  }
});

// Block submit
document.addEventListener("submit", (e) => {
  console.log("🚫 Form submission blocked");
  e.preventDefault();
  return false;
});

// ============================================================
// ELEMENTS
// ============================================================
console.log("%c📦 Loading elements...", "color: #EAD7C7;");

const fileInput = document.getElementById("fileInput");
const uploadZone = document.getElementById("uploadZone");
const uploadText = document.getElementById("uploadText");
const generateBtn = document.getElementById("generateBtn");
const output = document.getElementById("output");
const exportPdfBtn = document.getElementById("exportPdfBtn");
const exportDocxBtn = document.getElementById("exportDocxBtn");
const howToggle = document.getElementById("howToggle");
const howContent = document.getElementById("howContent");

console.table({
  "fileInput": !!fileInput,
  "uploadZone": !!uploadZone,
  "uploadText": !!uploadText,
  "generateBtn": !!generateBtn,
  "output": !!output,
  "exportPdfBtn": !!exportPdfBtn,
  "exportDocxBtn": !!exportDocxBtn
});

let keywords = [];
let questions = [];
const API_BASE = "http://127.0.0.1:8001";

// ============================================================
// HOW IT WORKS
// ============================================================
if (howToggle && howContent) {
  howToggle.onclick = (e) => {
    e.preventDefault();
    howContent.style.display = howContent.style.display === "none" ? "block" : "none";
  };
}

// ============================================================
// UPLOAD ZONE CLICK
// ============================================================
console.log("%c📂 Setting up uploadZone click...", "color: #EAD7C7;");

if (uploadZone && fileInput) {
  const originalClick = uploadZone.onclick;
  uploadZone.onclick = function(e) {
    console.log("%c🖱️ uploadZone.onclick fired", "color: yellow; font-weight: bold;");
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    console.log("📂 Triggering fileInput.click()");
    fileInput.click();

    return false;
  };

  console.log("✅ uploadZone.onclick set");
}

// ============================================================
// FILE INPUT CHANGE
// ============================================================
console.log("%c💾 Setting up fileInput change...", "color: #EAD7C7;");

if (fileInput) {
  fileInput.onchange = async function(e) {
    console.log("%c💾 fileInput.onchange fired", "color: yellow; font-weight: bold;");

    // Prevent defaults
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }

    const file = this.files[0];
    console.log("📄 File object:", file);

    if (!file) {
      console.log("⚠️ No file selected");
      return false;
    }

    console.log(`%c✓ File: ${file.name} (${(file.size / 1024).toFixed(2)} KB, ${file.type})`, "color: #4CAF50;");

    // Show loading
    if (uploadText) {
      uploadText.innerHTML = "<div>⏳ Uploading...</div>";
    }

    // Upload
    const formData = new FormData();
    formData.append("file", file);

    try {
      console.log(`%c→ Fetching: POST ${API_BASE}/api/upload`, "color: cyan;");

      const response = await fetch(`${API_BASE}/api/upload`, {
        method: "POST",
        body: formData
      });

      console.log(`%c← Response: ${response.status}`, "color: cyan;");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Upload failed");
      }

      keywords = data.keywords || [];
      const wordCount = data.word_count || 0;

      console.log(`%c✅ Upload SUCCESS - ${keywords.length} keywords, ${wordCount} words`, "color: #4CAF50; font-weight: bold;");

      // Update UI
      if (uploadText) {
        uploadText.innerHTML = `
          <div style="color: #4CAF50; font-weight: 700;">✅ ${file.name} uploaded successfully!</div>
          <small style="margin-top: 8px; display: block; color: #b7dcdc;">📊 ${wordCount} words · 🏷️ ${keywords.length} keywords extracted</small>
        `;
      }

      // Green style
      if (uploadZone) {
        uploadZone.style.borderColor = "#4CAF50";
        uploadZone.style.background = "rgba(76,175,80,0.15)";
      }

      // Enable button
      if (generateBtn) {
        generateBtn.disabled = false;
        generateBtn.classList.remove("disabled");
      }

      // Reset
      fileInput.value = "";

    } catch (error) {
      console.error(`%c❌ Upload ERROR: ${error.message}`, "color: #ff6b6b;");
      if (uploadText) {
        uploadText.innerHTML = `
          <div style="color: #ff6b6b;">❌ Upload failed</div>
          <small style="color: #ff6b6b;">${error.message}</small>
        `;
      }
    }

    return false;
  };

  console.log("✅ fileInput.onchange set");
}

// ============================================================
// DRAG & DROP
// ============================================================
if (uploadZone) {
  uploadZone.ondragover = (e) => {
    e.preventDefault();
    uploadZone.style.background = "rgba(234,215,199,0.25)";
    uploadZone.style.borderColor = "#EAD7C7";
  };

  uploadZone.ondragleave = (e) => {
    e.preventDefault();
    uploadZone.style.background = "rgba(234,215,199,0.08)";
    uploadZone.style.borderColor = "var(--accent)";
  };

  uploadZone.ondrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    uploadZone.style.background = "rgba(234,215,199,0.08)";
    uploadZone.style.borderColor = "var(--accent)";

    if (e.dataTransfer.files[0]) {
      fileInput.files = e.dataTransfer.files;
      fileInput.onchange.call(fileInput);
    }
    return false;
  };

  console.log("✅ Drag & drop set");
}

// ============================================================
// GENERATE
// ============================================================
if (generateBtn) {
  generateBtn.onclick = async (e) => {
    console.log("%c🔨 Generate clicked", "color: yellow; font-weight: bold;");
    e.preventDefault();
    e.stopPropagation();

    if (!keywords || keywords.length === 0) {
      alert("❌ Please upload a file first!");
      return false;
    }

    const noQuestionsInput = document.querySelector("input[type='number']");
    const count = noQuestionsInput ? parseInt(noQuestionsInput.value) : 10;

    const selects = document.querySelectorAll("select");
    const difficulty = selects[selects.length - 1]?.value || "medium";

    const qformatSelect = document.getElementById("qformat");
    const qformat = qformatSelect?.value || "MCQ";
    const qtype = qformat === "MCQ" ? "mcq" : "descriptive";

    if (output) output.innerHTML = "<p style='text-align:center;'>⏳ Generating...</p>";

    try {
      const response = await fetch(`${API_BASE}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords, count, difficulty, qtype })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail);

      questions = data.questions;
      displayQuestions(questions);

      if (exportPdfBtn) exportPdfBtn.disabled = false;
      if (exportDocxBtn) exportDocxBtn.disabled = false;

      console.log(`%c✅ Generated ${questions.length} questions`, "color: #4CAF50;");

    } catch (error) {
      console.error(`%c❌ Generation error: ${error.message}`, "color: #ff6b6b;");
      if (output) output.innerHTML = `<p style="color: #ff6b6b;">❌ ${error.message}</p>`;
    }

    return false;
  };

  console.log("✅ Generate button set");
}

// ============================================================
// DISPLAY
// ============================================================
function displayQuestions(questions) {
  if (!output) return;
  output.style.display = "block";
  output.innerHTML = "<h3>📋 Generated Questions</h3>";

  questions.forEach((q, i) => {
    let html = `<div class="question"><h4>${i + 1}. ${q.question}</h4>`;
    if (q.options?.length > 0) {
      html += "<ul>";
      q.options.forEach((opt, j) => {
        html += `<li>${String.fromCharCode(97 + j)}) ${opt}</li>`;
      });
      html += "</ul>";
      if (q.answer) html += `<p><strong>Answer:</strong> ${q.answer}</p>`;
    } else {
      html += "<p style='font-style: italic;'>(Descriptive)</p>";
    }
    html += "</div>";
    output.innerHTML += html;
  });
}

// ============================================================
// EXPORT
// ============================================================
if (exportPdfBtn) {
  exportPdfBtn.onclick = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/api/export/pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Generated Questions", questions })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail);
      window.open(`${API_BASE}${data.download_url}`, "_blank");
    } catch (error) {
      alert(`❌ PDF export failed: ${error.message}`);
    }
    return false;
  };
  console.log("✅ PDF export set");
}

if (exportDocxBtn) {
  exportDocxBtn.onclick = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/api/export/docx`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Generated Questions", questions })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail);
      window.open(`${API_BASE}${data.download_url}`, "_blank");
    } catch (error) {
      alert(`❌ DOCX export failed: ${error.message}`);
    }
    return false;
  };
  console.log("✅ DOCX export set");
}

console.log("%c✅ AI-QGen READY!", "font-size: 14px; color: #4CAF50; font-weight: bold;");
console.log("%cOpen Console to see detailed debugging logs", "color: #b7dcdc;");
console.log("");
