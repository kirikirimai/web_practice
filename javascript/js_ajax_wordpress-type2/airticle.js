/**
 * Define
 */
var Articles = {
  pageType: '',
  $list: null,
  apiUrl: '',
  paged: 1,
};

/**
 * Run
 */
jQuery(function () {
  // トップページ（新着記事）の場合
  if (jQuery('#generate_article_list')[0]) {
    Articles.pageType = 'front-page';
    Articles.$list = jQuery('#generate_article_list');
    Articles.apiUrl = '/wp-json/wp/v2/posts?page=';

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
  
  // ページタイプが設定されているとき
  if (Articles.pageType) {
    console.log(Articles.pageType);
  
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
  var _urlPrefix = 'http://localhost/wordpress';
  var _apiUrl = Articles.apiUrl;
  var _paged = Articles.paged;

  console.log('URL : ' + _urlPrefix + _apiUrl + _paged);
  jQuery
    .ajax({
      url: _urlPrefix + _apiUrl + _paged+"&per_page=2",
      beforeSend: function () {
        jQuery('#article_loading').fadeIn(300);
        lockedButtonMore();
      },
    })
    .done(function (data) {
      console.log(data.length);
      appendArticles(data);
    
        Articles.paged++;

        console.log('読み込んだページ数：' + Articles.paged);
        
        showMore();
    })
    .then(function () {
      jQuery('#article_loading').fadeOut(300);
      unlockedButtonMore();
    }).fail(function (jqXHR, textStatus, errorThrown) {
          // 通信失敗時の処理
    
          console.log("ajax通信に失敗しました");
          console.log("jqXHR          : " + jqXHR.status); // HTTPステータスが取得
          console.log("textStatus     : " + textStatus);    // タイムアウト、パースエラー
          console.log("errorThrown    : " + errorThrown.message); // 例外情報
  
          console.log('data is all');
          jQuery('#article_loading').fadeOut(300);
          unlockedButtonMore();
          all_posts_displayed();
            });
}

/**
 * 全件表示した場合
 */
function all_posts_displayed() {
  Articles.$list.addClass('is-no-gradation');
  hideMore();
}

/**
 * 記事一覧要素の追加
 */
function appendArticles(articles) {
  var _html = '';
  // トップページ（新着記事）の場合
  if (Articles.pageType == 'front-page') {
    for (var i = 0; i < articles.length; i++) {
      _html += generateTestDom(articles[i]);
    }
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



