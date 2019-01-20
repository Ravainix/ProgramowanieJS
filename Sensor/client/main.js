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

class Point {
  constructor(x, y, radius, color, ball, holes) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.ball = ball
    this.holesArr = holes
    this.complete = false
  }

  draw() {
    ctx.beginPath();
    
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = this.color;
    ctx.fill();

    ctx.closePath();
  }
  
  update() {
    this.draw();

    if(this.collision(this.x, this.ball.x, this.y, this.ball.y) < this.radius + this.ball.radius) {
      this.complete = true
      this.moveBallTo(this.holesArr)
    }
  }

  collision (x1, x2, y1, y2) {
    let xDistance = x2 - x1
    let yDistance = y2 - y1

    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2))
  }

  moveBallTo (holes) {
    let num = randomNumberFromRange(0, holes.length - 1)

    this.ball.x = holes[num].x
    this.ball.y = holes[num].y
  }
}

class Timer {
  constructor(date, x, y, color){
    this.date = date
    this.x = x
    this.y = y
    this.color = color
    this.finished = undefined
  }

  draw (time) {
    let timer = (time - this.date) / 1000
    
    ctx.font = '50px serif'
    ctx.textAlign = "center"
    ctx.fillStyle = this.color

    ctx.fillText(timer.toFixed(2), this.x, this.y)
  }

  update() {
    if(this.finished === undefined){
      this.draw(Date.now())
      
    } else {
      this.draw(this.finished)
    }
  }

  gameFinished () {
    if(this.finished === undefined)
      this.finished = Date.now()
  }
}

// ---------------------------- VARIABLES ---------------------------- 

const canv = /** @type {HTMLCanvasElement} */ document.querySelector("canvas");
const ctx = canv.getContext("2d");
const socket = io();

let anim;
let orientation;

const ballRadius = 15;
let ball;
let background;
let timer;
let rects
let holes = [];
let points = [];

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
  ball = new Ball(canv.width / 2 - 5, canv.height / 2 - 5, ballRadius, "red", 0.02);
  background = new Background();

  time = Date.now()
  timer = new Timer(time, canv.width/2, 50, "white")

  holes.push(new Rect(space, space, holeW, holeH, "white"))
  holes.push(new Rect(canv.width - holeW - space, space, holeW, holeH, "white"))

  holes.push(new Rect(canv.width - holeW - space, canv.height - holeH - space, holeW, holeH, "white"))
  holes.push(new Rect(10, canv.height - holeH - space, holeW, holeH, "white"))

  for(let i = 0; i < 4; i++) {
    const radius = 25;

    let holeRadius = randomNumberFromRange(ballRadius, radius)
    let x = randomNumberFromRange(radius, canv.width - radius)
    let y = randomNumberFromRange(radius, canv.height - radius)

    points.push(new Point(x , y, holeRadius, "#00b5cc", ball, holes))
  }

}

function animate () {
  anim = requestAnimationFrame(animate);

  let pointsLeft = (points.filter( point => !point.complete)).length

  ctx.clearRect(0, 0, canv.width, canv.height)

  background.update()

holes.forEach(hole => {
  hole.update()
});

  points.forEach(point => {
    if(!point.complete) point.update()
  });

  ball.move()
  ball.update()

  if(pointsLeft === 0) timer.gameFinished()
  timer.update()
}

function randomNumberFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

document
.querySelector("#stop")
.addEventListener("click", () => cancelAnimationFrame(anim));

document
.querySelector("#start")
.addEventListener("click", () => requestAnimationFrame(animate));


init()
animate()