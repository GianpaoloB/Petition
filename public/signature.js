const canvas = document.getElementById("signature");
const clear = document.getElementsByTagName("button")[0];
const ctx = canvas.getContext("2d");
const inputSig = document.getElementById("signatureVal");
function mySignature() {
  ctx.clearRect(0, 0, 500, 100);
  ctx.strokeStyle = "magenta";
  ctx.lineWidth = 3;
}
var x = 0;
var y = 0;
var allow;
canvas.addEventListener("mousedown", startingPosition => {
  startingPosition.preventDefault();
  allow = true;
  mySignature();
  ctx.moveTo(startingPosition.offsetX, startingPosition.offsetY);
  canvas.addEventListener("mousemove", c => {
    c.preventDefault();
    if (allow == true) {
      x = c.offsetX;
      y = c.offsetY;
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  });
});
canvas.addEventListener("mouseup", () => {
  allow = false;
  return allow;
});
canvas.addEventListener("mouseout", () => {
  allow = false;
  return allow;
});
clear.addEventListener("click", myButton => {
  myButton.preventDefault();
  ctx.beginPath();
  return ctx.clearRect(0, 0, 500, 100);
});

////////////////TOUCH PART

canvas.addEventListener(
  "touchstart",
  function(e) {
    e.preventDefault();
    mousePos = getTouchPos(canvas, e);
    var touch = e.touches[0];
    var mouseEvent = new MouseEvent("mousedown", {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
  },
  false
);
canvas.addEventListener(
  "touchend",
  function(e) {
    var mouseEvent = new MouseEvent("mouseup", {});
    canvas.dispatchEvent(mouseEvent);
  },
  false
);
canvas.addEventListener(
  "touchmove",
  function(e) {
    var touch = e.touches[0];
    var mouseEvent = new MouseEvent("mousemove", {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
  },
  false
);

// Prevent scrolling when touching the canvas
document.body.addEventListener(
  "touchstart",
  function(e) {
    if (e.target == canvas) {
      e.preventDefault();
    }
  },
  false
);
document.body.addEventListener(
  "touchend",
  function(e) {
    if (e.target == canvas) {
      e.preventDefault();
    }
  },
  false
);
document.body.addEventListener(
  "touchmove",
  function(e) {
    if (e.target == canvas) {
      e.preventDefault();
    }
  },
  false
);

// Get the position of the mouse relative to the canvas
function getMousePos(canvasDom, mouseEvent) {
  var rect = canvasDom.getBoundingClientRect();
  return {
    x: mouseEvent.clientX - rect.left,
    y: mouseEvent.clientY - rect.top
  };
}

// Get the position of a touch relative to the canvas
function getTouchPos(canvasDom, touchEvent) {
  var rect = canvasDom.getBoundingClientRect();
  return {
    x: touchEvent.touches[0].clientX - rect.left,
    y: touchEvent.touches[0].clientY - rect.top
  };
}

// Draw to the canvas
function renderCanvas() {
  if (drawing) {
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(mousePos.x, mousePos.y);
    ctx.stroke();
    lastPos = mousePos;
  }
}
(function drawLoop() {
  requestAnimFrame(drawLoop);
  renderCanvas();
})();

document.querySelector("#submit").addEventListener("mousedown", () => {
  console.log(canvas.toDataURL());
  inputSig.value = canvas.toDataURL();
});
////////////
