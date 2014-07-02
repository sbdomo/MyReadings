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

if($protect==false) {
	//OK
} else if($account[$mylogin]&&$account[$mylogin][0]==$mypass) {
	//ok
	if($account[$mylogin][1]=="Parental"&&$limited) {
		$calibre=array_merge ($calibre, $limited);
	}
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
} else if($action=="bookmark"||$action=="bookmarkpage") {
	//id du livre
	if(isset($_GET['id'])) $id=$_GET['id'];
	else      erreur("No id");
	
	//nom de la base
	if(isset($_GET['base'])) $base=$_GET['base'];
	else      erreur("No base");
	
	//type
	if(isset($_GET['type'])) $type=$_GET['type'];
	else erreur("No book type");
	
	//user
	if(isset($_GET['userid'])) $userid=$_GET['userid'];
	else erreur("No user");
	
	//numéro de page ou percent (pour epub)
	if(isset($_GET['page'])) $page=$_GET['page'];
	else erreur("No page number");
	
	//Chapitre (fichier) de l'epub
	if(isset($_GET['componentId'])) $componentId=$_GET['componentId'];
	else $componentId="";
	
	try{
		if(!file_exists($baseconf)) erreur("No config. database");
		
		// Create (connect to) SQLite database in file
		$file_db = new PDO('sqlite:'.$baseconf);
		$file_db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
		$file_db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // ERRMODE_WARNING | ERRMODE_EXCEPTION | ERRMODE_SILENT
	
		if($action=="bookmarkpage") {
			$query = "SELECT COUNT(*) FROM book_progress WHERE book_id = ? AND base_id = ? AND user_id = ? AND type = ? LIMIT 1;";
			$stmt = $file_db->prepare($query);
			$stmt->execute(array($id, $base, $userid, $type));
			if ($stmt->fetchColumn()==1) {
				$query = "UPDATE book_progress SET date_last_read = CURRENT_TIMESTAMP, componentId = ?, percent = ? WHERE book_id = ? AND base_id = ? AND user_id = ? AND type = ?";
				$stmt = $file_db->prepare($query);
				$stmt->execute(array($componentId, $page, $id, $base, $userid, $type));
			} else {
				$query = "INSERT INTO book_progress(book_id, base_id, user_id, type, date_last_read, componentId, percent) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?)";
				$stmt = $file_db->prepare($query);
				$stmt->execute(array($id, $base, $userid, $type, $componentId, $page));
			}
			
			//1 pour indiquer que la lecture est encours
			$page=1;
		} else {
			$query = "DELETE FROM book_progress WHERE book_id = ? AND base_id = ? AND user_id = ?;";
			$stmt = $file_db->prepare($query);
			$stmt->execute(array($id, $base, $userid));
		}
	
	
		// Close file db connection
		$file_db = null;
	} catch(Exception $e) {
		//echo "Impossible d'accéder à la base de données SQLite : ".$e->getMessage();
		erreur($e->getMessage());
	}

	
	$basename=$calibre[$base].'metadata.db';
	try{
		$pdo = new PDO('sqlite:'.$basename);
		$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
		$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // ERRMODE_WARNING | ERRMODE_EXCEPTION | ERRMODE_SILENT
		
		//Vérifie que le livre existe et récupère sa serieid
		$query = "SELECT books.id as id, books_series_link.series AS serieid FROM books LEFT OUTER JOIN books_series_link ON books_series_link.book=books.id where books.id = ?;";
		$stmt = $pdo->prepare($query);
		$stmt->execute(array($id));
		$resultquery=$stmt->fetch();
		if($resultquery) {
			$result=$resultquery;
			$custom_column="custom_column_".$userid;
			$query = "SELECT COUNT(*) FROM ".$custom_column." WHERE book=".$id." LIMIT 1;";
			$resultquery = $pdo->query($query);
			//custom column = 1 pour indiquer que c'est en cours de lecture
			if ($resultquery->fetchColumn()==1) {
				$query = "UPDATE ".$custom_column." SET value = ".$page." WHERE book = ".$id;
				$pdo->exec($query);
				//$result="Bookmark updated.";
			} else {
				$query = "INSERT INTO ".$custom_column."(book, value) VALUES (".$id.", ".$page.")";
				$pdo->exec($query);
				//$result="Bookmark created.";
			}
			$success = "true";
		} else {
			$success = "false";
			$result="Book not found";
		}
		// Close file db connection
		$pdo = null;
		
	} catch(Exception $e) {
		//echo "Impossible d'accéder à la base de données SQLite : ".$e->getMessage();
		erreur($e->getMessage());
	}
} else if($action=="getpage") {
	//id du livre
	if(isset($_GET['id'])) $id=$_GET['id'];
	else      erreur("No id");
	
	//nom de la base
	if(isset($_GET['base'])) $base=$_GET['base'];
	else      erreur("No base");
	
	//type
	if(isset($_GET['type'])) $type=$_GET['type'];
	else erreur("No book type");
	
	//user
	if(isset($_GET['userid'])) $userid=$_GET['userid'];
	else erreur("No user");
	try{
		if(!file_exists($baseconf)) erreur("No config. database");
		// Create (connect to) SQLite database in file
		$file_db = new PDO('sqlite:'.$baseconf);
		$file_db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
		$file_db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // ERRMODE_WARNING | ERRMODE_EXCEPTION | ERRMODE_SILENT
		$query = "SELECT * FROM book_progress WHERE book_id = ? AND base_id = ? AND user_id = ? AND type = ? LIMIT 1;";
		$stmt = $file_db->prepare($query);
		$stmt->execute(array($id, $base, $userid, $type));
		
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
} else if($action=="getnextinseries") {
	//id du livre
	if(isset($_GET['id'])) $id=$_GET['id'];
	else      erreur("No id");
	
	//nom de la base
	if(isset($_GET['base'])) $base=$_GET['base'];
	else      erreur("No base");
	
	if(isset($_GET['userid'])) $userid=$_GET['userid'];
	else $userid="";
	
	$basename=$calibre[$base].'metadata.db';
	$bookmark="";
	$isbookmark="";
	try{
		$pdo = new PDO('sqlite:'.$basename);
		$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
		$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // ERRMODE_WARNING | ERRMODE_EXCEPTION | ERRMODE_SILENT
		
		if($userid!="") {
			$bookmark=", custom_column_".$userid.".value as bookmark";
			$isbookmark=" LEFT OUTER JOIN custom_column_".$userid." ON custom_column_".$userid.".book=books.id ";
		}
		
		//Cherche l'id du livre qui vient en suivant dans la série
		$query = "SELECT books.id as id, books.title as title, books_series_link.series AS serieid, books.series_index as seriesIndex".$bookmark."
			FROM books LEFT OUTER JOIN books_series_link ON books_series_link.book=books.id".$isbookmark."
			where books.id = ?;";
		$stmt = $pdo->prepare($query);
		$stmt->execute(array($id));
		$resultquery=$stmt->fetch();
		if(!$resultquery) erreur("Book not found");
		if($userid!="") $result["bookmark"]=$resultquery['bookmark'];
		
		
		$query = "SELECT books.id as id, books.title as title, books.path as relativePath, books.series_index as seriesIndex".$bookmark."
			FROM books_series_link LEFT JOIN books ON books.id=books_series_link.book".$isbookmark."
			where books_series_link.series=? and books.series_index>? ORDER BY books.series_index limit 1;";
		$query2 = "select data.format as extension, data.name as filename, data.uncompressed_size as size from data where book = ?";
		$stmt = $pdo->prepare($query);
		$stmt->execute(array($resultquery['serieid'],$resultquery['seriesIndex']));
		$resultquery=$stmt->fetchAll();
		//if(!$resultquery) erreur("Next book not found");
		//$result=$resultquery['id'];
		if($resultquery) {
			$result["books"]=$resultquery;
			$nextid=$resultquery[0]["id"];
			$stmt = $pdo->prepare($query2);
			$stmt->execute(array($nextid));
			$resultquery=$stmt->fetchAll();
			if($resultquery) $result["files"]=$resultquery;
		}
		
		$success = "true";
		// Close file db connection
		$pdo = null;
		
	} catch(Exception $e) {
		//echo "Impossible d'accéder à la base de données SQLite : ".$e->getMessage();
		erreur($e->getMessage());
	}
} else if($action=="saveaccount") {
	$fichierjson="./config/accounts.json";
	if ($json = @file_get_contents('php://input')) {
		    $json = json_decode($json, true);
		    $account= $json['account'];
		    
		    $sav= array(
		    	    'order' => $account['order'],
		    	    'gpseries' => $account['gpseries'],
		    	    'showifread' => $account['showifread'],
		    	    'currentuser' => $account['currentuser'],
		    	    'open_current_comic_at_launch' => $account['open_current_comic_at_launch'],
		    	    'showresize' => $account['showresize'],
		    	    'hidemenu' => $account['hidemenu'],
		    	    'zoom_on_tap' => $account['zoom_on_tap'],
		    	    'toggle_paging_bar' => $account['toggle_paging_bar'],
		    	    'page_turn_drag_threshold' => $account['page_turn_drag_threshold'],
		    	    'page_fit_mode' => $account['page_fit_mode'],
		    	    'page_change_area_width' => $account['page_change_area_width'],
		    	    'epub_mode' => $account['epub_mode'],
		    	    'epub_font' => $account['epub_font'],
		    	    'epub_fontsize' => $account['epub_fontsize'],
		    	    'pathbase' => $account['pathbase']
		    	    );
		    
		    if($json = @file_get_contents($fichierjson)) {
		    	    $json = json_decode($json, true);
		    	    $accounts= $json['accounts'];
		    } else {
		    	    $accounts=array();
		    }
		    	$accounts[$account["username"]]=$sav;  
		    $acountencode='{"accounts":'.json_encode($accounts).'}';
		    file_put_contents($fichierjson, $acountencode);
		    
		    $result="OK";
		    $success = "true";
	} else {
		$success = "false";
		$result="No account";
		
	}

//Non utilisé
} else if($action=="getbookmarkcalibre") {
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
