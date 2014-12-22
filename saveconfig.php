<?php
header('Content-Type: application/javascript; charset=utf-8');
header('Cache-Control: no-cache, must-revalidate'); // HTTP/1.1
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past

require_once('./config/confadmin.php');

if($_GET['admin_login']!=$adlogin||$_GET['admin_pw']!=$adpw) {
	$success="false";
	$result="login error";
} else {
//Creation de conf.db si nécessaire
$basename="./config/conf.db";
if(!file_exists($basename)) {
		/**************************************
	      * Create database                     *
	      **************************************/
	      // Create (connect to) SQLite database in file
	      $file_db = new PDO('sqlite:'.$basename);
	      // Set errormode to exceptions
	      $file_db->setAttribute(PDO::ATTR_ERRMODE, 
                            PDO::ERRMODE_EXCEPTION);
	      
	      /**************************************
	      * Create tables                       *
	      **************************************/
	      $file_db->exec("CREATE TABLE book_progress(
		      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
		      book_id INTEGER NOT NULL,
		      base_id TEXT NOT NULL,
		      type TEXT NOT NULL, 
		      user_id INTEGER NOT NULL,
		      componentId TEXT,
		      percent REAL,
		      date_last_read INTEGER
		      );");
}

$phptxt="<?php"."\r\n".'$language="'.$_GET['language'].'";'."\r\n";

$protect=$_GET['protect'];
if($protect!=false&&$protect!=true) $protect=true;
$phptxt.='$protect='.$protect.';'."\r\n";
$phptxt.='$fetchmode="'.$_GET['fetchmode'].'";'."\r\n";

$XSendfile=$_GET['XSendfile'];
if($XSendfile!=false&&$XSendfile!=true) $XSendfile=false;
$phptxt.='$XSendfile='.$XSendfile.';'."\r\n";

$phptxt.='$epubview="'.$_GET['epubview'].'";'."\r\n";
$phptxt.='$cbzview="'.$_GET['cbzview'].'";'."\r\n";
$phptxt.='$cbrview="'.$_GET['cbrview'].'";'."\r\n";

$resizecbz=$_GET['resizecbz'];
if($resizecbz!=false&&$resizecbz!=true) $resizecbz=false;
$phptxt.='$resizecbz='.$resizecbz.';'."\r\n";

$maxsize=$_GET['maxsize'];
if(!$maxsize>0) $maxsize=5242880;
$phptxt.='$maxsize='.$maxsize.';'."\r\n";

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

$phptxt.='$customcolumn=array('."\r\n";
if(strval($_GET['nbcal'])>1) {
	$nbcust=strval($_GET['nbcal'])-1;
	for ($x=1; $x<=$nbcust; $x++) {
		if($_GET['calcustom'.$x]!="")
		$phptxt.='"'.$_GET['calkey'.$x].'" => "'.$_GET['calcustom'.$x].'",'."\r\n";
	}
}
if(strval($_GET['nblim']>1)) {
	$nbcust=strval($_GET['nblim'])-1;
	for ($x=1; $x<=$nbcust; $x++) {
		if($_GET['limcustom'.$x]!="")
		$phptxt.='"'.$_GET['limkey'.$x].'" => "'.$_GET['limcustom'.$x].'",'."\r\n";
	}
}
$phptxt.=');'."\r\n";

$phptxt.='$users=array('."\r\n";
if(strval($_GET['nbuser']>1)) {
	$nbuser=strval($_GET['nbuser'])-1;
	for ($x=1; $x<=$nbuser; $x++) {
		if($_GET['userval'.$x]!="")
		$phptxt.='"'.$_GET['userval'.$x].'",'."\r\n";
	}
}
$phptxt.=');'."\r\n";

$phptxt.='$account=array('."\r\n";
if(strval($_GET['nbaccount']>1)) {
	$nbaccount=strval($_GET['nbaccount'])-1;
	for ($x=1; $x<=$nbaccount; $x++) {
		if($_GET['acc_login'.$x]!="")
		$phptxt.='"'.$_GET['acc_login'.$x].'" => array("'.$_GET['acc_pass'.$x].'", "'.$_GET['acc_access'.$x].'", "'.$_GET['acc_userchoice'.$x].'", "'.$_GET['acc_user'.$x].'"),'."\r\n";
	}
}
$phptxt.=');'."\r\n";



$phptxt.="?>";

file_put_contents("./config/config.php", $phptxt);

$phptxt="<?php"."\r\n".'$language0="'.$_GET['language'].'";'."\r\n?>";
file_put_contents("./config/language.php", $phptxt);

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