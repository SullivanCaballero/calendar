//Puedes clicar en un día, crear un evento con título, hora de empezar y de acabar y descripción.
//En el calendario, en el cuadrado del día se muestran los diferentes eventos que puedan haber en ese día y el formato: Título del evento y hora de empezar. (Input para escribir, formularios, relacionar nodo html con datos)
//Crear persistencia (F5 => datos guardados y que no se pierdan)-> HINT: localStorage o indexedDB.

const dataToSave = [];
let canRequest = false;
let db;
let nombreEvento;
let requestDB = window.indexedDB.open("DayDatabase", 1);
requestDB.onerror = function (event) {
  alert(`Que no hay database, que te calles la boca bobo`);
};

requestDB.onsuccess = () => {
  db = requestDB.result;
  // const _request = requestDataDB(currentYear, currentMonth);
};

requestDB.onupgradeneeded = function (event) {
  const _db = requestDB.result;

  const objectStore = _db.createObjectStore("eventsOnADay", { autoIncrement: true });

  objectStore.createIndex("month", "month", { unique: false });
  objectStore.createIndex("year", "year", { unique: false });
};

//Comprobar los datos guardados

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
  if (canRequest) {
    requestDataDB(currentYear, currentMonth);
  }
};

const onSelectYear = (year) => {
  currentYear = year;
  yearCol.innerText = `${currentYear}`;
  renderCalendar();
  if (canRequest) {
    requestDataDB(currentYear, currentMonth);
  }
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
        createEvent(col);
      } else {
        col.setAttribute("class", "col day-col text-muted text-center text-decoration-underline");
        createEvent(col);
      }

      if (initDate.getDate() == presentDay && initDate.getMonth() == presentMonth) {
        col.setAttribute("class", "col day-col text-center bg-primary");
        createEvent(col);
      }

      initDate.setDate(initDate.getDate() + 1);

      row.appendChild(col);
      col.addEventListener(`click`, (e) => {
        const clicked = e.target;
        console.log("este es el día que has clickeado", clicked.id);
        if (clicked.id !== "") {
          let monthOnClick = clicked.id.split("-");
          mn = parseInt(monthOnClick[1]) + 1;
        }
        if (mn - 1 === currentMonth) {
          createEventEntry(clicked);
        }
      });
    }
  }

  requestDB.onsuccess = (e) => {
    db = e.target.result;
    requestDataDB(currentYear, currentMonth);
    canRequest = true;
  };
};

const createEvent = (element) => {
  const parent = document.createElement(`div`);
  parent.setAttribute(`class`, `list-group`);
  parent.setAttribute(`id`, `list-group`);
  element.appendChild(parent);
};

const createEventEntry = (element) => {
  const parent = element.childNodes[1];
  if (parent != null) {
    const popDiv = document.createElement(`div`);
    popDiv.setAttribute(`class`, `event-button bg-primary m-1`);
    popDiv.innerHTML = nombreEvento;
    new bootstrap.Popover(popDiv, {
      html: true,
      title: `Create new event`,
      sanitize: false,
      placement: `right`,
      content: `<div class="popover-active form-group" id="${element.querySelector(`span`).id}">
    <div class="input-group p-1">
    <span class="input-group-text">Event name</span>  
    <input  type="text" class="event-name form-control" placeholder="Event name" aria-label="Event name" aria-describedby="event-name">
    </div>
    <div class ="input-group p-1 ps-5">
      <span class="input-group-text" id="start-time">From</span>  
      <input class="event-start" type="time" aria-label="Start time" aria-describedby="start-time">
      <span class="input-group-text" id="end-time">To</span>  
      <input class="event-end" type="time" aria-label="End time" aria-describedby="end-time"> 
    </div>
    <div class="input-group p-1">
    <span class="input-group-text" id="event-descr">Event description</span>  
    <textarea  type="text" class="event-description form-control" placeholder="Event description" aria-label="Event description" aria-describedby="event-descr"></textarea>
    </div>
    <div class="d-md-flex justify-content-md-end">
    <button class="btn btn-outline-secondary" type="submit" id="confirm-button" onclick="submitEvent()">Create</button>
    </div>
    
    </div>`,
    });

    parent.appendChild(popDiv);

    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
      return new bootstrap.Popover(popoverTriggerEl);
    });
  }
};

const addEvent = (month, year, day, name, start, end, description) => {
  return db
    .transaction(["eventsOnADay"], "readwrite")
    .objectStore("eventsOnADay")
    .add({ month, year, day, name, start, end, description });
};

const submitEvent = () => {
  //Get data from the Input

  const dayClicked = document.querySelector(`.popover-active`);
  const eventName = document.querySelector(`.event-name`);
  const eventStart = document.querySelector(`.event-start`);
  const eventEnd = document.querySelector(`.event-end`);
  const eventDescription = document.querySelector(`.event-description`);

  const request = addEvent(
    mn,
    currentYear,
    parseInt(dayClicked.id),
    eventName.value,
    eventStart.value,
    eventEnd.value,
    eventDescription.value
  );

  const popoverActivo = document.querySelector(`.popover`);
  const popover = bootstrap.Popover.getInstance(popoverActivo);
  popover.hide();

  // alert(`evento creado`);
};

const requestDataDB = (currentYear, currentMonth) => {
  const _req = db.transaction(["eventsOnADay"], "readwrite").objectStore("eventsOnADay").getAll();

  _req.onsuccess = function (event) {
    const arrayResult = _req.result;
    console.log(arrayResult);

    const mnth = arrayResult.filter(({ month }) => month === currentMonth + 1);
    const evnts = mnth.filter(({ year }) => year === currentYear);

    console.log(mnth);

    for (i in evnts) {
      const { month: elmes, day: eldia, name: elnombre } = evnts[i];
      console.log(elmes, eldia, elnombre);
      const coge = document.getElementById(`${eldia}-${elmes - 1}`);
      nombreEvento = elnombre;

      createEventEntry(coge);

      console.log("BUENAS");
    }
  };
};

const f = () => {
  document.body.appendChild(container);
  addYears();
  addMonths();
  onSelectYear(currentYear);
  onSelectMonth("January", currentMonth);
};
