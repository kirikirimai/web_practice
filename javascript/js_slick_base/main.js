$(function(){
  $('.slide__block-slide01').slick({
    dots:true,
    dotsClass: 'slick-dots',
    prevArrow: '<img src="images/slide_arrow-l.png" class="slide-arrow prev-arrow">',
    nextArrow: '<img src="images/slide_arrow-r.png" class="slide-arrow next-arrow">',
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false, //prev next ボタンを非表示にしたい場合
        }
      },
      {
        breakpoint: 640,
        settings: {
          arrows: false, 
          dots: false,  //640以下でドットのボタンを非表示にしたい場合
        }
      },
    ]
  });
 
});