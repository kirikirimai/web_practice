
<?php

//メールの宛先（To）のメールアドレス
define('MAIL_TO', "xxxxx@xxxxx.com");
//メールの宛先（To）の名前  
define('MAIL_TO_NAME', "きりやま");
//Cc の名前
define('MAIL_CC', 'xxxx@xxxxxx.com');
//Cc の名前
define('MAIL_CC_NAME', 'Cc宛先名');
//Bcc
define('MAIL_BCC', 'xxxxx@xxxxx.com');
//Return-Pathに指定するメールアドレス
define('MAIL_RETURN', 'xxxxx@xxxxx.com');
//自動返信の返信先名前（自動返信を設定する場合）
define('AUTO_REPLY_NAME', '返信先名前');


$datas=[];
$error=[];
$getcsvdata=[];
$mailflg=false;

if(isset($_POST["submited"]) && $_SERVER["REQUEST_METHOD"]==='POST'){
    echo "クリックさたよ";
      
      $name=isset($_POST["name"])? $_POST["name"]:null;
      $mail=isset($_POST["mail"])? $_POST["mail"]:null;
      $checkmail=isset($_POST["checkmail"])? $_POST["checkmail"]:null;
      $subject=isset($_POST["subject"])? $_POST["subject"]:null;
      $howto=isset($_POST["howto"])? $_POST["howto"]:null;
      $food=isset($_POST["food"])? $_POST["food"]:null;
      $body=isset($_POST["body"])? $_POST["body"]:null;

      echo $howto;

      //前後の空白を削除
        $name=trim($name);
        $mail=trim($mail);
        $body=trim($body);
 
    if($name==""){
        $error["name"]="名前記入しろ！";
    }else if(preg_match('/\A[[:^cntrl:]]{1,30}\z/u',$name)==0){
        $error["name"]="名前は30文字以内で！！";
    }

    if($mail==""){
        $error["mail"]="メール記入してね";
    }else{
        $pattern = '/^([a-z0-9\+_\-]+)(\.[a-z0-9\+_\-]+)*@([a-z0-9\-]+\.)+[a-z]{2,6}$/uiD';
        if(!preg_match($pattern,$mail)){
        $error['mail'] = '*メールアドレスの形式が正しくありません。';
         }
    } 

    if($checkmail==""){
        $error["checkmail"]="確認用メールアドレスは必須です。";
    }else{
        if($mail!==$checkmail){
            $error['checkmail'] = '*メールアドレスが一致しません';
        }
    }

    if($howto==""){
        $error["howto"]="どの方法かわからん！";
    }

    if($food==""){
        $error["food"]="好きな食べ物ないのかよ";
    }

    if($subject==""){
        $error["subject"]="件名が必須です";
    }else if(preg_match('/\A[[:^cntrl:]]{1,100}\z/u',$subject)==0){
        $error["subject"]="件名は100文字以内でお願いします";
    }

    if ($body ==''){
        $error['body'] = '*内容は必須項目です。';
    //制御文字（タブ、復帰、改行を除く）でないことと文字数をチェック
    } else if ( preg_match( '/\A[\r\n\t[:^cntrl:]]{1,1050}\z/u', $body ) == 0 ) {
        $error['body'] = '*内容は1000文字以内でお願いします。';
    }

    if(empty($error)){
        $likefood=implode('・',$food);

       //メール本文
       $mail_body="これはメールフォームのテスト\n\n\n\n";
       $mail_body.="お名前：".h($name)."\n";
       $mail_body.="EMAIL : ".h($mail)."\n";
       $mail_body.="連絡方法 ：".h($howto)."\n";
       $mail_body.="好きな食べ物：".h($likefood)."\n";
       $mail_body.="お問い合わせ内容 :\n".h($body);
       
       //--------------------------------------------------------------------
       //  send email
       //-------------------------------------------------------------------

        //メールの宛先
        $mailto=mb_encode_mimeheader(MAIL_TO_NAME)."<".MAIL_TO.">";
        $return_mail=MAIL_RETURN;

        //日本語
        mb_language('ja');
        mb_internal_encoding('UTF-8');

        //送信者の設定
        $header="From : ".mb_encode_mimeheader($name)."<".$mail.">\n";
        $mailflg=mb_send_mail($mailto,$subject,$mail_body,$header);
        
        if($mailflg){ //送信が成功したらCSVに書き込む

            // csvで読込・書き込み
            $fp=fopen("form.csv","a");
            flock($fp,LOCK_EX);
            $putdata=[
                $name,
                $mail,
                $howto,
                $likefood,
                $body
                ];

            if($fp){
            fputcsv($fp,$putdata);
            fclose($fp);
            }

            header('Location:'.$_SERVER['REQUEST_URI']);
            exit;

        }

    }

}
    

echo "クリックされてないよ<br>";
     $fp=fopen("form.csv","r");
        flock($fp,LOCK_EX);
    $count=0;
    while (($array = fgetcsv($fp)) !== FALSE) {
        $getcsvdata[$count]=$array;
        $count++;
    }

//エスケープ処理を行う関数
function h($var) {
  if(is_array($var)){
    //$varが配列の場合、h()関数をそれぞれの要素について呼び出す（再帰）
    return array_map('h', $var);
  }else{
    return htmlspecialchars($var, ENT_QUOTES, 'UTF-8');
  }
}

?>
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>コンタクトフォーム</title>
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">
<link href="style.css" rel="stylesheet">
<style>
.txt-error{
    color: #ff0000;
}


table{
    width: 100%;
}
input[type="submit"],
input[type="text"],
select,
textarea,
button {
  -moz-appearance: none;
  -webkit-appearance: none;
  -webkit-box-shadow: none;
  box-shadow: none;
  outline: none;
  border: none;
}

input[type="text"],
textarea{
    border: none;
    background-color: #f5f5f5;
    width: 100%;
    padding:5px;
    box-sizing: border-box;
}

input[type="text"]:focus,
textarea:focus{
  box-shadow: 0px 0px 5px 1px rgba(0,0,0,0.6) inset;
}

textarea{
    min-height: 200px;
}

table tr{
    border-top: 1px solid #ccc;
}
table td,th{
    padding:12px;
}

table th{
    background-color: #eee8aa;
}

/* チェックboxとラジオボタン */
.label_btn{
    margin-right: 20px;
}

input[type="checkbox"],
input[type="radio"]{
    display: none;
}

.radio,
.checkbox{
    position: relative;
    padding-left: 30px;
}

.radio::before,
.checkbox::before{
    background: #fff;
    border: 1px solid #231815;
    content: '';
    display: block;
    height: 16px;
    left: 7px;
    margin-top: -8px;
    position: absolute;
    top: 50%;
    width: 16px;
}

.radio::before{
    border-radius: 50%;
}

.checkbox::after {
    border-right: 3px solid #ed7a9c;
    border-bottom: 3px solid #ed7a9c;
    content: '';
    display: block;
    height: 10px;
    left: 12px;
    margin-top: -7px;
    opacity: 0;
    position: absolute;
    top: 50%;
    transform: rotate(45deg);
    width: 6px;
}

.radio::after{
    content: '';
    display: block;
    height: 10px;
    left: 10px;
    margin-top: -5px;
    opacity: 0;
    position: absolute;
    top: 50%;
    width: 10px;
    background-color:#ed7a9c;
    border-radius: 50%;
}

input[type=radio]:checked +.radio::after{
    opacity: 1;
}

input[type=checkbox]:checked +.checkbox::after{
    opacity: 1;
}


/* ボタン */
input[type=submit]{
    width: 100%;
    max-width: 100px;
    padding: 10px;
    border-radius: 4px;
}

input[type=submit]:hover{
    background-color: #dc143c;
    color: #fff;
}

.csv_table{
    font-size: 12px;
}
</style>
</head>
<body>
<div class="container">
  <h2>フォームのテスト</h2>
  <form method="POST" action="<?php  echo $_SERVER['REQUEST_URI']; ?>">
  <table>
      <tr>
          <th>名前 ：</th>
          <td>
              <input type="text" name="name">
          <?php if(isset($error["name"])):  ?><span class="txt-error"><?= $error["name"]; ?></span><?php endif; ?>
          </td>
      </tr>
      <tr>
          <th>mail ：</th>
          <td><input type="text" name="mail">
           <?php if(isset($error["mail"])):  ?><span class="txt-error"><?= $error["mail"]; ?></span><?php endif; ?>
          </td>
      </tr>
      <tr>
          <th>確認用mail ：</th>
          <td><input type="text" name="checkmail">
           <?php if(isset($error["checkmail"])):  ?><span class="txt-error"><?= $error["checkmail"]; ?></span><?php endif; ?>
          </td>
      </tr>
      <tr>
          <th>連絡方法 ：</th>
          <td><input type="radio" name="howto" value="電話" id="r1"><label for="r1" class="label_btn radio">電話</label>
            <input type="radio" name="howto" value="メール" id="r2"><label for="r2" class="label_btn radio">メール</label>
           <?php if(isset($error["howto"])):  ?><span class="txt-error"><?= $error["howto"]; ?></span><?php endif; ?>
          </td>
      </tr>
      
      <tr>
          <th>好きな食べ物 ：</th>
          <td>
              <input type="checkbox" name="food[]" value="焼肉" id="c1"><label for="c1" class="label_btn checkbox">焼肉</label>
              <input type="checkbox" name="food[]" value="寿司" id="c2"><label for="c2" class="label_btn checkbox">寿司</label>
              <input type="checkbox" name="food[]" value="ごはん" id="c3"><label for="c3" class="label_btn checkbox">ごはん</label>
              <input type="checkbox" name="food[]" value="ハンバーグ" id="c4"><label for="c4" class="label_btn checkbox">ハンバーグ</label>
              <input type="checkbox" name="food[]" value="カレー" id="c5"><label for="c5" class="label_btn checkbox">カレー</label>
               <?php if(isset($error["food"])):  ?><span class="txt-error"><?= $error["food"]; ?></span><?php endif; ?>
          </td>
      </tr>
      <tr>
          <th>件名 ：</th>
          <td><input type="text" name="subject">
           <?php if(isset($error["subject"])):  ?><span class="txt-error"><?= $error["subject"]; ?></span><?php endif; ?>
          </td>
      </tr>
      <tr>
          <th>お問い合わせ内容 ：</th>
          <td>
              <?php if(isset($error["body"])):  ?><span class="txt-error"><?= $error["body"]; ?></span><?php endif; ?>
              <textarea name="body" placeholder="お問い合わせ内容（1000文字まで）をお書きください" rows="3"></textarea>
        </td>
      </tr>
      <tr>
          <th></th>
          <td><input name="submited" type="submit" value="送信">
        </td>
      </tr>
  </table>
  </form>
  <?php if(count($getcsvdata)>0): ?>
  <table class="csv_table">
      <?php foreach($getcsvdata as $data): ?>
      <tr><td><?= $data[0]; ?></td><td><?= $data[1]; ?></td><td><?= $data[2]; ?></td><td><?= $data[3]; ?></td><td><?= $data[4]; ?></td></tr>
      <?php endforeach; ?>
</table>
<?php endif; ?>
</body>
</html>