// script.js
document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    loadTasks();

    taskForm.addEventListener('submit', addTask);
    taskList.addEventListener('click', handleTaskClick);

    function addTask(event) {
        event.preventDefault();
        const taskText = taskInput.value.trim();
        if (taskText) {
            const task = {
                text: taskText,
                completed: false,
                id: new Date().getTime(),
            };
            addTaskToDOM(task);
            saveTask(task);
            taskInput.value = '';
        }
    }

    function handleTaskClick(event) {
        const item = event.target;
        const li = item.closest('li');
        const taskId = li.dataset.id;

        if (item.classList.contains('delete')) {
            deleteTask(taskId);
            li.remove();
        } else if (item.classList.contains('edit')) {
            const newText = prompt('Edit your task:', li.querySelector('.task-text').textContent);
            if (newText) {
                li.querySelector('.task-text').textContent = newText;
                editTask(taskId, newText);
            }
        } else if (item.classList.contains('task-text')) {
            toggleTaskCompleted(taskId, li);
        }
    }

    function addTaskToDOM(task) {
        const li = document.createElement('li');
        li.dataset.id = task.id;
        li.className = task.completed ? 'completed' : '';
        li.innerHTML = `
            <span class="task-text">${task.text}</span>
            <div>
                <button class="edit">Edit</button>
                <button class="delete">Delete</button>
            </div>
        `;
        taskList.appendChild(li);
    }

    function saveTask(task) {
        let tasks = getTasks();
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function getTasks() {
        return JSON.parse(localStorage.getItem('tasks')) || [];
    }

    function loadTasks() {
        const tasks = getTasks();
        tasks.forEach(addTaskToDOM);
    }

    function deleteTask(id) {
        let tasks = getTasks();
        tasks = tasks.filter(task => task.id !== Number(id));
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function editTask(id, newText) {
        let tasks = getTasks();
        tasks = tasks.map(task => task.id === Number(id) ? { ...task, text: newText } : task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function toggleTaskCompleted(id, li) {
        let tasks = getTasks();
        tasks = tasks.map(task => {
            if (task.id === Number(id)) {
                task.completed = !task.completed;
                li.classList.toggle('completed');
            }
            return task;
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});
