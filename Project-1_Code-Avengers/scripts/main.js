"use strict";

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

// const playingAround = () => {
//   shujinko.tag.classList.toggle("ninpo");
//   shujinko.tag.style.transform = `translate(0, -100vh);`;

//   log(shujinko.tag.getBoundingClientRect());
//   setTimeout(() => {
//     shujinko.tag.classList.toggle("kai");
//   }, 1000);
// };

const characterBtn = () => {
  if (shujinko.tag.parentNode.parentNode.id === "layer-character") {
    log("inside if");
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
  }
};

const calendarBtn = () => {
  log("Calendar");
};

const locationBtn = () => {
  document.querySelector("#location-list").classList.toggle("hidden");
  if (document.querySelector("#location-list").classList.contains("hidden")) {
    document.querySelector("#location-list").removeEventListener("mouseleave", locationBtn);
  } else {
    document.querySelector("#location-list").addEventListener("mouseleave", locationBtn);
  }
};

const footerEvent = (e) => {
  log(e.target, e.currentTarget);
  if (document.querySelector("footer") === e.target) return;
  if (e.target.classList.contains("menu")) eval(e.target.id)();
  else {
    locationBtn();
    pathFinder(e.target.id.split("-")[1]);
  }
};

document.querySelector("footer").addEventListener("click", footerEvent);

const movingNow = (e) => {
  if (e.target.classList.contains("location")) pathFinder(e.target.id);
};

document.querySelector("#layer1").addEventListener("click", movingNow);

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

document.querySelector("#exit-character").addEventListener("click", characterBtn);
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
