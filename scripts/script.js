document.addEventListener("DOMContentLoaded", function () {
  const handleSidebarItemClick = (event) => {
    event.preventDefault();
    const allSideMenu = document.querySelectorAll(
      "#sidebar .side-menu.top li a"
    );
    allSideMenu.forEach((item) => {
      item.parentElement.classList.remove("active");
    });
    const clickedItem = event.target.closest("a");
    clickedItem.parentElement.classList.add("active");
    const sectionToShow = clickedItem.getAttribute("data-section");
    const mainSections = document.querySelectorAll("main");
    mainSections.forEach((section) => {
      if (section.id === sectionToShow) {
        section.style.display = "block";
      } else {
        section.style.display = "none";
      }
    });
  };
  const allSideMenu = document.querySelectorAll("#sidebar .side-menu.top li a");
  allSideMenu.forEach((item) => {
    item.addEventListener("click", handleSidebarItemClick);
  });
///////////////////////////////////////////////////////////////////////////
  // TOGGLE SIDEBAR
  const menuBar = document.querySelector("#content nav .bx.bx-menu");
  const sidebar = document.getElementById("sidebar");

  menuBar.addEventListener("click", function () {
    sidebar.classList.toggle("hide");
  });

  const searchButton = document.querySelector(
    "#content nav form .form-input button"
  );
  const searchButtonIcon = document.querySelector(
    "#content nav form .form-input button .bx"
  );
  const searchForm = document.querySelector("#content nav form");

  searchButton.addEventListener("click", function (e) {
    if (window.innerWidth < 576) {
      e.preventDefault();
      searchForm.classList.toggle("show");
      if (searchForm.classList.contains("show")) {
        searchButtonIcon.classList.replace("bx-search", "bx-x");
      } else {
        searchButtonIcon.classList.replace("bx-x", "bx-search");
      }
    }
  });

  if (window.innerWidth < 768) {
    sidebar.classList.add("hide");
  } else if (window.innerWidth > 576) {
    searchButtonIcon.classList.replace("bx-x", "bx-search");
    searchForm.classList.remove("show");
  }

  window.addEventListener("resize", function () {
    if (this.innerWidth > 576) {
      searchButtonIcon.classList.replace("bx-x", "bx-search");
      searchForm.classList.remove("show");
    }
  });

  const switchMode = document.getElementById("switch-mode");

  switchMode.addEventListener("change", function () {
    if (this.checked) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  });

  // TODOS
  const todoList = document.querySelector(".todo-list");
  const addTodoBtn = document.querySelector(".bx-plus");
  let todos = JSON.parse(localStorage.getItem("todos")) || [];

  const renderTodos = () => {
    todoList.innerHTML = "";
    todos.forEach((todo, index) => {
      const li = document.createElement("li");
      li.classList.add(todo.completed ? "completed" : "not-completed");
      li.innerHTML = `
                <p>${todo.text}</p>
                <i class='bx bx-dots-vertical-rounded' data-index="${index}"></i>
            `;
      todoList.appendChild(li);
    });
  };

  const addTodo = (text) => {
    todos.push({ text, completed: false });
    localStorage.setItem("todos", JSON.stringify(todos));
    renderTodos();
  };

  const toggleTodo = (index) => {
    todos[index].completed = !todos[index].completed;
    localStorage.setItem("todos", JSON.stringify(todos));
    renderTodos();
  };

  const removeTodo = (index) => {
    todos.splice(index, 1);
    localStorage.setItem("todos", JSON.stringify(todos));
    renderTodos();
  };

  todoList.addEventListener("click", (e) => {
    if (e.target.classList.contains("bx-dots-vertical-rounded")) {
      const index = e.target.getAttribute("data-index");
      removeTodo(index);
    } else if (e.target.tagName === "P") {
      const index = e.target.nextElementSibling.getAttribute("data-index");
      toggleTodo(index);
    }
  });

  addTodoBtn.addEventListener("click", () => {
    const text = prompt("Enter a new to-do:");
    if (text) {
      addTodo(text);
    }
  });

  renderTodos();

  //////Premier
  //========= Copyright Group 1 - Orange Coding Acedemy , All rights reserved. ============//
  //
  // Purpose:
  //
  //=============================================================================//

  let projectList = document.getElementById("projectList");
  let projectForm = document.getElementById("projectForm");
  ////delete filter variable
  let historyTable = document.getElementById("historyList");
  let projectsCount = 0;
  let chartData = {
    labels: ["To-Do", "In Progress", "Completed"],
    datasets: [
      {
        label: "Task Status",
        data: [0, 0, 0],
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(75, 192, 192, 0.7)",
        ],
        hoverOffset: 4,
      },
    ],
  };
  function calculatePercentage() {
    let totalTasks = chartData.datasets[0].data.reduce(
      (total, currentValue) => total + currentValue,
      0
    );
    let percentages = chartData.datasets[0].data.map((value) =>
      totalTasks === 0 ? 0 : Math.round((value / totalTasks) * 100)
    );
    return percentages;
  }
  const ctx = document.getElementById("myPieChart").getContext("2d");

  let myPieChart = new Chart(ctx, {
    type: "pie",
    data: chartData,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              let label = tooltipItem.label || "";
              if (label) {
                label += ": ";
              }
              label += tooltipItem.raw.toLocaleString() + " tasks";
              return label;
            },
          },
        },
        title: {
          display: true,
          text: "Tasks Status",
        },
      },
      layout: {
        padding: 10,
      },
    },
  });

        function updateChartData() {
          let users = JSON.parse(localStorage.getItem("users"));
          let loggedInUser = users.find(
            (user) =>
              user.id == JSON.parse(localStorage.getItem("loggedInUser"))
          );

          let overallStatusCounter = {
            "To-Do": 0,
            "In Progress": 0,
            Completed: 0,
          };

          loggedInUser.projects.forEach((project) => {
            overallStatusCounter["To-Do"] += project.taskStatusCounter["To-Do"];
            overallStatusCounter["In Progress"] +=
              project.taskStatusCounter["In Progress"];
            overallStatusCounter["Completed"] +=
              project.taskStatusCounter["Completed"];
          });

          chartData.datasets[0].data[0] = overallStatusCounter["To-Do"];
          chartData.datasets[0].data[1] = overallStatusCounter["In Progress"];
          chartData.datasets[0].data[2] = overallStatusCounter["Completed"];

          let percentages = calculatePercentage();

          myPieChart.options.plugins.tooltip.callbacks.label = function (
            tooltipItem
          ) {
            let label = tooltipItem.label || "";
            if (label) {
              label += ": ";
            }
            label += tooltipItem.raw.toLocaleString() + " tasks";
            label += " (" + percentages[tooltipItem.dataIndex] + "%)";
            return label;
          };

          myPieChart.update();
        }

  function loadProjects() {
    let users = JSON.parse(localStorage.getItem("users"));
    let loggedInUser = null;
    users.forEach((user) => {
      if (user.id == JSON.parse(localStorage.getItem("loggedInUser"))) {
        loggedInUser = user;
   
      }
    });
     
    projectList.innerHTML = "";

    if (loggedInUser.projects) {
      loggedInUser.projects.forEach((project, projectIndex) => {
        let projectItem = Project(project, projectIndex);
        let taskStatusCounter = { "To-Do": 0, "In Progress": 0, Completed: 0 };
          project.tasks.forEach((task) => {
            taskStatusCounter[task.status]++;
          });
         project.taskStatusCounter = taskStatusCounter;
        projectList.appendChild(projectItem);
      });
      localStorage.setItem("users", JSON.stringify(users));
        updateChartData();
    }
  }
  /////////////////////////////////////////history
    function addToHistory(action) {
      const now = new Date();
      const dateFormatted = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;

      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${action}</td>
          <td>${dateFormatted}</td>
      `;

      historyTable.prepend(row); // Add new entry at the beginning of the table
  }
  ///////////////////////////////////////////
  //delete button edit
  function Project(project, projectIndex) {
    let projectItem = document.createElement("li");
    projectItem.className = "project";
    projectItem.innerHTML = `
      <div id="container">
      <div id="pro_main_flex">
        <div id="pro_div">
          <h3 id="h3">${project.title}  </h3>
          
          <button class="deleteProject">Delete Project</button>
          
        </div>
        <form class="taskForm">
          <input type="text" class="taskTitle" id="taskTitle${projectIndex}" placeholder="Task Title" required> <select id="taskStatus${projectIndex}" required><br>
            <option value="To-Do">To-Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select><input type="date" id="taskDueDate${projectIndex}" required><br>
          <textarea id="taskDescription${projectIndex}" placeholder="Task Description" required></textarea><br>
          <button type="submit" id="form_button">Add Task</button>
        </form>
        <div id="task_list_div" class="taskList">
          <ul>
            ${project.tasks
              .map(
                (task) => `
              <li class="task" data-status="${task.status}" data-due-date="${task.dueDate}">
                <div class="taskContent">
                <div id="space">
                  <h4>${task.title}</h4>
                  <p>${task.description}</p>
                  <p>Due Date: ${task.dueDate}</p>
                  <p>Status: ${task.status}</p>
                  <button class="editTask">Edit Task</button>
                  <button class="deleteTask">Delete Task</button>
                </div>
              </li>
            `
              )
              .join("")}
              </div>
          </ul>
        </div>
      </div>
    `;

    let taskForm = projectItem.querySelector(".taskForm");
    taskForm.addEventListener("submit", function (event) {
      event.preventDefault();
      let taskTitle = document.getElementById(`taskTitle${projectIndex}`).value;
      let taskDescription = document.getElementById(
        `taskDescription${projectIndex}`
      ).value;
      let taskDueDate = document.getElementById(
        `taskDueDate${projectIndex}`
      ).value;
      let taskStatus = document.getElementById(
        `taskStatus${projectIndex}`
      ).value;
      saveTask(
        projectIndex,
        taskTitle,
        taskDescription,
        taskDueDate,
        taskStatus
      );
    
    });
    //////////////////////////////change edit
    let taskItems = projectItem.querySelectorAll(".task");
    taskItems.forEach((taskItem, taskIndex) => {
      let editTaskButton = taskItem.querySelector(".editTask");
      editTaskButton.addEventListener("click", function () {
        const taskContent = taskItem.querySelector(".taskContent");
        const editForm = document.createElement("form");

        editForm.innerHTML = `
        <input type="text" value="${
          taskItem.querySelector("h4").innerText
        }" required>
        <textarea required>${
          taskItem.querySelector("p:nth-of-type(1)").innerText
        }</textarea>
        <input type="date" value="${
          taskItem.querySelector("p:nth-of-type(2)").innerText.split(": ")[1]
        }" required>
        <select required>
          <option value="To-Do" ${
            taskItem
              .querySelector("p:nth-of-type(3)")
              .innerText.split(": ")[1] === "To-Do"
              ? "selected"
              : ""
          }>To-Do</option>
          <option value="In Progress" ${
            taskItem
              .querySelector("p:nth-of-type(3)")
              .innerText.split(": ")[1] === "In Progress"
              ? "selected"
              : ""
          }>In Progress</option>
          <option value="Completed" ${
            taskItem
              .querySelector("p:nth-of-type(3)")
              .innerText.split(": ")[1] === "Completed"
              ? "selected"
              : ""
          }>Completed</option>
        </select>
        <button type="submit">Save</button>
        <button type="button" class="cancelEdit">Cancel</button>
      `;

        taskContent.style.display = "none";
        taskItem.appendChild(editForm);

        editForm.addEventListener("submit", function (event) {
          event.preventDefault();
          let users = JSON.parse(localStorage.getItem("users"));
          let loggedInUser = users.find(
            (user) =>
              user.id == JSON.parse(localStorage.getItem("loggedInUser"))
          ); let editTaskTitle =
            loggedInUser.projects[projectIndex].tasks[taskIndex].title;
             addToHistory(
               `Edited task "${editTaskTitle}" in project "${loggedInUser.projects[projectIndex].title}"`
             );
let oldStatus = loggedInUser.projects[projectIndex].tasks[taskIndex].status;
          
          loggedInUser.projects[projectIndex].tasks[taskIndex] = {
            title: editForm.querySelector("input[type='text']").value,
            description: editForm.querySelector("textarea").value,
            dueDate: editForm.querySelector("input[type='date']").value,
            status: editForm.querySelector("select").value,
          };
        if (
          oldStatus !==
          loggedInUser.projects[projectIndex].tasks[taskIndex].status
        ) {
          loggedInUser.projects[projectIndex].taskStatusCounter[oldStatus]--;
          loggedInUser.projects[projectIndex].taskStatusCounter[
            loggedInUser.projects[projectIndex].tasks[taskIndex].status
          ]++;
          }
         
          localStorage.setItem("users", JSON.stringify(users));
          loadProjects();
        });

        editForm
          .querySelector(".cancelEdit")
          .addEventListener("click", function () {
            taskContent.style.display = "";
            taskItem.removeChild(editForm);
          });
       
      });

      let deleteTask = taskItem.querySelector(".deleteTask");
      deleteTask.addEventListener("click", function () {
        let users = JSON.parse(localStorage.getItem("users"));
        /////////////change
        let loggedInUser = users.find(
          (user) => user.id == JSON.parse(localStorage.getItem("loggedInUser"))
        );
           let deletedTaskTitle =
             loggedInUser.projects[projectIndex].tasks[taskIndex].title;
           addToHistory(`Deleted Task "${deletedTaskTitle}"`);
let taskStatus = loggedInUser.projects[projectIndex].tasks[taskIndex].status;
        loggedInUser.projects[projectIndex].tasks.splice(taskIndex, 1);
      
        loggedInUser.projects[projectIndex].taskStatusCounter[taskStatus]--;
       
        localStorage.setItem("users", JSON.stringify(users));
        loadProjects();
      });
    });

    let deleteProject = projectItem.querySelector(".deleteProject");
    deleteProject.addEventListener("click", function () {
      let users = JSON.parse(localStorage.getItem("users"));
      /////////////////change
      let loggedInUser = users.find(
        (user) => user.id == JSON.parse(localStorage.getItem("loggedInUser"))
      );
  let deletedProjectTitle = loggedInUser.projects[projectIndex].title;
  loggedInUser.projects.splice(projectIndex, 1);
  addToHistory(`Deleted project "${deletedProjectTitle}"`);
      loggedInUser.projects.splice(projectIndex, 1);
      localStorage.setItem("users", JSON.stringify(users));
      loadProjects();
     
    });

    return projectItem;
  }

  function saveTask(projectIndex, title, description, dueDate, status) {
    let users = JSON.parse(localStorage.getItem("users"));

    let loggedInUser = null;
    users.forEach((user) => {
      if (user.id == JSON.parse(localStorage.getItem("loggedInUser"))) {
        loggedInUser = user;
      }
    });
    if (loggedInUser.projects[projectIndex]) {
      loggedInUser.projects[projectIndex].tasks.push({
        title,
        description,
        dueDate,
        status,
        
      });
        loggedInUser.projects[projectIndex].taskStatusCounter[status]++;
      localStorage.setItem("users", JSON.stringify(users));
      loadProjects();
    }
    addToHistory(
      `Add task "${title}" in project "${loggedInUser.projects[projectIndex].title}"`
    );
  }

  function saveProject(title) {
    let users = JSON.parse(localStorage.getItem("users"));
    //////////////change
    let loggedInUser = users.find(
      (user) => user.id == JSON.parse(localStorage.getItem("loggedInUser"))
    );

    loggedInUser.projects.push({
      title,
      tasks: [],
      taskStatusCounter: { "To-Do": 0, "In Progress": 0, Completed: 0 },
    });

    localStorage.setItem("users", JSON.stringify(users));
    loadProjects();
    addToHistory(`Added project "${title}"`);
  }

  projectForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const title = document.getElementById("projectTitle").value;
    if (title) {
      saveProject(title);
    }
  });

  loadProjects();

  /////////////firstNameDisplay

  let users = localStorage.getItem("users");
  let loggedInUserId = localStorage.getItem("loggedInUser");
  let usersArray = JSON.parse(users);
  let loggedInUser = usersArray.find((user) => user.id == loggedInUserId);
  let firstName = loggedInUser.firstName;
  const firstNameDisplay = document.getElementById("firstNameDisplay");
  firstNameDisplay.textContent = firstName;


  /////////////////logout
  document.getElementById("logout").addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
  });
});
