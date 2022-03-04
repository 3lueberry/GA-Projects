"use strict";

/////////////////////////////////////////////////
//// LOADING Screen Size and running necessities
/////////////////////////////////////////////////
const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
const mapH = vh;
const mapW = (mapH * 16) / 9;
const playerBackUp = structuredClone(shujinko.cloneMe());

const setViewCenter = () => {
  let x = document.querySelector(`#home`).getBoundingClientRect().x;
  let y = document.querySelector(`#home`).getBoundingClientRect().y;
  shujinko.tag = document.querySelector("#shujinko");
  if (vw < mapW) document.getElementById("container").scrollLeft = (mapW - vw) / 2;
  else x -= document.querySelector("#layer1").getBoundingClientRect().x;
  y -= 80;
  shujinko.updateCurrPos("home");
  shujinko.tag.style.transform = `translate(${x}px, ${y}px) rotate3d(1, 0, 0, 20deg)`;
  startNewGame();
};

//////////////////
//// Footer Menus
//////////////////

/* ---- Character Button ---- */
const characterBtn = () => {
  document.querySelector("#layer3").innerHTML = "";
  document.querySelector("#layer3").classList.add("hidden");

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
    document.querySelector("#char-name").innerText = shujinko.characterName();
    document.querySelector("#char-cash").innerText = "$ " + shujinko.updateCash();
    shujinko.updateStats();
    shujinko.updatePoints();
    shujinko.tag.addEventListener("click", shujinko.berryTalk);
  }
  try {
    document.querySelector("#game-script").remove();
  } catch {}
};

document.querySelector("#exit-character").addEventListener("click", characterBtn);

/* ---- Calender Button ---- */
const calendarBtn = () => {
  log("Calendar");
  const mth = { FEB: "01", MAR: "02", APR: "03", MAY: "04" };
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
          start: new Date(2022, mth[key], date),
          allDay: true,
        });
      }
    });
    log(calEvents);
    var calendarEl = document.getElementById("calendar");
    var calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
      initialDate: new Date(2022, mth[shujinko.today().month], shujinko.today().date),
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

/* ---- Header Event Handler ---- */
const headerEvent = (e) => {
  shujinko.tag.children[0].classList.add("hidden");
  if (document.querySelector("header") === e.target) return;
  if (e.target.id === "save") {
    localStorage.setItem(
      shujinko.characterName(),
      JSON.stringify(structuredClone(shujinko.cloneMe()))
    );
    document.querySelector("#layer5").classList.remove("hidden");
    $("#layer5").append(`
      <div>
          <h3>Saving Game</h3>
          <h5>Your character is successfully saved.</h5>
      </div>`);
    setTimeout(() => {
      document.querySelector("#layer5").innerHTML = "";
      document.querySelector("#layer5").classList.add("hidden");
    }, 2500);
  } else if (e.target.id === "restart") {
    if (confirm("Any unsaved data will be lost. Do you want to reset?")) {
      loading = false;
      if (document.querySelector("#layer4").innerHTML !== "")
        blueQuery.insert("footer", "#layer-character");
      document.querySelector("#layer4").classList.remove("hidden");
      blueQuery.append("#layer4", splashPage[0]);
      newPlayer = document.querySelector("#new-player");
      shujinko.cloneMe(structuredClone(playerBackUp));
      let x = document.querySelector(`#home`).getBoundingClientRect().x;
      let y = document.querySelector(`#home`).getBoundingClientRect().y;
      shujinko.tag = document.querySelector("#shujinko");
      if (vw < mapW) document.getElementById("container").scrollLeft = (mapW - vw) / 2;
      else x -= document.querySelector("#layer1").getBoundingClientRect().x;
      y -= 80;
      shujinko.updateCurrPos("home");
      shujinko.tag.style.transform = `translate(${x}px, ${y}px) rotate3d(1, 0, 0, 20deg)`;
    }
  }
};

/////////////////////////
//// Character Movement
/////////////////////////
const movingNow = (e) => {
  /* ---- hide overhead popup ---- */
  shujinko.tag.children[0].classList.add("hidden");

  /* ---- Location Button to Move ---- */
  if (e.target.classList.contains("location")) pathFinder(e.target.id);
  else if (e.target.id.indexOf("-game") !== -1) {
    /* ---- Enter Game Screen ---- */
    log(e.target.id.indexOf("-game"));
    /* ---- Dynamically load Game Scripts ---- */
    blueQuery.append(
      "head",
      blueQuery.create(
        `script>>src=./scripts/${shujinko.currPos.location}_game.js$$id=game-script$$`
      )
    );
    /* ---- Show Game Screen ---- */
    document.querySelector("#layer3").classList.toggle("hidden");

    /* ---- Lock External Clicks ---- */
    document.querySelector("#layer1").removeEventListener("click", movingNow);
    document.querySelector("footer").removeEventListener("click", footerEvent);
  } else if (e.target.id === "sleeping") {
    shujinko.realHP[0] = shujinko.realHP[1];
    endGame();
    if (shujinko.progress.time === "PM") {
      setTimeout(() => {
        endGame();
      }, 2000);
    }
  }
};

const mainEventListeners = () => {
  /* ---- Header Event Listener ---- */
  document.querySelector("header").addEventListener("click", headerEvent);

  /* ---- Footer Event Listener ---- */
  document.querySelector("footer").addEventListener("click", footerEvent);

  /* ---- Container Div Event Listener ---- */
  document.querySelector("#layer1").addEventListener("click", movingNow);
};

/* ---- Overhead PopUp ---- */
const popup = (location) => {
  shujinko.tag.children[0].children[0].innerText = document.querySelector(
    `#li-${location} h6`
  ).innerText;
  if (shujinko.currPos.location === `home`) {
    shujinko.tag.children[0].children[1].innerHTML = `sleep( <i class="fa-solid fa-bed"></i> );`;
    shujinko.tag.children[0].children[1].id = `sleeping`;
  } else {
    shujinko.tag.children[0].children[1].innerHTML = `enter( <i class="fa-solid fa-dungeon"></i> );`;
    shujinko.tag.children[0].children[1].id = `${location}-game`;
  }
  shujinko.tag.children[0].classList.remove("hidden");
};

/* ---- Exit from Game Screen ---- */
const endGame = () => {
  document.querySelector("#layer5").innerHTML = "";
  document.querySelector("#layer5").classList.add("hidden");
  document.querySelector("#layer3").innerHTML = "";
  document.querySelector("#layer3").classList.add("hidden");
  // characterBtn();
  /* ---- Release External Clicks ---- */

  if (shujinko.progress.time === "AM") {
    shujinko.advance();
    document
      .querySelector("#layer0")
      .setAttribute("style", "-webkit-transition : -webkit-filter 2s linear");
    document.querySelector("#layer0").classList.remove("AM");
    document.querySelector("#layer0").classList.add("PM");
  } else {
    document.querySelector("#layer5").classList.remove("hidden");
    blueQuery.append("#layer5", blueQuery.create(`h4>>${shujinko.today().month}`));
    blueQuery.append("#layer5", blueQuery.create(`h1>>${shujinko.today().date}`));
    setTimeout(() => {
      document.querySelector("#layer5").classList.add("end-day");
      setTimeout(() => {
        let newDay = shujinko.advance(true);
        document.querySelector("#layer5 h4").innerText = newDay.month;
        document.querySelector("#layer5 h1").innerText = newDay.date;
        document.querySelector("#layer5").classList.add("new-day");
        setTimeout(() => {
          document.querySelector("#layer5").innerHTML = "";
          document.querySelector("#layer5").classList.remove("end-day");
          document.querySelector("#layer5").classList.remove("new-day");
          document.querySelector("#layer5").classList.add("hidden");
        }, 2500);
      }, 2000);
    }, 1000);
    document
      .querySelector("#layer0")
      .setAttribute("style", "-webkit-transition : -webkit-filter 4s linear");
    document.querySelector("#layer0").classList.add("AM");
    document.querySelector("#layer0").classList.remove("PM");
  }
  setTimeout(() => {
    document.querySelector("#layer1").addEventListener("click", movingNow);
    document.querySelector("footer").addEventListener("click", footerEvent);
  }, 2000);
};

let splashPage;
let newPlayer = document.querySelector("#new-player");
let loading = false;

const startNewGame = () => {
  document.querySelector("#new-game form").addEventListener("click", (e) => {
    e.preventDefault();
    log(e);
    if (e.target === document.querySelector("#new-game .btn-new-game")) {
      if (document.querySelector("#new-game .btn-new-game").classList.contains("loading")) {
        log(document.getElementById("load-player"));
        log(
          JSON.parse(
            localStorage.getItem(document.getElementById("load-player").selectedOptions[0].value)
          )
        );
        shujinko.cloneMe(
          JSON.parse(
            localStorage.getItem(document.getElementById("load-player").selectedOptions[0].value)
          )
        );
        splashPage = $("#splash-screen").remove();
        document.querySelector("#layer4").classList.add("hidden");
        mainEventListeners();
      } else {
        if (newPlayer.value === "") {
          newPlayer.placeholder += "?";
        } else {
          shujinko.characterName(newPlayer.value);
          splashPage = $("#splash-screen").remove();
          document.querySelector("#layer4").classList.add("hidden");
          mainEventListeners();
        }
      }
    }
    if (e.target === document.querySelector("#new-game .btn-load-game")) {
      if (loading) {
        document.querySelector(
          "#new-game .btn-load-game"
        ).innerHTML = `load( <i class="fa-solid fa-folder-open"></i> );`;
        newPlayer.classList.toggle("hidden");
        document.querySelector("#load-player").classList.toggle("hidden");
        document.querySelector("#new-game .btn-new-game").classList.remove("loading");
      } else {
        loading = true;
        document.querySelector(
          "#new-game .btn-load-game"
        ).innerHTML = `back( <i class="fa-solid fa-delete-left"></i> );`;
        blueQuery.append(
          "#new-game form div",
          blueQuery.create(`select>>id=load-player$$name=load-player$$`)
        );
        newPlayer.classList.add("hidden");
        blueQuery.append(
          "#load-player",
          blueQuery.create(`option>>value=$$-- Select Saved Game --`)
        );
        for (let i = 0; i < localStorage.length; i++) {
          blueQuery.append(
            "#load-player",
            blueQuery.create(`option>>value=${localStorage.key(i)}$$${localStorage.key(i)}`)
          );
        }
        document.querySelector("#new-game .btn-new-game").classList.add("loading");
      }
    }
  });
};

// endGame();
// endGame();

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
