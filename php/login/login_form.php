
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>ログイン</title>
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
 <h1>ログインページ</h1>
<form action="login.php" method="post">
<div>
    <label>メールアドレス：<label>
    <input type="text" name="mail" required>
</div>
<div>
    <label>パスワード：<label>
    <input type="password" name="loginpass" required>
</div>
<input type="submit" name="submitted" value="ログイン">
</form>
<?php if(isset($_GET['result'])):?>
<p>ログインできません。</p>
<p><a href="index.php">トップへ戻る</a></p>
<p><a href="signup.php">新規登録</a></p>
<?php endif; ?>
</body>
</html>

