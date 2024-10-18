document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const taskDate = document.getElementById('taskDate');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');
    const search = document.getElementById('search');

    loadTasks();

    addTaskButton.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        const taskDeadline = taskDate.value;

        if (taskText.length < 3 || taskText.length > 255) {
            alert('Zadanie musi mieć od 3 do 255 znaków.');
            return;
        }
        if (taskDeadline && new Date(taskDeadline) < new Date()) {
            alert('Data musi być przyszła lub pusta.');
            return;
        }

        addTask(taskText, taskDeadline);
        taskInput.value = '';
        taskDate.value = '';
    });

    search.addEventListener('input', () => {
        const filter = search.value.toLowerCase();
        const tasks = taskList.querySelectorAll('li');
        tasks.forEach(task => {
            const text = task.querySelector('.task-text').textContent.toLowerCase();
            task.style.display = text.includes(filter) ? '' : 'none';
        });
    });

    function addTask(text, deadline) {
        const taskItem = document.createElement('li');
        const taskText = document.createElement('span');
        taskText.textContent = text;
        taskText.className = 'task-text';
        taskItem.appendChild(taskText);

        const taskDateSpan = document.createElement('span');
        taskDateSpan.textContent = deadline || 'Brak daty';
        taskItem.appendChild(taskDateSpan);

        taskText.addEventListener('click', () => {
            const editText = prompt('Edytuj zadanie:', taskText.textContent);
            if (editText && editText.length >= 3 && editText.length <= 255) {
                taskText.textContent = editText;
                saveTasks();
            }
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Usuń';
        deleteButton.addEventListener('click', () => {
            taskItem.remove();
            saveTasks();
        });
        taskItem.appendChild(deleteButton);

        taskList.appendChild(taskItem);
        saveTasks();
    }

    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(taskItem => {
            const text = taskItem.querySelector('.task-text').textContent;
            const date = taskItem.querySelector('span:nth-child(2)').textContent;
            tasks.push({ text, date });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => addTask(task.text, task.date));
    }
});