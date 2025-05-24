const blogName = "Exonimal";
const blogAPI = `https://v2.api.noroff.dev/blog/posts/${blogName}`;
const carouselContainer = document.getElementById("carouselContainer");
const blogGrid = document.getElementById("blogGrid");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const postBlogWrapper = document.getElementById("postBlogWrapper");
const loggedInUser = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");

if (loggedInUser && token) {
  postBlogWrapper.style.display = "block";
}

let currentIndex = 0;
let carouselItems = [];

async function fetchBlogs() {
  try {
    const res = await fetch(blogAPI);
    const { data } = await res.json();

    const sorted = data.sort((a, b) => new Date(b.created) - new Date(a.created));
    const latest3 = sorted.slice(0, 3);
    const latest12 = sorted.slice(0, 12);

    carouselContainer.innerHTML = "";
    carouselItems = latest3.map((post, index) => {
      const div = document.createElement("div");
      div.className = "carousel-item";
      if (index === 0) div.classList.add("active");

      div.innerHTML = `
        <h3>${post.title}</h3>
        ${post.media?.url ? `<img src="${post.media.url}" alt="${post.media.alt || post.title}" style="width:100%; height:150px; object-fit:cover; border-radius:8px;" />` : ""}
        <p style="font-size:14px">${post.body?.slice(0, 80) || ""}...</p>
        <a href="post/view-blog.html?id=${post.id}" style="color: #A8F900;">Read more</a>
      `;

      carouselContainer.appendChild(div);
      return div;
    });

    blogGrid.innerHTML = "";
    latest12.forEach(post => {
      const card = document.createElement("div");
      card.className = "blog-card";
      card.innerHTML = `
        ${post.media?.url ? `<img src="${post.media.url}" alt="${post.media.alt || post.title}" />` : ""}
        <h4>${post.title}</h4>
        <p>${post.body?.slice(0, 100) || "No content"}...</p>
        <a href="post/view-blog.html?id=${post.id}" style="color: #A8F900;">Read more</a>
      `;
      blogGrid.appendChild(card);
    });

  } catch (err) {
    console.error("Error loading blogs:", err);
  }
}

function showCarouselItem(index) {
  carouselItems.forEach((item, i) => {
    item.classList.toggle("active", i === index);
  });
}

prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + carouselItems.length) % carouselItems.length;
  showCarouselItem(currentIndex);
});

nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % carouselItems.length;
  showCarouselItem(currentIndex);
});

fetchBlogs();
