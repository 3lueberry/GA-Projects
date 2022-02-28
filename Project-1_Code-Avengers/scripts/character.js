"use strict";

const shujinko = {
  name: "Blueberry",
  hp: 100,
  sp: 100,
  occupation: {},
  stamina: 0,
  mentality: 0,
  strength: 0,
  knowledge: 0,
  chrisma: 0,
  currPos: { location: "home" },
  items: [],
  progress: {
    percent: 0,
    milestones: [],
    day: 1,
    time: "AM",
    gameOver: 95,
    weeks: ["TUE", "WED", "THU", "FRI", "SAT", "SUN", "MON"],
    months: { FEB: 28, MAR: 31, APR: 30, MAY: 31 },
    holidays: {
      FEB: {
        1: "Lunar New Year's Eve",
        2: "Lunar New Year's Day",
        11: "National Foundation Day",
        21: "No Class",
        22: "No Class",
        23: "The Emperor's Birthday",
      },
      MAR: { 21: "Vernal Equinox Day" },
      APR: { 15: "Good Friday", 29: "Showa Day" },
      MAY: {
        2: "Labour Day",
        3: "Constitution Memorial Day",
        4: "Greenery Day",
        5: "Children's Day",
      },
    },
  },
  charName: function (name = "") {
    if (name !== "") this.name = name;
    return this.name;
  },
  updatePoints: function (...args) {
    let change = { hp: 0, sp: 0 };
    for (let point of args) change[point.split(":")[0]] = parseInt(point.split(":")[1]);
    if (change.hp < 0 || change.sp < 0) {
      change.hp * -1 < Math.floor(this.stamina * 0.5)
        ? (change.hp = 0)
        : (change.hp += Math.floor(this.mentality * 0.5));
      change.sp * -1 < Math.floor(this.mentality * 0.5)
        ? (change.sp = 0)
        : (change.sp += Math.floor(this.mentality * 0.5));
    }
    this.hp += change.hp;
    this.sp += change.sp;
    return [this.hp, this.sp];
  },
  updateStats: function (...args) {
    for (let stat of args) {
      if (this[stat.split(":")[0]] > parseInt(stat.split(":")[1]) * -1)
        this[stat.split(":")[0]] += parseInt(stat.split(":")[1]);
      else this[stat.split(":")[0]] = 0;
    }
    return [this.stamina, this.mentality, this.strength, this.knowledge, this.chrisma];
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
    if (location != undefined) this.currPos.location = location;
    let pos = document.querySelector(`#shujinko`).getBoundingClientRect();
    this.currPos.x = pos.x;
    this.currPos.y = pos.y;
    return this.currPos;
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

// let stats = shujinko.updateStats("stamina:10", "mentality:5", "chrisma:-1");
// console.log(stats);

// stats = shujinko.updateStats("stamina:-15", "knowledge:5", "chrisma:5");
// console.log(stats);

// console.log(shujinko.updatePoints());
// console.log(shujinko.updateStats());

// console.log(shujinko.today());
// console.log(shujinko.advance());
// console.log(shujinko.advance(true));
// console.log(shujinko.advance(true));
