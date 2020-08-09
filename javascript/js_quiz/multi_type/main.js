'use strict'; {
  const q_num = document.getElementById('q_num');
  //ボタン
  const btn_answer = document.getElementById('btn_answer');
  const btn_next = document.getElementById('btn_next');
  /*
  複数の解答が可能な質問で「解答を見る」ボタンをクリックさせるには、クリックしてクラスを追加したらカウントアップして
  クラスを削除したらカウントダウンにすることで何もクリックしてない状態を「0」として「0」以外はクリックできるようにする
  */
  let mult_btn_cnt = 0;
  //クイズの選択後説明の要素
  const boxwrap = document.getElementById("box_wrap");
  const boxinner = document.getElementById("boxx_inner");
  let contents;
  let title;
  let txt_detail;
  //結果発表の要素
  const resultwrap = document.getElementById("result_wrap");
  const q_len = document.getElementById("q_len");
  const result_num = document.getElementById("result_num");
  const resultlist = document.getElementById("result_list");
  const rankinglist = document.querySelectorAll("#ranking_list li");
  //質問関連要素
  const quizwrap = document.getElementById("quiz_wrap");
  const quizList = [{
    q: "冬におすすめの渡航先は？ 複数解答してください。",
    c: ['タイ', 'アメリカ', 'アフリカ', "ロシア"],
    collect: [0, 2],
    q_type: "mult",
    contents_c: {
      title: "正解です",
      detail: "タイは冬は乾季にあたるので気温も高すぎず天気も晴れ間が多いでしょう。"
    },
    contents_w: {
      title: "不正解です。",
      detail: "他の国は冬にあたりアメリカに至っては氷点下も珍しくありません。"
    }
  }, {
    q: "今流行ってるフレームワークは？　複数回答してください。",
    c: ['React', 'Vue', 'ruby & rails'],
    collect: [0, 1],
    q_type: "mult",
    contents_c: {
      title: "正解です",
      detail: "Vueは1ソースにCSSやjavascriptファイルを各ことにより分かりやすいのが、取っつきやすい傾向にあります。"
    },
    contents_w: {
      title: "不正解です",
      detail: "ReactはJSXという記載方法により書きづらくVueに移行する人が増えています。"
    }
  }, {
    q: "住みたい街ランキング1位はどこ？",
    c: ['中野', '恵比寿', '中目黒'],
    collect: [2],
    q_type: "single",
    contents_c: {
      title: "正解です",
      detail: "中目黒は春になると目黒川沿いのサクラが咲き乱れるので人気の街です。"
    },
    contents_w: {
      title: "不正解です",
      detail: "恵比寿も中野も高いです"
    }
  }, {
    q: "稼げる職業ランキング",
    c: ['youtuber', '投資家', 'ニート'],
    collect: [1],
    q_type: "single",
    contents_c: {
      title: "正解です",
      detail: "投資家は一般の職業と比べてハイリスクであるもののリターンが大きいです。"
    },
    contents_w: {
      title: "不正解",
      detail: "youtuberは儲かれば大きいがなかなか目が出ない"
    }
  }, {
    q: "オワコンと言われてる言語は？",
    c: ['python', 'javascript', 'ruby', 'perl'],
    collect: [2],
    q_type: "single",
    contents_c: {
      title: "正解です",
      detail: "RUBYはVueなどのフレームワークなどの台頭により利用価値がなくなっており、他でもpythonに比べてAIに弱いことにあります。"
    },
    contents_w: {
      title: "不正解",
      detail: "pythonはこれから伸びるし、javascriptはもっとも人気があります。"
    }
  }];
  const q_title = document.getElementById('q_title');
  const question_list = document.getElementById('question_list');
  let quizlen = quizList.length; //クイズの問題数
  let answerList = [];
  let answerFlg = false;　　 //回答の正解フラグ　
  let currentNum = 0;　　 //現在の質問ナンバー
  let answer = [];　　　　　　　 //正解の回答ナンバー
  let answerChecked = [];　　　 //選んだ回答ナンバー
  let old_quiz_btn = null;　　 //クリックした解答のボタン
  let finalscore = 0; //最後の正解の数

  //ストップウォッチ
  let startStopFlag = 0; // スタート・ストップのフラグ
  let startTime; // スタート時間
  let interval;
  let timeToadd = 0; //
  let txt_timer = document.getElementById("timer");
  timerCheck();
  /*---------------------------------------------------------*/
  function timerCheck() {
    if (startStopFlag == 0) { // Startボタンを押した
      startTime = new Date(); // スタート時間を退避
      startStopFlag = 1;
      //
      interval = setInterval(stopWatch, 1);
    } else { // Stopボタンを押した
      stopWatch();
      startStopFlag = 0;
      clearInterval(interval);
      timeToadd += Date.now() - startTime;
    }
  }


  function stopWatch() {
    let stopTime = new Date(); // 経過時間を退避
    let myTime = stopTime.getTime() - startTime.getTime() + timeToadd; // 通算ミリ秒計算
    let myH = Math.floor(myTime / (60 * 60 * 1000)); // '時間'取得
    myTime = myTime - (myH * 60 * 60 * 1000);
    let myM = Math.floor(myTime / (60 * 1000)); // '分'取得
    myTime = myTime - (myM * 60 * 1000);
    let myS = Math.floor(myTime / 1000); // '秒'取得
    let myMS = myTime % 1000; // 'ミリ秒'取得
    txt_timer.textContent = myH + ":" + myM + ":" + myS + ":" + myMS;
  }
  /*---------------------------------------------------------*/
  function setQuiz() {
    if (!quizwrap.classList.contains("isshow")) {
      quizwrap.classList.add("isshow");
    }
    //問題数の表示
    q_num.textContent = (currentNum + 1) + " / " + quizlen;
    //回答ナンバーの配列
    answer = quizList[currentNum].collect;
    //チェックした回答の配列
    answerChecked = [];
    //タイトル
    q_title.textContent = quizList[currentNum].q;

    //複数の解答をチェックするカウントをリセットする
    mult_btn_cnt = 0;
    //質問リストをリセットする
    question_list.innerHTML = "";

    //質問
    let cnt = 0;

    //質問のタイプがシングルかマルチかで関数を分ける
    let funcname;
    let q_type = quizList[currentNum].q_type;
    if (q_type === "single") {
      funcname = checkList;
    } else {
      funcname = multiCheckList;
    }
    quizList[currentNum].c.forEach(question => {
      let li = document.createElement("li");
      li.textContent = question;
      li.value = cnt;
      li.addEventListener("click", funcname, false);
      question_list.appendChild(li);
      cnt++;
    });
    //クイズ選択後のボックスを作って置く
    boxinner.innerHTML = ""; //初期化
    contents = document.createElement("div");
    //タイトル
    title = document.createElement("p");
    title.setAttribute("id", "ttl");
    //正解・不正解のテキスト
    txt_detail = document.createElement("p");
    txt_detail.setAttribute("id", "detail");
    contents.appendChild(title);
    contents.appendChild(txt_detail);
    boxinner.appendChild(contents);
  }

  function multiCheckList(e) {
    //
    var target = e.target;
    if (target.classList.contains("active")) {
      mult_btn_cnt--;

      target.classList.remove("active");

      var v = target.value;
      answerChecked = answerChecked.filter((value) => {
        return value !== v;
      });

    } else {
      target.classList.add("active");
      var v = target.value;
      //console.log("配列に追加");
      answerChecked.push(v);


      mult_btn_cnt++;
    }

    //選択された解答ボタンが0以上の場合は、「解答見る」ボタンをクリックできるようにする
    if (mult_btn_cnt > 0) {
      btn_answer.classList.remove("disabled");
    } else {
      btn_answer.classList.add("disabled");
    }

    console.log(mult_btn_cnt);
  }
  /*質問をチェックする
  ---------------------------------------------------------*/
  function checkList(e) {
    //
    var target = e.target;
    if (target.classList.contains("active")) {
      target.classList.remove("active");
      var v = target.value;
      console.log("削除する:" + v);
      answerChecked = answerChecked.filter((value) => {
        return value !== v;
      });
      //解答ボタンを押せるようにする
      btn_answer.classList.add("disabled");
    } else {
      target.classList.add("active");
      console.log("配列に追加");
      var v = target.value;
      answerChecked.push(v);
      //前のボタンのクラスを消す
      if (old_quiz_btn != null && old_quiz_btn != target) {
        old_quiz_btn.classList.remove("active");
        console.log("配列から削除");
        //
        var v = old_quiz_btn.value;
        console.log("削除する:" + v);
        answerChecked = answerChecked.filter((value) => {
          return value !== v;
        });
        console.log(answerChecked);
      }
      //解答ボタンを押せない
      btn_answer.classList.remove("disabled");
    }
    //直前にクリックした解答ボタンを保存しておく
    old_quiz_btn = target;
  }
  //クイズをセットする
  setQuiz();
  //正解かどうかを表示させる
  btn_answer.addEventListener("click", () => {
    console.log("正解の配列：" + answer + " チェックした配列：" + answerChecked);
    // let resultA = answer.filter(item =>
    //   // 配列Bに存在しない要素が返る
    //   answerChecked.indexOf(item) == -1
    // );

    // let resultB = answerChecked.filter(item =>
    //   // 配列Bに存在しない要素が返る
    //   answer.indexOf(item) == -1
    // );

    // var lena = resultA.length;
    // var lenb = resultB.length;

    // console.log(lena + " : " + lenb);

    // if (lena == 0 && lenb === 0) {
    //   console.log("itti");
    // } else {
    //   console.log("no itti");
    // }

    let result = JSON.stringify(answerChecked.slice().sort()) === JSON.stringify(answer.slice().sort());


    if (result) {
      console.log("itti")
      answerFlg = true;
    } else {
      console.log("no");
      answerFlg = false;
    }
    //let result = (answer.length === answerChecked.length) && answerChecked.every(item => answer.includes(item)); // 未テスト

    //タイマーを止める
    timerCheck();
    //オブジェクトとしてlocalstrageに保存
    var answerObj = {
      qlist: currentNum,
      ans_flg: answerFlg
    }
    answerList.push(answerObj);
    var obj = JSON.stringify(answerList);
    localStorage.setItem("answerlist", obj);
    //最終問題の後は結果を発表したいのでボタンのテキストを切り替える
    if (currentNum === quizlen - 1) {
      btn_next.textContent = "結果発表";
      btn_next.removeEventListener("click", nextQuize);
      btn_next.addEventListener("click", showResult);
    }
    showAnswerBox();
  });
  //回答用のボックスを表示
  function showAnswerBox() {
    //質問エリアと解答見るボタンを消しておく
    btn_answer.classList.add("disabled");
    quizwrap.classList.remove("isshow");
    if (answerFlg) {
      title.textContent = quizList[currentNum].contents_c.title;
      txt_detail.textContent = quizList[currentNum].contents_c.detail;
    } else {
      title.textContent = quizList[currentNum].contents_w.title;
      txt_detail.textContent = quizList[currentNum].contents_w.detail;
    }
    boxwrap.classList.add("isshow");
  }
  //次の質問へのボタン
  btn_next.addEventListener("click", nextQuize, false);
  //次のクイズへ
  function nextQuize() {
    //表示していた解答ボックスを消す
    boxwrap.classList.remove("isshow");
    //タイマーを再生
    startTime = 0;
    timerCheck();
    //表示させる
    currentNum++;
    setQuiz();
  }
  //クイズが終わって結果発表
  function showResult() {
    boxwrap.classList.remove("isshow");
    resultwrap.classList.add("isshow");
    //結果を表示
    q_len.textContent = quizlen;
    //データをlocalstoragから抽出
    var jsondata = localStorage.getItem("answerlist");
    var resultdata = JSON.parse(jsondata);
    console.log(resultdata);
    //結果の配列から正解したデータを抽出
    var correctdata = resultdata.filter((value) => {
      return value.ans_flg;
    });
    //正解の数
    finalscore = correctdata.length;
    result_num.textContent = finalscore;
    //一覧を表示
    let correct_len = 0; //正解数
    resultdata.forEach(data => {
      var tr = document.createElement("tr");
      var td_q = document.createElement("td");
      var td_a = document.createElement("td");
      tr.appendChild(td_q);
      tr.appendChild(td_a);
      //質問ナンバー
      td_q.textContent = data.qlist;
      //解答
      if (data.ans_flg) {
        td_a.textContent = "●";
        correct_len++;
      } else {
        td_a.textContent = "×";
      }
      resultlist.appendChild(tr);
    });
    //正解数を元にランクを決定して黄色い背景色を付ける
    if (correct_len < 2) {
      rankinglist[2].classList.add("yourRank");
    } else if (correct_len >= 2 && correct_len <= 3) {
      rankinglist[1].classList.add("yourRank");
    } else {
      rankinglist[0].classList.add("yourRank");
    }
  }
  //テスト用
  document.getElementById("clearstorage").addEventListener("click", () => {
    localStorage.clear();
  }, false)
  /*------------------------------------------
  フォーム関連
  ---------------------------------------------*/
  let ws_form = document.ws_form;
  ws_form.addEventListener("change", (e) => {
    ws_form.forEach(form => {
      if (is_form_written(form)) {
        alert(form + ' は入力または選択済みです。');
      }
    });
  })

  function is_form_written(form_obj) {
    var tagname = form_obj.tagName;
    var type = form_obj.type
    if (tagname === 'SELECT') {
      if (form_obj === '') {
        return false;
      } else {
        return true;
      }
    } else if (tagname === 'INPUT') {
      if (type === 'radio') {
        return form_obj.checked = true;
      } else if (type === 'checkbox') {
        return form_obj.checked = true;
      } else if (type === 'text') {
        if (form_obj.value !== '') {
          return true;
        } else {
          return false;
        }
      }
    } else if (tagname === "TEXTAREA") {
      if (form_obj.value !== '') {
        return true;
      } else {
        return false;
      }
    }
  }
}