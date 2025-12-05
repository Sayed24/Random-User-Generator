const getUserBtn = document.getElementById("getUserBtn");
const userDiv = document.getElementById("user");

getUserBtn.addEventListener("click", () => {
  fetch('https://randomeuser.me/api/')
  .then(response => response.json())
  .then(data => {
    const user = date.results[0];
    userDiv.innerHTML = `
      <img src="${user.picture.large}" alt="User Picture">
      <h2>${user.name.title} ${user.name.first} ${user.name.last}</h2>
      <p>Email: ${user.email}</p>
      <p>Location: ${user.location.city} ${user.location.countery} </p>
  `;
    console.log(user);
  }
        .catch(error => {
          userDiv.innerHTML = <p style="color:red;">Error fetching user</p>;
          console.error(error);
        });
});
