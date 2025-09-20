// Select elements
const taskInput = document.getElementById('taskInput');
const dueDate = document.getElementById('dueDate');
const priority = document.getElementById('priority');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const searchBox = document.getElementById('searchBox');
const filterStatus = document.getElementById('filterStatus');
const darkModeBtn = document.getElementById('darkModeBtn');

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Save to localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render tasks
function renderTasks() {
  taskList.innerHTML = '';
  const searchTerm = searchBox.value.toLowerCase();
  const filter = filterStatus.value;

  tasks.forEach((task, index) => {
    const matchesSearch = task.text.toLowerCase().includes(searchTerm);
    const matchesFilter =
      (filter === 'all') ||
      (filter === 'completed' && task.completed) ||
      (filter === 'pending' && !task.completed);

    if (matchesSearch && matchesFilter) {
      const li = document.createElement('li');
      li.setAttribute("priority", task.priority);

      li.innerHTML = `
        <div>
          <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${index})">
          <span contenteditable="true" onblur="editTask(${index}, this.innerText)" 
            style="text-decoration: ${task.completed ? 'line-through' : 'none'}">
            ${task.text}
          </span>
        </div>
        <small>📅 ${task.due || 'No date'} | ⚡ ${task.priority}</small>
        <div class="task-actions">
          <button onclick="deleteTask(${index})">❌</button>
        </div>
      `;

      taskList.appendChild(li);
    }
  });
  updateProgress();
}

// Add new task
addTaskBtn.addEventListener('click', () => {
  if (taskInput.value.trim() === '') return;

  const newTask = {
    text: taskInput.value,
    completed: false,
    due: dueDate.value,
    priority: priority.value
  };

  tasks.push(newTask);
  taskInput.value = '';
  dueDate.value = '';
  saveTasks();
  renderTasks();
});

// Toggle complete
function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

// Edit task
function editTask(index, newText) {
  tasks[index].text = newText;
  saveTasks();
  renderTasks();
}

// Delete task
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

// Progress
function updateProgress() {
  let completed = tasks.filter(t => t.completed).length;
  let total = tasks.length;
  let percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  
  progressBar.value = percent;
  progressText.textContent = `${percent}% completed`;
}

// Filters
searchBox.addEventListener('input', renderTasks);
filterStatus.addEventListener('change', renderTasks);

// Dark Mode
darkModeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('darkMode', document.body.classList.contains('dark'));
});

// Load saved preference
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark');
}

// Initial render
renderTasks();
