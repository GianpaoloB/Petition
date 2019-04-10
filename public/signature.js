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
  allow = true;
  mySignature();
  ctx.moveTo(startingPosition.offsetX, startingPosition.offsetY);
  canvas.addEventListener("mousemove", c => {
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
document.querySelector("#submit").addEventListener("mousedown", () => {
  console.log(canvas.toDataURL());
  inputSig.value = canvas.toDataURL();
});
////////////
