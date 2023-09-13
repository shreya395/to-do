let tasksArray = JSON.parse(localStorage.getItem('tasks')) || [];

window.addEventListener('load', () => {
	const form = document.querySelector("#new-task-form");
	const input = document.querySelector("#new-task-input");
	const categorySelect = document.querySelector("#task-category");
	const sortButton = document.getElementById("sortButton");
	const list_el = document.querySelector("#tasks");
	const searchInput = document.querySelector("#searchInput");
    const searchButton = document.querySelector("#searchButton");

	form.addEventListener('submit', (e) => {
		e.preventDefault();
		const task = input.value;
        const category = categorySelect.value;
        const dueDate = document.querySelector("#new-task-due-date").value;
		 const CurrentDate = new Date();
        const selectedDueDate = new Date(dueDate);
	    CurrentDate.setHours(0, 0, 0, 0);
        selectedDueDate.setHours(0, 0, 0, 0);
    if (selectedDueDate < CurrentDate) {
        alert("You cannot add tasks with past due dates.");
        return; 
    }
	const taskObj = {
    text: task,
    category: category,
    dueDate: dueDate,
    completed: false 
};
tasksArray.push(taskObj);
localStorage.setItem('tasks', JSON.stringify(tasksArray));


		const task_el = document.createElement('div');
		task_el.classList.add('task');

		const task_content_el = document.createElement('div');
		task_content_el.classList.add('content');
		task_el.appendChild(task_content_el);

		const task_input_el = document.createElement('input');
		task_input_el.classList.add('text');
		task_input_el.type = 'text';
		task_input_el.value = task;
		task_input_el.setAttribute('readonly', 'readonly');

		task_content_el.appendChild(task_input_el);

		const task_actions_el = document.createElement('div');
		task_actions_el.classList.add('actions');

		const task_complete_el = document.createElement('button');
        task_complete_el.classList.add('complete');
        task_complete_el.innerText = 'Completed';
		
		const task_edit_el = document.createElement('button');
		task_edit_el.classList.add('edit');
		task_edit_el.innerText = 'Edit';
          
		const task_category_el = document.createElement('div');
        task_category_el.classList.add('category');
        task_category_el.textContent = `Category: ${category}`;
		
		const task_due_date_el = document.createElement('button');
        task_due_date_el.classList.add('due-date');
        task_due_date_el.setAttribute('data-due-date', dueDate);
        updateTimers();
		
		const task_delete_el = document.createElement('button');
		task_delete_el.classList.add('delete');
		task_delete_el.innerText = 'Delete';

		task_content_el.appendChild(task_category_el);
		task_content_el.appendChild(task_due_date_el);
		task_actions_el.appendChild(task_complete_el);
		task_actions_el.appendChild(task_edit_el);
		task_actions_el.appendChild(task_delete_el);
		
		task_el.appendChild(task_actions_el);
		list_el.appendChild(task_el);
		setTimeout(() => {
			task_el.classList.add('fade-in');
		}, 10); 
		input.value = '';
	
		 const currentDate = new Date();
		const dueDateObj = new Date(dueDate);
		const timeDifference = dueDateObj - currentDate;
	
		console.log(`Time remaining: ${timeDifference} milliseconds`);
        task_complete_el.addEventListener('click', (e) => {
            task_input_el.classList.toggle('completed');
        });

		task_edit_el.addEventListener('click', (e) => {
			if (task_edit_el.innerText.toLowerCase() == "edit") {
				task_edit_el.innerText = "Save";
				task_input_el.removeAttribute("readonly");
				task_input_el.focus();
			} else {
				task_edit_el.innerText = "Edit";
				task_input_el.setAttribute("readonly", "readonly");	
			}
		});

task_delete_el.addEventListener('click', (e) => {
    task_el.classList.add('fade-out');
    setTimeout(() => {
        list_el.removeChild(task_el);
    }, 500); 
});
let sortOrder = 1; 
sortButton.addEventListener('click', () => {
    const tasks = Array.from(list_el.querySelectorAll('.task'));
    tasks.sort((taskA, taskB) => {
        const dueDateA = new Date(taskA.querySelector('.due-date').getAttribute('data-due-date'));
        const dueDateB = new Date(taskB.querySelector('.due-date').getAttribute('data-due-date'));
        return sortOrder * (dueDateA - dueDateB);
    });
    list_el.innerHTML = '';
    tasks.forEach(task => list_el.appendChild(task));
});
});
});
// for search 
function handleSearch(e) {
	const list_el = document.querySelector("#tasks");
	const searchValue = searchInput.value.toLowerCase();
	const tasks = Array.from(list_el.querySelectorAll('.task'));
	tasks.forEach(task => {
		const taskText = task.querySelector('.text').value.toLowerCase();
		if (taskText.includes(searchValue)) {
			task.style.display = 'block';
		} else {
			task.style.display = 'none';
		}
        });
    };
	// for time date and day
	function updateClockAndDate() {
		const clockElement = document.getElementById("clock");
		const dateElement = document.getElementById("current-date");
		const now = new Date();
		const hours = now.getHours().toString().padStart(2, "0");
		const minutes = now.getMinutes().toString().padStart(2, "0");
		const seconds = now.getSeconds().toString().padStart(2, "0");
		const timeString = `${hours}:${minutes}:${seconds}`;
		clockElement.textContent = timeString;
		const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
		const dateString = now.toLocaleDateString(undefined, options);
		dateElement.textContent = dateString;
	}
	updateClockAndDate();
	setInterval(updateClockAndDate, 1000);
// for due date
	const updateTimers = () => {
		const list_el = document.querySelector("#tasks");
		const tasks = Array.from(list_el.querySelectorAll('.task'));
		tasks.forEach(task => {
			const dueDateElement = task.querySelector('.due-date');
			const dueDate = new Date(dueDateElement.getAttribute('data-due-date'));
			const currentDate = new Date();
			const timeDifference = dueDate - currentDate;
			if (timeDifference > 0) {
				const days = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // Using Math.ceil instead of Math.floor
				dueDateElement.textContent = `Due in ${days} days`;
			} else if (timeDifference <= 0) {
				const days = Math.floor(Math.abs(timeDifference) / (1000 * 60 * 60 * 24));
				if (days === 0) {
					dueDateElement.textContent = 'Due today';
				} 
			}
		});
	};
	const updateTimerDisplays = () => {
		const list_el = document.querySelector("#tasks");
		const timers = Array.from(list_el.querySelectorAll('.due-date'));
		timers.forEach(timer => {
			const dueDate = new Date(timer.getAttribute('data-due-date'));
			const currentDate = new Date();
			const timeDifference = dueDate - currentDate;
			if (timeDifference > 0) {
				const days = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // Using Math.ceil instead of Math.floor
				if (days === 1) {
					timer.textContent = 'Due in 1 day';
				} else {
					timer.textContent = `Due in ${days} days`;
				}
			} else if (timeDifference <= 0) {
				const days = Math.floor(Math.abs(timeDifference) / (1000 * 60 * 60 * 24));
				if (days === 0) {
					timer.textContent = 'Due today';
				} 
			}
		});
	};
	const timerInterval = setInterval(updateTimerDisplays, 500);
// Initialize variables for voice recognition
const voiceSearchButton = document.getElementById("voice-search-button");
const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
recognition.continuous = false;
recognition.lang = "en-US";
voiceSearchButton.addEventListener("click", () => {
  recognition.start();
});
recognition.onresult = function (event) {
  const transcript = event.results[0][0].transcript.toLowerCase();
  searchInput.value = transcript;
  handleSearch();
};
recognition.onerror = function (event) {
  console.error("Voice recognition error: " + event.error);
};
recognition.onend = function () {
  console.log("Voice recognition ended.");
};
function handleSearch() {
  const list_el = document.querySelector("#tasks");
  const searchValue = searchInput.value.toLowerCase();
  const tasks = Array.from(list_el.querySelectorAll('.task'));
  tasks.forEach(task => {
    const taskText = task.querySelector('.text').value.toLowerCase();
    if (taskText.includes(searchValue)) {
      task.style.display = 'block';
    } else {
      task.style.display = 'none';
    }
  });
}

function displayDailyReminder() {
  alert("Don't forget your daily task!");
}
function getTimeUntilNextReminder() {
  const now = new Date();
  const desiredTime = new Date();
  desiredTime.setHours(18, 3, 0);
  let timeDifference = desiredTime - now;
  if (timeDifference < 0) {
    desiredTime.setDate(desiredTime.getDate() + 1);
    timeDifference = desiredTime - now;
  }
  return timeDifference;
}
function scheduleDailyReminder() {
  const timeUntilNextReminder = getTimeUntilNextReminder();
  setTimeout(displayDailyReminder, timeUntilNextReminder);
}
scheduleDailyReminder();



