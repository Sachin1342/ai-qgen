const fileInput = document.getElementById("fileInput");
const uploadZone = document.getElementById("uploadZone");
const uploadText = document.getElementById("uploadText");
const answer = document.getElementById("answerText");
const evaluateBtn = document.getElementById("evaluateBtn");
const resultDiv = document.getElementById("result");

console.log("=== Initialize Evaluate ===");
console.log("fileInput:", fileInput?.id);
console.log("uploadZone:", uploadZone?.id);
console.log("evaluateBtn:", evaluateBtn?.id);

let keywords = [];

const API_BASE = "http://127.0.0.1:8001";

// Upload zone click handler
if (uploadZone) {
  uploadZone.onclick = (e) => {
    console.log("Upload zone clicked!");
    e.preventDefault();
    e.stopPropagation();
    if (fileInput) {
      console.log("Opening file picker...");
      fileInput.click();
    }
  };
} else {
  console.error("uploadZone not found!");
}

// File input change handler
if (fileInput) {
  fileInput.onchange = async (e) => {
    const file = fileInput.files[0];
    if (!file) {
      console.log("No file selected");
      return;
    }

    console.log("✓ File selected:", file.name, "Size:", file.size);
    if (uploadText) uploadText.innerText = "⏳ Uploading...";
    const fd = new FormData();
    fd.append("file", file);

    try {
      console.log("→ Sending to backend:", `${API_BASE}/api/upload`);
      const res = await fetch(`${API_BASE}/api/upload`, { 
        method: "POST", 
        body: fd 
      });
      
      console.log("← Response status:", res.status);
      const data = await res.json();
      console.log("← Response data:", data);

      if (!res.ok) throw new Error(data.detail || "Upload failed");

      keywords = data.keywords || [];
      const wordCount = data.word_count || 0;
      
      console.log("✓ Keywords extracted:", keywords.length);
      
      if (uploadText) uploadText.innerText = `✓ ${file.name} uploaded\n📊 ${wordCount} words`;
      if (evaluateBtn) evaluateBtn.disabled = false;
      console.log("✓ Upload successful!");
    } catch (error) {
      console.error("✗ Upload error:", error);
      if (uploadText) uploadText.innerText = `❌ Upload failed: ${error.message}`;
      if (evaluateBtn) evaluateBtn.disabled = true;
    }
  };
} else {
  console.error("✗ fileInput not found!");
}

// Evaluate button handler
if (evaluateBtn) {
  evaluateBtn.onclick = async () => {
    if (!answer || !answer.value.trim()) {
      alert("Please enter an answer");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answer: answer.value,
          keywords,
          max_marks: 10
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Evaluation failed");

      displayResult(data);
    } catch (error) {
      if (resultDiv) resultDiv.innerHTML = `<p style="color: red;">❌ Evaluation failed: ${error.message}</p>`;
      console.error(error);
    }
  };
}

function displayResult(data) {
  const percentage = ((data.marks_awarded / data.max_marks) * 100).toFixed(1);

  resultDiv.innerHTML = `
    <h3>Evaluation Result</h3>
    <div class="score">
      <h4>Score: ${data.marks_awarded}/${data.max_marks} (${percentage}%)</h4>
    </div>
    <div class="details">
      <p><strong>Keyword Score:</strong> ${data.keyword_score}% (${data.keywords_matched}/${data.total_keywords} keywords matched)</p>
      <p><strong>Semantic Score:</strong> ${data.semantic_score}%</p>
      <p><strong>Length Score:</strong> ${data.length_score}%</p>
    </div>
    <div class="feedback">
      <p><strong>Feedback:</strong> ${data.feedback}</p>
    </div>
  `;

  // Color coding
  const scoreDiv = resultDiv.querySelector('.score h4');
  if (percentage >= 80) {
    scoreDiv.style.color = 'green';
  } else if (percentage >= 60) {
    scoreDiv.style.color = 'orange';
  } else {
    scoreDiv.style.color = 'red';
  }
}
