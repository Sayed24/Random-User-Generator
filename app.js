const getUserBtn = document.getElementById("getUserBtn");
const usersDiv = document.getElementById("users");
const favoriteUsersDiv = document.getElementById("favoriteUsers");
const searchInput = document.getElementById("searchInput");

// Load favorites from localStorage
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let currentUsers = [];

function renderFavorites() {
  favoriteUsersDiv.innerHTML = "";
  favorites.forEach((user, index) => {
    const card = document.createElement("div");
    card.className = "user-card";
    card.innerHTML = `
      <img src="${user.picture}" alt="User Picture">
      <h2>${user.name}</h2>
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

function renderUsers(users) {
  usersDiv.innerHTML = "";
  users.forEach(user => {
    const card = document.createElement("div");
    card.className = "user-card";
    card.innerHTML = `
      <img src="${user.picture.large}" alt="User Picture">
      <h2>${user.name.title} ${user.name.first} ${user.name.last}</h2>
      <p>Email: ${user.email}</p>
      <p>${user.location.city}, ${user.location.country}</p>
      <p>Age: ${user.dob.age}</p>
      <button class="add">Add to Favorites</button>
    `;
    card.querySelector("button").addEventListener("click", () => {
      const userData = {
        name: `${user.name.title} ${user.name.first} ${user.name.last}`,
        email: user.email,
        picture: user.picture.large,
        location: `${user.location.city}, ${user.location.country}`,
        age: user.dob.age
      };
      favorites.push(userData);
      saveFavorites();
      renderFavorites();
    });
    usersDiv.appendChild(card);
  });
}

// Fetch users from API
async function fetchUsers() {
  usersDiv.innerHTML = "<p>Loading...</p>";
  try {
    const response = await fetch("https://randomuser.me/api/?results=3");
    if (!response.ok) throw new Error("Failed to fetch users");
    const data = await response.json();
    currentUsers = data.results;
    renderUsers(currentUsers);
  } catch (error) {
    usersDiv.innerHTML = `<p style="color:red;">${error.message}</p>`;
    console.error(error);
  }
}

// Search filter
searchInput.addEventListener("input", () => {
  const term = searchInput.value.toLowerCase();
  const filtered = currentUsers.filter(user => {
    const fullName = `${user.name.first} ${user.name.last}`.toLowerCase();
    const country = user.location.country.toLowerCase();
    return fullName.includes(term) || country.includes(term);
  });
  renderUsers(filtered);
});

getUserBtn.addEventListener("click", fetchUsers);

// Initial render of favorites
renderFavorites();
