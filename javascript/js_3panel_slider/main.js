$(function(){
 var body_block;
var info_block;
$(".image-block__item").hover(
  function () {
    body_block=$(this).find(".image-block__body");
    info_block=$(this).find(".image-block__info");
    
    $(".on-top").removeClass("on-top");
    $(this).addClass("active");
    $(this).addClass("on-top");
    $(body_block).addClass("down");
    $(info_block).addClass("up");
  },
  function() {
    $(this).removeClass("active");
    $(body_block).removeClass("down");
    $(info_block).removeClass("up");
  }
);

function checkMediaQuery(){
  if(window.matchMedia("(max-width:767px)").matches) {
    var wrap_w=$(".image-block").outerWidth();
    $('.image-block').scrollLeft(wrap_w/2);
  }
}

window.onresize=checkMediaQuery;
});
