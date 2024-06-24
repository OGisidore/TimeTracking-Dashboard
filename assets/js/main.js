import { datas } from "./data.js";
import { addBox, initBoxs, updateBox } from "./storageIndexDb.js";
import {
  calculateTimeframes,
  convertMunitToNormalTime,
  days,
  endOfWeek,
  generateID,
  getTimeMunite,
  isThisMonth,
  isThisWeek,
  months,
  startOfWeek,
} from "./utilities.js";

// essai de bloquer les zooms sur ma page

document.addEventListener(
  "touchmove",
  (e) => {
    if (e.scale !== 1) {
      e.preventDefault();
    }
  },
  { passive: false }
);
document.addEventListener(
  "wheel",
  (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
    }
  },
  { passive: false }
);

let lastTouchEnd = 0;
document.addEventListener(
  "touchend",
  (e) => {
    const now = new Date().getTime();
    if (now - lastTouchEnd <= 300) {
      e.preventDefault();
    }
    lastTouchEnd = now;
  },
  false
);

// *****************************************************************************************************************************

const next = document.querySelector(".next");
const previous = document.querySelector(".prev");
const details = document.querySelector(".details");
const filtersOptions = document.querySelectorAll(".option");
const addFormModal = document.querySelector(".addFormModal");
const viewDetailsModal = document.querySelector(".detailsModal");
const form = document.querySelector(".addFormModal form");
const boxsFromstorage = await initBoxs()
if (!boxsFromstorage.length) {
  datas.map((data)=>{
    addBox(data)
  })
  
}
const datasInit = await initBoxs()

let boxs = [...datasInit];



var today = new Date();
let currentBox;
let currentFilter = "daily";

// some fum
const closeModal = () => {
  addFormModal.classList.remove("active");
};

const deleteTask = (e) => {
  const id = e.target.parentNode.dataset.id;
  currentBox.tasks = currentBox.tasks.filter((task) => task._id !== id);
  let index = boxs.findIndex((box) => box._id === currentBox._id);
  index !== -1 ? (boxs[index] = currentBox) : null;

  boxs.forEach((data) => {
    data.timeframes = calculateTimeframes(data.tasks);
  });
  updateBox(currentBox)
  displayCard(boxs, currentFilter);

  displayTask(today);
};

// menu displaying for
const displayMenu = (e) => {
  const id = e.target.dataset.id;

  currentBox = boxs.find((box) => box._id === id);
  

  document.querySelectorAll(".cardMenu").forEach((menu) => {
    menu !== e.target.parentNode.nextElementSibling
      ? menu.classList.remove("active")
      : menu.classList.toggle("active");
  });
};

// task displaying on details modal and logic testing
const displayTask = (today) => {
  if (today.toDateString() === new Date().toDateString()) {
    next.style.display = "none";
  } else {
    next.style.display = "block";
  }

  document.querySelector(".dateDetails").textContent =
    currentFilter === "daily"
      ? today.toDateString()
      : currentFilter === "weekly"
      ? `${startOfWeek(today)} - ${endOfWeek(today)} `
      : `${months[today.getMonth()]} ${today.getFullYear()}`;

  document.querySelector(".tasks").innerHTML = "";

  const tasks = currentBox.tasks.filter((task) =>
    currentFilter === "weekly"
      ? isThisWeek(new Date(task.createdAt), today)
      : currentFilter === "monthly"
      ? isThisMonth(new Date(task.createdAt), today)
      : task.createdAt.toDateString() === today.toDateString()
  );
  document.querySelector(".totalTime span").textContent =
    convertMunitToNormalTime(
      tasks.reduce((sum, task) => sum + task.timeInMunite, 0)
    );

  tasks.map((elm) => {
    document.querySelector(".tasks").innerHTML += ` 
            <div class="task">
            <div class="calendar">
              <img src="assets/images/icon-calendar.svg" alt="" />
              <p>${
                currentFilter === "daily"
                  ? "today"
                  : currentFilter === "weekly"
                  ? ` ${
                      days[elm.createdAt.getDay()]
                    } </br> ${elm.createdAt.getDate()}`
                  : elm.createdAt.getDate()
              }</p>
            </div>
            <div class="taskDetails">
              <h3>${elm.name}</h3>
              <p>${elm.details}</p>
              <p class="time"> ${elm.startTime} - ${elm.endTime}</p>
            </div>
            <div data-id="${elm._id}" class="actions">
              <img
                src="assets/images/icon-edit.svg"
                class="edit"
                alt="edit"
              />
              <img
                src="assets/images/icon-delete.svg"
                class="delete"
                alt=""
              />
            </div>
          </div>`;
  });
  const deleteItem = document.querySelector(".delete");
  if (deleteItem) deleteItem.onclick = deleteTask;
};

// details display on modal
const displayviewModal = () => {
  viewDetailsModal.classList.toggle("active");

  document.querySelector(".tasks").innerHTML = "";

  displayTask(today);

  document.querySelectorAll(".detailsModal .close").forEach((closebtn) => {
    closebtn.onclick = () => {
      today = new Date();

      viewDetailsModal.classList.remove("active");
    };
  });
};

// Add form display on modal
const displayAddFormModal = () => {
  addFormModal.classList.toggle("active");

  document.querySelector(".formHeader h2").textContent =
    " Add to " + currentBox.title + " Box";

  document.querySelector(".addbtn").textContent = " Add to " + currentBox.title;

  document.querySelectorAll(".addFormModal .close").forEach((closebtn) => {
    closebtn.onclick = closeModal;
  });
};

// card display
const displayCard = (boxs, currentFilter) => {
  details.innerHTML = "";

  filtersOptions.forEach((option) => {
    option.textContent.trim().toLowerCase() === currentFilter
      ? option.classList.toggle("active")
      : option.classList.remove("active");
  });

  boxs.map((box) => {
    details.innerHTML += `
        <div class="card-container ${
          box.title.trim() === "Self Care"
            ? "self-care"
            : box.title.toLowerCase()
        }">
        <img src="assets/images/icon-${
          box.title.trim() === "Self Care"
            ? "self-care"
            : box.title.toLowerCase()
        }.svg" alt="">
        <div class="card-content">
          <div class="card-header">
            <div class="titles">${box.title}</div>
            <img src="assets/images/icon-ellipsis.svg" data-id="${
              box._id
            }" class="icon" alt="">
          </div>
          <div class="cardMenu  ${
            box.title.trim() === "Self Care"
              ? "self-care"
              : box.title.toLowerCase()
          } ">
        <div class="addTask">Add task</div>
        <div class="viewDetails"> View details</div>
      </div>
          <div class="card-body">
            <p class="current">${convertMunitToNormalTime(
              box.timeframes[currentFilter].current
            )} </p>
            <p class="previous">${
              currentFilter === "daily"
                ? "yesterday"
                : currentFilter === "weekly"
                ? "last Week"
                : "last Month"
            }  - ${convertMunitToNormalTime(
      box.timeframes[currentFilter].previous
    )}  </p>
          </div>
        </div>
      </div>
        `;
  });

  const ellipsis = document.querySelectorAll(".icon");

  ellipsis.forEach((ellips) => {
    ellips.onclick = displayMenu;
  });

  document.onclick = (e) => {
    if (!e.target.classList.contains("icon")) {
      document.querySelectorAll(".cardMenu").forEach((menu) => {
        menu.classList.remove("active");
      });
    }
  };

  const AddButtons = document.querySelectorAll(".addTask").forEach((addbtn) => {
    addbtn.onclick = displayAddFormModal;
  });

  const viewButton = document
    .querySelectorAll(".viewDetails")
    .forEach((vbtn) => {
      vbtn.onclick = displayviewModal;
    });
};

displayCard(boxs, currentFilter);

// filter option onclick handles
filtersOptions.forEach((option) => {
  option.onclick = () => {
    currentFilter = option.textContent.toLowerCase().trim();
    displayCard(boxs, currentFilter);
  };
});

const validateTask = (task) => {
  let errors = {};
  if (!task.name) {
    errors.name = "Name is required !";
  }
  if (!task.details) {
    errors.details = "Details is required";
  }
  if (!task.timeInMunite) {
    errors.timeInmunite =
      "Please make sure you have entered the respect times correctly. check start hours and the finish hours inputbox";
  }
  return errors;
};

const displayErrors = (errors) => {
  const errorsName = Object.keys(errors).forEach((name) => {
    const errorDiv = document.querySelector(".error-" + name);
    errorDiv.style.color = "red";
    errorDiv.innerHTML = errors[name];
    setTimeout(() => {
      errorDiv.innerHTML = "";
    }, 2000);
  });
};

// submit handle for add task
const handleSubmit = (e) => {
  e.preventDefault();
  const startHours = form.elements["startHours"].value
    ? form.elements["startHours"].value
    : undefined;
  const startMunite = form.elements["startMunite"].value;
  const endHours = form.elements["endHours"].value
    ? form.elements["endHours"].value
    : undefined;
  const endMunite = form.elements["endMunite"].value;
  const munit = getTimeMunite(startHours, startMunite, endHours, endMunite);
  const newTask = {
    _id: generateID(),
    name: form.elements["name"].value,
    details: form.elements["Taskdetails"].value,
    startTime: ` ${startHours} h ${startMunite}`,
    endTime: ` ${endHours} h ${endMunite}`,
    timeInMunite: munit,
    duree: convertMunitToNormalTime(munit),
    createdAt: new Date(),
  };

  let errors = validateTask(newTask);
  if (Object.keys(errors).length) {
    displayErrors(errors);
    return;
  }
  currentBox.tasks.push(newTask);
  

  currentBox.timeframes = calculateTimeframes(currentBox.tasks);
  const newBox = [...boxs];
  updateBox(currentBox)
  displayCard(newBox, currentFilter);
  form.reset();
  closeModal();
};

// decrement
const decrement = () => {
  currentFilter === "weekly"
    ? today.setDate(today.getDate() - 7)
    : currentFilter === "monthly"
    ? today.setMonth(today.getMonth() - 1)
    : today.setDate(today.getDate() - 1);
  displayTask(today);
};

//  increment
const increment = () => {
  currentFilter === "weekly"
    ? today.setDate(today.getDate() + 7)
    : currentFilter === "monthly"
    ? today.setMonth(today.getMonth() + 1)
    : today.setDate(today.getDate() + 1);
  displayTask(today);
};

form.onsubmit = handleSubmit;
previous.onclick = decrement;
next.onclick = increment;
