<?php
header('Content-Type: application/javascript; charset=utf-8');
header('Cache-Control: no-cache, must-revalidate'); // HTTP/1.1
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past

require_once('confadmin.php');

if($_GET['admin_login']!=$adlogin||$_GET['admin_pw']!=$adpw) {
	$success="false";
	$result="login error";
} else {
$phptxt="<?php"."\r\n".'$language="'.$_GET['language'].'";'."\r\n";
$phptxt.='$protect='.$_GET['protect'].';'."\r\n";
$phptxt.='$login="'.$_GET['login'].'";'."\r\n";
$phptxt.='$pass="'.$_GET['pass'].'";'."\r\n";
$phptxt.='$control='.$_GET['protect'].';'."\r\n";
$phptxt.='$login2="'.$_GET['login2'].'";'."\r\n";
$phptxt.='$pass2="'.$_GET['pass2'].'";'."\r\n";
$phptxt.='$fetchmode="'.$_GET['fetchmode'].'";'."\r\n";
$phptxt.='$XSendfile='.$_GET['XSendfile'].';'."\r\n";

$phptxt.='$calibre=array('."\r\n";
if(strval($_GET['nbcal'])>1) {
	$nbcal=strval($_GET['nbcal'])-1;
	for ($x=1; $x<=$nbcal; $x++) {
		if($_GET['calval'.$x]!="")
		$phptxt.='"'.$_GET['calkey'.$x].'" => "'.$_GET['calval'.$x].'",'."\r\n";
	}
}
$phptxt.=');'."\r\n";

$phptxt.='$limited=array('."\r\n";
if(strval($_GET['nblim']>1)) {
	$nblim=strval($_GET['nblim'])-1;
	for ($x=1; $x<=$nblim; $x++) {
		if($_GET['limval'.$x]!="")
		$phptxt.='"'.$_GET['limkey'.$x].'" => "'.$_GET['limval'.$x].'",'."\r\n";
	}
}
$phptxt.=');'."\r\n";

$phptxt.="?>";

file_put_contents("./config.php", $phptxt);

$result="OK";
$success="true";
}

$json = json_encode($result);
    $json = '{"success":"'.$success.'","resultat":'.$json."}";

    if (isset($_GET['callback'])) {
	    echo $_GET['callback'].'('.$json.');';
    } else {
	    echo $json;
    }
?>