"use strict";

const nodes = {
  home: ["point1", "point2"],
  point1: ["home", "yoga", "point2"],
  point2: ["home", "playground", "point1"],
  yoga: ["library", "gym", "point1"],
  playground: ["point2", "point3"],
  point3: ["playground", "point4"],
  point4: ["bar", "gym", "point3"],
  gym: ["yoga", "point4", "point5"],
  library: ["school", "yoga", "point5"],
  bar: ["point4", "point5", "point6"],
  point5: ["library", "gym", "bar", "food"],
  point6: ["bar", "point7"],
  point7: ["food", "point6", "point8"],
  food: ["point5", "point7", "point9"],
  school: ["library", "cafe", "point9"],
  point8: ["diner", "work", "point7"],
  diner: ["point8"],
  work: ["point8", "point9"],
  point9: ["school", "food", "work"],
  cafe: ["school"],
};

const calcTravelTime = (dest) => {
  dest = document.querySelector(`#${dest}`).getBoundingClientRect();
  let x1 = dest.x + dest.width / 2;
  let y1 = dest.y + dest.height / 2;
  let pos = document.querySelector(`#${shujinko.currPos.location}`).getBoundingClientRect();
  let x2 = pos.x + pos.width / 2;
  let y2 = pos.y + pos.height / 2;
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) / 200;
};

const moveChar = (path) => {
  log(path);
  let dest = "";
  if (typeof path === "string") dest = path;
  else if (typeof path !== undefined && path.length > 0) dest = path.pop();
  else return;
  let x = document.querySelector(`#${dest}`).getBoundingClientRect().x;
  let y = document.querySelector(`#${dest}`).getBoundingClientRect().y;
  let offset = document.querySelector(`#${dest}`).getBoundingClientRect().width;
  x -= document.querySelector("#layer1").getBoundingClientRect().x;
  offset = (offset - shujinko.tag.getBoundingClientRect().width) / 2;
  x += offset;
  y -= 80;

  let time = calcTravelTime(dest);

  document.querySelector("#layer1").removeEventListener("click", movingNow);

  shujinko.tag.style.transition = `transform ${time}s linear`;
  shujinko.tag.style.transform = `translate(${x}px, ${y}px) rotate3d(1, 0, 0, 20deg)`;
  shujinko.updateCurrPos(dest);

  if (typeof path !== "string" && path.length > 0)
    setTimeout(() => {
      moveChar(path);
    }, time * 1000 + 20);
  else
    setTimeout(() => {
      popup(dest);
      document.querySelector("#layer1").addEventListener("click", movingNow);
    }, time * 1000 + 20);
};

const pathFinder = (dest) => {
  if (dest === shujinko.currPos.location || calcTravelTime(dest) <= 0.8) {
    popup(dest);
    return;
  }
  if (shujinko.currPos.x == undefined || shujinko.currPos.y == undefined) {
    shujinko.currPos.x = shujinko.tag.getBoundingClientRect().x;
    shujinko.currPos.y = shujinko.tag.getBoundingClientRect().y;
  }

  if (nodes[dest].indexOf(shujinko.currPos.location) !== -1) moveChar(dest);
  else {
    const path = [dest];
    let pathFound = false;
    let i = 0;
    // let shortest = calcTravelTime(dest);
    let tempDist, tempLoc;
    // log(path, shortest);
    while (!pathFound && i < 18) {
      let shortest = 10;
      for (let next of nodes[path[i]]) {
        //if (path.indexOf(next) === -1) {
        tempDist = calcTravelTime(next);
        log(shortest, tempDist);
        if (tempDist <= shortest) {
          shortest = tempDist;
          tempLoc = next;
        }
        // }
      }
      log(tempLoc, shortest);
      //   if (tempLoc === path[path.length - 1]) tempLoc = nodes[tempLoc][0];
      i++;
      path.push(tempLoc);
      log(nodes[tempLoc], shujinko.currPos.location);
      if (nodes[tempLoc].indexOf(shujinko.currPos.location) !== -1) pathFound = true;
      log(path);
    }
    if (pathFound) moveChar(path);
    else log(`Path NOT Found!`);
  }
};
