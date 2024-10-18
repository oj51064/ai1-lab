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
    
        // Sprawdź, czy długość filtra jest mniejsza niż 2
        if (filter.length < 2) {
            tasks.forEach(task => {
                // Gdy długość filtra jest mniejsza niż 2, wyświetl wszystkie zadania i usuń podświetlenie
                const taskText = task.querySelector('.task-text');
                taskText.innerHTML = taskText.textContent;
                task.style.display = '';
            });
            return; // Zakończ funkcję, aby nie przetwarzać dalej
        }
    
        tasks.forEach(task => {
            const taskText = task.querySelector('.task-text');
            const text = taskText.textContent.toLowerCase();
    
            // Usuń poprzednie podświetlenia
            taskText.innerHTML = taskText.textContent;
    
            if (text.includes(filter)) {
                // Wyświetl zadanie
                task.style.display = '';
    
                // Podświetl fragment pasujący do filtra
                const startIndex = text.indexOf(filter);
                const endIndex = startIndex + filter.length;
                const originalText = taskText.textContent;
    
                taskText.innerHTML = `${originalText.substring(0, startIndex)}<span class="highlight">${originalText.substring(startIndex, endIndex)}</span>${originalText.substring(endIndex)}`;
            } else {
                // Ukryj zadanie, gdy nie pasuje do filtra
                task.style.display = 'none';
            }
        });
    });

    function addTask(text, deadline) {
        const taskItem = document.createElement('li');
    
        // Dodaj checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        taskItem.appendChild(checkbox);
    
        // Dodaj tekst zadania
        const taskText = document.createElement('span');
        taskText.textContent = text;
        taskText.className = 'task-text';
        taskItem.appendChild(taskText);
    
        // Dodaj datę zadania
        const taskDateSpan = document.createElement('span');
        taskDateSpan.textContent = deadline || 'Brak daty';
        taskItem.appendChild(taskDateSpan);
    
        // Obsługa edycji tekstu zadania
        taskText.addEventListener('click', () => startEdit(taskItem, text, deadline));
        taskDateSpan.addEventListener('click', () => startEdit(taskItem, text, deadline));
    
        // Dodaj przycisk usuwania
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Usuń';
        deleteButton.addEventListener('click', () => {
            taskItem.remove();
            saveTasks();
        });
        taskItem.appendChild(deleteButton);
    
        // Dodaj zadanie do listy
        taskList.appendChild(taskItem);
        saveTasks();
    }

    function startEdit(taskItem, currentText, currentDate) {
        // Ukryj aktualne elementy tekstowe
        const taskTextSpan = taskItem.querySelector('.task-text');
        const taskDateSpan = taskItem.querySelector('span:nth-child(3)');
        taskTextSpan.style.display = 'none';
        taskDateSpan.style.display = 'none';
    
        // Dodaj pole edycji tekstu
        const editText = document.createElement('input');
        editText.type = 'text';
        editText.value = currentText;
        editText.className = 'edit-text';
        taskItem.insertBefore(editText, taskTextSpan);
    
        // Dodaj pole edycji daty
        const editDate = document.createElement('input');
        editDate.type = 'date';
        editDate.value = currentDate ? new Date(currentDate).toISOString().slice(0, 10) : '';
        editDate.className = 'edit-date';
        taskItem.insertBefore(editDate, taskDateSpan);
    
        // Dodaj przycisk "Zapisz"
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Zapisz';
        saveButton.className = 'save-button';
        saveButton.addEventListener('click', () => {
            const newText = editText.value.trim();
            const newDate = editDate.value;
    
            if (newText.length < 3 || newText.length > 255) {
                alert('Zadanie musi mieć od 3 do 255 znaków.');
                return;
            }
    
            // Zapisz nowe wartości
            taskTextSpan.textContent = newText;
            taskDateSpan.textContent = newDate || 'Brak daty';
    
            // Usuń pola edycji i przycisk "Zapisz"
            editText.remove();
            editDate.remove();
            saveButton.remove();
    
            // Pokaż zaktualizowane elementy
            taskTextSpan.style.display = '';
            taskDateSpan.style.display = '';
    
            // Zapisz zmiany w localStorage
            saveTasks();
        });
    
        // Dodaj przycisk do elementu listy
        taskItem.appendChild(saveButton);
    }

    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(taskItem => {
            const text = taskItem.querySelector('.task-text').textContent;
            const date = taskItem.querySelector('span:nth-child(3)').textContent;
            tasks.push({ text, date });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => addTask(task.text, task.date));
    }
});