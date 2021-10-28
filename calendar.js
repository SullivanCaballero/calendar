const today = new Date();
const presentDay = today.getDate();
const presentMonth = today.getMonth();
const presentYear = today.getFullYear();
const firstMonth = new Intl.DateTimeFormat("en-us", { month: "long" }).format(new Date(presentYear, 0)).toString();

const container = document.createElement("div");
container.setAttribute("class", "container");
container.setAttribute("id", "calendar-container");

const daysContainer = document.createElement("div");
daysContainer.setAttribute("class", "col");
daysContainer.setAttribute("id", "days");

const dayscontRow = document.createElement("div");
dayscontRow.setAttribute("class", "row ");
dayscontRow.appendChild(daysContainer);

let rowHeader = document.createElement("div");
rowHeader.setAttribute("class", "row");

let monthCol = document.createElement("div");
monthCol.setAttribute("class", "col-6 h1 text-center");

let yearCol = document.createElement("div");
yearCol.setAttribute("class", "col-6 h1 text-center");

let rowWeek = document.createElement("div");
rowWeek.setAttribute("class", "row");
rowWeek.setAttribute("id", "rowWeek");

rowHeader.appendChild(monthCol);
rowHeader.appendChild(yearCol);

container.appendChild(rowHeader);

let currentMonth = 0;
let currentYear = 2021;
let mn = currentMonth;

const onSelectMonth = (monthName, monthIndex) => {
  monthCol.innerText = monthName;
  currentMonth = monthIndex;

  renderCalendar();
};

const onSelectYear = (year) => {
  currentYear = year;
  yearCol.innerText = `${currentYear}`;

  renderCalendar();
};

const addMonths = () => {
  const lst = document.getElementById("mlst");

  for (let m = 0; m < 12; m++) {
    const li = document.createElement("li");
    const anchor = document.createElement("a");
    const monthName = new Intl.DateTimeFormat("en-us", { month: "long" }).format(new Date(2000, m)).toString();

    anchor.setAttribute("class", "dropdown-item");
    anchor.setAttribute("id", monthName);
    anchor.innerText = monthName;
    anchor.addEventListener("click", () => onSelectMonth(monthName, m), false);

    li.appendChild(anchor);
    lst.appendChild(li);
  }
};

const addYears = () => {
  const lsty = document.getElementById("ylst");
  const minimumYear = 2000;

  for (let n = minimumYear; n <= presentYear; n++) {
    const li = document.createElement("li");
    const anchor = document.createElement("a");
    const yearString = n.toString();

    anchor.setAttribute("class", "dropdown-item");
    anchor.setAttribute("id", yearString);
    anchor.addEventListener("click", () => onSelectYear(n), false);
    anchor.innerText = yearString;

    li.appendChild(anchor);
    lsty.appendChild(li);
  }
};

const clearContent = (elementID) => {
  document.getElementById(elementID).innerHTML = "";
};

const renderCalendar = () => {
  container.appendChild(rowWeek);
  const firstday = new Date(currentYear, currentMonth);
  const weekday = firstday.getDay();
  const initDate = new Date(firstday);
  initDate.setFullYear(currentYear);
  initDate.setMonth(currentMonth);
  initDate.setDate(initDate.getDate() - weekday);
  container.appendChild(dayscontRow);
  clearContent("days");

  for (let d = 0; d < 7; d++) {
    const date = new Date(0, 0, d);
    const dayIndex = date.getDay();
    const text = new Intl.DateTimeFormat("en-us", { weekday: "short" }).format(date).toString();
    const colWeek = document.createElement("div");
    colWeek.setAttribute("class", "col text-center text-decoration-underline");
    colWeek.innerText = text;
    colWeek.setAttribute("id", dayIndex);
    if (rowWeek.childElementCount < d + 1) {
      rowWeek.appendChild(colWeek);
    }
  }

  for (let i = 0; i < 6; i++) {
    const row = document.createElement("div");
    row.setAttribute("class", "row align-items-start");

    daysContainer.appendChild(row);

    for (let j = 0; j < 7; j++) {
      const col = document.createElement("div");
      const spano = document.createElement("span");
      spano.setAttribute(`id`, `${initDate.getDate()}`);
      const textspano = document.createTextNode(initDate.getDate().toString());
      spano.appendChild(textspano);
      col.appendChild(spano);

      col.setAttribute(`id`, `${initDate.getDate()}-${initDate.getMonth()}`);

      if (initDate.getMonth() == currentMonth) {
        col.setAttribute("class", "col  day-col text-center");
      } else {
        col.setAttribute("class", "col day-col text-muted text-center text-decoration-underline");
      }

      if (initDate.getDate() == presentDay && initDate.getMonth() == presentMonth) {
        col.setAttribute("class", "col day-col text-center bg-primary");
      }

      initDate.setDate(initDate.getDate() + 1);

      row.appendChild(col);
    }
  }
};

(() => {
  document.body.appendChild(container);
  addYears();
  addMonths();
  onSelectYear(currentYear);
  onSelectMonth("January", currentMonth);
})();
