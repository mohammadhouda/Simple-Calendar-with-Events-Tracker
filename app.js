date = new Date();

let months = [
  "january",
  "february",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

let eventDate = document.querySelector(".eventdate");
let prevMonth = document.querySelectorAll(".icons span");
let days = document.querySelector(".days-list");
let headDate = document.querySelector(".date");
let currentMonth = date.getMonth();
let currentYear = date.getFullYear();
let addEvent = document.querySelector(".addEvent");
let EventWrapper = document.querySelector(".addevent-wrapper");
let closeEvent = document.querySelector(".closeEvent");
let eventTitle = document.querySelector(".eventTitle");
let timeFrom = document.querySelector(".timeFrom");
let timeTo = document.querySelector(".timeTo");
let todayBtn = document.querySelector(".todayBtn");
let submitBtn = document.querySelector(".submitEvent");
let noEventsMessage = document.querySelector(".noeventsmessage");

let arr = [];
getEvents();

function renderCalendar() {
  let firstDayofTheMonth = new Date(currentYear, currentMonth, 1).getDay();
  let lastDateofTheMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  let lastDateofTheLastMonth = new Date(currentYear, currentMonth, 0).getDate();
  let lastDayOfTheMonth = new Date(
    currentYear,
    currentMonth,
    lastDateofTheMonth
  ).getDay();

  headDate.innerText = `${months[currentMonth]} ${currentYear}`;
  let listDays = "";

  for (let i = firstDayofTheMonth; i > 0; i--) {
    listDays += `<li class="inactive">${lastDateofTheLastMonth - i + 1}</li> `;
  }

  for (let i = 1; i <= lastDateofTheMonth; i++) {
    let isToday =
      i === date.getDate() &&
      currentMonth === date.getMonth() &&
      currentYear === date.getFullYear()
        ? "active"
        : "";

    let hasEvent = arr.some((event) => {
      const [day, month, year] = event.date.split(", ");
      return (
        Number(day) === i &&
        months[currentMonth] === month &&
        Number(year) === currentYear
      );
    });

    listDays += `<li class="${isToday} ${
      hasEvent ? "event-day" : ""
    }">${i}</li> `;
  }

  for (let i = lastDayOfTheMonth; i < 6; i++) {
    listDays += `<li class="inactive">${i - lastDayOfTheMonth + 1}</li> `;
  }

  days.innerHTML = listDays;
}

prevMonth.forEach((icon) => {
  icon.addEventListener("click", () => {
    currentMonth = icon.id === "prev" ? currentMonth - 1 : currentMonth + 1;

    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    } else if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }

    renderCalendar();
  });
});

eventDate.textContent = `${date.getDate()}, ${
  months[currentMonth]
}, ${currentYear}`;

days.addEventListener("click", (e) => {
  let allDays = document.querySelectorAll(".days-list li");
  if (
    e.target &&
    e.target.nodeName == "LI" &&
    !e.target.classList.contains("inactive")
  ) {
    allDays.forEach((ele) => {
      ele.classList.remove("changeColor");
    });
    eventDate.textContent = `${e.target.textContent}, ${months[currentMonth]}, ${currentYear}`;
    displayEventsForSelectedDate(eventDate.textContent);
    e.target.classList.add("changeColor");
  }
});

addEvent.addEventListener("click", () => {
  EventWrapper.classList.toggle("getdown");
});

closeEvent.addEventListener("click", () => {
  EventWrapper.classList.remove("getdown");
});

todayBtn.addEventListener("click", () => {
  currentMonth = date.getMonth();
  currentYear = date.getFullYear();
  renderCalendar();
});

submitBtn.addEventListener("click", (e) => {
  if (
    eventTitle.value.length == 0 ||
    timeFrom.value.length == 0 ||
    timeTo.value.length == 0
  ) {
    alert("Invalid credentials");
  } else if (timeFrom.value > timeTo.value) {
    alert("Enter a valid dates !");
  } else {
    const newEvent = {
      title: eventTitle.value,
      startTime: timeFrom.value,
      endTime: timeTo.value,
      date: eventDate.textContent,
      color: true,
    };

    arr.push(newEvent);
    displayEventsForSelectedDate(eventDate.textContent);
    clearInput();
  }
});

function displayEventsForSelectedDate(selectedDate) {
  const eventsContainer = document.querySelector(".events");
  eventsContainer.innerHTML = "";

  const eventsForSelectedDate = arr.filter(
    (event) => event.date === selectedDate
  );

  if (eventsForSelectedDate.length > 0) {
    eventsForSelectedDate.forEach((event) => {
      const eventElement = document.createElement("div");
      eventElement.classList.add("event");
      eventElement.innerHTML = `
              <div class="firstH">
              <button><i class="fas fa-times close"></i> </button>
              <p>${event.title}</p>
              </div>
              <div class="dates">
              <p>Start Time: ${event.startTime}</p>
              <p>End Time: ${event.endTime}</p>
              </div>
            `;

      saveEvents();

      eventsContainer.appendChild(eventElement);
      noEventsMessage.style.display = "none";

      document.querySelectorAll(".firstH button").forEach((ele) => {
        ele.addEventListener("click", (e) => {
          const eventTitle = e.target
            .closest(".event")
            .querySelector("p").textContent;
          deleteEventFromLocalStorage(eventTitle);
          e.target.closest(".event").remove();
          renderCalendar();
        });
      });
    });
  } else {
    noEventsMessage.style.display = "block";
  }

  const allDays = document.querySelectorAll(".days-list li");
  allDays.forEach((day) => {
    const dayNumber = parseInt(day.textContent);
    const hasEvent = arr.some((event) => {
      const [dayOfMonth, month, year] = event.date.split(", ");
      return (
        Number(dayOfMonth) === dayNumber &&
        months[currentMonth] === month &&
        Number(year) === currentYear
      );
    });
    if (hasEvent) {
      day.classList.add("event-day");
    } else {
      day.classList.remove("event-day");
    }
  });
}

renderCalendar();

function saveEvents() {
  localStorage.setItem("events", JSON.stringify(arr));
}

function getEvents() {
  if (localStorage.getItem("events") === null) {
    return;
  }
  arr.push(...JSON.parse(localStorage.getItem("events")));
}

function deleteEventFromLocalStorage(eventTitle) {
  const index = arr.findIndex((event) => event.title === eventTitle);
  if (index !== -1) {
    arr.splice(index, 1);
    saveEvents();
  }
}

function clearInput() {
  eventTitle.value = "";
  timeFrom.value = "";
  timeTo.value = "";
}
