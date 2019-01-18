// ---------------------------- OBJECTS ---------------------------

class Background {
  draw() {
    ctx.clearRect(0, 0, canv.width, canv.height);
    
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canv.width, canv.height);
  }
  update() {
    this.draw();
  }
}

class Ball {
  constructor(x, y, radius, color, velocity) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = velocity
  }

  draw() {
    ctx.beginPath();
    
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = this.color;
    ctx.fill();

    ctx.closePath();
  }
  
  update() {
    this.move();
    this.draw();
  }

  move() {
    if (orientation === undefined) return;

    this.x += orientation.x * this.velocity
    this.y += orientation.y * this.velocity

    if(this.x < 0 + this.radius) this.x = 0 + this.radius

    if(this.x > canv.width - this.radius) this.x = canv.width - this.radius

    if(this.y > canv.height - this.radius) this.y = canv.height - this.radius

    if(this.y < 0 + this.radius) this.y = 0 + this.radius
  }
}

class Rect {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  draw () {
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height)
      ctx.fill();
      ctx.closePath();
    }

  update () {
      this.draw();
    }
}

class Timer {
  constructor(date, x, y, color){
    this.date = date
    this.x = x
    this.y = y
    this.color = color
  }

  draw () {
    let time = (Date.now() - this.date) / 1000
    
    ctx.font = '50px serif'
    ctx.textAlign = "center"
    ctx.fillStyle = this.color
    ctx.fillText(time.toFixed(2), this.x, this.y)
  }

  update() {
    this.draw()
  }
}

// ---------------------------- VARIABLES ---------------------------- 

const canv = /** @type {HTMLCanvasElement} */ document.querySelector("canvas");
const ctx = canv.getContext("2d");
const socket = io();

let anim;
let orientation;

let ball;
let background;
let timer;
let walls = [];

const space = 10 //space beetwen object
let holeW = 30
let holeH = 30

let time


// Sockets

socket.on('orientation', function(obj){
  orientationChange(obj)
})

function orientationChange(obj) {
  orientation = {
    x: obj.x,
    y: obj.y
  //  z: obj.z
  };
}

// ---------------------------- CANVAS ---------------------------

function init() {
  ball = new Ball(canv.width / 2 - 5, canv.height / 2 - 5, 15, "red", 0.02);
  background = new Background();

  time = Date.now()
  timer = new Timer(time, canv.width/2, 50, "white")

  walls.push(new Rect(space, space, holeW, holeH, "white"))
  walls.push(new Rect(canv.width - holeW - space, space, holeW, holeH, "white"))

  walls.push(new Rect(canv.width - holeW - space, canv.height - holeH - space, holeW, holeH, "white"))
  walls.push(new Rect(10, canv.height - holeH - space, holeW, holeH, "white"))

}

function animate () {
  anim = requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canv.width, canv.height)

  background.update()

  walls.forEach(wall => {
    wall.update()
  });

  ball.update()
  timer.update()
}

document
.querySelector("#stop")
.addEventListener("click", () => cancelAnimationFrame(anim));

document
.querySelector("#start")
.addEventListener("click", () => requestAnimationFrame(animate));


init()
animate()