"use strict";

// DOM Elements
const new_input = document.querySelector(".input-new");
const new_task = document.querySelector(".new-task");
const modal_change = document.querySelector(".modal-change");
const modal_new = document.querySelector(".modal-new");
const modal_add = document.querySelector(".modal-add");
const modal_delete = document.querySelector(".modal-delete");
const modal_edit = document.querySelector(".modal-edit");
const input_edit = document.querySelector(".input-edit");
const overlay = document.querySelector(".overlay");
const modal_delete_btn = document.querySelectorAll(".modal-delete-btn");
const modal_close_btns = document.querySelectorAll(".modal-close");
const modal_cancle_btn = document.querySelectorAll(".modal-cancle-btn");
const modal_ok_btn_add = document.querySelector(".modal-ok-btn-add");
const modal_ok_btn = document.querySelector(".modal-ok-btn");
const modal_edit_btn = document.querySelectorAll(".modal-edit-btn");
const modal_ok_btn_edit = document.querySelector(".modal-ok-btn-edit");
const list_container = document.querySelector("#list-container");

// Add task counter element after the tasks box
const taskCounter = document.createElement("div");
taskCounter.classList.add("task-counter");
taskCounter.style.textAlign = "center";
taskCounter.style.margin = "15px 0";
taskCounter.style.color = "rgb(30, 76, 129)";
taskCounter.style.fontWeight = "bold";
document.querySelector(".tasks-box").after(taskCounter);

// Create the mobile action modal if it doesn't exist
function createMobileActionModal() {
  // Check if modal already exists
  if (!document.querySelector(".modal-mobile-actions")) {
    const modalMobileActions = document.createElement("div");
    modalMobileActions.className = "modal-mobile-actions hidden";
    modalMobileActions.innerHTML = `
      <button class="modal-close" data-target="#modal-mobile-actions">&times;</button>
      <div class="modalbox">
        <p class="task-name-display">Task Actions</p>
        <div class="modal-buttoms">
          <button class="modal-mobile-edit-btn">Edit</button>  
          <button class="modal-mobile-delete-btn">Delete</button>
          <button class="modal-mobile-cancel-btn">Cancel</button>
        </div>
      </div>
    `;
    document.querySelector(".container").appendChild(modalMobileActions);

    // Add event listeners for the new modal buttons
    const modalMobileEditBtn = modalMobileActions.querySelector(
      ".modal-mobile-edit-btn"
    );
    const modalMobileDeleteBtn = modalMobileActions.querySelector(
      ".modal-mobile-delete-btn"
    );
    const modalMobileCancelBtn = modalMobileActions.querySelector(
      ".modal-mobile-cancel-btn"
    );
    const modalCloseBtn = modalMobileActions.querySelector(".modal-close");

    modalMobileEditBtn.addEventListener("click", function () {
      if (window.currentTaskToEdit) {
        const currentText = window.currentTaskToEdit.textContent;
        input_edit.value = currentText;
        openModal(modal_edit);
        input_edit.focus();
      }
    });

    modalMobileDeleteBtn.addEventListener("click", function () {
      if (window.currentTaskElement) {
        window.currentTaskToDelete = window.currentTaskElement;
        openModal(modal_delete);
      }
    });

    modalMobileCancelBtn.addEventListener("click", function () {
      closeAllModals();
    });

    modalCloseBtn.addEventListener("click", function () {
      closeAllModals();
    });
  }

  return document.querySelector(".modal-mobile-actions");
}

// Detect if we're on a mobile device (based on screen width)
function isMobileView() {
  return window.innerWidth < 576;
}

// Date and Time Display and Calendar update
function updateDateTime() {
  const now = new Date();
  const dateOptions = { weekday: "short", month: "short", year: "numeric" };
  const timeOptions = {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };

  document.querySelector(".current-date").textContent = now.toLocaleDateString(
    "en-US",
    dateOptions
  );
  document.querySelector(".current-time").textContent = now.toLocaleTimeString(
    "en-US",
    timeOptions
  );

  // Update calendar
  updateCalendar(now);
}

// Update calendar with current week
function updateCalendar(currentDate) {
  const calendarContainer = document.querySelector(".calender");
  const weekDays = calendarContainer.querySelectorAll(".week-days");

  // Get current day of week (0 is Sunday, 6 is Saturday)
  const currentDay = currentDate.getDay();

  // Get the date of Sunday of this week
  const sunday = new Date(currentDate);
  sunday.setDate(currentDate.getDate() - currentDay);

  // Update each day in the calendar
  weekDays.forEach((dayElement, index) => {
    const dayDate = new Date(sunday);
    dayDate.setDate(sunday.getDate() + index);

    // Update day of week
    const dayOfWeek = dayElement.querySelector(".day-of-week");
    dayOfWeek.textContent = ["s", "m", "t", "w", "t", "f", "s"][index];

    // Update date number
    const dateElement = dayElement.querySelector(".date");
    dateElement.textContent = dayDate.getDate();

    // Add or remove today highlight
    if (index === currentDay) {
      dayElement.id = "today";
    } else {
      dayElement.removeAttribute("id");
    }
  });
}

// Initial call and set interval for date/time updating
updateDateTime();
setInterval(updateDateTime, 1000);

// Add custom CSS for styling
addCustomCSS();

// Create the mobile action modal
createMobileActionModal();

// Modal functions
function closeAllModals() {
  const modals = [
    modal_new,
    modal_add,
    modal_delete,
    modal_edit,
    modal_change,
    document.querySelector(".modal-mobile-actions"),
  ];

  modals.forEach((modal) => {
    if (modal) modal.classList.add("hidden");
  });

  overlay.classList.remove("active");
}

function openModal(modal) {
  closeAllModals();
  modal.classList.remove("hidden");
  overlay.classList.add("active");
}

// Set up close buttons
modal_close_btns.forEach((btn) => {
  btn.addEventListener("click", () => {
    closeAllModals();
  });
});

// Cancel buttons
modal_cancle_btn.forEach((btn) => {
  btn.addEventListener("click", () => {
    closeAllModals();
  });
});

// Add new task
new_task.addEventListener("click", function () {
  openModal(modal_new);
  new_input.focus();
});

// Add task button
modal_ok_btn_add.addEventListener("click", addTask);

// Enter key in new task input
new_input.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});

function addTask() {
  const task = new_input.value.trim();

  if (!task) {
    openModal(modal_add);
  } else {
    // Get current time for task
    const now = new Date();
    const timeString = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const li = document.createElement("li");
    li.innerHTML = `
      <div class="tasks-container">
        <div class="tasks">
          <div class="check">
            <input type="checkbox" class="circular-checkbox" />
          </div>
          <span class="task-text">${task}</span>
        </div>
        <div class="create-time">${timeString}</div>
        <div><button class="delete">Delete</button></div>
        <div><button class="edit">Edit</button></div>
      </div>
    `;

    list_container.appendChild(li);
    new_input.value = "";
    closeAllModals();

    // Add event listeners to the new task's delete and edit buttons
    setupTaskButtons(li);

    // Add swipe functionality for mobile view
    setupSwipeActions(li);

    // Add task tap functionality for mobile
    setupTaskTapAction(li);

    // Update task counter
    updateTaskCounter();

    // Apply circular checkbox styles
    applyCircularCheckboxStyle(li.querySelector(".circular-checkbox"));
  }
}

// Function to create circular checkboxes
function applyCircularCheckboxStyle(checkbox) {
  if (!checkbox) return;

  checkbox.style.appearance = "none";
  checkbox.style.webkitAppearance = "none";
  checkbox.style.MozAppearance = "none";
  checkbox.style.width = "18px";
  checkbox.style.height = "18px";
  checkbox.style.borderRadius = "50%";
  checkbox.style.border = "2px solid rgb(30, 76, 129)";
  checkbox.style.outline = "none";
  checkbox.style.cursor = "pointer";
  checkbox.style.position = "relative";
  checkbox.style.backgroundColor = "white";

  checkbox.addEventListener("change", function () {
    if (this.checked) {
      this.style.backgroundColor = "rgb(30, 76, 129)";
      this.style.position = "relative";

      // Create a checkmark using ::after pseudo-element with JS
      this.style.setProperty("--checkmark-display", "block");

      // Add completed class to task text
      const taskText = this.closest(".tasks").querySelector(".task-text");
      taskText.classList.add("completed");
      taskText.style.textDecoration = "line-through";
      taskText.style.opacity = "0.6";
    } else {
      this.style.backgroundColor = "white";
      this.style.setProperty("--checkmark-display", "none");

      // Remove completed class from task text
      const taskText = this.closest(".tasks").querySelector(".task-text");
      taskText.classList.remove("completed");
      taskText.style.textDecoration = "none";
      taskText.style.opacity = "1";
    }

    // Update task counter
    updateTaskCounter();
  });
}

// Function to update task counter
function updateTaskCounter() {
  const totalTasks = list_container.querySelectorAll("li").length;
  const completedTasks = list_container.querySelectorAll(
    'input[type="checkbox"]:checked'
  ).length;

  taskCounter.textContent = `${completedTasks} tasks of ${totalTasks} done`;
}

// OK button in empty task modal
modal_ok_btn.addEventListener("click", function () {
  closeAllModals();
});

// Setup task tap action for mobile view
function setupTaskTapAction(taskElement) {
  const taskDiv = taskElement.querySelector(".tasks");
  const taskText = taskDiv.querySelector(".task-text");

  taskDiv.addEventListener("click", function (e) {
    // Only trigger if it's a mobile view and the checkbox was not clicked
    if (isMobileView() && !e.target.classList.contains("circular-checkbox")) {
      // Prevent checkbox from being clicked
      if (e.target.closest(".check")) {
        return;
      }

      e.stopPropagation();

      // Get the task text and store reference to current task
      const taskTextContent = taskText.textContent;
      window.currentTaskToEdit = taskText;
      window.currentTaskElement = taskElement;

      // Update and open the mobile actions modal
      const mobileActionsModal = document.querySelector(
        ".modal-mobile-actions"
      );
      const taskNameDisplay =
        mobileActionsModal.querySelector(".task-name-display");
      taskNameDisplay.textContent = taskTextContent;

      openModal(mobileActionsModal);
    }
  });
}

// Setup swipe functionality for mobile view
function setupSwipeActions(taskElement) {
  const tasksContainer = taskElement.querySelector(".tasks-container");
  let touchStartX = 0;
  let touchEndX = 0;

  tasksContainer.addEventListener(
    "touchstart",
    function (e) {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );

  tasksContainer.addEventListener(
    "touchend",
    function (e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    },
    { passive: true }
  );

  function handleSwipe() {
    const swipeThreshold = 70; // Minimum distance to be considered a swipe

    if (touchEndX < touchStartX - swipeThreshold) {
      // Swiped left - show delete action
      if (isMobileView()) {
        window.currentTaskElement = taskElement;
        window.currentTaskToDelete = taskElement;
        openModal(modal_delete);
      }
    } else if (touchEndX > touchStartX + swipeThreshold) {
      // Swiped right - show edit action
      if (isMobileView()) {
        const taskText = taskElement.querySelector(".task-text");
        window.currentTaskToEdit = taskText;
        input_edit.value = taskText.textContent;
        openModal(modal_edit);
        input_edit.focus();
      }
    }
  }
}

// Setup task buttons (edit and delete) for a task
function setupTaskButtons(taskElement) {
  const deleteBtn = taskElement.querySelector(".delete");
  const editBtn = taskElement.querySelector(".edit");
  const checkbox = taskElement.querySelector("input[type='checkbox']");
  const taskText = taskElement.querySelector(".task-text");

  // Apply circular style to checkbox
  applyCircularCheckboxStyle(checkbox);

  // Delete button
  deleteBtn.addEventListener("click", function () {
    // Store reference to the current task for deletion
    window.currentTaskToDelete = taskElement;
    openModal(modal_delete);
  });

  // Edit button
  editBtn.addEventListener("click", function () {
    const currentText = taskText.textContent;

    // Store reference to the current task for editing
    window.currentTaskToEdit = taskText;

    // Set the edit input value to current text
    input_edit.value = currentText;
    openModal(modal_edit);
    input_edit.focus();
  });

  // Checkbox
  checkbox.addEventListener("change", function () {
    if (this.checked) {
      taskText.classList.add("completed");
      taskText.style.textDecoration = "line-through";
      taskText.style.opacity = "0.6";
    } else {
      taskText.classList.remove("completed");
      taskText.style.textDecoration = "none";
      taskText.style.opacity = "1";
    }

    // Update task counter
    updateTaskCounter();
  });

  // Setup tap action for mobile view
  setupTaskTapAction(taskElement);

  // Setup swipe functionality for mobile
  setupSwipeActions(taskElement);
}

// Confirm deletion
modal_delete_btn.forEach((btn) => {
  btn.addEventListener("click", function () {
    if (window.currentTaskToDelete) {
      window.currentTaskToDelete.remove();
      window.currentTaskToDelete = null;
      // Update task counter after deleting a task
      updateTaskCounter();
    }
    closeAllModals();
  });
});

// Confirm edit
modal_ok_btn_edit.addEventListener("click", confirmEdit);

// Enter key in edit input
input_edit.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    confirmEdit();
  }
});

function confirmEdit() {
  const newText = input_edit.value.trim();

  if (newText && window.currentTaskToEdit) {
    window.currentTaskToEdit.textContent = newText;

    // If we're in mobile view, also update the task name in the mobile actions modal
    const taskNameDisplay = document.querySelector(".task-name-display");
    if (taskNameDisplay) {
      taskNameDisplay.textContent = newText;
    }

    window.currentTaskToEdit = null;
    closeAllModals();
  } else if (!newText) {
    // You could show an error or just not close the modal
    input_edit.focus();
  }
}

// Click outside modal to close (optional)
overlay.addEventListener("click", function () {
  closeAllModals();
});

// Window resize event listener to handle mobile/desktop view transitions
window.addEventListener("resize", function () {
  const taskElements = list_container.querySelectorAll("li");
  // Nothing specific needed here for now, but could be used for future enhancements
});

// Add double tap to mark as complete
function setupDoubleTapComplete() {
  let lastTap = 0;

  list_container.addEventListener("touchend", function (e) {
    const taskText = e.target.closest(".task-text");
    if (!taskText) return;

    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;

    if (tapLength < 300 && tapLength > 0) {
      // Double tap detected
      const checkbox = taskText
        .closest(".tasks")
        .querySelector("input[type='checkbox']");
      checkbox.checked = !checkbox.checked;

      // Trigger the change event manually
      const event = new Event("change");
      checkbox.dispatchEvent(event);

      e.preventDefault();
    }

    lastTap = currentTime;
  });
}

// Load saved tasks from localStorage (if any)
function loadTasks() {
  const savedTasks = localStorage.getItem("todoTasks");
  if (savedTasks) {
    list_container.innerHTML = savedTasks;

    // Add event listeners to all loaded tasks
    const taskElements = list_container.querySelectorAll("li");
    taskElements.forEach((taskElement) => {
      setupTaskButtons(taskElement);
    });

    // Update task counter for loaded tasks
    updateTaskCounter();
  }
}

// Add custom CSS for li elements to remove default bullet points
function addCustomCSS() {
  const styleElement = document.createElement("style");
  styleElement.textContent = `
    #list-container li {
      list-style-type: none;
    }
    
    /* Add custom style for checkbox */
    .circular-checkbox:checked::after {
      content: '✓';
      position: absolute;
      top: -1px;
      left: 3px;
      color: white;
      font-size: 14px;
    }
    
    /* Add ripple effect for task click on mobile */
    @keyframes ripple {
      0% {
        transform: scale(0.8);
        opacity: 1;
      }
      100% {
        transform: scale(2);
        opacity: 0;
      }
    }
    
    .ripple {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.7);
      transform: scale(0);
      animation: ripple 0.6s ease-out;
    }
    
    /* Add hint for mobile users */
    .mobile-hint {
      display: none;
      text-align: center;
      font-size: 12px;
      color: #666;
      margin-bottom: 10px;
    }
    
    @media (max-width: 575px) {
      .mobile-hint {
        display: block;
      }
    }
  `;
  document.head.appendChild(styleElement);

  // Add mobile hint text
  const mobileHint = document.createElement("div");
  mobileHint.className = "mobile-hint";
  mobileHint.textContent =
    "Tap a task to edit or delete • Swipe left/right for quick actions";

  const h1Element = document.querySelector("h1");
  h1Element.after(mobileHint);
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("todoTasks", list_container.innerHTML);
}

// Setup double tap to mark tasks as complete
setupDoubleTapComplete();

// Add event listener to save tasks whenever a change is made
const observer = new MutationObserver(saveTasks);
observer.observe(list_container, { childList: true, subtree: true });

// Load tasks on page load
loadTasks();
