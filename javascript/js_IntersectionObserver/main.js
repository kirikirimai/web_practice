window.onload = function () {
  const callback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        //交差したかチェック
        console.log('交差したよ');
        entry.target.classList.add('active');
      } else {
        console.log('交差してないよ');
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
  const el = document.querySelector('#target');
  observer.observe(el);
};
