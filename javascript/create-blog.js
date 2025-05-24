const form = document.getElementById("createBlogForm");
const message = document.getElementById("formMessage");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const content = document.getElementById("content").value.trim();
  const imageUrl = document.getElementById("imageUrl").value.trim();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if (!user || !token) {
    message.textContent = "You must be logged in to create a blog post.";
    return;
  }

  let media = null;
  if (imageUrl) {
    media = {
      url: imageUrl,
      alt: title
    };
  }

  const blogData = {
    title,
    body: content,
    media: media
  };

  try {
    const res = await fetch(`https://v2.api.noroff.dev/blog/posts/${user.name}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(blogData)
    });

    const result = await res.json();

    if (res.ok) {
      message.style.color = "#90ee90";
      message.textContent = "Blog post created.";
      form.reset();
    } else {
      message.style.color = "#ff6347";
      message.textContent = result.errors?.[0]?.message || "Failed to create post.";
    }
  } catch (err) {
    message.style.color = "#ff6347";
    message.textContent = "Network error. Please try again.";
  }
});


