"use strict";

document.querySelector("body").addEventListener("click", (e) => {
  if (e.target === document.querySelector("#start-game"))
    window.open("./Project-1_Code-Avengers/index.html", "_self");
});
