const getUserBtn = document.getElementById("getUserBtn");
const usersDiv = document.getElementById("users");
const favoriteUsersDiv = document.getElementById("favoriteUsers");

// Load favorites from localStorage
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

function renderFavorites() {
  favoriteUsersDiv.innerHTML = "";
  favorites.forEach((user, index) => {
    favoriteUsersDiv.innerHTML += `
      <div class="user-card">
        <img src="${user.picture}" alt="User Picture">
        <h2>${user.name}</h2>
        <p>${user.email}</p>
        <button onclick="removeFavorite(${index})">Remove</button>
      </div>
    `;
  });
}

function saveFavorites() {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

function removeFavorite(index) {
  favorites.splice(index, 1);
  saveFavorites();
  renderFavorites();
}

getUserBtn.addEventListener("click", async () => {
  usersDiv.innerHTML = "<p>Loading...</p>";

  try {
    const response = await fetch("https://randomuser.me/api/?results=3");
    if (!response.ok) throw new Error("Failed to fetch users");
    const data = await response.json();
    const users = data.results;

    usersDiv.innerHTML = "";
    users.forEach(user => {
      const userCard = document.createElement("div");
      userCard.className = "user-card";
      userCard.innerHTML = `
        <img src="${user.picture.large}" alt="User Picture">
        <h2>${user.name.title} ${user.name.first} ${user.name.last}</h2>
        <p>${user.email}</p>
        <button>Add to Favorites</button>
      `;
      const addBtn = userCard.querySelector("button");
      addBtn.addEventListener("click", () => {
        const userData = {
          name: `${user.name.title} ${user.name.first} ${user.name.last}`,
          email: user.email,
          picture: user.picture.large
        };
        favorites.push(userData);
        saveFavorites();
        renderFavorites();
      });
      usersDiv.appendChild(userCard);
    });
  } catch (error) {
    usersDiv.innerHTML = `<p style="color:red;">${error.message}</p>`;
    console.error(error);
  }
});

// Initial render of favorites
renderFavorites();