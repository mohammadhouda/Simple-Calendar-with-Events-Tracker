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

let prevMonth = document.querySelectorAll(".icons span");

let days = document.querySelector(".days-list");
let headDate = document.querySelector(".date");
let currentMonth = date.getMonth();
let currentYear = date.getFullYear();
renderCalendar();

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

    listDays += `<li class="${isToday}">${i}</li> `;
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
