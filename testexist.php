<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>My Readings - Test des bases Calibre</title>
<style type="text/css">
.titre {
	font-size : 15pt;
	color: #7f2323;
	width: 100%;
	background-color: #ababab;
	font-weight: bold;
}
.soustitre {
	color: #7382c1;
	font-weight: bold;
}
.normal {
	font-size : 12pt;
	color: black;
	font-weight: normal;
}
.normalmargin {
	font-size : 12pt;
	color: black;
	font-weight: normal;
	margin-left: 30px;
}
</style>
</head>
<body>
<?php
require_once('confadmin.php');
if($_GET['admin_login']!=$adlogin||$_GET['admin_pw']!=$adpw) exit("Not login");
if(!file_exists('config.php')) exit("No configuration file");

require_once('config.php');
if($calibre) {

if (!extension_loaded("sqlite3"))  exit("sqlite3 extension not loaded. Please check your php.ini");

if($control==true) $calibre=array_merge ($calibre, $limited);
foreach ($calibre as $key => $path) {
	$connect=false;
	$result="";
	$nocover="";
	echo '<div class="titre">Test library '.$key.":</div>";
	$COLUMNS="books.id as id, books.title as title, books.path as relativePath, 
	has_cover as hasCover";
	$query="SELECT ".$COLUMNS." FROM books ORDER BY books.author_sort;";
	try{
		$pdo = new PDO('sqlite:'.$path.'metadata.db');
		$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
		$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // ERRMODE_WARNING | ERRMODE_EXCEPTION | ERRMODE_SILENT
		$stmt = $pdo->prepare($query);
		$stmt->execute(array());
		$result = $stmt->fetchAll();
		$connect=true;
	} catch(Exception $e) {
		echo '<p class="red">Connection error - '.$e->getMessage()."</p>";
	}
	if($connect==true) {
		echo '<p class="soustitre">Access error:</p><div class="normalmargin">';
		$query2 = "select data.format as extension, data.name as filename, data.uncompressed_size as size from data where book = ?";
		$erreur=false;
		foreach ($result as $key => $book) {
			if($book['hasCover']==1) {
				$filename = $path.$book['relativePath'].'/cover.jpg';
				if (!file_exists($filename)) {
					$erreur=true;
					echo $filename."<br />";
				}
				//echo $book['hasCover']." ".$book['relativePath']."<br />";
			} else {
				$nocover=$nocover.$book['id']." - ".$book['title']."<br />";
			}
			$stmt = $pdo->prepare($query2);
			$stmt->execute(array($book['id']));
			$epubs = $stmt->fetchAll();
			foreach ($epubs as $key2 => $epub) {
				$filename = $path.$book['relativePath'].'/'.$epub['filename'].'.'.strtolower($epub['extension']);
				if (!file_exists($filename)) {
					$erreur=true;
					echo $filename."<br />";
				}
			}
		}
		if($erreur==false) echo "No error.</div>";
		else echo "</div>";
		
		
		
		if($nocover!="") {
			echo '<p class="soustitre">Ebooks without cover:</p><div class="normalmargin">'.$nocover."</div>";
		}
		echo '<p>&nbsp;</p>';
	}
}
} else {
	echo "No Calibre libraries.<br />";
}
?>
</body>
</html>