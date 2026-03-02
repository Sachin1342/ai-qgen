document.addEventListener("submit", e => e.preventDefault());

const contactForm = document.getElementById("contactForm");
const submitBtn = document.getElementById("submitBtn");
const resultDiv = document.getElementById("result");

const API_BASE = "http://127.0.0.1:8001";

contactForm.onsubmit = async () => {
  const formData = new FormData(contactForm);
  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message")
  };

  // Basic validation
  if (!data.name || !data.email || !data.subject || !data.message) {
    resultDiv.innerHTML = '<p style="color: red;">Please fill in all fields.</p>';
    return;
  }

  submitBtn.disabled = true;
  submitBtn.innerText = "Sending...";

  try {
    const res = await fetch(`${API_BASE}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const responseData = await res.json();

    if (!res.ok) throw new Error(responseData.detail || "Contact failed");

    resultDiv.innerHTML = `
      <p style="color: green;">✅ ${responseData.message}</p>
      ${responseData.email_sent ? '<p>Email notification sent to admin.</p>' : '<p>Note: Email notification not configured.</p>'}
    `;

    contactForm.reset();
  } catch (error) {
    resultDiv.innerHTML = `<p style="color: red;">❌ Failed to send message: ${error.message}</p>`;
    console.error(error);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerText = "Send Message";
  }
};

// Optional: File upload handler if needed in future
/*
if (uploadBtn && fileInput) {
  uploadBtn.addEventListener("click", async () => {
    // File upload logic here
  });
}
*/