"use strict";

let shujinko = {
  name: "Blueberry",
  hp: 100,
  realHP: [100, 100],
  sp: 100,
  realSP: [100, 100],
  cash: 500,
  occupation: {},
  stamina: 10,
  mentality: 10,
  strength: 10,
  knowledge: 10,
  charisma: 10,
  tag: null,
  currPos: { location: "home" },
  items: [],
  progress: {
    percent: 0,
    milestones: [],
    day: 28,
    time: "AM",
    gameOver: 95,
    weeks: ["TUE", "WED", "THU", "FRI", "SAT", "SUN", "MON"],
    months: { FEB: 28, MAR: 31, APR: 30, MAY: 31 },
    holidays: {
      FEB: {
        "01": "Lunar New Year's Eve",
        "02": "Lunar New Year's Day",
        11: "National Foundation Day",
        21: "No Class",
        22: "No Class",
        23: "The Emperor's Birthday",
      },
      MAR: { 21: "Vernal Equinox Day" },
      APR: { 15: "Good Friday", 29: "Showa Day" },
      MAY: {
        "02": "Labour Day",
        "03": "Constitution Memorial Day",
        "04": "Greenery Day",
        "05": "Children's Day",
      },
    },
  },
  speech: {
    anger: 0,
    text: [
      "Hi there!",
      "I'm Blueberry. You're?",
      "Stop poking me.",
      "I'm gonna get mad!",
      "HEY!!! STOP IT!",
      "Sigh...",
    ],
    url: [
      "./src/img/blueberry.png",
      "./src/img/berry_wink.png",
      "./src/img/berry_stare.png",
      "./src/img/berry_mad.png",
      "./src/img/berry_angry.png",
      "./src/img/berry_giveup.png",
    ],
  },
  characterName: function (character = "") {
    if (character !== "") this.name = character;
    return this.name;
  },
  updateCash: function (cash = 0) {
    this.cash += cash;
    return this.cash;
  },
  updatePoints: function (...args) {
    this.realHP[1] = 100 + this.stamina;
    this.realSP[1] = 100 + this.mentality;
    let change = { hp: 0, sp: 0 };
    for (let point of args) change[point.split(":")[0]] = parseInt(point.split(":")[1]);
    if (change.hp < 0 || change.sp < 0) {
      change.hp * -1 < Math.floor(this.strength * 0.3)
        ? (change.hp = 0)
        : (change.hp += Math.floor(this.strength * 0.3));
      change.sp * -1 < Math.floor(this.knowledge * 0.3)
        ? (change.sp = 0)
        : (change.sp += Math.floor(this.knowledge * 0.3));
    }
    this.realHP[0] += change.hp;
    this.hp = Math.round((this.realHP[0] / this.realHP[1]) * 100);
    this.realSP[0] += change.sp;
    this.sp = Math.round((this.realSP[0] / this.realSP[1]) * 100);

    document.querySelector(`#hp-bar span`).style.width = `${this.hp}%`;
    document.querySelector(`#sp-bar span`).style.width = `${this.sp}%`;
    this.updateProgress();
    return [this.hp, this.sp, change.hp, change.sp];
  },
  updateStats: function (...args) {
    for (let stat of args) {
      if (this[stat.split(":")[0]] > parseInt(stat.split(":")[1]) * -1)
        this[stat.split(":")[0]] += parseInt(stat.split(":")[1]);
      else this[stat.split(":")[0]] = 0;
    }
    // characterBtn();
    document.querySelector("#character-stat .star").style.clipPath = this.drawStar(
      this.stamina,
      this.strength,
      this.charisma,
      this.knowledge,
      this.mentality
    );
    this.updateProgress();
    return [this.stamina, this.mentality, this.strength, this.knowledge, this.charisma];
  },
  updateProgress: function () {
    document.querySelector(`#progress-bar span`).style.width = `${this.progress.percent}%`;
    return this.progress;
  },
  today: function () {
    let today = {};
    today.day = this.progress.day;
    today.date = this.progress.day;
    for (let mth of Object.keys(this.progress.months)) {
      if (today.date - this.progress.months[mth] <= 0) {
        today.month = mth;
        break;
      }
      today.date -= this.progress.months[mth];
    }
    today.week = this.progress.weeks[(this.progress.day % 7) - 1];
    today.holiday = this.progress.holidays[today.month][today.date];
    today.time = this.progress.time;
    return today;
  },
  advance: function (newDay = false) {
    if (newDay) {
      this.progress.day++;
      this.progress.time = "AM";
    } else this.progress.time = "PM";
    return this.today();
  },
  updateCurrPos: function (location) {
    if (location != undefined) {
      this.currPos.location = location;
      let pos = document.querySelector(`#${location}`).getBoundingClientRect();
      this.currPos.x = pos.x + pos.width / 2;
      this.currPos.y = pos.y + pos.height / 2;
      log(pos, this.currPos);
    }
    return this.currPos;
  },
  berryTalk: () => {
    if (shujinko.speech.anger === 0) {
      shujinko.timer = setTimeout(() => {
        shujinko.tag.innerHTML = "";
        shujinko.tag.style.backgroundImage = `url(${shujinko.speech.url[0]})`;
        shujinko.speech.anger = 0;
      }, 3000);
    } else {
      clearTimeout(shujinko.timer);
      shujinko.tag.innerHTML = "";
      shujinko.timer = setTimeout(() => {
        shujinko.tag.innerHTML = "";
        shujinko.tag.style.backgroundImage = `url(${shujinko.speech.url[0]})`;
        shujinko.speech.anger = 0;
      }, 3000 * shujinko.speech.anger);
    }
    if (shujinko.speech.anger < 6) {
      shujinko.tag.append(
        blueQuery.create(`h6>>id=berry-speech$$${shujinko.speech.text[shujinko.speech.anger]}`)
      );
      shujinko.tag.style.backgroundImage = `url(${shujinko.speech.url[shujinko.speech.anger]})`;
      shujinko.speech.anger++;
    }
    log(shujinko.timer);
  },

  drawStar: function (a, b, c, d, e, star = true) {
    const x = [];
    const y = 0.35,
      z = 50 - y * 100;
    let temp = 0;

    x.push(50);
    x.push(50 - (a * y + z));

    if (star) {
      temp = a < b ? a / 2 : b / 2;
      x.push(50 + Math.sin((36 * Math.PI) / 180) * (temp * y + z / 2));
      x.push(50 - Math.cos((36 * Math.PI) / 180) * (temp * y + z / 2));
    }

    x.push(50 + Math.cos((18 * Math.PI) / 180) * (b * y + z));
    x.push(50 - Math.sin((18 * Math.PI) / 180) * (b * y + z));

    if (star) {
      temp = c < b ? c / 2 : b / 2;
      x.push(50 + Math.cos((18 * Math.PI) / 180) * (temp * y + z / 2));
      x.push(50 + Math.sin((18 * Math.PI) / 180) * (temp * y + z / 2));
    }

    x.push(50 + Math.cos((54 * Math.PI) / 180) * (c * y + z));
    x.push(50 + Math.sin((54 * Math.PI) / 180) * (c * y + z));

    if (star) {
      temp = c < d ? c / 2 : d / 2;
      x.push(50);
      x.push(50 + (temp * y + z / 2));
    }

    x.push(50 - Math.cos((54 * Math.PI) / 180) * (d * y + z));
    x.push(50 + Math.sin((54 * Math.PI) / 180) * (d * y + z));

    if (star) {
      temp = d < e ? d / 2 : e / 2;
      x.push(50 - Math.cos((18 * Math.PI) / 180) * (temp * y + z / 2));
      x.push(50 + Math.sin((18 * Math.PI) / 180) * (temp * y + z / 2));
    }

    x.push(50 - Math.cos((18 * Math.PI) / 180) * (e * y + z));
    x.push(50 - Math.sin((18 * Math.PI) / 180) * (e * y + z));

    if (star) {
      temp = a < e ? a / 2 : e / 2;
      x.push(50 - Math.sin((36 * Math.PI) / 180) * (temp * y + z / 2));
      x.push(50 - Math.cos((36 * Math.PI) / 180) * (temp * y + z / 2));
    }

    temp = "polygon(";
    for (let i = 0; i < x.length; i++) {
      temp += `${x[i]}%`;
      if (i === x.length - 1) temp += `)`;
      else if (i % 2) temp += `, `;
      else temp += ` `;
    }
    return temp;
  },
  cloneMe: function (meObj = undefined) {
    if (meObj !== undefined) {
      this.name = meObj.name;
      this.hp = meObj.hp;
      this.realHP = meObj.realHP;
      this.sp = meObj.sp;
      this.realSP = meObj.realSP;
      this.cash = meObj.cash;
      this.occupation = meObj.occupation;
      this.stamina = meObj.stamina;
      this.mentality = meObj.mentality;
      this.strength = meObj.strength;
      this.knowledge = meObj.knowledge;
      this.charisma = meObj.charisma;
      this.currPos = meObj.currPos;
      this.items = meObj.items;
      this.progress = meObj.progress;
      this.speech = meObj.speech;
    }
    return {
      name: this.name,
      hp: this.hp,
      realHP: this.realHP,
      sp: this.sp,
      realSP: this.realSP,
      cash: this.cash,
      occupation: this.occupation,
      stamina: this.stamina,
      mentality: this.mentality,
      strength: this.strength,
      knowledge: this.knowledge,
      charisma: this.charisma,
      currPos: this.currPos,
      items: this.items,
      progress: this.progress,
      speech: this.speech,
    };
  },
};

// console.log(shujinko.charName());
// console.log(shujinko.charName("New Name"));
// let [hp, sp] = shujinko.updatePoints("hp:-10");
// console.log(hp, sp);
// [hp, sp] = shujinko.updatePoints("sp:-10");
// console.log(hp, sp);
// [hp, sp] = shujinko.updatePoints("sp:-10", "hp:-10");
// console.log(hp, sp);
// [hp, sp] = shujinko.updatePoints("hp:5", "sp:5");
// console.log(hp, sp);
// [hp, sp] = shujinko.updatePoints("sp:10");
// console.log(hp, sp);
// [hp, sp] = shujinko.updatePoints("hp:10");
// console.log(hp, sp);

// let stats = shujinko.updateStats("stamina:10", "mentality:5", "charisma:-1");
// console.log(stats);

// stats = shujinko.updateStats("stamina:-15", "knowledge:5", "charisma:5");
// console.log(stats);

// console.log(shujinko.updatePoints());
// console.log(shujinko.updateStats());

// console.log(shujinko.today());
// console.log(shujinko.advance());
// console.log(shujinko.advance(true));
// console.log(shujinko.advance(true));
// console.log(shujinko.speech.anger);
