<?php
header('Content-Type: application/javascript; charset=utf-8');
//header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-cache, must-revalidate'); // HTTP/1.1
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past

if(isset($_GET['mylogin'])) $mylogin=$_GET['mylogin'];
else      $mylogin="";
if(isset($_GET['mypass'])) $mypass=$_GET['mypass'];
else      $mypass="";

require_once('./config.php');

$locale = file_get_contents("./resources/locale/local_".$language.".json");

if($protect==true) {
	//test des identifiants
	if($mylogin==$login&&$mypass==$pass) {
		$result['bases']=$calibre;
		$result['connect']="protectok";
	} else {
		$result['connect']="error";
	}
} else {
	$result['bases']=$calibre;
	$result['connect']="noprotect";
}



$json=json_encode($result);
$json='{"config":'.$json.',"success":true,"locale":'.$locale.'}';


if (isset($_GET['callback'])) {
	echo $_GET['callback'].'('.$json.');';
} else {
	echo $json;
}
?>