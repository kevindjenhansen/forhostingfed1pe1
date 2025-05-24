const blogName = "Exonimal";
const postId = new URLSearchParams(window.location.search).get("id");
const titleInput = document.getElementById("title");
const bodyInput = document.getElementById("body");
const mediaUrlInput = document.getElementById("mediaUrl");
const formMessage = document.getElementById("formMessage");
const form = document.getElementById("editBlogForm");
const loginState = document.getElementById("loginState");
const user = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");

if (user && user.name) {
  loginState.innerHTML = `
    <span>Welcome, ${user.name}!</span>
    <button id="logoutBtn">Sign out</button>
  `;
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    location.reload();
  });
} else {
  alert("You must be logged in to edit posts.");
  window.location.href = "/account/login.html";
}

async function loadPost() {
  try {
    const res = await fetch(`https://v2.api.noroff.dev/blog/posts/${blogName}/${postId}`);
    const { data } = await res.json();

    if (!res.ok) {
      throw new Error("Could not load blog post.");
    }

    if (data.author.name !== user.name) {
      alert("You can only edit your own posts.");
      window.location.href = "/index.html";
      return;
    }

    titleInput.value = data.title;
    bodyInput.value = data.body;
    mediaUrlInput.value = data.media?.url || "";

  } catch (err) {
    console.error("Load error:", err);
    formMessage.textContent = "Could not load blog post.";
    formMessage.style.color = "#ff6347";
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const updatedPost = {
    title: titleInput.value.trim(),
    body: bodyInput.value.trim(),
    media: {
      url: mediaUrlInput.value.trim(),
      alt: titleInput.value.trim()
    }
  };

  try {
    const res = await fetch(`https://v2.api.noroff.dev/blog/posts/${blogName}/${postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updatedPost)
    });

    if (!res.ok) {
      throw new Error("Update failed.");
    }

    formMessage.textContent = "Blog updated successfully.";
    formMessage.style.color = "#90ee90";

  } catch (err) {
    console.error("Update error:", err);
    formMessage.textContent = "Failed to update post.";
    formMessage.style.color = "#ff6347";
  }
});

loadPost();

const deleteBtn = document.getElementById("deleteBtn");
const confirmModal = document.getElementById("confirmModal");
const confirmDelete = document.getElementById("confirmDelete");
const cancelDelete = document.getElementById("cancelDelete");

deleteBtn.addEventListener("click", () => {
  confirmModal.style.display = "flex";
});

cancelDelete.addEventListener("click", () => {
  confirmModal.style.display = "none";
});

confirmDelete.addEventListener("click", async () => {
  try {
    const res = await fetch(`https://v2.api.noroff.dev/blog/posts/${blogName}/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Delete failed");

    alert("Blog post deleted successfully.");
    window.location.href = "/index.html";

  } catch (err) {
    console.error("Delete error:", err);
    alert("Failed to delete the post.");
  }
});
