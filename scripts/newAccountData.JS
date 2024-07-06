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

  let passwordRegex = /^(?=.*[A-Z]).{5,}$/;

  if (!passwordRegex.test(password)) {
    alert("Password must be at least 5 characters long and include at least one capital letter!");
    return;
  }

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
    alert("Account created successfully!");
    window.location.href = "homepage.html";
  } else {
    alert("User already exists!");
  }
});

////// log in to an existing account :

document.getElementById("login_to_my_account").addEventListener("click", (e) => {
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
  if (loggedInUser && loggedInUser.password == password) {
    localStorage.setItem("loggedInUser", loggedInUser.id);
    window.location.href = "homepage.html";
  } else {
    alert("Wrong user credentials");
  }
});

let container = document.getElementById('container')

toggle = () => {
  container.classList.toggle('sign-in')
  container.classList.toggle('sign-up')
}

setTimeout(() => {
  container.classList.add('sign-in')
}, 200)

document.getElementById('signUp').addEventListener('click', (e) => {
  window.location.href = 'login.html';
});

/********************************************* */


function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}


const upButton = document.querySelector('.up-button');


window.onscroll = function () {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    upButton.classList.add('show');
  } else {
    upButton.classList.remove('show');
  }
};