"use strict";

let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
let mapH = vh;
let mapW = (mapH * 16) / 9;

const setViewCenter = () => {
  let x = document.querySelector(`#home`).getBoundingClientRect().x;
  let y = document.querySelector(`#home`).getBoundingClientRect().y;

  if (vw < mapW) document.getElementById("container").scrollLeft = (mapW - vw) / 2;
  else x -= document.querySelector("#layer1").getBoundingClientRect().x;
  y -= 80;
  document.querySelector(
    "#shujinko"
  ).style.transform = `translate(${x}px, ${y}px) rotate3d(1, 0, 0, 20deg)`;
};

const characterBtn = () => {
  document.querySelector("#layer4").append(document.querySelector("#layer-character"));
  document.querySelector("#layer4").classList.remove("hidden");
  document.querySelector("#layer-character").classList.remove("hidden");
  blueQuery.insert("#character-info", "#shujinko", true);
  document.querySelector("#shujinko").style.transform = "";
  shujinko.updateStats();
  shujinko.updatePoints();
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

document.querySelector("footer").addEventListener("click", function (e) {
  if (this === e.target) return;
  eval(e.target.id)();
});

document.querySelector("#layer1").addEventListener("click", function (e) {
  log(e.target);
  if (!e.target.classList.contains("location")) return;
  let pos = e.target.getBoundingClientRect();
  let divPos = this.getBoundingClientRect();
  const shujinko = document.querySelector("#shujinko");
  let shujinkoPos = shujinko.getBoundingClientRect();
  let distance = Math.sqrt(
    Math.pow(shujinkoPos.left - pos.left, 2) + Math.pow(shujinkoPos.top + 80 - pos.top, 2)
  );
  log(shujinkoPos, pos);
  log(distance);
  shujinko.style.transition = `transform ${distance / 200}s linear`;
  shujinko.style.transform = `translate(${
    pos.x - divPos.x + pos.width / 2 - shujinkoPos.width / 2
  }px, ${pos.y - 80}px) rotate3d(1, 0, 0, 20deg)`;
  log(shujinko.style.transition, shujinko.style.transform);

  // if (e.target.value === "point1") {
  //   log(e.target.value);
  //   document.querySelector("#shujinko").className = "movePoint1";
  // }
});

document.querySelector("#exit-character").addEventListener("click", function (e) {
  let x = 0,
    y = 0,
    width = 0;

  if (shujinko.currPos.x == undefined || shujinko.currPos.y == undefined) {
    let currPos = document.querySelector(`#${shujinko.currPos.location}`).getBoundingClientRect();
    x = currPos.x;
    y = currPos.y;
    width = currPos.width;
  } else {
    x = shujinko.currPos.x;
    y = shujinko.currPos.y;
  }

  x -= document.querySelector("#layer1").getBoundingClientRect().x;
  y -= 80;

  let shujinkoPos = document.querySelector("#shujinko");
  blueQuery.append("#layer1", shujinkoPos);
  shujinkoPos = shujinkoPos.getBoundingClientRect();

  width = (width - shujinkoPos.width) / 2;
  x += width;

  let time = Math.sqrt(Math.pow(shujinkoPos.x - x, 2) + Math.pow(shujinkoPos.y - y, 2)) / 200;
  document.querySelector("#shujinko").style.transition = `transform ${time}s linear`;
  document.querySelector(
    "#shujinko"
  ).style.transform = `translate(${x}px, ${y}px) rotate3d(1, 0, 0, 20deg)`;

  for (let elem of document.querySelectorAll("#layer4 div")) {
    document.querySelector("#layerCharacter").append(elem);
  }
  document.querySelector("#layer4").classList.remove("character");
  document.querySelector("#layer4").classList.add("hidden");
});
