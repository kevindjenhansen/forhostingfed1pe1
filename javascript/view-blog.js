const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("id");
const blogName = "Exonimal";
const titleEl = document.getElementById("postTitle");
const authorDateEl = document.getElementById("postAuthorDate");
const imageEl = document.getElementById("postImage");
const bodyEl = document.getElementById("postBody");
const errorEl = document.getElementById("errorMessage");
const shareBtn = document.getElementById("shareBtn");
const editBtn = document.getElementById("editBtn");

async function loadPost() {
  if (!postId) {
    errorEl.textContent = "Missing blog ID.";
    return;
  }

  try {
    const res = await fetch(`https://v2.api.noroff.dev/blog/posts/${blogName}/${postId}`);
    const { data } = await res.json();

    if (!res.ok) throw new Error("Could not load blog");

    titleEl.textContent = data.title;
    authorDateEl.textContent = `By ${data.author.name} • ${new Date(data.created).toLocaleDateString()}`;
    bodyEl.textContent = data.body || "No content available.";

    if (data.media?.url) {
      imageEl.src = data.media.url;
      imageEl.alt = data.media.alt || data.title;
    } else {
      imageEl.style.display = "none";
    }

    const userData = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (userData && token) {
      editBtn.href = `/post/edit-blog.html?id=${postId}`;
      editBtn.style.display = "inline-block";
    }

  } catch (err) {
    console.error("Error:", err);
    errorEl.textContent = "Could not load blog post.";
  }
}

loadPost();

const loginState = document.getElementById("loginState");
const userData = JSON.parse(localStorage.getItem("user"));
if (userData && userData.name) {
  loginState.innerHTML = `
    <span>Welcome, ${userData.name}!</span>
    <button id="logoutBtn">Sign out</button>
  `;

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    location.reload();
  });
}

shareBtn.addEventListener("click", () => {
  const shareUrl = `${window.location.origin}${window.location.pathname}?id=${postId}`;
  navigator.clipboard.writeText(shareUrl)
    .then(() => {
      shareBtn.innerHTML = `<i class="fas fa-check"></i> Copied`;
      setTimeout(() => {
        shareBtn.innerHTML = `<i class="fas fa-share-alt"></i> Share`;
      }, 2000);
    })
    .catch((err) => {
      alert("Failed to copy link.");
      console.error(err);
    });
});
