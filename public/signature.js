const canvas = document.getElementById("signature");
const clear = document.getElementsByTagName("button")[0];
const ctx = canvas.getContext("2d");
const inputSig = document.getElementById("signatureVal");
var x = 0;
var y = 0;
var allow;
///initislization
function mySignature() {
  ctx.clearRect(0, 0, 500, 100);
  ctx.strokeStyle = "magenta";
  ctx.lineWidth = 3;
}

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
function getTouches(e) {
  return e.touches;
}
var offTop = canvas.offsetTop - window.pageYOffset;
var left = canvas.offsetLeft;
canvas.addEventListener("touchstart", function(e) {
  e.preventDefault();
  allow = true;
  mySignature();
  ctx.moveTo(getTouches(e)[0].clientX - left, e.clientY - offTop);
});
canvas.addEventListener("touchmove", function(c) {
  c.preventDefault();
  console.log("top", offTop);
  if (allow == true) {
    x = c.touches[0].clientX - left;
    y = c.touches[0].clientY - offTop;
    ctx.lineTo(x, y);
    ctx.stroke();
  }
});
canvas.addEventListener("touchend", function(e) {
  e.preventDefault();
});
// Get the position of a touch relative to the canvas
function getTouchPos(canvasDom, touchEvent) {
  var rect = canvasDom.getBoundingClientRect();
  return {
    x: touchEvent.touches[0].clientX - rect.left,
    y: touchEvent.touches[0].clientY - rect.top
  };
}
document.querySelector("#submit").addEventListener("mousedown", () => {
  console.log(canvas.toDataURL());
  inputSig.value = canvas.toDataURL();
});
////////////
