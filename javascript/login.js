const form = document.getElementById("loginForm");
const formMessage = document.getElementById("formMessage");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("https://v2.api.noroff.dev/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.errors?.[0]?.message || "Login failed");
    }

    const { data } = await response.json();

    localStorage.setItem("token", data.accessToken);
    localStorage.setItem("user", JSON.stringify(data));

    window.location.href = "/index.html";
  } catch (err) {
    formMessage.textContent = err.message;
  }
});
