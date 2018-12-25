const canv = /** @type {HTMLCanvasElement} */ (document.querySelector(".ps"));
const ctx = canv.getContext("2d");

let drawingOpt = {
  mousedown: false,
  inside: false,
  mousePoz: {
    x: 0,
    y: 0
  },
  mousePozPrv: {
    x: 0,
    y: 0
  },
  paleta: [
    "rgb(0, 0, 0)",
    "rgb(255, 255, 255)",
    "rgb(255, 0, 0)",
    "rgb(0, 0, 255)",
    "rgb(150, 111, 255)",
    "rgb(50, 111, 50)",
    "rgb(0,255,255)",
    "rgb(255,215,0)"
  ],
  color: "rgb(0, 0, 0)",
  lineWidth: 2
};

let imgData = {};

let img = new Image();
img.src = "./jesien.jpeg";

const contrastSlider = document.querySelector("#ContrastSlider");
const brightnessSlider = document.querySelector("#BrightnessSlider");

img.addEventListener("load", () => {
  ctx.drawImage(img, 0, 0, canv.width, canv.height);

  imgData = ctx.getImageData(0, 0, canv.width, canv.height);
});

window.addEventListener("load", () => createPalete(drawingOpt.paleta));

document
  .querySelector("#lineWidth")
  .addEventListener("change", e => changeThickness(e));

document.querySelector("#kit").addEventListener("click", e => changeColor(e));

contrastSlider.addEventListener("change", e => {
  contrast(parseInt(contrastSlider.value));

  document.querySelector("#ContrastValue").innerHTML = contrastSlider.value;
});

brightnessSlider.addEventListener("input", e => {
  brightness(parseInt(brightnessSlider.value));

  document.querySelector("#BrightnessValue").innerHTML = brightnessSlider.value;
});

document
  .querySelector("#restart")
  .addEventListener("click", () => ctx.putImageData(imgData, 0, 0));

document
  .querySelector("#download")
  .addEventListener("click", () => downloadCanvas());

canv.addEventListener("mousedown", e => onMouseDown(e));
document.addEventListener("mouseup", e => onMouseUp(e));
canv.addEventListener("mouseenter", e => onMouseEnter(e));
canv.addEventListener("mouseleave", e => onMouseLeave(e));
canv.addEventListener("mousemove", e => onMouseMove(e));

function onMouseDown(e) {
  let rect = e.target.getBoundingClientRect();

  drawingOpt.mousePoz.x = e.clientX - rect.left;
  drawingOpt.mousePoz.y = e.clientY - rect.top;
  drawingOpt.mousedown = true;
}

function onMouseUp() {
  drawingOpt.mousedown = false;
}

function onMouseEnter() {
  drawingOpt.inside = true;
}

function onMouseLeave() {
  drawingOpt.inside = false;
}

function onMouseMove(e) {
  if (drawingOpt.mousedown && drawingOpt.inside) {
    let rect = e.target.getBoundingClientRect();
    drawingOpt.mousePozPrv.x = drawingOpt.mousePoz.x;
    drawingOpt.mousePozPrv.y = drawingOpt.mousePoz.y;
    drawingOpt.mousePoz.x = e.clientX - rect.left;
    drawingOpt.mousePoz.y = e.clientY - rect.top;
    ctx.beginPath();
    ctx.strokeStyle = drawingOpt.color;
    ctx.lineWidth = drawingOpt.lineWidth;
    ctx.lineCap = "round";
    ctx.moveTo(drawingOpt.mousePozPrv.x, drawingOpt.mousePozPrv.y);
    ctx.lineTo(drawingOpt.mousePoz.x, drawingOpt.mousePoz.y);
    ctx.stroke();
  }
}

function downloadCanvas() {
  document
    .querySelector("#download")
    .setAttribute(
      "href",
      canv.toDataURL("image/png").replace("image/png", "image/octet-stream")
    );
}

function createPalete(paleteArr) {
  paleteArr.forEach(el => {
    let newColor = document.createElement("button");

    newColor.className = "btn-color";
    newColor.style.backgroundColor = el;

    document.querySelector("#kit").appendChild(newColor);
  });
}

function changeColor(event) {
  drawingOpt.color = event.target.style.backgroundColor;

  let colorArr = document.querySelectorAll(".btn-color");
  colorArr.forEach(el => {
    el.addEventListener("click", e => {
      colorArr.forEach(el => el.classList.remove("color-selected"));
      e.target.classList.toggle("color-selected");
    });
  });
}

function changeThickness(event) {
  drawingOpt.lineWidth = event.target.value;
}

//---------------------- Filters ----------------------

function contrast(value) {
  let imgData2 = new ImageData(
    new Uint8ClampedArray(imgData.data),
    imgData.width,
    imgData.height
  );
  let factor = (259.0 * (value + 255.0)) / (255.0 * (259.0 - value));

  for (let i = 0; i < imgData.data.length; i += 4) {
    imgData2.data[i] = factor * (imgData.data[i] - 128.0) + 128.0;
    imgData2.data[i + 1] = factor * (imgData.data[i + 1] - 128.0) + 128.0;
    imgData2.data[i + 2] = factor * (imgData.data[i + 2] - 128.0) + 128.0;
  }

  ctx.putImageData(imgData2, 0, 0);
}

function brightness(value) {
  let imgData2 = new ImageData(
    new Uint8ClampedArray(imgData.data),
    imgData.width,
    imgData.height
  );

  for (let i = 0; i < imgData.data.length; i += 4) {
    imgData2.data[i] += 255 * (value / 100);
    imgData2.data[i + 1] += 255 * (value / 100);
    imgData2.data[i + 2] += 255 * (value / 100);
  }

  ctx.putImageData(imgData2, 0, 0);
}
