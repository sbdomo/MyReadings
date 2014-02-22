<?php
header('Content-Type: application/javascript; charset=utf-8');
header('Cache-Control: no-cache, must-revalidate'); // HTTP/1.1
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past
if(isset($_GET['mylogin'])) $mylogin=$_GET['mylogin'];
else      $mylogin="";
if(isset($_GET['mypass'])) $mypass=$_GET['mypass'];
else      $mypass="";
require_once('config.php');

if($protect==true&&($mylogin!=$login&&$mypass!=$pass)) erreur("login error");

//Le chemin est en dur pour éviter le détournement de ClearCache
$cache="./cache";
$daysnbr=1;

$fichierjson="cache.json";

$lastcache=file_get_contents($fichierjson);
$now=mktime(0, 0, 0, date('m'), date('d'), date('Y'));
$reftime=$now-86400*$daysnbr;
if($lastcache<$reftime) {
	//Mise à jour du cache
	$folder = new DirectoryIterator($cache);
	$filenbr=0;
	foreach($folder as $file) {
		if($file->isFile() && !$file->isDot() && ($file->getMTime()<$reftime)) {
			unlink($file->getPathname());
			$filenbr=$filenbr+1;
		}
	}
	file_put_contents($fichierjson, $now);
	$result="delete ".$filenbr." files";
} else {
	$result="was ok";
}

$json=json_encode($result);
$json = '{"success":"'.true.'","resultat":'.$json."}";
if (isset($_GET['callback'])) {
	echo $_GET['callback'].'('.$json.');';
} else {
	echo $json;
}

function erreur($message) {
	$result = array("resultat"=>array(),"success"=>false, "message"=>$message);
	$json=json_encode($result);
	if (isset($_GET['callback'])) {
		echo $_GET['callback'].'('.$json.');';
	} else {
	    echo $json;
	}
	die();
}

?>
