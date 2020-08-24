<?php
require 'functions.php';
//メールアドレス等を記述したファイルの読み込み
 require 'mailvars.php'; 

//postされたデータを変数に格納
$name=isset($_POST["name"]) ? $_POST["name"] : NULL;
$email=isset($_POST["email"]) ? $_POST["email"] : NULL;
$email_check=isset($_POST["email_check"]) ? $_POST["email_check"] : NULL;
$tel=isset($_POST["tel"]) ? $_POST["tel"] : NULL;
$subject=isset($_POST["subject"]) ? $_POST["subject"] : NULL;
$body =isset($_POST["body"]) ? $_POST["body"] : NULL;

//前後の空白を削除
$name=trim($name);
$email=trim($email);
$email_check=trim($email_check);
$tel=trim($tel);
$subject=trim($subject);
$body=trim($body);

//
if(isset($_POST["submitted"])){

    //POSTデータをチェック
    $_POST=checkInput($_POST);
    //エラーメッセージの配列
    $error=[];

    //値を検証する
    if($name==""){
        $error['name']="お名前は必須やで";
    }else if(preg_match('/\A[[:^cntrl:]]{1,30}\z/u',$name)==0){
        $error['name']="お名前は30文字以内でお願いします。";    
    }

    if($email==""){
         $error['email']="メールアドレスは必須";
    }else{
        $pattern = '/^([a-z0-9\+_\-]+)(\.[a-z0-9\+_\-]+)*@([a-z0-9\-]+\.)+[a-z]{2,6}$/uiD';
        if(!preg_match($pattern,$email)){
            $error['email'] = '*メールアドレスの形式が正しくありません。';
        }
    }

    if($email_check==""){
        $error['email_check'] = '*確認用メールアドレスは必須です。';
    }else{
        //アドレスの一致
        if($email!==$email){
           $error['email_check'] = '*メールアドレスが一致しません。';
        }
    }

    if($tel!==""){
        if ( preg_match( '/\A[[:^cntrl:]]{0,30}\z/u', $tel ) == 0 ) {
                $error['tel'] = '*電話番号は30文字以内でお願いします。';
        }

        if(preg_match('/\A\(?\d{2,5}\)?[-(\.\s]{0,2}\d{1,4}[-)\.\s]{0,2}\d{3,4}\z/u',$tel)==0){
            $error["tel_format"]="電話番号の形式が正しくありません";
        }
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

    if(empty($error) && $_SERVER["REQUEST_METHOD"]==='POST'){

        //メール本文
        $mail_body="コンタクトページからお問い合わせ".'\n\n';
        $mail_body.="お名前：".h($name)."\n";
        $mail_body.="email : ".h($email)."\n";
        $mail_body.="tel ：".h($tel)."\n";
        $mail_body.="お問い合わせ ："."\n".h($body);

        //--------------------------------------------------------------------
        //  send email
        //-------------------------------------------------------------------

        //メールの宛先
        $maito=mb_encode_mimeheader(MAIL_TO_NAME)."<".MAIL_TO.">";
        $return_mail=MAIL_RETURN_PATH;

        //日本語の設定
        mb_language('ja');
        mb_internal_encoding('UTF-8');

        //送信者 from header の設定
        $header="From:".mb_encode_mimeheader($name)."<".$email.">\n";

        $result=mb_send_mail($maito,$subject,$mail_body,$header);

        //送信結果
        if($result){
            //全部初期化して空に
            $_POST=[];
            $name="";
            $email="";
            $email_check="";
            $tel="";
            $subject="";
            $body="";

            //再読み込み
            $param="?result=".$result;
            //URLを組み立てる
            $url=(empty($_SERVER["HTTPS"])) ? 'http://' : 'https://'.$_SERVER["HTTP_HOST"].$_SERVER["SCRIPT_NAME"];

            header('Location:'.$url.$param);
            exit;

        }

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
</head>
<body>
<div class="container">
  <h2 class="">お問い合わせフォーム</h2>
  <?php  if ( isset($_GET['result']) && $_GET['result'] ) : // 送信が成功した場合?>
  <h4>送信完了!</h4>
  <p>送信完了いたしました。</p>
  <hr>
  <?php elseif (isset($result) && !$result ): // 送信が失敗した場合 ?>
  <h4>送信失敗</h4>
  <p>申し訳ございませんが、送信に失敗しました。</p>
  <p>しばらくしてもう一度お試しになるか、メールにてご連絡ください。</p>
  <p>メール：<a href="mailto:info@example.com">Contact</a></p>
  <hr>
  <?php endif; ?>
  <p>以下のフォームからお問い合わせください。</p>
  <form id="form" method="post">
    <div class="form-group">
      <label for="name">お名前（必須） 
        <span class="error"><?php if(isset($error['name'])) echo h($error['name']); ?></span>
      </label>
      <input type="text" class="form-control" id="name" name="name" placeholder="氏名" value="<?php echo h($name); ?>">
    </div>
    <div class="form-group">
      <label for="email">Email（必須） 
        <span class="error"><?php if(isset($error['email'] )) echo h($error['email'] ); ?></span>
      </label>
      <input type="text" class="form-control" id="email" name="email" placeholder="Email アドレス" value="<?php echo h($email); ?>">
    </div>
    <div class="form-group">
      <label for="email_check">Email（確認用 必須） 
        <span class="error"><?php if (isset($error['email_check'])) echo h($error['email_check'] ); ?></span>
      </label>
      <input type="text" class="form-control" id="email_check" name="email_check" placeholder="Email アドレス（確認のためもう一度ご入力ください。）" value="<?php echo h($email_check); ?>">
    </div>
    <div class="form-group">
      <label for="tel">お電話番号（半角英数字） 
        <span class="error"><?php if (isset($error['tel'])) echo h( $error['tel'] ); ?></span>
        <span class="error"><?php if (isset($error['tel_format'])) echo '<br>'. h( $error['tel_format'] ); ?></span>
      </label>
      <input type="text" class="form-control" id="tel" name="tel" value="<?php echo h($tel); ?>" placeholder="お電話番号（半角英数字でご入力ください）">
    </div>
    <div class="form-group">
      <label for="subject">件名（必須） 
        <span class="error"><?php if ( isset( $error['subject'] ) ) echo h( $error['subject'] ); ?></span> 
      </label>
      <input type="text" class="form-control" id="subject" name="subject" placeholder="件名" value="<?php echo h($subject); ?>">
    </div>
    <div class="form-group">
      <label for="body">お問い合わせ内容（必須） 
        <span class="error"><?php if ( isset( $error['body'] ) ) echo h( $error['body'] ); ?></span>
      </label>
      <textarea class="form-control" id="body" name="body" placeholder="お問い合わせ内容（1000文字まで）をお書きください" rows="3"><?php echo h($body); ?></textarea>
    </div>
    <button name="submitted" type="submit" class="btn btn-primary">送信</button>
  </form>
</div>
</body>