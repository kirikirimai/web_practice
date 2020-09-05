let mySwiper = new Swiper ('.swiper-container', {
  // 以下にオプションを設定
  loop: true, //最後に達したら先頭に戻る
   centeredSlides : false,  //アクティブなスライドを中央に表示
  //ページネーション表示の設定
  pagination: { 
    el: '.swiper-pagination', //ページネーションの要素
    type: 'bullets', //ページネーションの種類
    clickable: true, //クリックに反応させる
  },
 
  //ナビゲーションボタン（矢印）表示の設定
  navigation: { 
    nextEl: '.swiper-button-next', //「次へボタン」要素の指定
    prevEl: '.swiper-button-prev', //「前へボタン」要素の指定
  },
 
  //スクロールバー表示の設定
  scrollbar: { 
    el: '.swiper-scrollbar', //要素の指定
  },

  // レスポンシブブレーポイント（画面幅による設定）
  breakpoints: {
      // 画面幅が 480px 以上の場合（window width >= 640px）
    480: {
     slidesPerView: 1,
        spaceBetween: 10
    },
    // 画面幅が 640px 以上の場合（window width >= 640px）
    640: {
     slidesPerView: 2,
        spaceBetween: 10
    },
    // 画面幅が 980px 以上の場合（window width >= 980px）
    768: {
      slidesPerView:4,  //スライドを2つ（分）表示
    spaceBetween:30,
    }
  },
})