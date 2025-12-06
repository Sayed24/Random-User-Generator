const getUserBtn = document.getElementById("getUserBtn");
const usersDiv = document.getElementById("users");
const favoriteUsersDiv = document.getElementById("favoriteUsers");
const searchInput = document.getElementById("searchInput");
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let currentUsers = [];

// DARK MODE
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

// RENDER FAVORITES
function renderFavorites() {
  favoriteUsersDiv.innerHTML = "";
  favorites.forEach((user, index) => {
    const card = document.createElement("div");
    card.className = "user-card";
    card.innerHTML = `
      <img src="${user.picture}" />
      <h3>${user.name}</h3>
      <p>${user.email}</p>
      <p>${user.location}</p>
      <p>Age: ${user.age}</p>
      <button class="remove">Remove</button>
    `;
    card.querySelector("button").addEventListener("click", () => {
      favorites.splice(index, 1);
      saveFavorites();
      renderFavorites();
    });
    favoriteUsersDiv.appendChild(card);
  });
}

function saveFavorites() {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

// RENDER USERS
function renderUsers(users) {
  usersDiv.innerHTML = "";
  users.forEach(user => {
    const card = document.createElement("div");
    card.className = "user-card";
    card.innerHTML = `
      <img src="${user.picture.large}" />
      <h3>${user.name.title} ${user.name.first} ${user.name.last}</h3>
      <p>${user.email}</p>
      <p>${user.location.city}, ${user.location.country}</p>
      <p>Age: ${user.dob.age}</p>
      <button class="add">Add to Favorites</button>
    `;
    card.querySelector("button").addEventListener("click", () => {
      const data = {
        name: `${user.name.title} ${user.name.first} ${user.name.last}`,
        email: user.email,
        picture: user.picture.large,
        location: `${user.location.city}, ${user.location.country}`,
        age: user.dob.age
      };
      favorites.push(data);
      saveFavorites();
      renderFavorites();
    });
    usersDiv.appendChild(card);
  });
}

// FETCH USERS
async function fetchUsers() {
  usersDiv.innerHTML = "<p>Loading...</p>";
  try {
    const res = await fetch("https://randomuser.me/api/?results=3");
    const data = await res.json();
    currentUsers = data.results;
    renderUsers(currentUsers);
  } catch {
    usersDiv.innerHTML = "<p style='color:red;'>Failed to fetch users.</p>";
  }
}

// SEARCH FILTER
searchInput.addEventListener("input", () => {
  const term = searchInput.value.toLowerCase();
  const filtered = currentUsers.filter(user => {
    const name = `${user.name.first} ${user.name.last}`.toLowerCase();
    const country = user.location.country.toLowerCase();
    return name.includes(term) || country.includes(term);
  });
  renderUsers(filtered);
});

// EVENTS
getUserBtn.addEventListener("click", fetchUsers);

// INITIAL
renderFavorites();
