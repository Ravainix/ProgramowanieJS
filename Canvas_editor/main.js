const canv = /** @type {HTMLCanvasElement} */ (document.querySelector('.ps'))
const ctx = canv.getContext('2d')

let mousedown = false;
let inside = false;

let mousePoz = {
  x: 0,
  y: 0
}
let mousePozPrv = {
  x: 0,
  y: 0
}

let imgData = {}


let img = new Image()
img.src = './jesien.jpeg'

const contrastSlider = document.querySelector('#ContrastSlider')
const brightnessSlider = document.querySelector('#BrightnessSlider')


img.addEventListener('load', () => {
  ctx.drawImage(img, 0, 0, canv.width, canv.height)

  imgData = ctx.getImageData(0, 0, canv.width, canv.height)
})

contrastSlider.addEventListener('change', (e) => {
  contrast(parseInt(contrastSlider.value));
  
  document.querySelector('#ContrastValue').innerHTML = contrastSlider.value
}
)

brightnessSlider.addEventListener('input', (e) => {
  brightness(parseInt(brightnessSlider.value))
  
  document.querySelector('#BrightnessValue').innerHTML = brightnessSlider.value
}
)

document.querySelector('#start').addEventListener('click', contrast)

canv.addEventListener("mousedown", e => onMouseDown(e));
document.addEventListener("mouseup", e => onMouseUp(e));
canv.addEventListener("mouseenter", e => onMouseEnter(e));
canv.addEventListener("mouseleave", e => onMouseLeave(e));
canv.addEventListener("mousemove", e => onMouseMove(e));

// function rysuj() {
//   let ctx = this.canvas.getContext("2d");
//   let randomX = Math.floor(Math.random() * this.canvas.width - 5);
//   let randomY = Math.floor(Math.random() * this.canvas.height - 5);
  
//   ctx.fillStyle = this.color;
//   ctx.beginPath();
//   ctx.arc(randomX, randomY, 5, 0, 2 * Math.PI, false);
//   ctx.fill();
// }

function onMouseDown(e) {
  let rect = e.target.getBoundingClientRect();
  
  mousePoz.x = e.clientX - rect.left;
  mousePoz.y = e.clientY - rect.top;
  mousedown = true;
}
function onMouseUp() {
  mousedown = false;
}

function onMouseEnter() {
  inside = true;
}

function onMouseLeave() {
  inside = false;
}

function onMouseMove(e) {
  if (mousedown && inside) {
    let rect = e.target.getBoundingClientRect();
    mousePozPrv.x = mousePoz.x;
    mousePozPrv.y = mousePoz.y;
    mousePoz.x = e.clientX - rect.left;
    mousePoz.y = e.clientY - rect.top;
    ctx.beginPath();
    //ctx.strokeStyle = this.color;
    ctx.lineWidth = 10//this.lineWidth;
    ctx.lineCap = "round";
    ctx.moveTo(mousePozPrv.x, mousePozPrv.y);
    ctx.lineTo(mousePoz.x, mousePoz.y);
    ctx.stroke();
  }
}

function contrast(value) {
  

  let imgData2 =  new ImageData(new Uint8ClampedArray(imgData.data), imgData.width, imgData.height)
  // let factor = (value / 100)
  let factor = (259.0 * (value + 255.0)) / (255.0 * (259.0 - value))
  // let intercept = 128 * (1 - factor)
  
  for (let i = 0; i < imgData.data.length; i += 4) {
    
    imgData2.data[i]     = factor * (imgData.data[i] - 128.0) + 128.0 
    imgData2.data[i + 1] = factor * (imgData.data[i + 1] - 128.0) + 128.0 
    imgData2.data[i + 2] = factor * (imgData.data[i + 2] - 128.0) + 128.0 
    // imgData2.data[i] = imgData.data[i] * factor + intercept
    // imgData2.data[i + 1] = imgData.data[i + 1] * factor + intercept
    // imgData2.data[i + 2] = imgData.data[i + 2] * factor + intercept
    
  } 
  
  ctx.putImageData(imgData2, 0, 0)
  // console.log(factor * (imgData2.data[1] - 128) + 128)
  }


function brightness(value) {

  let imgData2 =  new ImageData(new Uint8ClampedArray(imgData.data), imgData.width, imgData.height)
  
    for (let i = 0; i < imgData.data.length; i += 4) {
    
    imgData2.data[i]     += 255 * (value / 100);
    imgData2.data[i + 1] += 255 * (value / 100);
    imgData2.data[i + 2] += 255 * (value / 100);
    }

  ctx.putImageData(imgData2, 0, 0)
  // console.log(imgData2.data[0] += parseInt(value))
}
