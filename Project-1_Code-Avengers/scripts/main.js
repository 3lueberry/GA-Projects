"use strict";

/////////////////////////////////////////////////
//// LOADING Screen Size and running necessities
/////////////////////////////////////////////////
let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
let mapH = vh;
let mapW = (mapH * 16) / 9;

const setViewCenter = () => {
  let x = document.querySelector(`#home`).getBoundingClientRect().x;
  let y = document.querySelector(`#home`).getBoundingClientRect().y;
  shujinko.tag = document.querySelector("#shujinko");
  if (vw < mapW) document.getElementById("container").scrollLeft = (mapW - vw) / 2;
  else x -= document.querySelector("#layer1").getBoundingClientRect().x;
  y -= 80;
  shujinko.updateCurrPos("home");
  shujinko.tag.style.transform = `translate(${x}px, ${y}px) rotate3d(1, 0, 0, 20deg)`;
};

//////////////////
//// Footer Menus
//////////////////

/* ---- Character Button ---- */
const characterBtn = () => {
  if (shujinko.tag.parentNode.parentNode.id === "layer-character") {
    log("inside if");

    shujinko.tag.removeEventListener("click", shujinko.berryTalk);
    shujinko.tag.classList.toggle("ninpo");
    setTimeout(() => {
      let pos = shujinko.updateCurrPos(shujinko.currPos.location);
      let x = pos.x - document.querySelector("#layer1").getBoundingClientRect().x;
      let y = pos.y - 80;
      blueQuery.append("#layer1", shujinko.tag);
      shujinko.tag.classList.toggle("ninpo");
      shujinko.tag.style.transform = `translate(${x}px, ${y}px) rotate3d(1, 0, 0, 20deg)`;
      document.querySelector("#layer4").classList.toggle("hidden");
      document.querySelector("#layer-character").classList.toggle("hidden");
    }, 1000);
  } else {
    log("inside else");
    document.querySelector("#layer4").append(document.querySelector("#layer-character"));
    document.querySelector("#layer4").classList.toggle("hidden");
    document.querySelector("#layer-character").classList.toggle("hidden");
    blueQuery.insert("#character-info", "#shujinko", true);
    shujinko.tag.style.transform = "";
    shujinko.updateStats();
    shujinko.updatePoints();
    shujinko.tag.addEventListener("click", shujinko.berryTalk);
  }
};

document.querySelector("#exit-character").addEventListener("click", characterBtn);

/* ---- Calender Button ---- */
const calendarBtn = () => {
  log("Calendar");
  // document.querySelector("#game-script").remove();
  // document.querySelector("#layer3").innerHTML = "";

  if (document.querySelector("#layer3").classList.contains("hidden")) {
    document.querySelector("#layer3").classList.toggle("hidden");
    blueQuery.append("#layer3", blueQuery.create(`div>>id=calendar$$`));

    let calEvents = [];

    log(Object.keys(shujinko.progress.holidays));
    Object.keys(shujinko.progress.holidays).forEach((key) => {
      log(Object.keys(shujinko.progress.holidays[key]));
      for (let date of Object.keys(shujinko.progress.holidays[key])) {
        calEvents.push({
          title: shujinko.progress.holidays[key][date],
          start: new Date(2022, "0" + (parseInt(key) - 1), date),
          allDay: true,
        });
      }
    });
    log(calEvents);
    var calendarEl = document.getElementById("calendar");
    var calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
      initialDate: new Date(
        2022,
        "0" + (parseInt(shujinko.today().month) - 1),
        shujinko.today().date
      ),
      validRange: {
        start: "2022-02-01",
        end: "2022-05-06",
      },
      events: calEvents,
    });
    calendar.render();
  } else {
    document.querySelector("#layer3").innerHTML = "";
    document.querySelector("#layer3").classList.toggle("hidden");
  }
};

/* ---- Map Button ---- */
const locationBtn = () => {
  document.querySelector("#location-list").classList.toggle("hidden");
  if (document.querySelector("#location-list").classList.contains("hidden")) {
    document.querySelector("#location-list").removeEventListener("mouseleave", locationBtn);
  } else {
    document.querySelector("#location-list").addEventListener("mouseleave", locationBtn);
  }
};

/* ---- Footer Event Handler ---- */
const footerEvent = (e) => {
  log(e.target, e.currentTarget);

  shujinko.tag.children[0].classList.add("hidden");
  if (document.querySelector("footer") === e.target) return;
  if (e.target.classList.contains("menu")) eval(e.target.id)();
  else {
    locationBtn();
    pathFinder(e.target.id.split("-")[1]);
  }
};

/* ---- Footer Event Listener ---- */
document.querySelector("footer").addEventListener("click", footerEvent);

/////////////////////////
//// Character Movement
/////////////////////////
const movingNow = (e) => {
  shujinko.tag.children[0].classList.add("hidden");
  if (e.target.classList.contains("location")) pathFinder(e.target.id);
  else if (e.target.id.indexOf("-game") !== -1) {
    log(e.target.id.indexOf("-game"));
    blueQuery.append(
      "head",
      blueQuery.create(`script>>src=./scripts/yoga_game.js$$id=game-script$$`)
    );
    document.querySelector("#layer3").classList.toggle("hidden");
  }
};

document.querySelector("#layer1").addEventListener("click", movingNow);

const popup = (location) => {
  shujinko.tag.children[0].children[0].innerText = document.querySelector(
    `#li-${location} h6`
  ).innerText;
  shujinko.tag.children[0].children[1].id = `${location}-game`;
  shujinko.tag.children[0].classList.remove("hidden");
};

// {
//   log(e.target);

// let pos = e.target.getBoundingClientRect();
// let divPos = this.getBoundingClientRect();
// let shujinkoPos = shujinko.tag.getBoundingClientRect();
// let distance = Math.sqrt(
//   Math.pow(shujinkoPos.left - pos.left, 2) + Math.pow(shujinkoPos.top + 80 - pos.top, 2)
// );
// log(shujinkoPos, pos);
// log(distance);
// shujinko.tag.style.transition = `transform ${distance / 200}s linear`;
// shujinko.tag.style.transform = `translate(${
//   pos.x - divPos.x + pos.width / 2 - shujinkoPos.width / 2
// }px, ${pos.y - 80}px) rotate3d(1, 0, 0, 20deg)`;
// log(shujinko.tag.style.transition, shujinko.tag.style.transform);

// if (e.target.value === "point1") {
//   log(e.target.value);
//   shujinko.tag.className = "movePoint1";
// }
// });

// let x = 0,
//   y = 0,
//   width = 0;

// if (shujinko.currPos.x == undefined || shujinko.currPos.y == undefined) {
//   let currPos = document.querySelector(`#${shujinko.currPos.location}`).getBoundingClientRect();
//   x = currPos.x;
//   y = currPos.y;
//   width = currPos.width;
// } else {
//   x = shujinko.currPos.x;
//   y = shujinko.currPos.y;
// }

// x -= document.querySelector("#layer1").getBoundingClientRect().x;
// y -= 80;

// let shujinkoPos = shujinko.tag;
// blueQuery.append("#layer1", shujinkoPos);
// shujinkoPos = shujinkoPos.getBoundingClientRect();

// width = (width - shujinkoPos.width) / 2;
// x += width;

// let time = Math.sqrt(Math.pow(shujinkoPos.x - x, 2) + Math.pow(shujinkoPos.y - y, 2)) / 200;
// shujinko.tag.style.transition = `transform ${time}s linear`;
// shujinko.tag.style.transform = `translate(${x}px, ${y}px) rotate3d(1, 0, 0, 20deg)`;

// for (let elem of document.querySelectorAll("#layer4 div")) {
//   document.querySelector("#layerCharacter").append(elem);
// }
// document.querySelector("#layer4").classList.remove("character");
// document.querySelector("#layer4").classList.add("hidden");
// });

// const playingAround = () => {
//   shujinko.tag.classList.toggle("ninpo");
//   shujinko.tag.style.transform = `translate(0, -100vh);`;

//   log(shujinko.tag.getBoundingClientRect());
//   setTimeout(() => {
//     shujinko.tag.classList.toggle("kai");
//   }, 1000);
// };
