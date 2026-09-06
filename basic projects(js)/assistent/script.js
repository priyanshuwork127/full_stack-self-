const form=document.getElementById('taskform');
const taskInput=document.getElementById('taskInput');
const priority=document.getElementById('priority');
const deadline=document.getElementById(
'deadline');
let tasks=[];
form.addEventListener('submit',function(event){
    tasks.push({
        id: tasks.length + 1,
        title:taskInput.value,
        priority:priority.value,
        deadline:deadline.value,
        completed:false
    })
    saveTask();
    renderTask();
    console.log(tasks);
    event.preventDefault();
})
function renderTask(){
    const tasklist=document.getElementById('tasklist');
    tasklist.innerHTML='';
    for(let i=0;i<tasks.length;i++){
        const task=tasks[i];
        const li=document.createElement('li');
        li.innerHTML=task.id+" "+'<span>'+task.title+" "+'</span>'+'<span>'+" "+task.priority+'</span>'+'<span>'+" "+task.deadline+'</span>';
        // const checkbox=document.createElement('input');
        // checkbox.type='checkbox';
        const checkbox=document.createElement('input');
        checkbox.type='checkbox';
        checkbox.checked=task.completed;
        checkbox.addEventListener('change',function(){
            task.completed=checkbox.checked;
            saveTask();
            updateStatus();
        })
        const del=document.createElement('button');
        del.innerHTML='Delete';
        del.addEventListener('click',function(){
            tasks.splice(i,1);
            saveTask();
            renderTask();
        })
        li.appendChild(checkbox);
        li.appendChild(del);
        tasklist.appendChild(li);
    }
    updateStatus();
    
}
function updateStatus(){
    let total = tasks.length;
    let completed = tasks.filter(task => task.completed).length;
    let pending = total - completed;

    let progress;

    if(total === 0){
        progress = 0;
    } else {
        progress = completed / total * 100;
    }

    document.getElementById('totalTasks').innerHTML = 'Total Tasks: ' + total;
    document.getElementById('completedTasks').innerHTML = 'Completed Tasks: ' + completed;
    document.getElementById('pendingTasks').innerHTML = 'Pending Tasks: ' + pending;
    document.getElementById('progress').innerHTML = 'Progress: ' + progress.toFixed(2) + '%';
}
function saveTask(){
    localStorage.setItem('tasks',JSON.stringify(tasks));
}
function loadTask(){
    const storedtask=localStorage.getItem('tasks');
    if(storedtask){
        tasks=JSON.parse(storedtask);
    }
    renderTask();
}
loadTask();