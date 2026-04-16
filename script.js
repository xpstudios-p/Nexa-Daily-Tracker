let xp = parseInt(localStorage.getItem("xp")) || 0;
let level = parseInt(localStorage.getItem("level")) || 1;

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let habits = JSON.parse(localStorage.getItem("habits")) || [];
let events = JSON.parse(localStorage.getItem("events")) || [];

updateXP();
renderTasks();
renderHabits();
renderEvents();

/* NAV */
function show(id) {
  document.querySelectorAll(".page").forEach((p) => p.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

/* TASKS */
function addTask() {
  let t = document.getElementById("taskInput").value;
  if (!t) return;

  tasks.push(t);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  xp += 10;
  updateXP();
  renderTasks();
}

function renderTasks() {
  let list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach((t, i) => {
    let li = document.createElement("li");
    li.innerText = "📝 " + t;

    li.onclick = () => {
      tasks.splice(i, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      xp += 20;
      updateXP();
      renderTasks();
    };

    list.appendChild(li);
  });
}

/* HABITS */
function addHabit() {
  let h = document.getElementById("habitInput").value;
  if (!h) return;

  habits.push({ name: h, streak: 0 });
  localStorage.setItem("habits", JSON.stringify(habits));

  renderHabits();
}

function renderHabits() {
  let box = document.getElementById("habitList");
  box.innerHTML = "";

  habits.forEach((h, i) => {
    let div = document.createElement("div");
    div.innerHTML = `
      🔥 ${h.name} | Streak: ${h.streak}
      <button onclick="grow(${i})">Done</button>
    `;
    box.appendChild(div);
  });
}

function grow(i) {
  habits[i].streak++;
  localStorage.setItem("habits", JSON.stringify(habits));

  xp += 15;
  updateXP();
  renderHabits();
}

/* CALENDAR */
function saveEvent() {
  let date = document.getElementById("datePick").value;
  let time = document.getElementById("eventTime").value;
  let text = document.getElementById("eventText").value;

  if (!date || !text) return;

  let e = { date, time, text };
  events.push(e);

  localStorage.setItem("events", JSON.stringify(events));

  schedule(e);
  renderEvents();
  xp += 15;
  updateXP();
}

function renderEvents() {
  let box = document.getElementById("events");
  box.innerHTML = "";

  events.forEach((e) => {
    box.innerHTML += `
      📅 ${e.date} ${e.time || ""} - ${e.text}<br>
    `;
  });
}

/* SMART REMINDER */
function schedule(e) {
  let t = new Date(`${e.date}T${e.time || "00:00"}`);
  let now = new Date();
  let diff = t - now;

  if (diff > 0) {
    setTimeout(() => {
      alert("⏰ NEXA Reminder: " + e.text);
    }, diff);
  }
}

/* 🤖 PIXEL AI (SMARTER) */
function send() {
  let input = document.getElementById("chatInput");
  let box = document.getElementById("chatBox");

  let msg = input.value;
  if (!msg) return;

  box.innerHTML += `<p><b>You:</b> ${msg}</p>`;

  let reply = "I am Pixel AI, your assistant.";

  if (msg.includes("stress"))
    reply = "Break tasks into small wins. Focus one step.";
  if (msg.includes("lazy"))
    reply = "Start with 2 minutes. Momentum will follow.";
  if (msg.includes("task")) reply = "Do the hardest task first.";
  if (msg.includes("hello")) reply = "Hey, I’m Pixel AI ⚡ ready to help.";

  box.innerHTML += `<p><b>Pixel AI:</b> ${reply}</p>`;

  input.value = "";
  box.scrollTop = box.scrollHeight;
}

/* XP SYSTEM */
function updateXP() {
  if (xp >= 100) {
    level++;
    xp = 0;
  }

  localStorage.setItem("xp", xp);
  localStorage.setItem("level", level);

  document.getElementById("level").innerText = "Level " + level;
  document.getElementById("xpBar").style.width = xp + "%";
}
let score = 0;
let gameRunning = false;
let activeIndex = -1;
let gameTimer;

/* BUILD GRID */
function buildGrid() {
  const grid = document.getElementById("grid");
  grid.innerHTML = "";

  for (let i = 0; i < 9; i++) {
    const div = document.createElement("div");
    div.classList.add("cell");

    div.onclick = () => hitCell(i);

    grid.appendChild(div);
  }
}

buildGrid();

/* START GAME */
function startGame() {
  score = 0;
  gameRunning = true;

  document.getElementById("gameInfo").innerText = "Score: 0";

  gameTimer = setTimeout(endGame, 30000);

  spawn();
}

/* SPAWN ACTIVE CELL */
function spawn() {
  if (!gameRunning) return;

  const cells = document.querySelectorAll(".cell");

  cells.forEach((c) => c.classList.remove("active"));

  activeIndex = Math.floor(Math.random() * 9);

  cells[activeIndex].classList.add("active");

  setTimeout(spawn, 800);
}

/* HIT CELL */
function hitCell(i) {
  if (!gameRunning) return;

  if (i === activeIndex) {
    score += 1;

    xp += 5; // integrate with your tracker
    updateXP();

    document.getElementById("gameInfo").innerText = "Score: " + score;
  }
}

/* END GAME */
function endGame() {
  gameRunning = false;

  document
    .querySelectorAll(".cell")
    .forEach((c) => c.classList.remove("active"));

  alert("Game Over! Score: " + score);
}
