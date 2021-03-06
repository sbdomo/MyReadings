<?php
header('Content-Type: application/javascript; charset=utf-8');
//header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-cache, must-revalidate'); // HTTP/1.1
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past
if(isset($_GET['mylogin'])) $mylogin=$_GET['mylogin'];
else      $mylogin="";
if(isset($_GET['mypass'])) $mypass=$_GET['mypass'];
else      $mypass="";
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

if(isset($_GET['min'])) $min=$_GET['min'];
else $min=0;
//Pour dinimuer le min si un bookmark à fait disparaitre un livre de la liste précédente
//ex: première requête pour les 100 premier livres non lu, deux livres parmi ces 100 sont marqué comme lu,
//la deuxième requête ne devra pas prendre les 100 livres suivants à partir de 101 mais à partir de 99.
if(isset($_GET['offset'])) $offset=$_GET['offset'];
else $offset=0;
$min=$min-$offset;
if($min<0) $min=0;

if(isset($_GET['count'])) $count=$_GET['count'];
else $count=100;

//Chemin de calibre
if(isset($_GET['txtbase'])) $txtbase=$_GET['txtbase'];
else erreur("No base");
$path=$calibre[$txtbase];
if(!$path) erreur("No base");

if(isset($_GET['userid'])) $userid=$_GET['userid'];
else $userid="";

//1 s'il est demandé d'afficher le premier custom column
if(isset($_GET['showcust'])) $showcust=$_GET['showcust'];
else $showcust="0";

//s'il y a un filtre principal (en plus d'autres critères de recherche)
if(isset($_GET['idfilter'])) $idfilter=$_GET['idfilter'];
else      $idfilter="";
//valeurs: author, serie, tag
if(isset($_GET['listfilter'])) $listfilter=$_GET['listfilter'];
else      $listfilter="";

//Tri par livre lu ou pas - valeurs: all, notread, read, reading
if(isset($_GET['showifread'])) $showifread=$_GET['showifread'];
else $showifread="all";
//Type de requête (par titre, auteur...)
if(isset($_GET['type'])) $type=$_GET['type'];
else      $type="";
//Texte à recherche
if(isset($_GET['find'])) $find=$_GET['find'];
else      $find="";
//Utilisé pour la recherche de texte: texte au début ou pas
if(isset($_GET['start'])) $start=$_GET['start'];
else      $start=0;
//ordre de tri de la requête - valeur: pubdate, title, serie ou par défaut (recent)
if(isset($_GET['order'])) $order=$_GET['order'];
else      $order="recent";
//pour la recherche depuis une liste: id de l'auteur, de la série...
if(isset($_GET['idlist'])) $idlist=$_GET['idlist'];
else      $idlist="";

//Pour le groupement par série: valeur -1, 1, 2 ou par défaut (voir plus bas...)
if(isset($_GET['gpseries'])) $gpseries=$_GET['gpseries'];
else      $gpseries="0";

//S'il faut chercher une série (par son id) dans le cas gpseries=="-1" ou $gpseries=="2"
if(isset($_GET['findserie'])) $findserie=$_GET['findserie'];
else      $findserie="";

if($start==0) {
	$find='%'.$find.'%';
} else {
	$find=$find.'%';
}

switch ($order)
{
case "pubdate":
        $order="books.pubdate DESC, books.sort";
break;

case "title":
        $order="books.sort";
break;

case "serie":
        $order="seriesName,  seriesIndex";
break;

case "author":
        $order="books.author_sort,  books.sort";
break;

default: //recent
        $order="books.timestamp DESC,  books.sort";
}
//Groupé par série
if($gpseries=="1") {
	$byseries="GROUP BY serieid ";
	$countgrp="COUNT(books.id) AS nbgp,
		CASE WHEN books_series_link.series IS NULL then -books.id
		ELSE books_series_link.series END AS serieid,";
//pour afficher les livres d'une série (sous menu de groupé par sértie
} else if($gpseries=="-1") {
	$byseries="and books_series_link.series=? ";
	$countgrp="";
//Utilisé après le changement d'un bookmark du groupe d'une série
//Pour connaitre le nombre de livres et l'état du groupe
} else if($gpseries=="2") {
	$byseries="and books_series_link.series=? GROUP BY serieid ";
	$countgrp="COUNT(books.id) AS nbgp,
		CASE WHEN books_series_link.series IS NULL then -books.id
		ELSE books_series_link.series END AS serieid,";
//Cas par défaut : non groupé
} else {
	$byseries="";
	$countgrp="";
}

//Initialisation connection
try{
    $pdo = new PDO('sqlite:'.$path.'metadata.db');
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // ERRMODE_WARNING | ERRMODE_EXCEPTION | ERRMODE_SILENT
} catch(Exception $e) {
    erreur($e->getMessage());
}
//Gestion des custom column
$custom1="";
$custom1Table="";
$customlabel="";
$customs=$customcolumn[$txtbase];
if($showcust==1&&$customs!=""&&$customs!=Null) {
	$customarray= explode(",", $customs);
	$customlabel=$customarray[0];
}
if($customlabel!="") {
	$stmt = $pdo->prepare("select * from custom_columns where label = ?");
	$stmt->execute(array($customlabel));
	$custominfo=$stmt->fetch();
	if($custominfo) {
	$custom1Id=$custominfo["id"];
	if($custominfo["datatype"]=="series") {
		$custom1="b.value as cust1value, a.extra as cust1extra, ";
		$custom1Table="LEFT OUTER JOIN books_custom_column_".$custom1Id."_link as a ON a.book=books.id
	    LEFT OUTER JOIN custom_column_".$custom1Id." as b ON a.value=b.id ";
	} else if($custominfo["datatype"]=="enumeration") {
		$custom1="b.value as cust1value, ";
		$custom1Table="LEFT OUTER JOIN books_custom_column_".$custom1Id."_link as a ON a.book=books.id
	    LEFT OUTER JOIN custom_column_".$custom1Id." as b ON a.value=b.id ";
	} else if($custominfo["datatype"]=="int") {
		$custom1="a.value as cust1value, ";
		$custom1Table="LEFT OUTER JOIN custom_column_".$custom1Id." as a ON a.book=books.id ";
	} else if($custominfo["datatype"]=="bool") {
		$custom1="a.value as cust1value, ";
		$custom1Table="LEFT OUTER JOIN custom_column_".$custom1Id." as a ON a.book=books.id ";
	} else if($custominfo["datatype"]=="text") {//Réponse multiple possible (comme les tags)
		$custom1="(SELECT group_concat(value,', ') FROM custom_column_".$custom1Id." as b WHERE b.id IN (SELECT value from books_custom_column_".$custom1Id."_link WHERE book=books.id)) cust1value, ";
		
	} else if($custominfo["datatype"]=="float") {
		$custom1="a.value as cust1value, ";
		$custom1Table="LEFT OUTER JOIN custom_column_".$custom1Id." as a ON a.book=books.id ";
	}
	}
}

$COLUMNS=$countgrp.$custom1."books.id as id, books.title as title, books.path as relativePath, books.series_index as seriesIndex, 
	has_cover as hasCover, substr(books.pubdate,1,4) as pubDate,
	series.name AS seriesName,
	(SELECT group_concat(name,', ') FROM tags WHERE tags.id IN (SELECT tag from books_tags_link WHERE book=books.id)) tagsName,
	(SELECT group_concat(name,', ') FROM authors WHERE authors.id IN (SELECT author from books_authors_link WHERE book=books.id)) authorsName";

$isread="";
$isbookmark="";
//S'il y a un userid, il peut y avoir des bookmarks
if($userid!="") {
	if($gpseries=="1"||$gpseries=="2") {
	//Dans le cas d'un groupement par série: reading donne le nombre de livre en cours de lecture du groupe et read le nombre de livre lus.
	$COLUMNS=$COLUMNS.", custom_column_".$userid.".value as bookmark, SUM(CASE WHEN custom_column_".$userid.".value=1 then 1
		ELSE 0 END) as reading, SUM(CASE WHEN custom_column_".$userid.".value=-1 then 1
		ELSE 0 END) as read";
	} else {
	$COLUMNS=$COLUMNS.", custom_column_".$userid.".value as bookmark";
	}
	$isbookmark=" LEFT OUTER JOIN custom_column_".$userid." ON custom_column_".$userid.".book=books.id ";
	
	//Pour faire une sélection livres lus/non lus si demandé.
	if($showifread=="read") {
		$isread="and bookmark='-1' ";
	} else if($showifread=="notread") {
		$isread="and (bookmark is NULL or bookmark<>'-1') ";
	} else if($showifread=="reading") {
		$isread="and bookmark='1' ";
	}
}

if($listfilter!=""&&$listfilter!="") {
	$books1="(SELECT books.id, books.title, books.sort, books.timestamp, books.pubdate, books.series_index, books.author_sort, books.path, books.has_cover FROM ";
	switch ($listfilter)
	{
	case "tag":
	$books=$books1."books_tags_link INNER JOIN books ON books_tags_link.book = books.id where books_tags_link.tag = ".$idfilter.") AS books";
	break;
	case "author":
	$books=$books1."books_authors_link INNER JOIN books ON books_authors_link.book = books.id where books_authors_link.author = ".$idfilter.") AS books";
	break;
	case "serie":
	$books=$books1."books_series_link INNER JOIN books ON books_series_link.book = books.id where books_series_link.series = ".$idfilter.") AS books";
	break;
	default:
	$books="books";
	}
} else $books="books";

//Tous les livres
//$SQL_BY_TITLE est utilisé
//texte dans titre du livre
$SQL_BY_TITLE="SELECT DISTINCT ".$COLUMNS."
	FROM ".$books." ".$custom1Table."LEFT OUTER JOIN books_series_link ON books_series_link.book=books.id
	    LEFT OUTER JOIN series ON books_series_link.series=series.id".$isbookmark."
	where books.title LIKE ? ".$isread.$byseries."ORDER BY ".$order." LIMIT ";
//texte dans étiquette (tags)
$SQL_BY_TAGNAME="SELECT DISTINCT ".$COLUMNS."
	FROM ".$books." ".$custom1Table."LEFT OUTER JOIN books_series_link ON books_series_link.book=books.id
	    LEFT OUTER JOIN series ON books_series_link.series=series.id".$isbookmark.",
	    books_tags_link, tags
	where books_tags_link.book = books.id and tags.id = books_tags_link.tag and
	tags.name LIKE ? ".$isread.$byseries."ORDER BY ".$order." LIMIT ";
//texte dans auteur
$SQL_BY_AUTHORNAME="SELECT DISTINCT ".$COLUMNS."
	FROM ".$books." ".$custom1Table."LEFT OUTER JOIN books_series_link ON books_series_link.book=books.id
	    LEFT OUTER JOIN series ON books_series_link.series=series.id".$isbookmark.",
	    books_authors_link, authors
	where books_authors_link.book = books.id and authors.id = books_authors_link.author and
	authors.name LIKE ? ".$isread.$byseries."ORDER BY ".$order." LIMIT ";
//texte dans serie
$SQL_BY_SERIENAME="SELECT DISTINCT ".$COLUMNS."
	FROM ".$books." ".$custom1Table."LEFT OUTER JOIN books_series_link ON books_series_link.book=books.id
	    LEFT OUTER JOIN series ON books_series_link.series=series.id".$isbookmark."
	where series.name LIKE ? ".$isread.$byseries."ORDER BY ".$order." LIMIT ";
//un auteur
$SQL_BY_AUTHOR="SELECT DISTINCT ".$COLUMNS."
	FROM books_authors_link INNER JOIN ".$books." ON books_authors_link.book = books.id
	    ".$custom1Table."LEFT OUTER JOIN books_series_link ON books_series_link.book=books.id
	    LEFT OUTER JOIN series ON books_series_link.series=series.id".$isbookmark."
	where books_authors_link.author = ? ".$isread.$byseries."ORDER BY ".$order." LIMIT ";
//une série
$SQL_BY_SERIE="SELECT DISTINCT ".$COLUMNS."
	FROM ".$books." ".$custom1Table."LEFT OUTER JOIN books_series_link ON books_series_link.book=books.id
	    LEFT OUTER JOIN series ON books_series_link.series=series.id".$isbookmark."
	where books_series_link.series = ? ".$isread.$byseries."ORDER BY ".$order." LIMIT ";
//Une étiquette
$SQL_BY_TAG="SELECT DISTINCT ".$COLUMNS."
	FROM books_tags_link INNER JOIN ".$books." ON books_tags_link.book = books.id
	    ".$custom1Table."LEFT OUTER JOIN books_series_link ON books_series_link.book=books.id
	    LEFT OUTER JOIN series ON books_series_link.series=series.id".$isbookmark."
	where books_tags_link.tag = ? ".$isread.$byseries."ORDER BY ".$order." LIMIT ";

switch ($type)
{
case "title":
        $query=$SQL_BY_TITLE;
	if($gpseries=="-1"||$gpseries=="2") $params=array($find, $findserie);
        else $params=array($find);
break;

case "tagname":
        $query=$SQL_BY_TAGNAME;
	if($gpseries=="-1"||$gpseries=="2") $params=array($find, $findserie);
        else $params=array($find);
break;

case "authorname":
        $query=$SQL_BY_AUTHORNAME;
	if($gpseries=="-1"||$gpseries=="2") $params=array($find, $findserie);
        else $params=array($find);
break;

case "seriename":
        $query=$SQL_BY_SERIENAME;
	if($gpseries=="-1"||$gpseries=="2") $params=array($find, $findserie);
        else $params=array($find);
break;

case "author":
        $query=$SQL_BY_AUTHOR;
	if($gpseries=="-1"||$gpseries=="2") $params=array($idlist, $findserie);
        else $params=array($idlist);
break;

case "serie":
        $query=$SQL_BY_SERIE;
	if($gpseries=="-1"||$gpseries=="2") $params=array($idlist, $findserie);
        else $params=array($idlist);
break;

case "tag":
        $query=$SQL_BY_TAG;
	if($gpseries=="-1"||$gpseries=="2") $params=array($idlist, $findserie);
        else $params=array($idlist);
break;

default: //all - comme title mais sans texte à chercher
        $query=$SQL_BY_TITLE;
        if($gpseries=="-1"||$gpseries=="2") $params=array("%%", $findserie);
        else $params=array("%%");
}

try{
    $stmt = $pdo->prepare($query.$min.",".$count);
    $stmt->execute($params);
    $result["books"] = $stmt->fetchAll();
    
    $json=json_encode($result);

    if (isset($_GET['callback'])) {
	    echo $_GET['callback'].'('.$json.');';
    } else {
	    echo $json;
    }
    
} catch(Exception $e) {
    erreur($e->getMessage());
}

function erreur($message) {
	$result = array("books"=>array(),"success"=>false, "message"=>$message);
	$json=json_encode($result);
	if (isset($_GET['callback'])) {
		echo $_GET['callback'].'('.$json.');';
	} else {
	    echo $json;
	}
	die();
}
?>
