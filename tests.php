<?php
header('Content-Type: application/javascript; charset=utf-8');
header('Cache-Control: no-cache, must-revalidate'); // HTTP/1.1
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past

require_once('./config/confadmin.php');
$success="false";
$result="";
if($_GET['admin_login']!=$adlogin||$_GET['admin_pw']!=$adpw) {
	$result="login error";
} else {
	if(file_exists('./config/config.php')) {
		require_once('./config/config.php');
		if($calibre) {
			$success="true";
			if (!extension_loaded("sqlite3")) $result='<p class="yellow">Sqlite3 extension could be not loaded.</p>';
				
			if(phpversion()<=5.2) $result.='<p>Your php version is '.phpversion().'. If you have a problem, you could test a newer version.</p>';
			$result.='<p>Connection Test:</p>';
			$result.="<p>If all is OK, you must see a cover for each library.</p>";
			$result.="<p>If your library is OK, but you don't see the cover, it's probably a problem with acccess mode configuration.</p>";
			$result=testconnect($calibre, $result, $fetchmode, $login, $pass, $users, $customcolumn);
			if($limited) $result=testconnect($limited, $result, $fetchmode, $login, $pass, $users, $customcolumn);
			if(fw("./thumb")) {
				$result.='<p>Directory thumb is writable (use by access mode with resize and cache)</p>';
			} else {
				$result.='<p class="red">Directory thumb is not writable (you can\'t use access mode with resize and cache)</p>';
			}
			if(ini_get('open_basedir')) {
				$result.='<p class="yellow">You have a open_basedir restriction. If you can\'t access to your library, try to add your library path in open_basedir.</p>';
			}
			if (extension_loaded("zip")) {
				$result.='<p>PHP Zip extension loaded (use by cbz viewer)</p>';
			} else {
				if($cbzview=="on") $result.='<p class="red">';
				else $result.='<p class="yellow">';
				$result.='PHP Zip extension not loaded (you can\'t use viewer)</p>';
			}
			if (extension_loaded("rar")) {
				$result.='<p>PHP Rar extension loaded (use by cbr viewer)</p>';
			} else {
				if($cbrview=="on") $result.='<p class="red">';
				else $result.='<p class="yellow">';
				$result.='PHP Rar extension not loaded (you can\'t use cbr viewer)</p>';
			}
			if(fw("./cache")) {
				$result.='<p>Directory cache is writable (use by cbz viewer)</p>';
			} else {
				$result.='<p class="red">Directory cache is not writable (you can\'t use viewer)</p>';
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

function testconnect($bases, $result, $fetchmode, $login, $pass, $users, $customs) {
	$COLUMNS="books.id as id, books.title as title, books.path as relativePath, has_cover as hasCover";
	$query="SELECT ".$COLUMNS." FROM books ORDER BY books.author_sort;";
	foreach ($bases as $key => $path) {
	try{
		if(file_exists($path.'metadata.db')) {
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
		//Cherche les customs column pour les users
		if($users) {
			$erroruser="";
			foreach ($users as $value) {
				$queryuser = "SELECT id, datatype from custom_columns WHERE name = '".$value."'";
				$resultquery = $pdo->query($queryuser)->fetch();
				if(!$resultquery) {
					$erroruser.=" ".$value." not found.";
				} else if($resultquery['datatype']!='int') {
					$erroruser.=" ".$value." is not integer.";
				}
			}
			if($erroruser!="") $result.='<p class="red">User error:'.$erroruser.'</p>';
			else $result.='<p>All users OK</p>';
		}
		//Cherche les custom column
		if($customs&&$customs[$key]!=Null&&$customs[$key]!="") {
			$customarray= explode(",", $customs[$key]);
			$errorcustom="";
			foreach ($customarray as $value) {
				$query = "select * from custom_columns where label = '".$value."'";
				$resultquery = $pdo->query($query)->fetch();
				if(!$resultquery) {
					$errorcustom.=" ".$value." not found.";
				} else if($resultquery['datatype']!='series'&&$resultquery['datatype']!='enumeration'&&$resultquery['datatype']!='int'&&$resultquery['datatype']!='bool'&&$resultquery['datatype']!='text'&&$resultquery['datatype']!='float') {
					$errorcustom.=" The type of ".$value." (".$resultquery['datatype'].") is not supported.";
				}
			}
			if($errorcustom!="") $result.='<p class="yellow">Custom column error:'.$errorcustom.'</p>';
			else $result.='<p>All custom columns are OK</p>';
		}
		} else $result.='<p class="red">'.$path."metadata.db not found.</p>";
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