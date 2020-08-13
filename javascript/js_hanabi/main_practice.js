const SCREEN_W = document.getElementById("bg_img").width;
const SCREEN_H =  document.getElementById("bg_img").height;
const HANABI_W = 2;
const HANABI_H = 2;
const HANABI_COLOR=["#ffee88","#ffeeee","#ff8888"];
const FPS = 60;



//発射ボタン
var btn_hanabi = document.getElementById("btn_hanabi");
btn_hanabi.addEventListener("click", startHanabi);


//CANVAS
var cvs = document.getElementById("cvs");
var ctx = cvs.getContext("2d");
cvs.width = SCREEN_W;
cvs.height = SCREEN_H;
// ctx.fillStyle = "#222222";
// ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);


//花火と残像の配列
var hanabiList = [];
var zanzoList = [];

var ZANZO=function (x, y,color) {
  this.x=x;
  this.y=y;
  this.counter=2;
  this.color=color;
  this.kill=false;
}

ZANZO.prototype.update=function(){
  if(this.kill) return;
  --this.counter;
  if(this.counter==0) this.kill=true;
}

ZANZO.prototype.draw=function(){
  if (this.kill) return;
  ctx.globalAlpha = this.counter/2;
  ctx.fillStyle = this.color;
  ctx.fillRect(this.x, this.y, HANABI_W, HANABI_H);
}


var HANABI = function (x, y, vx, vy, gv, hp, color,type) {
  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;
  this.gv = gv;
  this.color = color;
  this.kill = false;
  this.hp=hp;
  this.type=type;  /* type:0  打上花火  type:1 爆発花火 */  
}


HANABI.prototype.update = function () {
  if (this.kill) return;
  this.x += this.vx;
  this.y += this.vy;
  this.vy += this.gv;

  if (this.type ==0) {
    if (this.y > SCREEN_H) this.kill = true;
    //if (this.hp == 0) this.kill = true;
    if (this.vy > 0) {
      this.kill = true;
      //爆発
      this.explosion();
    }
  }else{
    --this.hp;
    if (this.hp==0) this.kill = true;
  }
  
  
}


HANABI.prototype.explosion = function () {
  var num = rand(50, 400);
  for (let i = 0; i < num; i++) {
    let r = rand(0, 360);
    let s = rand(10, 30);
    let vx = Math.sin(r * Math.PI / 180) *(s/10);
    let vy = Math.cos(r * Math.PI / 180) * (s/10);
    var c=Math.floor(Math.random() * HANABI_COLOR.length);
    hanabiList.push(new HANABI(this.x, this.y, vx, vy, 0.04,200,HANABI_COLOR[c],1));
   }
  
}

HANABI.prototype.draw = function () {
  if (this.kill) return;
  ctx.globalAlpha = 1.0;
  ctx.fillStyle = this.color;
  ctx.fillRect(this.x, this.y, HANABI_W, HANABI_H);
  zanzoList.push(new ZANZO(this.x,this.y,this.color));
}


//アニメーション関数
function mainLoop() {
  ctx.fillStyle = "#222222";
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);

  for (var i = 0; i < hanabiList.length; i++) {
    hanabiList[i].update();
    hanabiList[i].draw();
    if (hanabiList[i].kill) hanabiList.splice(i, 1);
  }

  for (var i = 0; i < zanzoList.length; i++) {
    zanzoList[i].update();
    zanzoList[i].draw();
    if (zanzoList[i].kill) zanzoList.splice(i, 1);
  }

  requestAnimationFrame(mainLoop);
}


//最初に実行
mainLoop();

//ボタン
function startHanabi() {
  var start = rand(200, 600);
    var vy = rand(-2, -4);
    hanabiList.push(new HANABI(start, SCREEN_H, 0,vy, 0.01,200,HANABI_COLOR[0],0));
}

//ランダムに位置を決める
function rand(min, max) {
  return Math.floor(
    (Math.random() * (max - min + 1)) + min);
}
