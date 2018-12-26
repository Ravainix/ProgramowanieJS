const canv = /** @type {HTMLCanvasElement} */ document.querySelector("canvas");
const ctx = canv.getContext("2d");
const socket = io();

socket.on('orientation', function(obj){
  orientationChange(obj)
  console.log(obj)
})

let anim;
let orientation;

const height = canv.height
const width = canv.width

let ball = {
  x: canv.width / 2 - 5,
  y: canv.height / 2 - 5,
  radius: 10
};



function setup() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, width, height);

  moveBall();
  drawBall(ball.x, ball.y, ball.radius, "red");

  anim = requestAnimationFrame(setup);
}

function drawBall(x, y, radius, color) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  // ctx.strokeStyle = 'white'
  // ctx.stroke()
  ctx.fill();
  ctx.closePath();
}

function moveBall() {
  if (orientation === undefined) return;


  // ball.y = height * orientation.y / 180 - 10
  // ball.x = width * orientation.x / 180 - 10

  // console.log(ball.x)

  if (orientation.x > 0 && ball.x <= width - 10) ball.x += 1
  
  if (orientation.x < 0 && ball.x >= 0 + 10) ball.x = ball.x - 1;

  if (orientation.y > 90 && ball.y <= height - 10) ball.y = (height * orientation.y) - 10 //-= 1;

  if (orientation.y < 90 && ball.y >= 0 + 10) ball.y += 1;
}


function orientationChange(obj) {
  orientation = {
    x: obj.x,
    y: obj.y,
    z: obj.z
  };
  console.log(orientation);
  //return orientation;
}

anim = requestAnimationFrame(setup);

// window
//   .addEventListener("deviceorientation", orientationChange);

document
  .querySelector("#stop")
  .addEventListener("click", () => cancelAnimationFrame(anim));

document
  .querySelector("#start")
  .addEventListener("click", () => requestAnimationFrame(setup));
