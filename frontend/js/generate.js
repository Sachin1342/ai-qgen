document.addEventListener("submit", e => e.preventDefault());

const fileInput = document.getElementById("fileInput");
const uploadZone = document.getElementById("uploadZone");
const uploadText = document.getElementById("uploadText");
const generateBtn = document.getElementById("generateBtn");
const output = document.getElementById("output");

let keywords = [];
let questions = [];

uploadZone.onclick = () => fileInput.click();

fileInput.onchange = async () => {
  const file = fileInput.files[0];
  if (!file) return;

  uploadText.innerText = "Uploading...";
  const fd = new FormData();
  fd.append("file", file);

  const res = await fetch("http://127.0.0.1:8000/api/upload", { method: "POST", body: fd });
  const data = await res.json();

  keywords = data.keywords || [];
  uploadText.innerText = `📄 ${file.name} uploaded`;
  generateBtn.disabled = false;
};

generateBtn.onclick = async () => {
  const res = await fetch("http://127.0.0.1:8000/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      keywords,
      count: 5,
      difficulty: "medium",
      qtype: "mcq"
    })
  });

  const data = await res.json();
  questions = data.questions;
  output.innerHTML = "<h3>Generated Questions</h3>";

  questions.forEach((q, i) => {
    output.innerHTML += `<p>${i + 1}. ${q.question}</p>`;
  });
};
