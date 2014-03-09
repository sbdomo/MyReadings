<?php
header('Content-Type: application/javascript; charset=utf-8');
header('Cache-Control: no-cache, must-revalidate'); // HTTP/1.1
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past

require_once('confadmin.php');
$success="false";
$result="";
if($_GET['admin_login']!=$adlogin||$_GET['admin_pw']!=$adpw) {
	$result="login error";
} else {
	if(file_exists('config.php')) {
		require_once('config.php');
		if($calibre) {
			if (extension_loaded("sqlite3")) {
				$success="true";
				if(phpversion()<=5.2) $result.='<p>Your php version is '.phpversion().'. If you have a problem, you could test a newer version.</p>';
				$result.='<p>Connection Test:</p>';
				$result.="<p>If all is OK, you must see a cover for each library.</p>";
				$result.="<p>If your library is OK, but you don't see the cover, it's probably a problem with acccess mode configuration.</p>";
				$result=testconnect($calibre, $result, $fetchmode, $login, $pass);
				if($limited) $result=testconnect($limited, $result, $fetchmode, $login, $pass);
				if(fw("./thumb")) {
					$result.='<p>Directory thumb is writable (use by access mode with resize and cache)</p>';
				} else {
					$result.='<p class="red">Directory thumb is not writable (you can\'t use access mode with resize and cache)</p>';
				}
				if(ini_get('open_basedir')) {
					$result.='<p class="yellow">You have a open_basedir restriction. If you can\'t access to your library, try to add your library path in open_basedir.</p>';
				}
				if (extension_loaded("zip")) {
					$result.='<p>Zip extension loaded (use by cbz viewer)</p>';
				} else {
					$result.='<p class="red">Zip extension not loaded (you can\'t use viewer)</p>';
				}
				
				//if (!extension_loaded("rar")) {
				//	$result.='<p>Rar extension loaded (use by cbr viewer)</p>';
				//} else {
				//	$result.='<p class="red">Rar extension not loaded (you can\'t use cbr viewer)</p>';
				//}
				if(fw("./cache")) {
					$result.='<p>Directory cache is writable (use by cbz viewer)</p>';
				} else {
					$result.='<p class="red">Directory cache is not writable (you can\'t use viewer)</p>';
				}
			} else {
				$result="Sqlite3 extension not loaded. Please check your php.ini";
			}
		} else {
			$result="Calibre libraires are not defined";
		}
	} else {
		$result="Configuration is not defined";
	}
}
$json = json_encode($result);
$json = '{"success":"'.$success.'","resultat":'.$json."}";

if (isset($_GET['callback'])) {
	echo $_GET['callback'].'('.$json.');';
} else {
	echo $json;
}

function testconnect($bases, $result, $fetchmode, $login, $pass) {
	$COLUMNS="books.id as id, books.title as title, books.path as relativePath, has_cover as hasCover";
	$query="SELECT ".$COLUMNS." FROM books ORDER BY books.author_sort;";
	foreach ($bases as $key => $path) {
	try{
		$pdo = new PDO('sqlite:'.$path.'metadata.db');
		$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
		$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // ERRMODE_WARNING | ERRMODE_EXCEPTION | ERRMODE_SILENT
		$stmt = $pdo->prepare($query);
		$stmt->execute(array());
		//$resultat = $stmt->fetchAll();
		$resultat = $stmt->fetch();
		$hascover=0;
		$result.='<p>'.$key.' is OK</p>';
		while($resultat&&$hascover==0){
			//echo $resultat;
			if($resultat['hasCover']) {
				$hascover=1;
				if($fetchmode=="direct") {
				$result.='<p><img  src="'.$path.$resultat['relativePath'].'/cover.jpg"/></p>';
				} else {
				$url="./cover.php?path=".urlencode($resultat['relativePath'])."&id=".$resultat['id']."&base=".urlencode($key)."&mylogin=".urlencode($login)."&mypass=".urlencode($pass);
				$result.='<p><img  src="'.$url.'"/></p>';
				}
			} else $resultat = $stmt->fetch();
		}
	} catch(Exception $e) {
		$result.='<p class="red">Connection error with '.$key.' - '.$e->getMessage()."</p>";
	}
	}
	return $result;
}

function fw($file) {
	return (file_exists($file) && is_writeable($file));
}
?>