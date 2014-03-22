<?php
header('Content-Type: application/javascript; charset=utf-8');
//header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-cache, must-revalidate'); // HTTP/1.1
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past
if(isset($_GET['mylogin'])) $mylogin=$_GET['mylogin'];
else      $mylogin="";
if(isset($_GET['mypass'])) $mypass=$_GET['mypass'];
else      $mypass="";
require_once('config.php');

if($protect==false||(($mylogin==$login&&$mypass==$pass)||($mylogin==$login2&&$mypass==$pass2&&$control==true))) {
	 //OK
} else {
	erreur("login error");
}

//Utilisé pour la pagination de la requête sql avec la commande LIMIT
if(isset($_GET['min'])) $min=$_GET['min'];
else      $min=0;
if(isset($_GET['count'])) $count=$_GET['count'];
else      $count=25;

//Chemin de calibre
if(isset($_GET['pathbase'])) $path=$_GET['pathbase'];
else erreur("No pathbase");

//indique la table à utiliser. valeurs: author, serie, tag
if(isset($_GET['list'])) $list=$_GET['list'];
else      $list="author";
//Texte à recherche ="" s'il faut tout afficher
if(isset($_GET['search'])) $search=$_GET['search'];
else      $search="";
//if(isset($_GET['start'])) $start=$_GET['start'];
//else      $start=0;

//$SQL_AUTHOR = "SELECT * FROM [tag_browser_authors] LIMIT ";
$SQL_AUTHOR="SELECT id, name, (SELECT COUNT(id) FROM books_authors_link WHERE author=authors.id) count FROM authors";
$SQL_AUTHORCOUNT="SELECT count() AS count FROM authors";

$SQL_SERIE="SELECT id, name, (SELECT COUNT(id) FROM books_series_link WHERE series=series.id) count FROM series";
$SQL_SERIECOUNT="SELECT count() AS count FROM series";

$SQL_TAG="SELECT id, name, (SELECT COUNT(id) FROM books_tags_link WHERE tag=tags.id) count FROM tags";
$SQL_TAGCOUNT="SELECT count() AS count FROM tags";

$order=" ORDER BY sort";
switch ($list)
{
case "author":
        $query=$SQL_AUTHOR;
	$query2=$SQL_AUTHORCOUNT;
break;
case "serie":
        $query=$SQL_SERIE;
	$query2=$SQL_SERIECOUNT;
break;
case "tag":
        $query=$SQL_TAG;
	$query2=$SQL_TAGCOUNT;
	$order=" ORDER BY name";
break;
default:
        erreur('list non conforme');
}

if($search=="") {
	$query=$query.$order." LIMIT ";
	$query2=$query2;
	$params=array();
} else {
	$query=$query." WHERE name LIKE ?".$order." LIMIT ";
	$query2=$query2." WHERE name LIKE ?";
	$params=array('%'.$search.'%');
}

try{
    //$pdo = new PDO('sqlite:'.dirname(__FILE__).'/metadata.db');
    $pdo = new PDO('sqlite:'.$path.'metadata.db');
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // ERRMODE_WARNING | ERRMODE_EXCEPTION | ERRMODE_SILENT
    
    $stmt = $pdo->prepare($query2);
    $stmt->execute($params);
    $total = $stmt->fetch();
    $result["total"] = $total["count"];
    
    
    $stmt = $pdo->prepare($query.$min.",".$count);
    $stmt->execute($params);
    $result["list"] = $stmt->fetchAll();
    
    $resutl["success"]=true;
    $json=json_encode($result);

    if (isset($_GET['callback'])) {
	    echo $_GET['callback'].'('.$json.');';
    } else {
	    echo $json;
    }
    
} catch(Exception $e) {
    //echo "Impossible d'accéder à la base de données SQLite : ".$e->getMessage();
    erreur($e->getMessage());
}

function erreur($message) {
	$result = array("list"=>array(),"success"=>false, "message"=>$message);
	$json=json_encode($result);
	if (isset($_GET['callback'])) {
		echo $_GET['callback'].'('.$json.');';
	} else {
		echo $json;
	}
	die();
}
?>