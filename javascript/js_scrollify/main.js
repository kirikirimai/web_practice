$(function () {
var wh = window.innerHeight;
var boxs = document.querySelectorAll(".box");
var $pager = $('#js-pager'); // ページャー枠
var video_wrap = document.getElementById('video-wrap');
video_wrap.style.height = wh + 'px';

window.addEventListener("scroll", function(){
  checkBox();
});

window.addEventListener("resize", function(){
  wh = window.innerHeight;
  video_wrap.style.height = wh + 'px';
 if (!window.matchMedia('(max-width:768px)').matches) {
				$('#gnav').removeAttr('style');
			}
 
  checkBox();
});

var boxsArr=Array.prototype.slice.call(boxs); //ie11

//
function checkBox() {
  //ページの上端から、要素の上端までの距離が必要なのでオフセット量を足す
    boxsArr.forEach(function(box){
    //ポジションを取得
    var pos=box.getBoundingClientRect();
    
     //各ボックスのポジションがウィンドウの高さの半分の位置を下回ったらクラスを追加
    var py=pos.top;
    if(py<wh/2){
      box.classList.add("fadein");
    }else{
      box.classList.remove("fadein");
    }
 
  });
}

var option = {
  section: ".box",
  easing: "swing",
  scrollSpeed: 600,
  scrollbars: true,
  before:function(index) {
    pagerCurrent(index); // ページャーに対応する順番にクラス名を付与
  },
  afterRender:function() {
    createPager(); // ページャーの作成
  }
};


  $.scrollify(option); // scrollifyの実行
  var $pager = $('#js-pager'); // ページャー枠


// ==============================
// functions
// ------------------------------

// ページャーに対応する順番にクラス名を付与
function pagerCurrent(index) {
  var $li = $pager.find('li');
  $li.removeClass('is-current');
  $li.eq(index).addClass('is-current');
}

// ページャーの作成
function createPager() {

  $(boxs).each(function(i, e){
    // ページ内リンク先の作成
    var sectionName = $(e).attr('data-section-name');
    var sectionTitle = $(e).attr('data-section-title');
    // 最初のliにはクラスを付与
    var addClass = '';
    if (i === 0) {
        addClass = 'is-current';
    }
    // liのHTML作成
    var html = '';
    html += '<li class="' + addClass + '">';
    html += '<a href="#' + sectionName + '">'+sectionTitle+'</a>';
    html += '</li>';
    $pager.append(html);
  });
  
  pagerLink();
}

// ページャーでaタグをクリックされたらスクロールする
function pagerLink () {
  $pager.find('a').on('click', function() {
    $.scrollify.move($(this).attr("href"));
  });
}

});
