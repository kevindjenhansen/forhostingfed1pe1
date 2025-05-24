const registerForm = document.getElementById("registerForm");
const message = document.getElementById("formMessage");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email.endsWith("@stud.noroff.no")) {
    message.textContent = "Email must be a @stud.noroff.no address.";
    return;
  }

  if (password.length < 8) {
    message.textContent = "Password must be at least 8 characters.";
    return;
  }

  const registerData = {
    name,
    email,
    password,
  };

  try {
    const response = await fetch("https://v2.api.noroff.dev/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registerData),
    });

    const result = await response.json();

    if (response.ok) {
      message.style.color = "#90ee90";
      message.textContent = "Registration successful! Redirecting to login...";
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
    } else {
      message.style.color = "#ff6347";
      message.textContent = result.errors?.[0]?.message || "Registration failed.";
    }
  } catch (error) {
    message.style.color = "#ff6347";
    message.textContent = "Network error. Please try again.";
  }
});
