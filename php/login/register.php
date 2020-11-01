<?php

//database
$dsn="mysql:host=localhost;dbname=test; charset=utf8";
$username="root";
$password="";

$msg="";
$link="";
if(isset($_POST["newsubmit"])){
    //エラーメッセージの配列
    $error=[];
    
    //フォームの値
    $name=isset($_POST["name"]) ? $_POST["name"] : NULL;
    $mail=isset($_POST["mail"]) ? $_POST["mail"] : NULL;
    $pass=isset($_POST["pass"]) ? $_POST["pass"] : NULL;
    $pass=password_hash($pass,PASSWORD_DEFAULT);  
    //値を検証する
    if($name==""){
        $error['name']="お名前は必須やで";
        $msg="エラーがあります。登録ができません。";
        $link="<a href='signup.php'>戻る</a>";
    }else if(preg_match('/\A[[:^cntrl:]]{1,30}\z/u',$name)==0){
        $msg="エラーがあります。登録ができません。";
        $error['name']="お名前は30文字以内でお願いします。";    
        $link="<a href='signup.php'>戻る</a>";
    }

    if($mail==""){
         $error['mail']="メールアドレスは必須";
         $msg="エラーがあります。登録ができません。";
         $link="<a href='signup.php'>戻る</a>";
    }else{
        $pattern = '/^([a-z0-9\+_\-]+)(\.[a-z0-9\+_\-]+)*@([a-z0-9\-]+\.)+[a-z]{2,6}$/uiD';
        if(!preg_match($pattern,$mail)){
            $error['mail'] = '*メールアドレスの形式が正しくありません。';
            $msg="エラーがあります。登録ができません。";
            $link="<a href='signup.php'>戻る</a>";
        }
    }

    if($pass==""){
        $error['name']="パスワードを入力してください";
        $msg="エラーがあります。登録ができません。";
        $link="<a href='signup.php'>戻る</a>";
    }

    if(empty($error) && $_SERVER["REQUEST_METHOD"]==='POST'){

        try{
            $pdo=new PDO($dsn,$username,$password);
        }catch(PDOException $e){
            $msg=$e->getMessage();
        }

        //フォームに入力されたmailがすでに登録されていないかチェック
        $sql="select * from users WHERE mail = :mail";
        $stmt=$pdo->prepare($sql);
        $stmt->bindValue(':mail',$mail);
        $stmt->execute();
        $memger=$stmt->fetch();

        if($memger['mail']==$mail){
            $msg="すでに同じメールアドレスが存在します。";
            $link="<a href='signup.php'>戻る</a>";
        }else{
            //登録されてなければDBにinsertする
            $sql="insert into users(username,mail,password) values(:name,:mail,:pass)";
            $stmt=$pdo->prepare($sql);
            $stmt->bindValue(':name',$name);
            $stmt->bindValue(':mail',$mail);
            $stmt->bindValue(':pass',$pass);
            $stmt->execute();

            $msg="会員登録が完了しました";
            $link="<a href='login_form.php'>ログインページ</a>";
        }

    }
   
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
</head>
<body>
<h1><?php echo $msg; ?></h1><!--メッセージの出力-->

<?php if(isset($error['name'])) echo h($error['name']); ?>
<?php if(isset($error['mail'])) echo h($error['mail']); ?>
<p><?php echo $link; ?></p>
</body>