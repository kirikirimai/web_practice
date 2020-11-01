<?php
session_start();

$username="";

$msg="";
$link="";

if(isset($_SESSION['id'])){ //ログイン中
    $username=$_SESSION['name'];
    $msg="こんにちは！".htmlspecialchars($username, ENT_QUOTES, 'UTF-8')."さん";
    $link="<a href='logout.php'>ログアウト</a>";

}else{ //ログインしていない時
    $msg="ログインしていません。";
    $link="<a href='login_form.php'>ログイン</a>";
}

?>
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>2ページ目</title>
  <meta charset="utf-8">
  <meta name="description" content="">
  <meta name="author" content="">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="">
  <!--[if lt IE 9]>
<script src="//cdn.jsdelivr.net/html5shiv/3.7.2/html5shiv.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/respond.js/1.4.2/respond.min.js"></script>
<![endif]-->
  <link rel="shortcut icon" href="">
  <link rel="stylesheet" href="main.css"> </head>
<body>
 <h1>2ページ目</h1>
<p><?= $msg; ?></p>
<p><?= $link; ?></p>
<p><a href="index.php">トップページ</a></p>
</body>
</html>

