document.addEventListener("DOMContentLoaded", function () {
  const handleSidebarItemClick = (event) => {
    event.preventDefault();
    const allSideMenu = document.querySelectorAll("#sidebar .side-menu.top li a");
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

  // Add click event listener to each sidebar item
  const allSideMenu = document.querySelectorAll("#sidebar .side-menu.top li a");
  allSideMenu.forEach((item) => {
    item.addEventListener("click", handleSidebarItemClick);
  });
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Function to load projects for the logged-in user
  function loadProjects() {
    const projectList = document.getElementById("projectList");
    projectList.innerHTML = ""; // Clear existing list

    const users = getUsersFromLocalStorage();
    const loggedInUserId = getLoggedInUserId();
    let loggedInUser = getUserById(users, loggedInUserId);

    if (loggedInUser && loggedInUser.projects) {
      loggedInUser.projects.forEach((project, projectIndex) => {
        const projectItem = createProjectElement(project, projectIndex);
        projectList.appendChild(projectItem);
      });
    }
  }

  // Function to create HTML element for a project
  function createProjectElement(project, projectIndex) {
    const projectItem = document.createElement("li");
    projectItem.className = "project";
    projectItem.innerHTML = `
      <h3>${project.title}</h3>
      <button class="deleteProject">Delete Project</button>
      <button class="editProject" data-bs-toggle="modal" data-bs-target="#taskModal-${projectIndex}">Edit Project</button>
      <form class="taskForm" id="taskForm-${projectIndex}">
        <input type="text" id="taskTitle${projectIndex}" placeholder="Task Title" required>
        <textarea id="taskDescription${projectIndex}" placeholder="Task Description" required></textarea>
        <input type="date" id="taskDueDate${projectIndex}" required>
        <select id="taskStatus${projectIndex}" required>
          <option value="To-Do">To-Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <button type="submit">Add Task</button>
      </form>
      <ul class="taskList">
        ${project.tasks.map((task, taskIndex) => `
          <li class="task" data-status="${task.status}" data-dueDate="${task.dueDate}">
            <h4>${task.title}</h4>
            <p>${task.description}</p>
            <p>Due Date: ${task.dueDate}</p>
            <p>Status: ${task.status}</p>
            <button class="editTask">Edit Task</button>
            <button class="deleteTask">Delete Task</button>
          </li>`).join("")}
      </ul>
    `;

    // Add event listener for task form submission
    const taskForm = projectItem.querySelector(`#taskForm-${projectIndex}`);
    taskForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const taskTitle = document.getElementById(`taskTitle${projectIndex}`).value;
      const taskDescription = document.getElementById(`taskDescription${projectIndex}`).value;
      const taskDueDate = document.getElementById(`taskDueDate${projectIndex}`).value;
      const taskStatus = document.getElementById(`taskStatus${projectIndex}`).value;
      saveTask(projectIndex, taskTitle, taskDescription, taskDueDate, taskStatus);
    });

    // Add event listeners for task editing and deletion
    const taskItems = projectItem.querySelectorAll(".task");
    taskItems.forEach((taskItem, taskIndex) => {
      const editTaskButton = taskItem.querySelector(".editTask");
      editTaskButton.addEventListener("click", function () {
        const taskTitle = prompt("Enter new task title:", taskItem.querySelector("h4").innerText);
        const taskDescription = prompt("Enter new task description:", taskItem.querySelector("p").innerText);
        const taskDueDate = prompt("Enter new task due date:", taskItem.querySelector("p:nth-of-type(2)").innerText.split(": ")[1]);
        const taskStatus = prompt("Enter new task status:", taskItem.querySelector("p:nth-of-type(3)").innerText.split(": ")[1]);

        if (taskTitle && taskDescription && taskDueDate && taskStatus) {
          updateTask(projectIndex, taskIndex, taskTitle, taskDescription, taskDueDate, taskStatus);
        }
      });

      const deleteTaskButton = taskItem.querySelector(".deleteTask");
      deleteTaskButton.addEventListener("click", function () {
        deleteTask(projectIndex, taskIndex);
      });
    });

    // Event listener for deleting a project
    const deleteProjectButton = projectItem.querySelector(".deleteProject");
    deleteProjectButton.addEventListener("click", function () {
      deleteProject(projectIndex);
    });

    return projectItem;
  }

  // Function to save a new project
  function saveProject(title) {
    const users = getUsersFromLocalStorage();
    const loggedInUserId = getLoggedInUserId();
    let loggedInUser = getUserById(users, loggedInUserId);

    loggedInUser.projects.push({ title, tasks: [] });
    saveUsersToLocalStorage(users);
    addHistory(`Project "${title}" created`); // Log history for project creation
    loadProjects(); // Reload projects after saving project
  }

  // Function to save a task
  function saveTask(projectIndex, title, description, dueDate, status) {
    const users = getUsersFromLocalStorage();
    let loggedInUser = getUserById(users, getLoggedInUserId());

    if (loggedInUser.projects[projectIndex]) {
      loggedInUser.projects[projectIndex].tasks.push({ title, description, dueDate, status });
      saveUsersToLocalStorage(users);
      addHistory(`Task "${title}" added to project "${loggedInUser.projects[projectIndex].title}"`); // Log history for task creation
      loadProjects(); // Reload projects after saving task
    }
  }

  // Function to update a task
  function updateTask(projectIndex, taskIndex, title, description, dueDate, status) {
    const users = getUsersFromLocalStorage();
    let loggedInUser = getUserById(users, getLoggedInUserId());

    if (loggedInUser.projects[projectIndex] && loggedInUser.projects[projectIndex].tasks[taskIndex]) {
      loggedInUser.projects[projectIndex].tasks[taskIndex] = { title, description, dueDate, status };
      saveUsersToLocalStorage(users);
      addHistory(`Updated task "${title}" in project "${loggedInUser.projects[projectIndex].title}"`); // Log history for task update
      loadProjects(); // Reload projects after updating task
    }
  }

  // Function to delete a task
  function deleteTask(projectIndex, taskIndex) {
    const users = getUsersFromLocalStorage();
    let loggedInUser = getUserById(users, getLoggedInUserId());

    if (loggedInUser.projects[projectIndex] && loggedInUser.projects[projectIndex].tasks[taskIndex]) {
      loggedInUser.projects[projectIndex].tasks.splice(taskIndex, 1);
      saveUsersToLocalStorage(users);
      addHistory(`Deleted task from project "${loggedInUser.projects[projectIndex].title}"`); // Log history for task deletion
      loadProjects(); // Reload projects after deleting task
    }
  }

  // Function to delete a project
  function deleteProject(projectIndex) {
    const users = getUsersFromLocalStorage();
    let loggedInUser = getUserById(users, getLoggedInUserId());

    if (loggedInUser.projects[projectIndex]) {
      addHistory(`Deleted project "${loggedInUser.projects[projectIndex].title}"`); // Log history for project deletion
      loggedInUser.projects.splice(projectIndex, 1);
      saveUsersToLocalStorage(users);
      loadProjects(); // Reload projects after deleting project
    }
  }

  // Function to add history entry
  function addHistory(action) {
    const users = getUsersFromLocalStorage();
    const loggedInUserId = getLoggedInUserId();
    let loggedInUser = getUserById(users, loggedInUserId);

    const now = new Date();
    const formattedDate = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;

    if (!loggedInUser.history) {
      loggedInUser.history = [];
    }

    loggedInUser.history.unshift({
      action,
      date: formattedDate
    });

    saveUsersToLocalStorage(users);
    loadHistory(); // Reload history after adding new entry
  }

  // Function to load history for the logged-in user
  function loadHistory() {
    const users = getUsersFromLocalStorage();
    const loggedInUserId = getLoggedInUserId();
    let loggedInUser = getUserById(users, loggedInUserId);
    const historyList = document.getElementById("historyList");

    historyList.innerHTML = ""; // Clear existing history

    if (loggedInUser && loggedInUser.history) {
      loggedInUser.history.forEach((entry) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${entry.action}</td>
          <td class="date">${entry.date}</td>
        `;
        historyList.appendChild(row);
      });
    }
  }

  // Function to get users from local storage
  function getUsersFromLocalStorage() {
    return JSON.parse(localStorage.getItem("users")) || [];
  }

  // Function to save users to local storage
  function saveUsersToLocalStorage(users) {
    localStorage.setItem("users", JSON.stringify(users));
  }

  // Function to get logged-in user ID from local storage
  function getLoggedInUserId() {
    return JSON.parse(localStorage.getItem("loggedInUser"));
  }

  // Function to get user by ID from users array
  function getUserById(users, userId) {
    return users.find(user => user.id === userId);
  }

  // Event listener for project form submission
  const projectForm = document.getElementById("projectForm");
  projectForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const title = document.getElementById("projectTitle").value;
    if (title) {
      saveProject(title);
    }
  });

  // Event listener for logout button
  document.getElementById("logout").addEventListener("click", function () {
    addHistory("Logged out"); // Log history for logout
    localStorage.removeItem("loggedInUser");
    window.location.href = "homepage.html"; // Redirect to homepage on logout
  });

  // Toggle dark mode based on switch mode checkbox
  const switchMode = document.getElementById("switch-mode");
  switchMode.addEventListener("change", function () {
    document.body.classList.toggle("dark");
    localStorage.setItem("darkMode", switchMode.checked ? "enabled" : "disabled");
  });

  // Check local storage for dark mode preference
  const darkModeSetting = localStorage.getItem("darkMode");
  if (darkModeSetting === "enabled") {
    switchMode.checked = true;
    document.body.classList.add("dark");
  } else {
    switchMode.checked = false;
    document.body.classList.remove("dark");
  }

  // Toggle sidebar visibility on burger menu click
  const menuBar = document.querySelector("#content nav .bx.bx-menu");
  const sidebar = document.getElementById("sidebar");

  menuBar.addEventListener("click", function () {
    sidebar.classList.toggle("hide");
  });

  // Close sidebar when clicking outside of it (if opened)
  document.addEventListener("click", function (event) {
    if (!event.target.closest("#sidebar") && !event.target.closest("#content nav .bx.bx-menu")) {
      sidebar.classList.add("hide");
    }
  });

  // Toggle search form visibility and button icon on smaller screens
  const searchButton = document.querySelector("#content nav form .form-input button");
  const searchButtonIcon = document.querySelector("#content nav form .form-input button .bx");
  const searchForm = document.querySelector("#content nav form");

  searchButton.addEventListener("click", function () {
    if (window.innerWidth < 768) {
      searchForm.classList.toggle("show");
      searchButtonIcon.classList.toggle("bx-search");
      searchButtonIcon.classList.toggle("bx-x");
    }
  });

  // Reset search form and icon when window size changes to desktop view
  window.addEventListener("resize", function () {
    if (this.innerWidth >= 768) {
      searchForm.classList.remove("show");
      searchButtonIcon.classList.remove("bx-x");
      searchButtonIcon.classList.add("bx-search");
    }
  });

  // Initial load of projects and history
  loadProjects();
  loadHistory();

  
});




















        let projectList = document.getElementById("projectList");
        let projectForm = document.getElementById("projectForm");
        let historyTable = document.getElementById("historyList");

        let projectsCount = 0;

        // Chart data initialization
        let chartData = {
            labels: ['To-Do', 'In Progress', 'Completed'],
            datasets: [{
                label: 'Task Status',
                data: [0, 0, 0],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(75, 192, 192, 0.7)'
                ],
                hoverOffset: 4
            }]
        };

        function calculatePercentage() {
            let totalTasks = chartData.datasets[0].data.reduce((total, currentValue) => total + currentValue, 0);
            let percentages = chartData.datasets[0].data.map(value => totalTasks === 0 ? 0 : Math.round((value / totalTasks) * 100));
            return percentages;
        }

        const ctx = document.getElementById('myPieChart').getContext('2d');

        let myPieChart = new Chart(ctx, {
            type: 'pie',
            data: chartData,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                let label = tooltipItem.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += tooltipItem.raw.toLocaleString() + ' tasks';
                                return label;
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Tasks Status'
                    }
                },
                layout: {
                    padding: 10
                }
            }
        });

        function updateChartData() {
            let users = JSON.parse(localStorage.getItem("users"));
            let loggedInUser = users.find((user) => user.id == JSON.parse(localStorage.getItem("loggedInUser")));

            let overallStatusCounter = { "To-Do": 0, "In Progress": 0, "Completed": 0 };

            loggedInUser.projects.forEach((project) => {
                overallStatusCounter["To-Do"] += project.taskStatusCounter["To-Do"];
                overallStatusCounter["In Progress"] += project.taskStatusCounter["In Progress"];
                overallStatusCounter["Completed"] += project.taskStatusCounter["Completed"];
            });

            chartData.datasets[0].data[0] = overallStatusCounter["To-Do"];
            chartData.datasets[0].data[1] = overallStatusCounter["In Progress"];
            chartData.datasets[0].data[2] = overallStatusCounter["Completed"];

            let percentages = calculatePercentage();

            myPieChart.options.plugins.tooltip.callbacks.label = function(tooltipItem) {
                let label = tooltipItem.label || '';
                if (label) {
                    label += ': ';
                }
                label += tooltipItem.raw.toLocaleString() + ' tasks';
                label += ' (' + percentages[tooltipItem.dataIndex] + '%)';
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
                    let taskStatusCounter = { "To-Do": 0, "In Progress": 0, "Completed": 0 };
                    
                    project.tasks.forEach(task => {
                        taskStatusCounter[task.status]++;
                    });

                    project.taskStatusCounter = taskStatusCounter;
                    let projectItem = Project(project, projectIndex);
                    projectList.appendChild(projectItem);
                });

                localStorage.setItem("users", JSON.stringify(users));
            }

            updateChartData();
        }

        function Project(project, projectIndex) {
            let projectItem = document.createElement("li");
            projectItem.className = "project";
            projectItem.innerHTML = `
            <div id="container">
              <div id="pro_div">
                <h3 id="h3">${project.title}</h3>
                <p>To-Do: ${project.taskStatusCounter["To-Do"]}</p>
                <p>In Progress: ${project.taskStatusCounter["In Progress"]}</p>
                <p>Completed: ${project.taskStatusCounter["Completed"]}</p>
                <button class="deleteProject">Delete Project</button>
              </div>
              <form class="taskForm">
                <input type="text" id="taskTitle${projectIndex}" placeholder="Task Title" required>
                <textarea id="taskDescription${projectIndex}" placeholder="Task Description" required></textarea>
                <input type="date" id="taskDueDate${projectIndex}" required>
                <select id="taskStatus${projectIndex}" required>
                  <option value="To-Do">To-Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                <button type="submit">Add Task</button>
              </form>
              <div id="task_list_div" class="taskList">
                <ul>
                  ${project.tasks.map((task, taskIndex) => `
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
                      </div>
                    </li>
                  `).join("")}
                </ul>
              </div>
            </div>
          `;

            let taskForm = projectItem.querySelector(".taskForm");
            taskForm.addEventListener("submit", function (event) {
                event.preventDefault();
                let taskTitle = document.getElementById(`taskTitle${projectIndex}`).value;
                let taskDescription = document.getElementById(`taskDescription${projectIndex}`).value;
                let taskDueDate = document.getElementById(`taskDueDate${projectIndex}`).value;
                let taskStatus = document.getElementById(`taskStatus${projectIndex}`).value;
                saveTask(projectIndex, taskTitle, taskDescription, taskDueDate, taskStatus);
            });

            let taskItems = projectItem.querySelectorAll(".task");
            taskItems.forEach((taskItem, taskIndex) => {
                let editTaskButton = taskItem.querySelector(".editTask");
                editTaskButton.addEventListener("click", function () {
                    const taskContent = taskItem.querySelector(".taskContent");
                    const editForm = document.createElement("form");

                    editForm.innerHTML = `
                    <input type="text" value="${taskItem.querySelector("h4").innerText}" required>
                    <textarea required>${taskItem.querySelector("p:nth-of-type(1)").innerText}</textarea>
                    <input type="date" value="${taskItem.querySelector("p:nth-of-type(2)").innerText.split(": ")[1]}" required>
                    <select required>
                      <option value="To-Do" ${taskItem.querySelector("p:nth-of-type(3)").innerText.split(": ")[1] === "To-Do" ? "selected" : ""}>To-Do</option>
                      <option value="In Progress" ${taskItem.querySelector("p:nth-of-type(3)").innerText.split(": ")[1] === "In Progress" ? "selected" : ""}>In Progress</option>
                      <option value="Completed" ${taskItem.querySelector("p:nth-of-type(3)").innerText.split(": ")[1] === "Completed" ? "selected" : ""}>Completed</option>
                    </select>
                    <button type="submit">Save</button>
                  `;

                    taskContent.replaceWith(editForm);

                    editForm.addEventListener("submit", function (event) {
                        event.preventDefault();
                        const [title, description, dueDate, status] = editForm.elements;

                        saveTask(projectIndex, title.value, description.value, dueDate.value, status.value, taskIndex);
                    });
                });

                let deleteTaskButton = taskItem.querySelector(".deleteTask");
                deleteTaskButton.addEventListener("click", function () {
                    deleteTask(projectIndex, taskIndex);
                });
            });

            let deleteProjectButton = projectItem.querySelector(".deleteProject");
            deleteProjectButton.addEventListener("click", function () {
                deleteProject(projectIndex);
            });

            return projectItem;
        }

        function saveTask(projectIndex, title, description, dueDate, status, taskIndex = null) {
            let users = JSON.parse(localStorage.getItem("users"));
            let loggedInUser = users.find((user) => user.id == JSON.parse(localStorage.getItem("loggedInUser")));
            let project = loggedInUser.projects[projectIndex];

            if (taskIndex === null) {
                project.tasks.push({ title, description, dueDate, status });
            } else {
                let oldStatus = project.tasks[taskIndex].status;
                project.tasks[taskIndex] = { title, description, dueDate, status };
                project.taskStatusCounter[oldStatus]--;
            }

            project.taskStatusCounter[status]++;

            localStorage.setItem("users", JSON.stringify(users));
            loadProjects();
            addToHistory(`Added/Edited task "${title}" in project "${project.title}"`);
        }

        function deleteTask(projectIndex, taskIndex) {
            let users = JSON.parse(localStorage.getItem("users"));
            let loggedInUser = users.find((user) => user.id == JSON.parse(localStorage.getItem("loggedInUser")));
            let project = loggedInUser.projects[projectIndex];

            let oldStatus = project.tasks[taskIndex].status;
            project.tasks.splice(taskIndex, 1);
            project.taskStatusCounter[oldStatus]--;

            localStorage.setItem("users", JSON.stringify(users));
            loadProjects();
            addToHistory(`Deleted task from project "${project.title}"`);
        }

        function deleteProject(projectIndex) {
            let users = JSON.parse(localStorage.getItem("users"));
            let loggedInUser = users.find((user) => user.id == JSON.parse(localStorage.getItem("loggedInUser")));

            let projectTitle = loggedInUser.projects[projectIndex].title;
            loggedInUser.projects.splice(projectIndex, 1);

            localStorage.setItem("users", JSON.stringify(users));
            loadProjects();
            addToHistory(`Deleted project "${projectTitle}"`);
        }

        function saveProject(title) {
            let users = JSON.parse(localStorage.getItem("users"));
            let loggedInUser = users.find((user) => user.id == JSON.parse(localStorage.getItem("loggedInUser")));

            loggedInUser.projects.push({ title, tasks: [], taskStatusCounter: { "To-Do": 0, "In Progress": 0, "Completed": 0 } });
            projectsCount++;
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

        let users = localStorage.getItem("users");
        let loggedInUserId = localStorage.getItem("loggedInUser");
        let usersArray = JSON.parse(users);
        let loggedInUser = usersArray.find((user) => user.id == loggedInUserId);
        let firstName = loggedInUser.firstName;
        const firstNameDisplay = document.getElementById("firstNameDisplay");
        firstNameDisplay.textContent = firstName;

        document.getElementById("logout").addEventListener("click", () => {
            localStorage.removeItem("loggedInUser");
            window.location.href = "homepage.html";
        });

        function addToHistory(message) {
            // Implementation for adding to history
        }

