const fileInput = document.getElementById("fileInput");
const uploadZone = document.getElementById("uploadZone");
const uploadText = document.getElementById("uploadText");
const answer = document.getElementById("answerText");
const evaluateBtn = document.getElementById("evaluateBtn");

let keywords = [];

uploadZone.onclick = () => fileInput.click();

fileInput.onchange = async () => {
  const fd = new FormData();
  fd.append("file", fileInput.files[0]);

  const res = await fetch("http://127.0.0.1:8000/api/upload", { method: "POST", body: fd });
  const data = await res.json();

  keywords = data.keywords;
  uploadText.innerText = "File uploaded";
  evaluateBtn.disabled = false;
};

evaluateBtn.onclick = async () => {
  const res = await fetch("http://127.0.0.1:8000/api/evaluate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      answer: answer.value,
      keywords,
      max_marks: 10
    })
  });

  const data = await res.json();
  alert(`Score: ${data.marks_awarded}/${data.max_marks}`);
};
