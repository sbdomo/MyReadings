<?php
header('Content-Type: application/javascript; charset=utf-8');
header('Cache-Control: no-cache, must-revalidate'); // HTTP/1.1
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past
if(isset($_GET['mylogin'])) $mylogin=$_GET['mylogin'];
else      $mylogin="";
if(isset($_GET['mypass'])) $mypass=$_GET['mypass'];
else      $mypass="";

if(isset($_GET['action'])) $action=$_GET['action'];
else      $action="";

require_once('./config/config.php');

if($protect==false||(($mylogin==$login&&$mypass==$pass)||($mylogin==$login2&&$mypass==$pass2&&$control==true))) {
	 //OK
} else {
	erreur("login error");
}

$baseconf="./config/conf.db";

if($action=="cache") {
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
			if($file->isFile() && !$file->isDot() && ($file->getMTime()<$reftime) && ($file->getFilename()!="writetest.html")) {
				unlink($file->getPathname());
				$filenbr=$filenbr+1;
			}
		}
		file_put_contents($fichierjson, $now);
		$result="delete ".$filenbr." files";
	} else {
		$result="was ok";
	}
	$success=true;
} else if($action=="bookmark"||$action=="bookmarkepub") {
	//id du livre
	if(isset($_GET['id'])) $id=$_GET['id'];
	else      erreur("No id");
	
	//nom de la base
	if(isset($_GET['base'])) $base=$_GET['base'];
	else      erreur("No base");
	
	//user
	if(isset($_GET['userid'])) $userid=$_GET['userid'];
	else erreur("No user");
	
	if($action=="bookmarkepub") {
		//Chapitre (fichier) de l'epub
		if(isset($_GET['componentId'])) $componentId=$_GET['componentId'];
		else erreur("No bookmark");
		//Pourcentage d'avancement dans le chapitre
		if(isset($_GET['page'])) $percent=$_GET['page'];
		else erreur("No bookmark");
		
		//Pour indiquer dans metadata.db que la lecture est en cours
		$page = "1";
		
	    try{
		if(!file_exists($baseconf)) erreur("No config. database");
		
		// Create (connect to) SQLite database in file
		$file_db = new PDO('sqlite:'.$baseconf);
		$file_db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
		$file_db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // ERRMODE_WARNING | ERRMODE_EXCEPTION | ERRMODE_SILENT
		$query = "SELECT COUNT(*) FROM book_progress WHERE book_id = ? AND base_id = ? AND user_id = ? LIMIT 1;";
		$stmt = $file_db->prepare($query);
		$stmt->execute(array($id, $base, $userid));
		//$resultquery = $file_db->query($query);
		if ($stmt->fetchColumn()==1) {
			$query = "UPDATE book_progress SET date_last_read = CURRENT_TIMESTAMP, componentId = ?, percent = ? WHERE book_id = ? AND base_id = ? AND user_id = ?";
			$stmt = $file_db->prepare($query);
			$stmt->execute(array($componentId, $percent, $id, $base, $userid));
			$success = "true";
			$result="Bookmark updated.";
		} else {
			$query = "INSERT INTO book_progress(book_id, base_id, user_id, date_last_read, componentId, percent) VALUES (?, ?, ?, CURRENT_TIMESTAMP, ?, ?)";
			$stmt = $file_db->prepare($query);
			$stmt->execute(array($id, $base, $userid, $componentId, $percent));
			$success = "true";
			$result="Bookmark created.";
		}
		// Close file db connection
		$file_db = null;
	    } catch(Exception $e) {
		//echo "Impossible d'accéder à la base de données SQLite : ".$e->getMessage();
		erreur($e->getMessage());
	    }
		
	} else {
		//numéro de page
		if(isset($_GET['page'])) $page=$_GET['page'];
		else erreur("No page number");
	}
	
	$basename=$calibre[$base].'metadata.db';
	try{
		$pdo = new PDO('sqlite:'.$basename);
		$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
		$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // ERRMODE_WARNING | ERRMODE_EXCEPTION | ERRMODE_SILENT
				
		$custom_column="custom_column_".$userid;
		
		$query = "SELECT COUNT(*) FROM ".$custom_column." WHERE book=".$id." LIMIT 1;";
		$resultquery = $pdo->query($query);
		if ($resultquery->fetchColumn()==1) {
			$query = "UPDATE ".$custom_column." SET value = ".$page." WHERE book = ".$id;
			$pdo->exec($query);
			$result="Bookmark updated.";
		} else {
			$query = "INSERT INTO ".$custom_column."(book, value) VALUES (".$id.", ".$page.")";
			$pdo->exec($query);
			$result="Bookmark created.";
		}
		$success = "true";
		
		// Close file db connection
		$pdo = null;
		
	} catch(Exception $e) {
		//echo "Impossible d'accéder à la base de données SQLite : ".$e->getMessage();
		erreur($e->getMessage());
	}
} else if($action=="getbookmarkepub") {
	//id du livre
	if(isset($_GET['id'])) $id=$_GET['id'];
	else      erreur("No id");
	
	//nom de la base
	if(isset($_GET['base'])) $base=$_GET['base'];
	else      erreur("No base");
	
	//user
	if(isset($_GET['userid'])) $userid=$_GET['userid'];
	else erreur("No user");
	try{
		if(!file_exists($baseconf)) erreur("No config. database");
		// Create (connect to) SQLite database in file
		$file_db = new PDO('sqlite:'.$baseconf);
		$file_db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
		$file_db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // ERRMODE_WARNING | ERRMODE_EXCEPTION | ERRMODE_SILENT
		$query = "SELECT * FROM book_progress WHERE book_id = ? AND base_id = ? AND user_id = ? LIMIT 1;";
		$stmt = $file_db->prepare($query);
		$stmt->execute(array($id, $base, $userid));
		
		$book=$stmt->fetch();
		//print_r($book);
		$result= array(
			"percent" => $book['percent'],
			"componentId" => $book['componentId']
			);
		$file_db = null;
		$success = "true";
	} catch(Exception $e) {
		//echo "Impossible d'accéder à la base de données SQLite : ".$e->getMessage();
		erreur($e->getMessage());
	}
} else if($action=="getuserid") {
	//nom de la base
	if(isset($_GET['base'])) $base=$_GET['base'];
	else      erreur("No base");
	
	//user
	if(isset($_GET['user'])) $user=$_GET['user'];
	else erreur("No user");
	
	$basename=$calibre[$base].'metadata.db';
	try{
		$pdo = new PDO('sqlite:'.$basename);
		$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
		$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // ERRMODE_WARNING | ERRMODE_EXCEPTION | ERRMODE_SILENT
		$query = "SELECT id from custom_columns WHERE name = ?";
		
		$stmt = $pdo->prepare($query);
		$stmt->execute(array($user));
		$resultquery=$stmt->fetch();
		//$custom=$resultquery->fetch();
		if(!$resultquery) erreur("User not found");
		
		$result=$resultquery['id'];
		
		$success = "true";
		
		// Close file db connection
		$pdo = null;
		
	} catch(Exception $e) {
		//echo "Impossible d'accéder à la base de données SQLite : ".$e->getMessage();
		erreur($e->getMessage());
	}
//Non utilisé
} else if($action=="getbookmark") {
	//id du livre
	if(isset($_GET['id'])) $id=$_GET['id'];
	else      erreur("No id");
	
	//nom de la base
	if(isset($_GET['base'])) $base=$_GET['base'];
	else      erreur("No base");
	
	//user
	if(isset($_GET['user'])) $user=$_GET['user'];
	else erreur("No user");
	
	$basename=$calibre[$base].'metadata.db';
	try{
		$pdo = new PDO('sqlite:'.$basename);
		$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
		$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // ERRMODE_WARNING | ERRMODE_EXCEPTION | ERRMODE_SILENT
		$query = "SELECT id from custom_columns WHERE name = ?";
		
		$stmt = $pdo->prepare($query);
		$stmt->execute(array($user));
		$resultquery=$stmt->fetch();
		//$custom=$resultquery->fetch();
		if(!$resultquery) erreur("User not found");
		
		$custom_column="custom_column_".$resultquery['id'];
		
		$query = "SELECT value FROM ".$custom_column." WHERE book=".$id." LIMIT 1;";
		$resultquery = $pdo->query($query)->fetch();
		
		if(!$resultquery) erreur("Book not found");
		
		$result=$resultquery["value"];
		
		$success = "true";
		
		// Close file db connection
		$pdo = null;
		
	} catch(Exception $e) {
		//echo "Impossible d'accéder à la base de données SQLite : ".$e->getMessage();
		erreur($e->getMessage());
	}
} else erreur("no action");

$json=json_encode($result);
$json = '{"success":"'.$success.'","resultat":'.$json."}";
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
