<?php
header('Content-Type: application/javascript; charset=utf-8');
//header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-cache, must-revalidate'); // HTTP/1.1
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past

if(isset($_GET['mylogin'])) $mylogin=$_GET['mylogin'];
else      $mylogin="";
if(isset($_GET['mypass'])) $mypass=$_GET['mypass'];
else      $mypass="";

if(isset($_GET['isinit'])) $isinit=$_GET['isinit'];
else      $isinit=false;


require_once('./config/config.php');

//Appelé seulement la première fois
if(!$isinit) $locale = file_get_contents("./resources/locale/local_".$language.".json");
else $locale='null';

$accountconf='null';

if($protect==true) {
	//test des identifiants
	if($account[$mylogin]&&$account[$mylogin][0]==$mypass) {
	//if($mylogin==$login&&$mypass==$pass) {
		$acc=$account[$mylogin];
		if($acc[1]=="Parental"&&$limited) {
			$result['bases']=array_merge ($calibre, $limited);
		} else {
			$result['bases']=$calibre;
		}
		
		$result['account']=array($acc[2],$acc[3]);
		
		$result['connect']="protectok";
		
		//Connexion acceptée, récupère la configuration du compte si c'est une nouvelle connexion
		if($isinit==true) {
			$fichierjson="./config/accounts.json";
			if($json = @file_get_contents($fichierjson)) {
				$json = json_decode($json, true);
				$accounts= $json['accounts'];
				if($accounts) {
					$accountconf=json_encode($accounts[$mylogin]);
				}
			}
		}
		
	//}
	//elseif($control==true&&$mylogin==$login2&&$mypass==$pass2) {
	//	$result['bases']=array_merge ($calibre, $limited);
	//	$result['connect']="protectok";
	} else {
		$result['connect']="error";
	}
} else {
	$result['bases']=$calibre;
	$result['connect']="noprotect";
}

$result['fetchmode']=$fetchmode;

$result['epubview']=$epubview;
$result['cbzview']=$cbzview;
$result['cbrview']=$cbrview;

$result['users']=$users;

$json=json_encode($result);
$json='{"config":'.$json.',"success":true,"locale":'.$locale.',"account":'.$accountconf.'}';


if (isset($_GET['callback'])) {
	echo $_GET['callback'].'('.$json.');';
} else {
	echo $json;
}
?>