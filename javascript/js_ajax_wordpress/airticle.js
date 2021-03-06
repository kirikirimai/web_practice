/**
 * Define
 */
var Articles = {
  pageType: '',
  $list: null,
  apiUrl: '',
  paged: 1,
};

//読み込み時に新着一覧のデータが保存されているかチェックする
var next_page = sessionStorage.getItem('nextPageNum');
var page_name = sessionStorage.getItem('pageName');
var html_com = sessionStorage.getItem('htmlDom');
console.log('保存したページ数：' + next_page);
console.log('保存したページ名：' + page_name);

/**
 * Run
 */
jQuery(function () {
  // トップページ（新着記事）の場合
  if (jQuery('#generate_article_list')[0]) {
    Articles.pageType = 'front-page';
    Articles.$list = jQuery('#generate_article_list');
    Articles.apiUrl = '/wp/wp-json/wp/v2/posts?page=';
    sessionStorage.setItem('pageName', Articles.pageType);

    if (html_com) {
      copyHtmlDom();
    } else {
      html_com = '';
    }

    if (next_page) {
      Articles.paged = next_page;
    }

    console.log('font pageの場合のページ数 : ' + Articles.paged);
  }
  //
  if (jQuery('#category_article_list')[0]) {
    Articles.pageType = 'category';
    Articles.$list = jQuery('#category_article_list');
    Articles.apiUrl = '/wp/wp-json/wp/v2/posts?' + Articles.$list.attr('data-cat-slug') + '/';
    Articles.paged = 2; // 1ページ目は初期表示されているので2ページ目から取得
  }
  //
  if (jQuery('#fortune_related_article_list')[0]) {
    Articles.pageType = 'fortune_related';
    Articles.$list = jQuery('#fortune_related_article_list');
    Articles.apiUrl = '/wp-json/fortune/v0/related-posts/';
  }
  //
  if (jQuery('#prtimes_article_list')[0]) {
    Articles.pageType = 'prtimes';
    Articles.$list = jQuery('#prtimes_article_list');
    Articles.apiUrl = '/wp-json/prtimes/v0/latest-posts/';
    Articles.paged = 2; // 1ページ目は初期表示されているので2ページ目から取得
  }

  // ページタイプが設定されているとき
  if (Articles.pageType) {
    console.log(Articles.pageType);
    if (html_com == '') {
      // 初期表示
      getArticles();
    }
    // MORE ボタン
    jQuery('#generate_article_list_btn').on('click', function (e) {
      e.preventDefault();
      getArticles();
    });
  }
});

/**
 * 記事一覧の取得
 */
function getArticles() {
  var _urlPrefix = 'https://the-zombis.sakura.ne.jp';
  var _apiUrl = Articles.apiUrl;
  var _paged = Articles.paged;

  console.log('URL : ' + _urlPrefix + _apiUrl + _paged);
  jQuery
    .ajax({
      url: _urlPrefix + _apiUrl + _paged,
      beforeSend: function () {
        jQuery('#article_loading').fadeIn(300);
        lockedButtonMore();
      },
    })
    .done(function (data) {
      appendArticles(data);
      if (data.is_all) {
        console.log('data is all');
        all_posts_displayed();
      } else {
        Articles.paged++;

        console.log('読み込んだページ数：' + Articles.paged);
        if (Articles.pageType == 'front-page') {
          sessionStorage.setItem('nextPageNum', Articles.paged);
        }

        showMore();
      }
    })
    .then(function () {
      jQuery('#article_loading').fadeOut(300);
      unlockedButtonMore();
    });
}

/**
 * 記事一覧要素の追加
 */
function appendArticles(articles) {
  var _html = '';
  // トップページ（新着記事）の場合
  if (Articles.pageType == 'front-page') {
    for (var i = 0; i < articles.length; i++) {
      html_com += generateTestDom(articles[i]);
    }
    console.log('ajax toplisthtml');
    console.log(html_com);
    sessionStorage.setItem('htmlDom', html_com);
    // jQuery.each(articles, function( index, article ) {
    //   if (article.sns_disp_flag) {
    //     if (article.child_category_name == '') {
    //       _html += generateDomForArticle_noSubCat(article);
    //     } else {
    //       _html += generateDomForArticle(article);
    //     }
    //   } else {
    //     if (article.child_category_name == '') {
    //       _html += generateDomForArticle_noSns_noSubCat(article);
    //     } else {
    //       _html += generateDomForArticle_noSns(article);
    //     }
    //   }
    // });

    copyHtmlDom();
  }
  //
  if (Articles.pageType == 'category') {
    _html = articles.join('');
  }
  //
  if (Articles.pageType == 'fortune_related') {
    _html = articles.join('');
  }
  //
  if (Articles.pageType == 'prtimes') {
    _html = articles.join('');
  }

  Articles.$list.append(_html);
}

/*--------------------------------
 テスト用の関数
---------------------------------*/
function generateTestDom(datas) {
  var title = datas.title.rendered; //記事のタイトル
  var link = datas.link; //記事のリンクURL
  var li = "<li><a href='" + link + "'>" + title + '</a></li>';
  return li;
}

function copyHtmlDom() {
  $('#generate_article_list').children().remove();
  Articles.$list.append(html_com);
}

/**
 * MOREロック
 */
function lockedButtonMore() {
  console.log('lockedButtonMore');
  jQuery('#generate_article_list_btn').prop('disabled', true);
}

/**
 * MOREアンロック
 */
function unlockedButtonMore() {
  console.log('unlockedButtonMore');
  jQuery('#generate_article_list_btn').prop('disabled', false);
}

/**
 * MORE 表示
 */
function showMore() {
  jQuery('#generate_article_list_btn').parent().show();
}

/**
 * MORE 非表示
 */
function hideMore() {
  jQuery('#generate_article_list_btn').parent().hide();
}

/**
 * 全件表示した場合
 */
function all_posts_displayed() {
  Articles.$list.addClass('is-no-gradation');
  hideMore();
}

/**
 * 記事一覧のDOM生成
 */
function generateDomForArticle(article_item_data) {
  return '<div class="l-article02">\n  <article class="c-article02" data-pr="'
    .concat(article_item_data.pr, '" data-category="')
    .concat(
      article_item_data.category_slug,
      '">\n    <div class="c-article02__image">\n      <a href="'
    )
    .concat(article_item_data.permalink, '"><div class="c-article02__bgImage lazyload" data-bg="')
    .concat(
      article_item_data.bg_image_url,
      '"></div></a>\n      <div class="l-articleShare-medium">\n        <div class="c-articleShare js-articleShare">\n          <img class="c-articleShare__btn" src="'
    )
    .concat(
      article_item_data.image_url,
      '/images/common/share-icon-01.png" alt="share">\n          <a class="c-articleShare__link" href="'
    )
    .concat(article_item_data.share_twitter_url, '" target="_blank"><img src="')
    .concat(
      article_item_data.image_url,
      '/images/common/share-icon-01-twitter.svg" alt="Twitter"></a>\n          <a class="c-articleShare__link" href="'
    )
    .concat(article_item_data.share_facebook_url, '" rel="nofollow" target="_blank"><img src="')
    .concat(
      article_item_data.image_url,
      '/images/common/share-icon-01-facebook.svg" alt="Facebook"></a>\n        </div>\n      </div>\n    </div>\n    <div class="c-article02__head">\n      <a href="'
    )
    .concat(
      article_item_data.permalink,
      '">\n        <div class="c-article02__info">\n          <time datetime="'
    )
    .concat(article_item_data.post_date_data, '">')
    .concat(
      article_item_data.post_date_text,
      '</time>\n          <div class="c-article02__categoryWrap">\n            <span class="c-article02__category">'
    )
    .concat(
      article_item_data.category_name,
      '</span>\n            <span class="c-article02__subCategory"> / '
    )
    .concat(
      article_item_data.child_category_name,
      '</span>\n          </div>\n        </div>\n        <h2 class="c-article02__heading">'
    )
    .concat(article_item_data.title, '</h2>\n      </a>\n    </div>\n  </article>\n</div>');
}
/**
 * 記事一覧のDOM生成（サブカテゴリーなし）
 */
function generateDomForArticle_noSubCat(article_item_data) {
  return '<div class="l-article02">\n    <article class="c-article02" data-pr="'
    .concat(article_item_data.pr, '" data-category="')
    .concat(
      article_item_data.category_slug,
      '">\n      <div class="c-article02__image">\n        <a href="'
    )
    .concat(article_item_data.permalink, '"><div class="c-article02__bgImage lazyload" data-bg="')
    .concat(
      article_item_data.bg_image_url,
      '"></div></a>\n        <div class="l-articleShare-medium">\n          <div class="c-articleShare js-articleShare">\n            <img class="c-articleShare__btn" src="'
    )
    .concat(
      article_item_data.image_url,
      '/images/common/share-icon-01.png" alt="share">\n            <a class="c-articleShare__link" href="'
    )
    .concat(article_item_data.share_twitter_url, '" target="_blank"><img src="')
    .concat(
      article_item_data.image_url,
      '/images/common/share-icon-01-twitter.svg" alt="Twitter"></a>\n            <a class="c-articleShare__link" href="'
    )
    .concat(article_item_data.share_facebook_url, '" rel="nofollow" target="_blank"><img src="')
    .concat(
      article_item_data.image_url,
      '/images/common/share-icon-01-facebook.svg" alt="Facebook"></a>\n          </div>\n        </div>\n      </div>\n      <div class="c-article02__head">\n        <a href="'
    )
    .concat(
      article_item_data.permalink,
      '">\n          <div class="c-article02__info">\n            <time datetime="'
    )
    .concat(article_item_data.post_date_data, '">')
    .concat(
      article_item_data.post_date_text,
      '</time>\n            <div class="c-article02__categoryWrap">\n              <span class="c-article02__category">'
    )
    .concat(
      article_item_data.category_name,
      '</span>\n            </div>\n          </div>\n          <h2 class="c-article02__heading">'
    )
    .concat(article_item_data.title, '</h2>\n        </a>\n      </div>\n    </article>\n  </div>');
}
/**
 * 記事一覧のDOM生成（SNS無し）
 */
function generateDomForArticle_noSns(article_item_data) {
  return '<div class="l-article02">\n    <article class="c-article02" data-pr="'
    .concat(article_item_data.pr, '" data-category="')
    .concat(
      article_item_data.category_slug,
      '">\n      <div class="c-article02__image">\n        <a href="'
    )
    .concat(article_item_data.permalink, '"><div class="c-article02__bgImage lazyload" data-bg="')
    .concat(
      article_item_data.bg_image_url,
      '"></div></a>\n      </div>\n      <div class="c-article02__head">\n        <a href="'
    )
    .concat(
      article_item_data.permalink,
      '">\n          <div class="c-article02__info">\n            <time datetime="'
    )
    .concat(article_item_data.post_date_data, '">')
    .concat(
      article_item_data.post_date_text,
      '</time>\n            <div class="c-article02__categoryWrap">\n              <span class="c-article02__category">'
    )
    .concat(
      article_item_data.category_name,
      '</span>\n              <span class="c-article02__subCategory"> / '
    )
    .concat(
      article_item_data.child_category_name,
      '</span>\n            </div>\n          </div>\n          <h2 class="c-article02__heading">'
    )
    .concat(article_item_data.title, '</h2>\n        </a>\n      </div>\n    </article>\n  </div>');
}
