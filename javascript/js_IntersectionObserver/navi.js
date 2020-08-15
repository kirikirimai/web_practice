$(function () {
  const callback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        //交差したかチェック
        console.log('交差したよ');
        entry.target.classList.add('active');

        //現在のクラスを確認
        var currentNav = document.querySelector('#gnav .current');
        if (currentNav !== null) {
          currentNav.classList.remove('current');
        }
        var t = entry.target.id;
        var newNav = document.querySelector('a[href="#' + t + '"]');
        newNav.classList.add('current');
      } else {
        console.log('交差してない：');
        entry.target.classList.remove('active');
      }
    });
  };

  const options = {
    root: null,
    rootMargin: '-50% 0px',
    threshold: 0,
  };

  const observer = new IntersectionObserver(callback, options);

  //ターゲット
  const boxes = document.querySelectorAll('.box');
  boxes.forEach((box) => {
    observer.observe(box);
  });

  var adjust = -$('#header').outerHeight() + 60;
  // #で始まるアンカーをクリックした場合に処理
  $('#gnav a').click(function () {
    $('#gnav a').removeClass('current');
    $(this).addClass('current');
    // スクロールの速度
    var speed = 400; // ミリ秒
    // アンカーの値取得
    var href = $(this).attr('href');
    // 移動先を取得
    var target = $(href == '#' || href == '' ? 'html' : href);
    // 移動先を調整
    var position = target.position().top + adjust;
    // スムーススクロール
    $('body,html').animate({ scrollTop: position }, speed, 'swing');
    return false;
  });
});
