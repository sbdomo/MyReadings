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
	$result="";
	$languagejson="./resources/locale/admin_".$_GET['language'].".json";
	if(!file_exists($languagejson)) $languagejson="./resources/locale/admin_en.json";
	$json = file_get_contents($languagejson);
	$json = json_decode($json, true);
	$msg= $json['msg'];
	
	if(file_exists('./config/config.php')) {
		require_once('./config/config.php');
		//Test des comptes si protégé
		$accountok=true;
		if($protect==true) {
			if($account&&count($account)>0) {
					//Prendre un compte par défaut pour les tests
					$login= array_keys($account)[0];
					$pass=$account[$login][0];
			} else {
				$accountok=false;
			}
			
		} else {
			$login="";
			$pass="";
		}
		if($accountok==true){
		if($calibre) {
			$success="true";
			if (!extension_loaded("sqlite3")) $result.='<p class="yellow">'.$msg["sqlite_ext"].'</p>';
				
			if(phpversion()<=5.2) $result.='<p>'.$msg["php_version"].phpversion().'. '.$msg["php_badversion"].'.</p>';
			$result.=$msg["connect_test"];
			$result=testconnect($calibre, $result, $fetchmode, $login, $pass, $users, $customcolumn, $account, $XSendfile, $msg);
			if($limited) $result=testconnect($limited, $result, $fetchmode, $login, $pass, $users, $customcolumn, $account, $XSendfile, $msg);
			if(fw("./thumb")) {
				$result.='<p>'.$msg["writable_thumb"].'</p>';
			} else {
				$result.='<p class="red">'.$msg["writable_thumb_error"].'</p>';
			}
			if(ini_get('open_basedir')) {
				$result.='<p class="yellow">'.$msg["open_basedir"].'</p>';
			}
			if (extension_loaded("zip")) {
				$result.='<p>'.$msg["zip_loaded"].'</p>';
			} else {
				if($cbzview=="on") $result.='<p class="red">';
				else $result.='<p class="yellow">';
				$result.=$msg["zip_notloaded"].'</p>';
			}
			if (extension_loaded("rar")) {
				$result.='<p>'.$msg["rar_loaded"].'</p>';
			} else {
				if($cbrview=="on") $result.='<p class="red">';
				else $result.='<p class="yellow">';
				$result.=$msg["rar_notloaded"].'</p>';
			}
			if(fw("./cache")) {
				$result.='<p>'.$msg["cache_writable"].'</p>';
			} else {
				$result.='<p class="red">'.$msg["cache_notwritable"].'</p>';
			}
		} else {
			$result=$msg["nocalibre"];
		}
		} else $result.=$msg["account_error"];
	} else {
		$result.=$msg["noconfig"];
	}
}
$json = json_encode($result);
$json = '{"success":"'.$success.'","resultat":'.$json."}";

if (isset($_GET['callback'])) {
	echo $_GET['callback'].'('.$json.');';
} else {
	echo $json;
}

function testconnect($bases, $result, $fetchmode, $login, $pass, $users, $customs, $account, $XSendfile, $msg) {
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
		$result.='<p class="grey">'.$key.$msg["isok"].'</p>';
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
				//Test de Xsenfile grace à cover.php
				if($XSendfile) {
				$url="./cover.php?testxsendfile=true&path=".urlencode($resultat['relativePath'])."&id=".$resultat['id']."&base=".urlencode($key)."&mylogin=".urlencode($login)."&mypass=".urlencode($pass);
				$result.='<p>'.$msg["xsendfile"].':<br/><img  src="'.$url.'"/></p>';
				}
			} else $resultat = $stmt->fetch();
		}
		//Cherche les customs column pour les users
		//Dans la listes des users
		$resultuser="";
		if($users) {
			$erroruser="";
			foreach ($users as $value) {
				$queryuser = "SELECT id, datatype from custom_columns WHERE name = '".$value."'";
				$resultquery = $pdo->query($queryuser)->fetch();
				if(!$resultquery) {
					$erroruser.=" ".$value.$msg["notfound"];
				} else if($resultquery['datatype']!='int') {
					$erroruser.=" ".$value.$msg["notinteger"];
				}
			}
			if($erroruser!="") $resultuser.='<p class="red">'.$msg["user_error"].':'.$erroruser.'</p>';
			//else $result.='<p>All users OK</p>';
		}
		
		if($account&&count($account)>0) {
			$erroruser="";
			foreach ($account as $key => $value) {
				if($value[3]!="") {
					$queryuser = "SELECT id, datatype from custom_columns WHERE name = '".$value[3]."'";
					$resultquery = $pdo->query($queryuser)->fetch();
					if(!$resultquery) {
						$erroruser.=" ".$value[3].$msg["user_notfound"].$key.").";
					} else if($resultquery['datatype']!='int') {
						$erroruser.=" ".$value[3].$msg["user_notinteger"].$key.").";
					}
				}
			}
			if($erroruser!="") $resultuser.='<p class="red">'.$msg["user_error"].':'.$erroruser.'</p>';
			//else $result.='<p>All users OK</p>';
		}
		$result.=$resultuser;
		
		//Cherche les custom column
		if($customs&&$customs[$key]!=Null&&$customs[$key]!="") {
			$customarray= explode(",", $customs[$key]);
			$errorcustom="";
			foreach ($customarray as $value) {
				$query = "select * from custom_columns where label = '".$value."'";
				$resultquery = $pdo->query($query)->fetch();
				if(!$resultquery) {
					$errorcustom.=" ".$value.$msg["notfound"];
				} else if($resultquery['datatype']!='series'&&$resultquery['datatype']!='enumeration'&&$resultquery['datatype']!='int'&&$resultquery['datatype']!='bool'&&$resultquery['datatype']!='text'&&$resultquery['datatype']!='float') {
					$errorcustom.=$msg["typeof"].$value." (".$resultquery['datatype'].") ".$msg["notsupported"];
				}
			}
			if($errorcustom!="") $result.='<p class="yellow">'.$msg["custom_error"].':'.$errorcustom.'</p>';
			else $result.='<p>'.$msg["custom_okcustom_ok"].'</p>';
		}
		} else $result.='<p class="red">'.$path.$msg["no_metadata"].".</p>";
	} catch(Exception $e) {
		$result.='<p class="red">'.$msg["error_connect_with"].$key.' - '.$e->getMessage()."</p>";
	}
	}
	return $result;
}

function fw($file) {
	return (file_exists($file) && is_writeable($file));
}
?>