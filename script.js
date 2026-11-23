const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");

const searchInput = document.getElementById("searchInput");
const filterStatus = document.getElementById("filterStatus");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");
const productivity = document.getElementById("productivity");

const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

const themeToggle = document.getElementById("themeToggle");
const toast = document.getElementById("toast");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

/* ==========================
   SAVE LOCAL STORAGE
========================== */

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* ==========================
   TOAST MESSAGE
========================== */

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

/* ==========================
   UPDATE DASHBOARD
========================== */

function updateDashboard() {

    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed
    ).length;

    const pending = total - completed;

    const progress =
        total === 0
        ? 0
        : Math.round(
            (completed / total) * 100
        );

    totalTasks.textContent = total;
    completedTasks.textContent = completed;
    pendingTasks.textContent = pending;

    productivity.textContent =
        progress + "%";

    progressFill.style.width =
        progress + "%";

    progressText.textContent =
        progress + "% Completed";
}

/* ==========================
   ADD TASK
========================== */

taskForm.addEventListener("submit", function(e){

    e.preventDefault();

    const title =
        document.getElementById("taskInput").value;

    const description =
        document.getElementById("taskDescription").value;

    const category =
        document.getElementById("category").value;

    const priority =
        document.getElementById("priority").value;

    const dueDate =
        document.getElementById("dueDate").value;

    const task = {

        id: Date.now(),

        title,
        description,
        category,
        priority,
        dueDate,

        completed:false
    };

    tasks.unshift(task);

    saveTasks();

    renderTasks();

    updateDashboard();

    taskForm.reset();

    showToast("✅ Task Added");
});

/* ==========================
   DELETE TASK
========================== */

function deleteTask(id){

    if(!confirm("Delete this task?"))
        return;

    tasks = tasks.filter(
        task => task.id !== id
    );

    saveTasks();

    renderTasks();

    updateDashboard();

    showToast("🗑 Task Deleted");
}

/* ==========================
   COMPLETE TASK
========================== */

function toggleTask(id){

    tasks = tasks.map(task => {

        if(task.id === id){

            task.completed =
            !task.completed;
        }

        return task;
    });

    saveTasks();

    renderTasks();

    updateDashboard();

    showToast("✅ Status Updated");
}

/* ==========================
   EDIT TASK
========================== */

function editTask(id){

    const task =
    tasks.find(
        item => item.id === id
    );

    const updatedTitle =
    prompt(
        "Edit Task Name",
        task.title
    );

    if(!updatedTitle)
        return;

    task.title = updatedTitle;

    saveTasks();

    renderTasks();

    updateDashboard();

    showToast("✏️ Task Updated");
}

/* ==========================
   RENDER TASKS
========================== */

function renderTasks(){

    let search =
    searchInput.value.toLowerCase();

    let filter =
    filterStatus.value;

    let filteredTasks =
    tasks.filter(task => {

    const matchesSearch =
    task.title
    .toLowerCase()
    .includes(search);

    const matchesFilter =

    filter === "all"
    ||
    (filter === "completed"
    && task.completed)
    ||
    (filter === "pending"
    && !task.completed);

    return matchesSearch &&
           matchesFilter;

    });

    taskList.innerHTML = "";

    if(filteredTasks.length === 0){

        taskList.innerHTML =
        `
        <div class="task-card">
            <div>
                <h3>🎉 No Tasks Found</h3>
                <p>Add some tasks to get started.</p>
            </div>
        </div>
        `;

        return;
    }

    filteredTasks.forEach(task => {

        let priorityClass = "";

        if(task.priority === "High")
            priorityClass = "high";

        if(task.priority === "Medium")
            priorityClass = "medium";

        if(task.priority === "Low")
            priorityClass = "low";

        const taskCard =
        document.createElement("div");

        taskCard.className =
        task.completed
        ? "task-card completed-task"
        : "task-card";

        taskCard.innerHTML =
        `
        <div class="task-left">

            <h3>${task.title}</h3>

            <p>
                ${task.description || ""}
            </p>

            <div class="task-meta">

                <span class="tag category">
                    ${task.category}
                </span>

                <span class="tag ${priorityClass}">
                    ${task.priority}
                </span>

                <span class="tag">
                    📅 ${task.dueDate || "No Date"}
                </span>

            </div>

        </div>

        <div class="task-actions">

            <button
                class="task-btn complete-btn"
                onclick="toggleTask(${task.id})">

                <i class="fa-solid fa-check"></i>

            </button>

            <button
                class="task-btn edit-btn"
                onclick="editTask(${task.id})">

                <i class="fa-solid fa-pen"></i>

            </button>

            <button
                class="task-btn delete-btn"
                onclick="deleteTask(${task.id})">

                <i class="fa-solid fa-trash"></i>

            </button>

        </div>
        `;

        taskList.appendChild(taskCard);
    });
}

/* ==========================
   SEARCH
========================== */

searchInput.addEventListener(
    "input",
    renderTasks
);

/* ==========================
   FILTER
========================== */

filterStatus.addEventListener(
    "change",
    renderTasks
);

/* ==========================
   THEME
========================== */

const currentTheme = localStorage.getItem("theme");

const icon = themeToggle.querySelector("i");

if(currentTheme === "light"){

    document.body.classList.add("light");

    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");

}else{

    icon.classList.remove("fa-sun");
    icon.classList.add("fa-moon");
}

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("light");

    if(document.body.classList.contains("light")){

        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");

        localStorage.setItem("theme","light");

        showToast("☀️ Light Mode Enabled");

    }else{

        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");

        localStorage.setItem("theme","dark");

        showToast("🌙 Dark Mode Enabled");
    }
});



/* ==========================
   LOAD DATA
========================== */


renderTasks();
updateDashboard();