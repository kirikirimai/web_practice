$(function () {

  
  var mediaQuery = matchMedia('(min-width: 780px)');
  // ページが読み込まれた時に実行
  handle(mediaQuery);
  // ウィンドウサイズが変更されても実行されるように
  mediaQuery.addListener(handle);

  function handle(mq) {
    if (mq.matches) {
      // ウィンドウサイズが780px以上の時
      console.log("780以上");
      $("#gnav").css("top","20px");
      $("#main-contents").css("padding-top",120+"px");
    } else {
      // それ以外
      console.log("780以下");
       var h = $("#header").outerHeight();
       $("#gnav").css("top",h+"px");
       $("#main-contents").css("padding-top",h+20+"px");
       
    }
  }
  // $("#gnav").css("top",h+"px");
  $(".btn-trigger").on("click", function () {
    $(this).toggleClass("active");
    $("#gnav-list").toggleClass("active");
    // if ($("#gnav-list").hasClass("active")) {
    //   $("#gnav-list").removeClass("active");
    //   setTimeout(function () {
    //     $("#gnav-wrap").removeClass("is-open");
    //   }, 500);
    // } else {
    //   $("#gnav-wrap").addClass("is-open");
    //   setTimeout(function () {
    //     $("#gnav-list").addClass("active");
    //   }, 5);
    // }
    return false;
  });
});