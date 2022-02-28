"use strict";

const log = (...args) => console.log(...args);
const random = (a, b = 0) => Math.floor(Math.random() * (a - b) + b);

const blueQuery = {
  create: (str) => {
    str = str.split(">>");
    let tag = document.createElement(str.shift());
    str = str[0].split("$$");
    for (let i = 0; i < str.length - 1; i++) {
      tag.setAttribute(str[i].split("=")[0], str[i].split("=")[1]);
    }
    tag.innerText = str[str.length - 1];
    return tag;
  },

  append: (parent, node, prepend = false) => {
    if (typeof parent === "string") parent = document.querySelector(parent);
    if (typeof node === "string") node = document.querySelector(node);
    if (prepend) {
      parent.insertBefore(node, parent.firstChild);
    } else {
      parent.appendChild(node);
    }
  },
  insert: (sibling, node, before = false) => {
    if (typeof sibling === "string") sibling = document.querySelector(sibling);
    if (typeof node === "string") node = document.querySelector(node);
    if (before) {
      sibling.parentNode.insertBefore(node, sibling);
    } else {
      sibling.parentNode.insertBefore(node, sibling.nextSibling);
    }
  },

  removeItem: (item) => item.remove(),

  find: (tag, str, fn) => {
    let foundIt = [];
    document.querySelectorAll(tag).forEach((item) => {
      if (
        item.innerText.toLowerCase().split(" ").indexOf(str.toLowerCase()) >= 0 ||
        item.innerText.toLowerCase() === str.toLowerCase()
      ) {
        if (fn !== undefined) foundIt.push(fn(item));
        else foundIt.push(item);
      }
    });
    return foundIt.length === 0 ? null : foundIt.length === 1 ? foundIt[0] : foundIt;
  },
};

document.querySelector("#layer1").addEventListener("click", function (e) {
  log(e.target);
  let pos = e.target.getBoundingClientRect();
  let divPos = this.getBoundingClientRect();
  const shujinko = document.querySelector("#shujinko");
  let shujinkoPos = shujinko.getBoundingClientRect();
  let distance = Math.sqrt(
    Math.pow(shujinkoPos.left - pos.left, 2) + Math.pow(shujinkoPos.top + 80 - pos.top, 2)
  );
  log(shujinkoPos, pos);
  log(distance);
  shujinko.style.transition = `transform ${Math.round(distance / 200)}s linear`;
  shujinko.style.transform = `translate(${
    pos.x - divPos.x + pos.width / 2 - shujinkoPos.width / 2
  }px, ${pos.y - 80}px) rotate3d(1, 0, 0, 20deg)`;
  log(shujinko.style.transition, shujinko.style.transform);

  // if (e.target.value === "point1") {
  //   log(e.target.value);
  //   document.querySelector("#shujinko").className = "movePoint1";
  // }
});
