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
$phptxt.='$protect='.$_GET['protect'].';'."\r\n";
$phptxt.='$login="'.$_GET['login'].'";'."\r\n";
$phptxt.='$pass="'.$_GET['pass'].'";'."\r\n";
$phptxt.='$control='.$_GET['protect'].';'."\r\n";
$phptxt.='$login2="'.$_GET['login2'].'";'."\r\n";
$phptxt.='$pass2="'.$_GET['pass2'].'";'."\r\n";
$phptxt.='$fetchmode="'.$_GET['fetchmode'].'";'."\r\n";
$phptxt.='$XSendfile='.$_GET['XSendfile'].';'."\r\n";

$phptxt.='$epubview="'.$_GET['epubview'].'";'."\r\n";
$phptxt.='$cbzview="'.$_GET['cbzview'].'";'."\r\n";
$phptxt.='$cbrview="'.$_GET['cbrview'].'";'."\r\n";

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

$phptxt.='$users=array('."\r\n";
if(strval($_GET['nbuser']>1)) {
	$nbuser=strval($_GET['nbuser'])-1;
	for ($x=1; $x<=$nbuser; $x++) {
		if($_GET['userval'.$x]!="")
		$phptxt.='"'.$_GET['userval'.$x].'",'."\r\n";
	}
}
$phptxt.=');'."\r\n";


$phptxt.="?>";

file_put_contents("./config/config.php", $phptxt);

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