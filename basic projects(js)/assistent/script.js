// ===============================
// 1. GET HTML ELEMENTS
// ===============================

const form = document.getElementById('taskform');
const taskInput = document.getElementById('taskInput');
const priority = document.getElementById('priority');
const deadline = document.getElementById('deadline');


// ===============================
// 2. MAIN TASK ARRAY
// ===============================

// All tasks will be stored inside this array
let tasks = [];


// ===============================
// 3. CURRENT FILTER
// ===============================

// This stores which filter is currently selected
//
// Possible values:
// "all"
// "pending"
// "completed"
// "overdue"

let currentFilter = "all";


// ===============================
// 4. ADD NEW TASK
// ===============================

form.addEventListener('submit', function(event) {

    // Prevent the form from refreshing the page
    event.preventDefault();

    // Create a new task object
    const newTask = {

        // Generate a unique ID for the task
        id: crypto.randomUUID(),

        // Get task title from input
        title: taskInput.value,

        // Get priority from select box
        priority: priority.value,

        // Get deadline from date input
        deadline: deadline.value,

        // New tasks are incomplete by default
        completed: false
    };

    // Add the new task to the tasks array
    tasks.push(newTask);

    // Save updated tasks to localStorage
    saveTask();

    // Display the tasks
    renderTask();

    // Clear the input fields
    taskInput.value = "";
    deadline.value = "";

    console.log(tasks);
});


// ===============================
// 5. RENDER TASKS
// ===============================

function renderTask() {

    // Get the <ul> where tasks will be displayed
    const tasklist = document.getElementById('tasklist');

    // Clear the old task list
    tasklist.innerHTML = "";


    // --------------------------------
    // FILTER TASKS
    // --------------------------------

    // Create a new array containing only
    // the tasks that should currently be displayed

    const visibleTasks = tasks.filter(function(task) {

        // If "all" is selected,
        // display every task
        if (currentFilter === "all") {
            return true;
        }

        // Otherwise, check the task's status
        // against the selected filter
        return getTaskStatus(task) === currentFilter;
    });


    // --------------------------------
    // DISPLAY FILTERED TASKS
    // --------------------------------

    // Loop through visibleTasks, NOT tasks
    for (let i = 0; i < visibleTasks.length; i++) {

        // Get the current task
        const task = visibleTasks[i];


        // Create <li> element
        const li = document.createElement('li');


        // Add task information
        li.innerHTML =
            task.title +
            " | Priority: " +
            task.priority +
            " | Status: " +
            getTaskStatus(task);


        // ===============================
        // CHECKBOX
        // ===============================

        const checkbox = document.createElement('input');

        // Make it a checkbox
        checkbox.type = 'checkbox';

        // Set checkbox according to task status
        checkbox.checked = task.completed;


        // When checkbox is changed
        checkbox.addEventListener('change', function() {

            // Update task's completed value
            task.completed = checkbox.checked;

            // Save changes
            saveTask();

            // Re-render because the task's status
            // may have changed
            renderTask();
        });


        // ===============================
        // DELETE BUTTON
        // ===============================

        const del = document.createElement('button');

        del.innerHTML = 'Delete';


        del.addEventListener('click', function() {

            // Remove the task using its unique ID
            //
            // This is safer than:
            // tasks.splice(i, 1)
            //
            // because i belongs to visibleTasks
            // when filtering is active.

            tasks = tasks.filter(function(t) {
                return t.id !== task.id;
            });


            // Save updated array
            saveTask();

            // Display updated tasks
            renderTask();
        });


        // Add checkbox to <li>
        li.appendChild(checkbox);

        // Add delete button to <li>
        li.appendChild(del);

        // Add <li> to <ul>
        tasklist.appendChild(li);
    }


    // Update statistics
    updateStatus();
}


// ===============================
// 6. UPDATE STATISTICS
// ===============================

function updateStatus() {

    // Total number of tasks
    const total = tasks.length;


    // Count completed tasks
    const completed = tasks.filter(function(task) {
        return task.completed;
    }).length;


    // Pending = total - completed
    const pending = total - completed;


    // Variable for progress percentage
    let progress;


    // Avoid division by zero
    if (total === 0) {
        progress = 0;
    }

    else {
        progress = (completed / total) * 100;
    }


    // Update HTML
    document.getElementById('totalTasks').innerHTML =
        'Total Tasks: ' + total;

    document.getElementById('completedTasks').innerHTML =
        'Completed Tasks: ' + completed;

    document.getElementById('pendingTasks').innerHTML =
        'Pending Tasks: ' + pending;

    document.getElementById('progress').innerHTML =
        'Progress: ' + progress.toFixed(2) + '%';
}


// ===============================
// 7. SAVE TASKS TO LOCAL STORAGE
// ===============================

function saveTask() {

    // localStorage can only store strings.
    //
    // JSON.stringify() converts the tasks array
    // into a string.

    localStorage.setItem(
        'tasks',
        JSON.stringify(tasks)
    );
}


// ===============================
// 8. LOAD TASKS FROM LOCAL STORAGE
// ===============================

function loadTask() {

    // Get saved tasks
    const storedTask = localStorage.getItem('tasks');


    // If tasks exist in localStorage
    if (storedTask) {

        // Convert JSON string back into an array
        tasks = JSON.parse(storedTask);
    }


    // Display the loaded tasks
    renderTask();
}


// ===============================
// 9. GET TASK STATUS
// ===============================

function getTaskStatus(task) {

    // Get today's date
    const today = new Date();


    // Remove current time
    // Example:
    // 6 September 2026 23:30
    // becomes
    // 6 September 2026 00:00

    today.setHours(0, 0, 0, 0);


    // Convert task deadline into Date object
    const deadlineDate = new Date(task.deadline);


    // Remove time from deadline as well
    deadlineDate.setHours(0, 0, 0, 0);


    // Completed has highest priority
    if (task.completed) {
        return 'completed';
    }


    // Deadline has already passed
    else if (deadlineDate < today) {
        return 'overdue';
    }


    // Otherwise task is still pending
    else {
        return 'pending';
    }
}


// ===============================
// 10. FILTER TASKS
// ===============================

function filterTasks(status) {

    // Store the selected filter
    currentFilter = status;


    // Re-render the tasks
    // using the new filter
    renderTask();
}


// ===============================
// 11. LOAD TASKS WHEN PAGE STARTS
// ===============================

loadTask();