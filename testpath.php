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
require_once('config.php');
if($calibre) {

if (!extension_loaded("sqlite3")) {
  exit("sqlite3 extension not loaded. Please check your php.ini");
} else {
	echo '<p class="soustitre">Extension sqlite3 OK</p>';
}
// zip extension is needed for reading cbz files
if (!extension_loaded("zip")) {
	echo '<p class="soustitre">Extension zip non disponible (pour lire les cbz)</p>';
} else {
	echo '<p class="soustitre">Extension Zip OK</p>';
}

// zip extension is needed for reading cbz files
if (!extension_loaded("rar")) {
	echo '<p class="soustitre">Extension Rar non disponible (pour lire les cbr) - non géré pour l\'instant</p>';
} else {
	echo '<p class="soustitre">Extension Rar OK (pour lire les cbr) - non géré pour l\'instant</p>';
}

if($control==true) $calibre=array_merge ($calibre, $limited);
foreach ($calibre as $key => $path) {
	$connect=false;
	$result="";
	$nocover="";
	echo '<div class="titre">Test de la base '.$key.":</div>";
	$COLUMNS="books.id as id, books.title as title, books.path as relativePath, 
	has_cover as hasCover";
	$query="SELECT ".$COLUMNS." FROM books ORDER BY books.author_sort;";
	echo '<p><span class="soustitre">Test de connexion:<span> <span class="normal">';
	try{
		$pdo = new PDO('sqlite:'.$path.'metadata.db');
		$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
		$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // ERRMODE_WARNING | ERRMODE_EXCEPTION | ERRMODE_SILENT
		$stmt = $pdo->prepare($query);
		$stmt->execute(array());
		$result = $stmt->fetchAll();
		$connect=true;
	} catch(Exception $e) {
		echo "Impossible d'accéder à la base de données SQLite - ".$e->getMessage()."</span></p>";
	}
	if($connect==true) {
		echo 'Connection OK.</span></p>';
		echo '<p class="soustitre">Erreurs d\'accès:</p><div class="normalmargin">';
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
		if($erreur==false) echo "Pas d'erreur.</div>";
		else echo "</div>";
		
		
		
		if($nocover!="") {
			echo '<p class="soustitre">Ebooks sans jaquette:</p><div class="normalmargin">'.$nocover."</div>";
		}
		echo '<p>&nbsp;</p>';
	}
}
} else {
	echo "Configuration des bases Calibre non trouvée.<br />";
}
?>
</body>
</html>