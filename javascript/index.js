const loginState = document.getElementById("loginState");
const userData = JSON.parse(localStorage.getItem("user"));

if (userData && userData.name) {
  loginState.innerHTML = 
    `<span>Welcome, ${userData.name}!</span>
    <button id="logoutBtn">Sign out</button>`;
  
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    location.reload();
  });
}


