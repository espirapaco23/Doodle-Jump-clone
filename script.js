document.addEventListener("DOMContentLoaded", () => {
  const net = document.querySelector(".net");
  const doodle = document.createElement("doodle");
  let doodleLeftSpace = 50;
  let startPoint = 150;
  let doodleBottomSpace = startPoint;
  let isGameOver = false;
  let platformCount = 6;
  let platform = [];
  let upTimerId;
  let downTimerId;
  let isJumping = true;
  let isGoingLeft = false;
  let isGoingRight = false;
  let leftTimerId;
  let rightTimerId;
  let score = 0;

  function createDoodle() {
    net.appendChild(doodle);
    doodle.classList.add("doodle");
    doodleLeftSpace = platform[0].left;
    doodle.style.left = doodleLeftSpace + "px";
    doodle.style.bottom = doodleBottomSpace + "px";
  }

  class Platform {
    constructor(newPlatformBottom) {
      this.bottom = newPlatformBottom;
      this.left = Math.random() * 315;
      this.visual = document.createElement("div");

      const visual = this.visual;
      visual.classList.add("platform");
      visual.style.left = this.left + "px";
      visual.style.bottom = this.bottom + "px";
      net.appendChild(visual);
    }
  }

  function createPlatform() {
    for (let i = 0; i < platformCount; i++) {
      let platformSpace = 600 / platformCount;
      let newPlatformBottom = 100 + i * platformSpace;
      let newPlatform = new Platform(newPlatformBottom);
      platform.push(newPlatform);
      console.log(platform);
    }
  }

  function movePlatform() {
    if (doodleBottomSpace > 200) {
      platform.forEach((platforms) => {
        platforms.bottom -= 4;
        let visual = platforms.visual;
        visual.style.bottom = platforms.bottom + "px";

        if (platforms.bottom < 10) {
          let firstPlatform = platform[0].visual;
          firstPlatform.classList.remove("platform");
          platform.shift();
          score++;
          console.log("platform");
          let newPlatforms = new Platform(600);
          platform.push(newPlatforms);
        }
      });
    }
  }

  function jump() {
    clearInterval(downTimerId);
    isJumping = true;
    upTimerId = setInterval(function () {
      doodleBottomSpace += 20;
      doodle.style.bottom = doodleBottomSpace + "px";
      if (doodleBottomSpace > startPoint + 200) {
        fall();
      }
    }, 40);
  }

  function fall() {
    clearInterval(upTimerId);
    isJumping = false;
    downTimerId = setInterval(function () {
      doodleBottomSpace -= 5;
      doodle.style.bottom = doodleBottomSpace + "px";
      if (doodleBottomSpace <= 0) {
        gameOver();
      }
      platform.forEach((platform) => {
        if (
          doodleBottomSpace >= platform.bottom &&
          doodleBottomSpace <= platform.bottom + 15 &&
          doodleLeftSpace + 60 >= platform.left &&
          doodleLeftSpace <= platform.left + 85 &&
          !isJumping
        ) {
          jump();
          startPoint = doodleBottomSpace;
          console.log("landed");
        }
      });
    }, 40);
  }

  //movement
  function control(e) {
    if (e.key === "ArrowLeft") {
      moveLeft();
    } else if (e.key === "ArrowRight") {
      moveRight();
    } else if (e.key === "ArrowUp") {
      moveStraight();
    }
  }

  function moveLeft() {
    if (isGoingRight) {
      clearInterval(rightTimerId);
      isGoingRight = false;
    }
    isGoingLeft = true;
    leftTimerId = setInterval(function () {
      if (doodleLeftSpace >= 0) {
        doodleLeftSpace -= 5;
        doodle.style.left = doodleLeftSpace + "px";
      } else moveRight();
    }, 40);
  }

  function moveRight() {
    if (isGoingLeft) {
      clearInterval(leftTimerId);
      isGoingLeft = false;
    }
    isGoingRight = true;
    rightTimerId = setInterval(function () {
      if (doodleLeftSpace <= 340) {
        doodleLeftSpace += 5;
        doodle.style.left = doodleLeftSpace + "px";
      } else moveLeft();
    }, 40);
  }

  function moveStraight() {
    isGoingRight = false;
    isGoingLeft = false;
    clearInterval(rightTimerId);
    clearInterval(leftTimerId);
  }

  function start() {
    if (!isGameOver) {
      createPlatform();
      createDoodle();
      setInterval(movePlatform, 30);
      jump();
      document.addEventListener("keyup", control);
    }
  }

  function gameOver() {
    isGameOver = true;
    while (net.firstChild) {
      net.removeChild(net.firstChild);
    }
    net.innerHTML = score;
    clearInterval(upTimerId);
    clearInterval(downTimerId);
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);
    console.log("game over");
  }

  start();
});
