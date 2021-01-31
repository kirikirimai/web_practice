<?php
session_start();

$msg="";
$link="";

//database
$dsn="mysql:host=localhost;dbname=test; charset=utf8";
$username="root";
$password="";

if(isset($_POST["submitted"])){
    //エラーメッセージの配列
    $error=[];

    //フォームの値
    $pass=isset($_POST["loginpass"]) ? $_POST["loginpass"] : NULL;
    $mail=isset($_POST["mail"]) ? $_POST["mail"] : NULL;

    try{
        $pdo=new PDO($dsn,$username,$password);
    }catch(PDOException $e){
        $msg=$e->getMessage();
    }

    //ログイン
    $sql="select * from users WHERE mail = :mail";
    $stmt=$pdo->prepare($sql);
    $stmt->bindValue(':mail',$mail);
    $stmt->execute();

    $member=$stmt->fetch();
    //指定したハッシュがパスワードにマッチしてるかどうか
    if(password_verify($pass,$member['password'])){
        //DBのユーザー情報をセッションに保存
        $_SESSION['id']=$member['id'];
        $_SESSION['name']=$member['username'];
      
       header('Location:index.php');
        exit;
    }else{
       
        header('Location:login_form.php?result=true');
        exit;
    }
}


?>