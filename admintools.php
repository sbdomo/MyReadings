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
	} else if($action=="initdeletesaveaccount") {
		$result=array();
		$fichierjson="./config/accounts.json";
		if ($json = @file_get_contents($fichierjson)) {
		    $json = json_decode($json, true);
		    $accounts= $json['accounts'];
		    foreach( $accounts as $key => $value){
			    $result[]=$key;
		    }
		}
		$success=true;
	} else if($action=="deletesaveaccount") {
		if($_GET['accountsav']) {
		$account=$_GET['accountsav'];
		$result=array();
		$fichierjson="./config/accounts.json";
		if ($json = @file_get_contents($fichierjson)) {
		    $json = json_decode($json, true);
		    $accounts= $json['accounts'];
		    unset($accounts[$account]);
		    
		    $acountencode='{"accounts":'.json_encode($accounts).'}';
		    file_put_contents($fichierjson, $acountencode);
		    
		    foreach( $accounts as $key => $value){
			    $result[]=$key;
		    }
		}
		$success=true;
		} else {
			$result="You didn't choose the account to delete";
		}
		
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