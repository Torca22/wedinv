// Set the date we're counting down to
        var countDownDate = new Date("May 25, 2024 20:00:00").getTime();

        // Update the count down every 1 second
        var x = setInterval(function() {

          // Get today's date and time
          var now = new Date().getTime();

          // Find the distance between now and the count down date
          var distance = countDownDate - now;

          // Time calculations for days, hours, minutes and seconds
          var days = Math.floor(distance / (1000 * 60 * 60 * 24));
          var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          var seconds = Math.floor((distance % (1000 * 60)) / 1000);

          // Display the result in the element with id="temporizador"
          document.getElementById("temporizador").innerHTML = days + "d : " + hours + "h : "
          + minutes + "m : " + seconds +"s";

          // If the count down is finished, write some text
          if (distance < 0) {
            clearInterval(x);
            document.getElementById("temporizador").innerHTML = "EXPIRED";
          }
        }, 1000);

        var coll = document.getElementsByClassName("collapsible");
        var i;
        
        for (i = 0; i < coll.length; i++) {
          coll[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.maxHeight){
              content.style.maxHeight = null;
            } else {
              content.style.maxHeight = content.scrollHeight + "px";
            }
          });
        }

        var canvas = document.querySelector("#town"),
  ctx = canvas.getContext('2d'),
  data, canvas2, ctx2, rafAnim = null;
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetWidth,
  amount = 1000;
var img = new Image();
img.onload = function() {
  ctx.drawImage(img, 0, 0, 800, 800, 0, 0, canvas.width, canvas.height);
  data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  canvas2 = document.querySelector("#snowFlakes");
  ctx2 = canvas2.getContext('2d');
  canvas2.width = canvas.offsetWidth;
  canvas2.height = canvas.offsetWidth;
  initSnow();
}
img.crossOrigin = "Anonymous";
img.src = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/127738/town.svg?v2";

var flakes;

function initSnow() {
  window.addEventListener("click", shakeGlobe);
  window.addEventListener("touchstart", shakeGlobe);
  ctx2.fillStyle = "rgba(255,255,255,0.7)";
  var radius = canvas.width * 0.2875;
  var offsetX = canvas.width / 2;
  var offsetY = canvas.width * 0.4;
  flakes = [];
  for (var i = 0; i < amount; i++) {
    x = Math.random() * 2 * radius - radius;
    ylim = Math.sqrt(radius * radius - x * x);
    y = Math.random() * ylim - ylim;
    flakes.push(new Flake(x + offsetX, y + offsetY));
  }
  if (rafAnim === null) {
    rafAnim = requestAnimationFrame(render);
  }
}

function Flake(x, y, color) {
  this.x = Math.floor(x);
  this.y = Math.floor(y);
  for (var i = this.y; i < canvas.width; i++) {
    if (data[((this.x + (canvas.width * i)) * 4 + 3)] > 10) {
      destination = parseInt(i - 1);
      i = canvas.width;
    } else {
      destination = canvas.width;
    }
  }
  this.finalY = destination;
  this.r = Math.random() * 2;
  this.speedY = Math.random() + 0.2;
}
Flake.prototype.render = function() {
  if (this.finalY > this.y) {
    this.y += this.speedY;
  }
  ctx2.beginPath();
  ctx2.arc(this.x, this.y, this.r, Math.PI * 2, false);
  ctx2.fill();
}

function render(a) {
  requestAnimationFrame(render);
  ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
  for (var i = 0; i < amount; i++) {
    flakes[i].render();
  }
};

function shakeGlobe() {
  window.removeEventListener("click", shakeGlobe);
  window.removeEventListener("touchstart", shakeGlobe);
  var globe = document.querySelector("#globe");
  TweenMax.to(canvas2, 0.5, {
    opacity: 0
  });
  TweenMax.to(globe, .1, {
    rotationZ: 25,
    ease: Quad.easeInOut,
    yoyo: true,
    repeat: 5,
    onComplete: initSnow
  })
  TweenMax.to(canvas2, 0.5, {
    opacity: 1,
    delay: "0.6"
  });
}