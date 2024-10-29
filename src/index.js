const themeToggle = document.querySelectorAll(".icon i");
const theRoot = document.documentElement;
const theBody = document.body;
const tasksContainer = document.getElementById("tasks");
const allBtn = document.querySelector("#all");
const activeBtn = document.getElementById("active");
const completeBtn = document.getElementById("completed");

// save tasks in the array
let tasksArray = [];


let pageWidth = window.innerWidth;

window.addEventListener("resize", () => {
  pageWidth = window.innerWidth;
  changeBgImage(pageWidth);
});

function changeBgImage(width) {
  // Clear all background classes first
  theBody.classList.remove("mobile-bg-light", "mobile-bg-dark", "bg-light", "bg-dark");

  if (width < 640) {
    // Mobile backgrounds
    theBody.classList.add(theRoot.classList.contains("dark") ? "mobile-bg-dark" : "mobile-bg-light");
  } else {
    // Desktop backgrounds
    theBody.classList.add(theRoot.classList.contains("dark") ? "bg-dark" : "bg-light");
  }
}

// Initial call to set background based on current screen width
changeBgImage(pageWidth);



// loooping throw the sun and moon icons
themeToggle.forEach((icon) => {
  // click on the icon to switch mode
  icon.onclick = () => {
    swtchMode();
    changeBgImage(pageWidth);
  };
});

// swiching mode function
function swtchMode() {
  if (theRoot.classList.contains("dark")) {
    // theBody.classList.replace(dark, light);
    theRoot.classList.remove("dark");
  } else {
    // theBody.classList.replace(light, dark);
    theRoot.classList.add("dark");
  }
}

// click Enter key triger addTask function and give it the entred value
document.addEventListener("keydown", (ev) => {
  let taskInputElement = document.getElementById("task_input");
  let taskInputValue = taskInputElement.value;

  // check press Enter key
  if (ev.key === "Enter") {
    // check if the input isn't empty
    if (taskInputValue !== "") {
      addTask(taskInputValue);

      // clear the actual input field
      taskInputElement.value = "";
    }
  }
});

function addTask(task) {
  // create an object with task details
  const taskObj = {
    name: task,
    completed: false,
    id: Date.now(),
  };
  // add the object of tasks in the array
  tasksArray.push(taskObj);
  // trigger the display tasks function to display tasks on the page
  displayTasks(tasksArray);
}

function displayTasks(tasksArray) {
  // check if there're tasks in the array
  if (tasksArray.length > 0) {
    // display the tasks container
    tasksContainer.classList.remove("hidden");
    // empty the tasks container
    tasksContainer.innerHTML = "";
    // tasks footer
    const tasksFooter = document.createElement("li");
    tasksFooter.className =
      "footer flex justify-between items-center gap-3 p-2 pt-4 border-b-dark_mode-Very-Dark-Blue dark:border-b-light_mode-Dark-Grayish-Blue";
    tasksFooter.innerHTML = `
    <div class="text-sm text-light_mode-Dark-Grayish-Blue">${tasksArray.length} Items left</div>
    <button class="text-sm text-light_mode-Dark-Grayish-Blue">Clear Completed</button>
  `;

    // looping throw the tasks array
    for (let i = 0; i < tasksArray.length; i++) {
      // create the main li task
      const li = document.createElement("li");
      // add data-id to catch the task
      li.setAttribute("data-id", tasksArray[i].id);
      li.className =
        "flex justify-between items-center gap-3 p-2 py-4 border-b-dark_mode-Very-Dark-Blue dark:border-b-light_mode-Dark-Grayish-Blue border-b-[1px] ";
      // create the input checkbox
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "checkbox cursor-pointer";

      // Toggle checkbox status
      checkbox.checked = tasksArray[i].completed;
      // if the task is completed add a done class and line through task
      if (tasksArray[i].completed) {
        checkbox.classList.add("done");
        li.classList.add("line-through");
      } else {
        checkbox.classList.remove("done");
        li.classList.remove("line-through");
      }

      // add the task input on li
      li.appendChild(checkbox);
      li.appendChild(document.createTextNode(tasksArray[i].name));

      // create the delete button
      const deleteBtn = document.createElement("button");
      const deleteImg = document.createElement("img");
      deleteImg.src = "../images/icon-cross.svg";

      // add the img to the delete btn
      deleteBtn.appendChild(deleteImg);

      // add the delete button to the main li
      li.appendChild(deleteBtn);

      // finally add the li to the main container
      tasksContainer.appendChild(li);
    }
    // add the footer to the main tasks container
    tasksContainer.appendChild(tasksFooter);
  } else {
    tasksContainer.classList.add("hidden");
  }
  completed(tasksContainer);
  deleteTasks(tasksContainer);
  clearCompleted(tasksContainer, tasksArray);
}

function completed(tasks) {
  let checkboxes = tasks.querySelectorAll('input[type="checkbox"]');

  // Loop through all checkboxes
  checkboxes.forEach((checkbox) => {
    // Add an event listener for the checkbox click
    checkbox.addEventListener("click", function () {
      // Get the parent li element to find the corresponding task ID
      const taskLi = checkbox.parentElement;
      const taskId = taskLi.getAttribute("data-id");

      // Find the corresponding task in tasksArray using the task ID
      const task = tasksArray.find((t) => t.id == taskId);

      // Toggle the completed status of the task
      task.completed = checkbox.checked;

      // Update the display by calling displayTasks again
      displayTasks(tasksArray);
    });
  });
}

// clear all completed tasks function
function clearCompleted(clear, tasks) {
  const clearCompletedBtn = clear.querySelector(".footer button");
  // click clear complted btn to clear all completed tasks
  clearCompletedBtn.addEventListener("click", function () {
    tasks.forEach((task) => {
      task.completed = false;
    });
    displayTasks(tasksArray);
  });
}

// delete function
function deleteTasks(allTasks) {
  // loop through the delete  buttons
  allTasks.querySelectorAll("button").forEach((btn, index) => {
    btn.addEventListener("click", (b) => {
      let task = b.target.parentElement.parentElement;
      let taskId = b.target.parentElement.parentElement.getAttribute("data-id");

      tasksArray.splice(index, 1);

      displayTasks(tasksArray);
    });
  });
}

// delete active classes handle active class
function setActiveButton(clickedBtn) {
  // remove all active classes
  allBtn.classList.remove("active");
  completeBtn.classList.remove("active");
  activeBtn.classList.remove("active");

  // add active class to clicked btn
  clickedBtn.classList.add("active");
}

// get completed tasks
completeBtn.addEventListener("click", () => {
  let completedTasks = tasksArray.filter((task) => task.completed);
  displayTasks(completedTasks);
  setActiveButton(completeBtn);
});

// get active tasks
activeBtn.addEventListener("click", () => {
  let activeTasks = tasksArray.filter((task) => !task.completed);
  displayTasks(activeTasks);
  setActiveButton(activeBtn);
});
// get all tasks
allBtn.addEventListener("click", () => {
  // let activeTasks =  tasksArray.filter(task => !task.completed)
  displayTasks(tasksArray);
  setActiveButton(allBtn);
});

// the issue, when clicked completed btn then click clear completed it's delete one task
