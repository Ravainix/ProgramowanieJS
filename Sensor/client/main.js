// Objects
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
      ctx.fillRect(this.x, this.y, this.width, this.height)
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.closePath();
    }

  update () {
      this.draw();
    }
}


// --------------------------------------

const canv = /** @type {HTMLCanvasElement} */ document.querySelector("canvas");
const ctx = canv.getContext("2d");
const socket = io();

let anim;
let orientation;

let ball;
let background;


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

// Canvas

function init() {
  ball = new Ball(canv.width / 2 - 5, canv.height / 2 - 5, 15, "red", 0.02);
  background = new Background();
}

function animate () {
  anim = requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canv.width, canv.height)

  background.update()
  ball.update()
}

document
.querySelector("#stop")
.addEventListener("click", () => cancelAnimationFrame(anim));

document
.querySelector("#start")
.addEventListener("click", () => requestAnimationFrame(animate));


init()
animate()