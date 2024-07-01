//////Premier
//========= Copyright Group 1 - Orange Coding Acedemy , All rights reserved. ============//
//
// Purpose:		Log in\Log out\Registration.
//
//=============================================================================//

////// creating a new account :

let user = [
  {
    id: 1,
    firstName: "Alaa",
    lastName: "Ramahi",
    email: "a@a.com",
    password: 123,
    projects: [],
  },
];
if (!localStorage.getItem("users")) {
  localStorage.setItem("users", JSON.stringify([]));
}

document.getElementById("newAccountData").addEventListener("click", (e) => {
  let fName = document.getElementById("fName").value;
  let lName = document.getElementById("lName").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  let users = JSON.parse(localStorage.getItem("users"));
  let maxId = 1;
  if (users.length > 0) {
    maxId = users[users.length - 1].id + 1;
  }

  let userExist = false;
  users.forEach((user) => {
    if (user.email == email) {
      userExist = true;
    }
  });

  if (!userExist) {
    let user = {
      id: maxId,
      firstName: fName,
      lastName: lName,
      email,
      password,
      projects: [],
    };

    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
  } else {
    alert("user exists!");
  }
});

////// log ing to an exsisted account :

document
  .getElementById("login_to_my_account")
  .addEventListener("click", (e) => {
    e.preventDefault();
    let email = document.getElementById("log_in_email").value;
    let password = document.getElementById("log_in_password").value;
    let users = JSON.parse(localStorage.getItem("users"));
    let loggedInUser = null;
    users.forEach((user) => {
      if (user.email == email) {
        loggedInUser = user;
      }
    });
    console.log(loggedInUser);
    if (loggedInUser.password == password) {
      localStorage.setItem("loggedInUser", loggedInUser.id);
      window.location.href = "homepage.html";
    } else {
      alert("wrong user credentials");
    }
  });
