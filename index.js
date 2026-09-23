// Credentials
const VALID_EMAIL = "harshsuryavanshi@dev.in";
const VALID_PASS = "HarshDev@0123456789";

// Default Dataset
const initialTasks = [
  { id: 1, text: "Review pull requests for RO Helper platform", category: "Dev", priority: "High", completed: false },
  { id: 2, text: "Design updated dashboard layout", category: "Work", priority: "Medium", completed: true },
  { id: 3, text: "Configure SendGrid SMTP authentication", category: "Dev", priority: "High", completed: false },
  { id: 4, text: "Update client documentation for Intelli Assess", category: "Work", priority: "Low", completed: false }
];

// Elements
const authScreen = document.querySelector("#auth-screen");
const appScreen = document.querySelector("#app-screen");
const loginForm = document.querySelector("#login-form");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const authError = document.querySelector("#auth-error");
const logoutBtn = document.querySelector("#logout-btn");

const submitEle = document.querySelector("#submit");
const textEle = document.querySelector("#text");
const categoryEle = document.querySelector("#task-category");
const priorityEle = document.querySelector("#task-priority");
const t1Ele = document.querySelector("#t1");
const emptyState = document.querySelector("#empty-state");

const statTotal = document.querySelector("#stat-total");
const statCompleted = document.querySelector("#stat-completed");
const statPending = document.querySelector("#stat-pending");
const currentDateEle = document.querySelector("#current-date");

let tasks = [];

// Init Date
currentDateEle.textContent = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

// Auth Handlers
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (emailInput.value.trim() === VALID_EMAIL && passwordInput.value === VALID_PASS) {
    localStorage.setItem("isLoggedIn", "true");
    showApp();
  } else {
    authError.textContent = "Invalid email or password.";
  }
});

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("isLoggedIn");
  showAuth();
});

function checkAuthStatus() {
  if (localStorage.getItem("isLoggedIn") === "true") {
    showApp();
  } else {
    showAuth();
  }
}

function showApp() {
  authScreen.classList.replace("screen-active", "screen-hidden");
  appScreen.classList.replace("screen-hidden", "screen-active");
  loadTasks();
}

function showAuth() {
  appScreen.classList.replace("screen-active", "screen-hidden");
  authScreen.classList.replace("screen-hidden", "screen-active");
}

// Task Handlers
submitEle.addEventListener("click", addTask);
textEle.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

function addTask() {
  const textVal = textEle.value.trim();
  if (!textVal) return alert("Please enter a task description!");

  const newTask = {
    id: Date.now(),
    text: textVal,
    category: categoryEle.value,
    priority: priorityEle.value,
    completed: false
  };

  tasks.unshift(newTask);
  saveTasks();
  renderTasks();
  textEle.value = "";
}

function toggleTask(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  saveTasks();
  renderTasks();
}

function deleteTask(id, element) {
  if (element) {
    element.classList.add("removing");
    setTimeout(() => {
      tasks = tasks.filter(t => t.id !== id);
      saveTasks();
      renderTasks();
    }, 200);
  } else {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
  }
}

function saveTasks() {
  localStorage.setItem("taskflow_data", JSON.stringify(tasks));
}

function loadTasks() {
  const saved = localStorage.getItem("taskflow_data");
  tasks = saved ? JSON.parse(saved) : [...initialTasks];
  renderTasks();
}

function renderTasks() {
  t1Ele.innerHTML = "";

  tasks.forEach(task => {
    const item = document.createElement("div");
    item.className = `task-item ${task.completed ? 'completed' : ''}`;

    item.innerHTML = `
      <div class="task-content">
        <div class="task-checkbox"><i class="fa-solid fa-check"></i></div>
        <span class="task-text">${escapeHtml(task.text)}</span>
      </div>
      <div class="task-meta">
        <span class="tag tag-cat">${task.category}</span>
        <span class="tag priority-${task.priority.toLowerCase()}">${task.priority}</span>
        <i class="fa-solid fa-trash-can delete-btn"></i>
      </div>
    `;

    item.querySelector(".task-content").addEventListener("click", () => toggleTask(task.id));
    item.querySelector(".delete-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      deleteTask(task.id, item);
    });

    t1Ele.appendChild(item);
  });

  updateStats();
}

function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;

  statTotal.textContent = total;
  statCompleted.textContent = completed;
  statPending.textContent = pending;

  emptyState.style.display = total === 0 ? "block" : "none";
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, match => {
    const escapeMap = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return escapeMap[match];
  });
}

checkAuthStatus();