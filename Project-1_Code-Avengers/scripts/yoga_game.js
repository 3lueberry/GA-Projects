"use strict";

$("#layer3").append(`
     <div class="game" id="yoga-game">
        <div class="instructions">
          <h3>Welcome to Await Yoga</h3>
          <p>Cool your mind and be ready to shake it down!!!</p>
        </div>

        <div class="screen">
          <div class="left-col">
            <div class="">
              <div class="power"></div>
            </div>
          </div>
          <div class="block-col"></div>
          <div class="right-col">
            <div class="hammer">
              <i class="fa-solid fa-gavel"></i>
            </div>
          </div>
        </div>
        <div class="controller">
          <button type="button" class="btn btn-danger" id="start-game">
            Start( <i class="fa-solid fa-play"></i> );
          </button>
        </div>
      </div>
 `);

let start = false;
let hit = false;

const code = [
  `for(`,
  `let i = 0;`,
  `i < arr.length;`,
  `i++) `,
  `console.log(`,
  `"Hello World"`,
  ` + `,
  `arr[i]);`,
];

let randomCode = [...code];

for (let i = 0; i < 8; i++) {
  if (i < 7) {
    let randNum = random(8, i + 1);
    [randomCode[i], randomCode[randNum]] = [randomCode[randNum], randomCode[i]];
  }
  let rgb = [random(256), random(256), random(256)];
  let color = `rgb(${rgb.join(",")})`;
  $("#yoga-game .block-col").append(
    blueQuery.create(
      `div>>class=blocks$$id=block${i}$$style=background:linear-gradient(#fff 2%, ${color} 90%, #fff);$$${randomCode[i]}`
    )
  );
  if (rgb[0] + rgb[1] + rgb[2] > 382) document.querySelector(`#block${i}`).style.color = "#000";
  else document.querySelector(`#block${i}`).style.color = "#fff";
  document.querySelector(`#block${i}`).style.lineHeight =
    document.querySelector(`#block${i}`).getBoundingClientRect().height + "px";
}

log(code, randomCode);

const rightCol = document.querySelector(".right-col");
let blocks = document.querySelectorAll(".blocks");
const hammer = document.querySelector(".hammer");
const blockH = blocks[0].getBoundingClientRect().height + 2;
hammer.style.height = blockH + "px";
hammer.style.lineHeight = blockH + "px";
hammer.style.fontSize = blockH + "px";
let hammerPos;

rightCol.style.height = blockH * blocks.length + "px";

// console.log(hammer, hammer.style.height);
// console.log(document.querySelector(".block-col").getBoundingClientRect().height);

const setAnimation = () => {
  log(hammer.style.animationDuration);
  hammer.style.animationDuration = 0.1 * blocks.length + "s";
};

const startSwing = () => {};

const playGame = (e) => {
  log(blocks.length, rightCol.style.height);
  let height;
  if (!hit) {
    height = hammer.getBoundingClientRect().height;
    if (blocks.length > 1) {
      hammer.classList.toggle("moving");
      if (
        document.attachEvent
          ? document.readyState === "complete"
          : document.readyState !== "loading"
      ) {
        setAnimation();
      } else {
        document.addEventListener("DOMContentLoaded", setAnimation);
      }
    }
    if (start) {
      hammer.style.height = height + "px";
      hammer.children[0].classList.toggle("swing");
      document.querySelector(".power").classList.toggle("moving");
      hammerPos = hammer.getBoundingClientRect().height - blockH * 0.1;
      hit = true;
      document.querySelector("#start-game").innerHTML = `HIT( <i class="fa-solid fa-gavel"></i> );`;
    } else {
      start = true;
      document.querySelector(
        "#start-game"
      ).innerHTML = `Stop ( <i class="fa-solid fa-stop"></i> );`;
    }
  } else {
    document.querySelector("#start-game").removeEventListener("click", playGame);

    hammer.children[0].classList.toggle("swing");
    // hammer.children[0].style.transformOrigin = "bottom right";
    hammer.children[0].style.transform = "translate(-50%,-20%) rotateZ(-60deg)";
    height = document.querySelector(".power").getBoundingClientRect().height;
    document.querySelector(".power").classList.toggle("moving");
    document.querySelector(".power").style.height = height + "px";
    let hitBlock = [blocks.length - Math.ceil(hammerPos / blockH), -1];
    let strength =
      (height / document.querySelector(".power").parentNode.getBoundingClientRect().height) * 100;
    log(strength);
    if ((hammerPos % blockH) / blockH >= 0.7) {
      hitBlock = [hitBlock[0], hitBlock[0] - 1];
      strength = [strength, strength * 0.3, strength];
    } else if ((hammerPos % blockH) / blockH <= 0.35) {
      hitBlock = [hitBlock[0], hitBlock[0] + 1];
      strength = [strength, strength * 0.3, strength];
    } else strength = [strength, 0];

    log(strength);
    log(hammerPos, blockH, hammerPos / blockH, (hammerPos % blockH) / blockH);

    if ((hammerPos % blockH) / blockH >= 0.85 || (hammerPos % blockH) / blockH <= 0.15)
      [strength[0], strength[1]] = [strength[2] * 0.5, strength[2] * 0.5];

    strength[0] +=
      ((document.querySelector("#yoga-game .block-col").getBoundingClientRect().left -
        blocks[hitBlock[0]].getBoundingClientRect().left) /
        blocks[hitBlock[0]].getBoundingClientRect().width) *
      100;

    if (hitBlock[1] >= 0 && hitBlock[1] < blocks.length) {
      strength[1] +=
        ((document.querySelector("#yoga-game .block-col").getBoundingClientRect().left -
          blocks[hitBlock[1]].getBoundingClientRect().left) /
          blocks[hitBlock[1]].getBoundingClientRect().width) *
        100;
    }

    log(strength);
    if (strength[0] > 70) strength[0] = 200;

    log(hitBlock, strength, hammer.getBoundingClientRect().height);
    blocks[hitBlock[0]].style.transition = `transform 0.3s linear`;
    blocks[hitBlock[0]].style.transform = `translateX(-${strength[0]}%)`;
    if (hitBlock[1] >= 0 && hitBlock[1] < blocks.length) {
      blocks[hitBlock[1]].style.transition = `transform 0.3s linear`;
      blocks[hitBlock[1]].style.transform = `translateX(-${strength[1]}%)`;
    }

    setTimeout(() => {
      log(
        blocks[hitBlock[0]].getBoundingClientRect().right,
        document.querySelector("#yoga-game .block-col").getBoundingClientRect().left
      );
      if (
        blocks[hitBlock[0]].getBoundingClientRect().right <=
        document.querySelector("#yoga-game .block-col").getBoundingClientRect().left
      )
        blocks[hitBlock[0]].remove();

      if (
        hitBlock[1] >= 0 &&
        hitBlock[1] < blocks.length &&
        blocks[hitBlock[1]].getBoundingClientRect().right <=
          document.querySelector("#yoga-game .block-col").getBoundingClientRect().left
      )
        blocks[hitBlock[1]].remove();

      blocks = document.querySelectorAll(".blocks");
      rightCol.style.height = blockH * blocks.length + "px";

      if (blocks.length > 0) {
        if (blocks.length > 1) start = false;

        hit = false;
        document.querySelector(
          "#start-game"
        ).innerHTML = `Start ( <i class="fa-solid fa-play"></i> );`;
        hammer.children[0].style.transform = "translate(0,0) rotateZ(0)";
        document.querySelector("#start-game").addEventListener("click", playGame);
      } else {
        document.querySelector("#start-game").innerHTML = `Game Over!`;
      }
    }, 300);
  }
};

document.querySelector("#start-game").addEventListener("click", playGame);
