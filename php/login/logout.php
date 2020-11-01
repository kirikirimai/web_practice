<?php

session_start();

$_SESSION=array(); //セッションの中身をすべて削除

session_destroy(); //セッションの破棄

?>

<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>ログアウト</title>
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
 <h1>ログアウトしました</h1>
 <p><a href="login_form.php">ログインへ</a></p>
</body>
</html>

