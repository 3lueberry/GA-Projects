"use strict";

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
