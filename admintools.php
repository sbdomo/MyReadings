<?php
header('Content-Type: application/javascript; charset=utf-8');
header('Cache-Control: no-cache, must-revalidate'); // HTTP/1.1
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past

require_once('./config/confadmin.php');
$success="false";
$result="";
$cache="./thumb";
if($_GET['admin_login']!=$adlogin||$_GET['admin_pw']!=$adpw) {
	$result="login error";
} else {
	$action=$_GET['action'];
	if($action=="deletethumb") {
		$folder = new DirectoryIterator($cache);
		$filenbr=0;
		foreach($folder as $file) {
			if($file->isFile() && !$file->isDot() && ($file->getFilename()!="writetest.html")) {
				unlink($file->getPathname());
				$filenbr=$filenbr+1;
			}
		}
		$result="delete ".$filenbr." files in thumb";
		$success=true;
	} else {
		$result="error";
	}
}
$json = json_encode($result);
$json = '{"success":"'.$success.'","resultat":'.$json."}";

if (isset($_GET['callback'])) {
	echo $_GET['callback'].'('.$json.');';
} else {
	echo $json;
}