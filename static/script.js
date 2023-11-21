
var priorityLevel = "none";
var sortBy = '';
var sortOrder = 1;
var tasksDisplayed = 0;


/**
 * calls certain functions when the page loads
 */
document.addEventListener('DOMContentLoaded', function() {
  getData();
  noTasks();
  setTimeout(function() {
    noTasks();
  }, 50);
});

/**
 * This function opens the new task form modal and displays it by changing the display style to flex
 * it also changes the display style for the button to none.
 * It is called when the new task button is pressed
 */
function openForm() {
  document.getElementById('submit-task-container').style.display = 'flex';
  document.getElementById('open-form-button').style.display = "none";
}


/**
 * This function closes the new task form modal by changing the display style to none and changes
 * the new task button display to block.
 * It is called when the close button is pressed.
 * The function also resets the form steps and removes the information inputted inside the form.
 */
function closeForm() {
  document.getElementById('submit-task-container').style.display = 'none';
  document.getElementById('open-form-button').style.display = "block";

  document.getElementById('step-1').reset();
  document.getElementById('step-2').reset();
  document.getElementById('step-3').reset();
  document.getElementById('step-1').style.display = 'block';
  document.getElementById('step-2').style.display = 'none';
  document.getElementById('step-3').style.display = 'none';

  document.getElementById('low-priority').classList.remove("active");
  document.getElementById('medium-priority').classList.remove("active");
  document.getElementById('high-priority').classList.remove("active");
}


/**
 * This function is used to take the current step of the form and change it to the next page when called on.
 * It is called on by a next button inside the form.
 * it works by taking the current step and adding 1, then changing the currentstep display to none and
 * the new one to block.
 * @param {*} currentStep 
 */
function nextStep(currentStep) {
  document.getElementById('step-' + currentStep).style.display = 'none';
  document.getElementById('step-' + (currentStep + 1)).style.display = 'block';
}


/**
 * This function is used to take the current step of the form and change it to the previous page when called on.
 * It is called on by a previous button inside the form.
 * it works by taking the current step and subtracting one then changing the current step display to none and
 * the new one to block.
 * @param {*} currentStep 
 */
function prevStep(currentStep) {
  document.getElementById('step-' + currentStep).style.display = 'none';
  document.getElementById('step-' + (currentStep - 1)).style.display = 'block';
}


/**
 * This function closes the full task display and is called on by the press of a button.
 * It works by setting the display style to none.
 */
function closeTaskDisplay() {
  document.getElementById('full-task-display-container').style.display = 'none';
}


/**
 * This function uses the set priority buttons to change the style of the button by
 * giveing the button the active class.
 * @param {*} event 
 */
function selctedPriority(event) {
  var low = document.getElementById("low-priority");
  var medium = document.getElementById("medium-priority");
  var high = document.getElementById("high-priority");
  
  if (event.target === low) {
    low.classList.add("active");
    medium.classList.remove("active");
    high.classList.remove("active");
    priorityLevel = "low";
  } else if (event.target === medium) {
    low.classList.remove("active");
    medium.classList.add("active");
    high.classList.remove("active");
    priorityLevel = "medium";
  } else {
    low.classList.remove("active");
    medium.classList.remove("active");
    high.classList.add("active");
    priorityLevel = "high";
  }
}


/**
 * This function closes the new task form modal and stores the inputs from the form as variables, it then 
 * resets the form and puts the variables inside an array, the array is then sent to the flask using xhr 
 * XMLHttpRequest.
 * 
 */
function submitForm() {
  document.getElementById('submit-task-container').style.display = 'none';
  document.getElementById('open-form-button').style.display = 'block';

  var taskName = document.getElementById("task-name").value;
  var taskDescription = document.getElementById('task-description').value
  var dueDate = document.getElementById('due-date').value;

  document.getElementById('step-1').reset();
  document.getElementById('step-2').reset();
  document.getElementById('step-3').reset();
  document.getElementById('step-1').style.display = 'block';
  document.getElementById('step-2').style.display = 'none';
  document.getElementById('step-3').style.display = 'none';

  document.getElementById('low-priority').classList.remove("active");
  document.getElementById('medium-priority').classList.remove("active");
  document.getElementById('high-priority').classList.remove("active");


var xhr = new XMLHttpRequest();

xhr.open('PUT', '/submit-form');
xhr.setRequestHeader('Content-Type', 'application/json');


var data = {
  taskName,
  taskDescription,
  dueDate,
  priorityLevel
};

xhr.send(JSON.stringify(data));

tasksDisplayed++;
getData();

setTimeout(function() {
  noTasks();
}, 50);
}


/**
 * This function takes the task id of the button which is linked to the the specific task and send it to this
 * function where it opens a modal showing the full details. It is done by changing the display style to flex.
 * @param {*} taskId 
 */
function openTask(taskId) {
  document.getElementById('full-task-display-container').style.display= "flex";
}


/**
 * This function sends a request to the flask to recieve all of the json data in the file and stores it in
 * a variable which is formatted to be a list element and a button. It does this for every task in the file
 * and then uses innerHTMl to display it on the website.
 */
function getData() {
  fetch('/get_data')
      .then(response => response.json())
      .then(tasks => {

        let placeholder = document.querySelector('#current-tasks-list');
        let out = "";

        for (let task of tasks) {
          out += `
          <li>
          <button id="${task.task_id}"class="task-button" onclick="displayTask(this.id)">
          <span class="task-name">Task Name: ${task.task_name}</span>
          <span class="sort-due-date">Due Date: ${task.due_date}</span>
          <span class="sort-priority-level">Priority Level: ${task.priority_level}</span>
          </button>
          </li>
          `;
        }

        placeholder.innerHTML = out;
  });
}


/**
 * This function takes the taskID from the button list element and opens the modal displaying all of the
 * information about the task. It does this by sending the taskID to the flask where the flask will send back
 * all of the information about that task ID back to the function and then it uses the innerHTML method to
 * display it in the modal.
 */
function displayTask(task_id) {
  document.getElementById('full-task-display-container').style.display = 'flex';
  const xhr = new XMLHttpRequest();
  xhr.open('PUT', '/display_task');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = function() {
    const task = JSON.parse(xhr.responseText);
    const taskDiv = document.getElementById('full-task-display-form');
    const out = `
      <fieldset id="full-task-display-fieldset">
        <h2 class="task-form-title">${task.task_name}</h2>
        <a id="close-task-disp" type="button" onclick="closeTaskDisplay()">&#x2715</a>
        <p id="popup-task-desc">${task.task_description}</p>
        <p id="popup-task-due-date">Due: ${task.due_date}</p>
        <p id="popup-task-prior-level">Priority Level: <span id="${task.priority_level}-prior-disp">${task.priority_level}</span></p>
        <button id="${task.task_id}" class="delete-button" onclick="deleteTask(this.id)">Delete Task</button>
        <button id="${task.task_id}" class="complete-button" type="button" onclick="deleteTask(this.id)">Complete Task</button>
      </fieldset>
    `;
    taskDiv.innerHTML = out;
  };
  xhr.send(JSON.stringify({ task_id }));
}


/**
 * This function takes the taskID from the button and sends the taskID to the flask where it deletes the task
 * information containing that taskID.
 * @param {*} task_id 
 */
function deleteTask(task_id) {
  const xhr = new XMLHttpRequest();
  xhr.open('PUT', '/delete_task');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({ task_id }));
  tasksDisplayed--;
  setTimeout(function() {
    noTasks();
  }, 50);
}



/**
 * This function counts how many tasks are currently being displayed on the website and displays a message
 * if there are no current tasks. It appears and dissapears using the display style.
 */
function noTasks() {
  let tasksDisplayed = document.querySelectorAll('#current-tasks-list li').length;
  const noTasks = document.getElementById('no-tasks-message');
  const tasksRemaining = document.getElementById('tasks-remaining');
  let output = `you have ${tasksDisplayed} tasks remaining`;

  tasksRemaining.innerHTML = output;
  if (tasksDisplayed == 0) {
    noTasks.style.display = "block";
    tasksRemaining.style.display = "none";
  } else if(tasksDisplayed > 0) {
    noTasks.style.display = "none";
    tasksRemaining.style.display = "block";
  }
};


/**
 * This funvction takes 2 dates or priority levels from the array and compares them by and stores them back
 * in the array. It uses if else statements to compare the date or priority level.
 * @param {} a 
 * @param {*} b 
 * @returns 
 */
function compareItems(a, b) {
  var comparison = 0;

  if (sortBy === 'sort-due-date') {
    var aDate = new Date(a[0]).getTime();
    var bDate = new Date(b[0]).getTime();
    comparison = aDate - bDate;
  } else if (sortBy === 'sort-priority-level') {
    var aPriority = getPriorityValue(a[1]);
    var bPriority = getPriorityValue(b[1]);
    comparison = aPriority - bPriority;
  }

  return comparison * sortOrder;
}


/**
 * This function finds the priority level of the tasks in the array, and assigns it a value 1-3 and returns the
 * value which is then called in the compareItems() function
* @param {*} priority 
 * @returns 
 */
function getPriorityValue(priority) {

  if (priority === 'low') {
    return 1;
  } else if (priority === 'medium') {
    return 2;
  } else if (priority === 'high') {
    return 3;
  }

  return 0;
}


/**
 * This function takes the sorted arrays and reorders the list elements accordingly.
 * @param {} sortAttribute 
 */
function sortListBy(sortAttribute) {

  if (sortBy === sortAttribute) {
    sortOrder = -sortOrder;
  } else {
    sortBy = sortAttribute;
  }

  var myList = document.getElementById("current-tasks-list");
  var listItems = myList.getElementsByTagName("li");
  var itemsArray = [];

  for (var i = 0; i < listItems.length; i++) {
    var item = listItems[i];
    var itemDate = item.querySelector('.sort-due-date').innerHTML.substring(10);
    var itemPriority = item.querySelector('.sort-priority-level').innerHTML.substring(16);
    itemsArray.push([itemDate, itemPriority, item]);
  }
  itemsArray.sort(compareItems);

  for (i = 0; i < itemsArray.length; i++) {
    myList.appendChild(itemsArray[i][2]);
  }
}