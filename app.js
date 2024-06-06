document.addEventListener('DOMContentLoaded', () => {
    //get elements
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const filters = document.querySelectorAll('#filters button');
    //get tasks from local storage if no tasks then make an empty array
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    // Initialize the current filter to 'all'
    let currentFilter = 'all';

    // Function to render tasks based on the current filter
    function renderTasks() {
        taskList.innerHTML = '';
        // Filter tasks based on the current filter
        const filteredTasks = tasks.filter(task => {
            if (currentFilter === 'completed') return task.completed;
            if (currentFilter === 'pending') return !task.completed;
            return true;
        });

        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task ${task.completed ? 'completed' : ''}`;
            // Set the task with its buttons
            li.innerHTML = `
                <span>${task.name}</span>
                <div>
                    <button class="edit">Edit</button>
                    <button class="delete">Delete</button>
                    <button class="complete">${task.completed ? 'Undo' : 'Complete'}</button>
                </div>
            `;
            taskList.appendChild(li);

            //  edit, delete, and complete buttons
            li.querySelector('.edit').addEventListener('click', () => editTask(task.id));
            li.querySelector('.delete').addEventListener('click', () => deleteTask(task.id));
            li.querySelector('.complete').addEventListener('click', () => toggleComplete(task.id));
        });
    }

    //  add a new task
    function addTask(name) {
        //initialize task
        const task = {
            id: Date.now(),
            name,
            completed: false,
        };
        // Add the new task to the tasks array that was retrived at the beginning of the code
        tasks.push(task);
        // Save the updated tasks array to local storage
        saveTasks();
        renderTasks();
    }

    //  edit task
    function editTask(id) {
        // ask the user for the new task name
        const newName = prompt('Edit task name:');
        // Find the task with the specified ID
        const task = tasks.find(task => task.id === id);
        // If the task is found and the new name is not empty
        if (task && newName) {
            // Update the task name
            task.name = newName;

            saveTasks();
            renderTasks();
        }
    }

    //  delete a task
    function deleteTask(id) {
        // Filter out the task with the specified ID
        tasks = tasks.filter(task => task.id !== id);

        saveTasks();
        renderTasks();
    }

    // toggle the completion status of a task
    function toggleComplete(id) {
        const task = tasks.find(task => task.id === id);
        // If the task is found
        if (task) {
            // Toggle the task's completion status
            task.completed = !task.completed;

            saveTasks();
            renderTasks();
        }
    }

    //  save tasks to local storage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    //  task form submission
    taskForm.addEventListener('submit', e => {
        e.preventDefault();
        const taskName = taskInput.value.trim(); // Get the task name from the input and trim whitespace
        if (taskName) {
            addTask(taskName); // Add the task if the name is not empty
            taskInput.value = ''; // Clear the input field
        }
    });

    // filter buttons
    filters.forEach(button => {
        button.addEventListener('click', () => {
            // Remove the 'active' class from all filter buttons
            filters.forEach(btn => btn.classList.remove('active'));
            // Add the 'active' class to the clicked button
            button.classList.add('active');
            // Update the current filter based on the button's data-filter attribute
            currentFilter = button.getAttribute('data-filter');

            renderTasks();
        });
    });

    renderTasks();
});
