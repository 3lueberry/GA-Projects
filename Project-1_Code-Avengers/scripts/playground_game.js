"use strict";

$("#layer3").append(`
        <div class="game" id="playground-game">
        <div class="instructions">
        <h3>Welcome to Nested-ball Court</h3>
        <p>You think you can shoot???</p>
        </div>
        <div class="screen">
        <div class="left-col">
            <div class="">
            <div class="power"></div>
            </div>
        </div>
        <div class="block-col"></div>
        <div class="right-col">
            <h5>TIMER</h5>
            <div id="timer"></div>
            <h5>SCORE</h5>
            <div id="score"></div>
        </div>
        </div>
        <div class="controller">
        <button type="button" class="btn btn-danger" id="start-game">
            Start( <i class="fa-solid fa-play"></i> );
        </button>
        </div>
        </div>`);

(() => {
  let start = false;
  let shoot = false;
  let score = 0;
  let timer = 15;
  let myTimerInterval;

  $("#playground-game .block-col").append(blueQuery.create(`div>>id=playground-emoji$$🏀`));
  $("#timer").text(timer);
  $("#score").text(score);

  const startGame = () => {
    $(".instructions p").remove();
    $(".instructions").append(`
      <div class="status-bar-row">
        <div class="status-bar-name"><h5>HP :</h5></div>
        <div class="status-bar-disp" id="hp-bar"><span></span></div>
      </div>`);
    let [, , lostHP] = [0, 0, -30]; //shujinko.updatePoints("hp:-30");
    $("#hp-bar span").text(lostHP);
    setTimeout(() => {
      $("#hp-bar span").text("");
    }, 5000);
    myTimerInterval = setInterval(() => {
      timer--;
      $("#timer").text(timer);
      if (timer < 1) gameOver();
    }, 1000);
  };

  const gameOver = () => {
    document.querySelector("#start-game").removeEventListener("mouseup", shootBall);
    document.querySelector("body").removeEventListener("keyup", spaceBarShoot);
    document.querySelector("#start-game").removeEventListener("mousedown", powerBar);
    document.querySelector("body").removeEventListener("keydown", spaceBarPower);
    clearInterval(myTimerInterval);
    document.querySelector(
      "#start-game"
    ).innerHTML = `exit( <i class="fa-solid fa-door-open"></i> );`;
    let stamina = 1;
    if (score > 0) {
      stamina += Math.floor(score / 3);
    }

    document.querySelector("#layer5").classList.remove("hidden");
    $("#layer5").append(`
      <div class="game" id="game-result">
          <h3>Game Over!</h3>
          <h5>Stamina: +${stamina}</h5>
          <h5>Charisma: -1</h5>
      </div>`);

    shujinko.updateStats(`stamina:${stamina}`, "charisma:-1");
    document.querySelector("#start-game").addEventListener("click", endGame);
    document.querySelector("#start-game").disabled = false;
  };

  const spaceBar = (e) => {
    if (e.key === " ") playGame();
  };

  const spaceBarPower = (e) => {
    if (e.key === " ") powerBar();
  };

  const spaceBarShoot = (e) => {
    if (e.key === " ") shootBall();
  };

  const shootBall = (e) => {
    document.querySelector("#start-game").removeEventListener("mouseup", shootBall);
    document.querySelector("#start-game").disabled = true;
    document.querySelector("body").removeEventListener("keyup", spaceBarShoot);
    const basketBall = document.querySelector("#playground-emoji");
    const powerDiv = document.querySelector(".power");
    let power = powerDiv.getBoundingClientRect().height;
    powerDiv.classList.toggle("moving");
    powerDiv.style.height = power + "px";
    power = (power / powerDiv.parentNode.getBoundingClientRect().height) * 100;

    if (power > 78) basketBall.classList.add("strong");
    else if (power < 73) basketBall.classList.add("weak");
    else {
      basketBall.classList.add("win");
      score++;
      timer++;
      $("#timer").text(timer);
      $("#score").text(score);
    }
    console.log(score, timer);
    setTimeout(() => {
      basketBall.className = "";
      if (timer > 0) {
        document.querySelector("#start-game").addEventListener("mousedown", powerBar);
        document.querySelector("#start-game").disabled = false;
        document.querySelector("body").addEventListener("keydown", spaceBarPower);
      }
    }, 1000);
  };

  const powerBar = (e) => {
    document.querySelector("#start-game").removeEventListener("mousedown", powerBar);
    document.querySelector("body").removeEventListener("keydown", spaceBarPower);

    document.querySelector(".power").classList.toggle("moving");

    document.querySelector("#start-game").addEventListener("mouseup", shootBall);
    document.querySelector("body").addEventListener("keyup", spaceBarShoot);
  };

  const playGame = (e) => {
    document.querySelector("#start-game").removeEventListener("click", playGame);
    document.querySelector("body").removeEventListener("keyup", spaceBar);
    startGame();
    start = true;
    document.querySelector(
      "#start-game"
    ).innerHTML = `shoot( <i class="fa-solid fa-basketball"></i> );`;

    document.querySelector("#start-game").addEventListener("mousedown", powerBar);
    document.querySelector("body").addEventListener("keydown", spaceBarPower);
  };

  document.querySelector("#start-game").addEventListener("click", playGame);
  document.querySelector("body").addEventListener("keyup", spaceBar);
})();
