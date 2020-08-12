const SCREEN_W = document.getElementById("bg_img").width;
const SCREEN_H =  document.getElementById("bg_img").height;
let can = document.getElementById("cvs");
let con = can.getContext("2d");
can.width = SCREEN_W;
can.height = SCREEN_H;
let fwcol = ["#ffdd55", "#ff6622", "#2255ff", "#44ff44", ];
// setInterval(mainLoop, 1000 / 60);


function rand(min, max) {
  return Math.floor(
    (Math.random() * (max - min + 1)) + min);
}
class Zanzo {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.counter = 10;
    this.kill = false;
  }
  update() {
    if (this.kill) return;
    if (--this.counter == 0) this.kill = true;
  }
  draw() {
    if (this.kill) return;
    
    con.globalAlpha = 1.0 * this.counter / 10;
    con.fillStyle = "#ffee88";
    con.fillRect(this.x >> 8, this.y >> 8, 2, 2);
  }
}
class Hanabi {
  constructor(x, y, vx, vy, gv, hp) {
    this.x = x << 8;
    this.y = y << 8;
    this.vx = vx;
    this.vy = vy;
    this.gv = gv; //重力
    this.kill = false;
    if (hp == undefined) {
      this.hp = 200;
      this.type = 0; //打上花火と爆発花火をtypeで切り分ける
    } else {
      this.hp = hp;
      this.type = 1;
    }
  }
  update() {
    if (this.kill) return;
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gv;
    if (this.y >> 8 > SCREEN_H) this.kill = true;
    if (this.type == 0) {
      if (this.vy > 10) { //打ち上げて落ち始めた時
        this.kill = true;
        var num = rand(10, 400);
        for (let i = 0; i < num; i++) {
          let r = rand(0, 360);
          let s = rand(10, 400);
          let vx = Math.sin(r * Math.PI / 180) * s;
          let vy = Math.cos(r * Math.PI / 180) * s;
          hanabi.push(new Hanabi(this.x >> 8, this.y >> 8, vx, vy, 3, 200));
        }
      }
    } else {
      --this.hp;
      if (this.hp == 0) {
        this.kill = true;
      }
    }
  }
  draw() {
    if (this.kill) return;
    con.globalAlpha = 1.0;
    con.fillStyle = "#ffee88";
    con.fillRect(this.x >> 8, this.y >> 8, 2, 2);
    
    zanzo.push(new Zanzo(this.x, this.y))
  }
}
//花火の配列
let zanzo = [];
let hanabi = [];
//更新
function update() {
  
  for (let i = hanabi.length-1; i > 0; i--) {
    hanabi[i].update();
    if (hanabi[i].kill) hanabi.splice(i, 1);
  }
  for (let i = zanzo.length - 1; i >= 0; i--) {
    zanzo[i].update();
    if (zanzo[i].kill) zanzo.splice(i, 1);
  }
}
//描画
function draw() {
//   con.fillStyle = "#222222";
//   con.fillRect(0, 0, SCREEN_W, SCREEN_H);
 con.clearRect(0, 0, SCREEN_W, SCREEN_H);
  for (let i = zanzo.length - 1; i >= 0; i--) {
    zanzo[i].draw();
  }
  for (let i = hanabi.length - 1; i >= 0; i--) {
    hanabi[i].draw();
  }
}

function mainLoop() {
  update();
  draw();
  requestAnimationFrame( mainLoop );
}

mainLoop();

document.onkeydown = function (e) {
  if (e.keyCode == 32) {
    var randmx = rand(300, 800);
    var randmh = rand(SCREEN_H/2, SCREEN_H-100);
    hanabi.push(new Hanabi(randmx, randmh, 0, -600, 2));
  }

  if (e.keyCode == 32) {
    var randmx = rand(300, 800);
    var randmh = rand(SCREEN_H/2, SCREEN_H-100);
    hanabi.push(new Hanabi(randmx, randmh, 0, -600, 2));
  }
}
