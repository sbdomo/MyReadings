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

if($protect==false||(($mylogin==$login&&$mypass==$pass)||($mylogin==$login2&&$mypass==$pass2&&$control==true))) {
	 //OK
} else {
	erreur("login error");
}

if(isset($_GET['min'])) $min=$_GET['min'];
else      $min=0;
if(isset($_GET['offset'])) $offset=$_GET['offset'];
else      $offset=0;
$min=$min-$offset;
if($min<0) $min=0;

if(isset($_GET['count'])) $count=$_GET['count'];
else      $count=100;

//Chemin de calibre
if(isset($_GET['pathbase'])) $path=$_GET['pathbase'];
else erreur("No pathbase");

if(isset($_GET['userid'])) $userid=$_GET['userid'];
else $userid="";
if(isset($_GET['showifread'])) $showifread=$_GET['showifread'];
else $showifread="all"; //valeurs: all, notread, read


if(isset($_GET['type'])) $type=$_GET['type'];
else      $type="";
if(isset($_GET['find'])) $find=$_GET['find'];
else      $find="";
if(isset($_GET['start'])) $start=$_GET['start'];
else      $start=0;
if(isset($_GET['order'])) $order=$_GET['order'];
else      $order="recent";

if(isset($_GET['idlist'])) $idlist=$_GET['idlist'];
else      $idlist="";

if(isset($_GET['gpseries'])) $gpseries=$_GET['gpseries'];
else      $gpseries="0";

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

default: //recent
        $order="books.timestamp DESC,  books.sort";
}
if($gpseries=="1") {
	$byseries="GROUP BY serieid ";
	$byseries2="GROUP BY serieid ";
	$countgrp="COUNT(books.id) AS nbgp,
		CASE WHEN books_series_link.series IS NULL then -books.id
		ELSE books_series_link.series END AS serieid,";
} else if($gpseries=="-1") {
	$byseries="and books_series_link.series=? ";
	$byseries2="where books_series_link.series=? ";
	$countgrp="";
} else {
	$byseries="";
	$byseries2="";
	$countgrp="";
}

$COLUMNS=$countgrp."books.id as id, books.title as title, books.path as relativePath, books.series_index as seriesIndex, 
	has_cover as hasCover, substr(books.pubdate,1,4) as pubDate,
	series.name AS seriesName,
	(SELECT group_concat(name,', ') FROM tags WHERE tags.id IN (SELECT tag from books_tags_link WHERE book=books.id)) tagsName,
	(SELECT group_concat(name,', ') FROM authors WHERE authors.id IN (SELECT author from books_authors_link WHERE book=books.id)) authorsName";
//(SELECT group_concat(name,', ') FROM series WHERE series.id IN (SELECT series from books_series_link WHERE book=books.id)) seriesName,

$isread="";
if($userid!="") {
	$COLUMNS=$COLUMNS.", (SELECT group_concat(value,', ') FROM custom_column_".$userid." WHERE custom_column_".$userid.".book=books.id) bookmark";
	if($showifread=="read") {
		$isread=" bookmark='-1' ";
	} else if($showifread=="notread") {
		$isread=" (bookmark is NULL or bookmark<>'-1') ";
	}
	if($isread!="") {
	if($gpseries=="1")  {
		$byseries2= "where".$isread.$byseries2;
	} else if($gpseries=="-1") {
		$byseries2=$byseries2."and".$isread;
	} else {
		$byseries2="where".$isread;
	}
	$isread="and".$isread;
	}
}

//Tous les livres
$SQL_ALL="SELECT DISTINCT ".$COLUMNS."
	FROM books LEFT OUTER JOIN books_series_link ON books_series_link.book=books.id
	    LEFT OUTER JOIN series ON books_series_link.series=series.id
	".$byseries2."ORDER BY ".$order." LIMIT ";
//texte dans titre du livre
$SQL_BY_TITLE="SELECT DISTINCT ".$COLUMNS."
	FROM books LEFT OUTER JOIN books_series_link ON books_series_link.book=books.id
	    LEFT OUTER JOIN series ON books_series_link.series=series.id
	where books.title LIKE ? ".$isread.$byseries."ORDER BY ".$order." LIMIT ";
//texte dans étiquette (tags)
$SQL_BY_TAGNAME="SELECT DISTINCT ".$COLUMNS."
	FROM books LEFT OUTER JOIN books_series_link ON books_series_link.book=books.id
	    LEFT OUTER JOIN series ON books_series_link.series=series.id,
	    books_tags_link, tags
	where books_tags_link.book = books.id and tags.id = books_tags_link.tag and
	tags.name LIKE ? ".$isread.$byseries."ORDER BY ".$order." LIMIT ";
//texte dans auteur
$SQL_BY_AUTHORNAME="SELECT DISTINCT ".$COLUMNS."
	FROM books LEFT OUTER JOIN books_series_link ON books_series_link.book=books.id
	    LEFT OUTER JOIN series ON books_series_link.series=series.id,
	    books_authors_link, authors
	where books_authors_link.book = books.id and authors.id = books_authors_link.author and
	authors.name LIKE ? ".$isread.$byseries."ORDER BY ".$order." LIMIT ";
//texte dans serie
$SQL_BY_SERIENAME="SELECT DISTINCT ".$COLUMNS."
	FROM books LEFT OUTER JOIN books_series_link ON books_series_link.book=books.id
	    LEFT OUTER JOIN series ON books_series_link.series=series.id
	where series.name LIKE ? ".$isread.$byseries."ORDER BY ".$order." LIMIT ";
//un auteur
$SQL_BY_AUTHOR="SELECT DISTINCT ".$COLUMNS."
	FROM books_authors_link LEFT JOIN books ON books_authors_link.book = books.id
	    LEFT OUTER JOIN books_series_link ON books_series_link.book=books.id
	    LEFT OUTER JOIN series ON books_series_link.series=series.id
	where books_authors_link.author = ? ".$isread.$byseries."ORDER BY ".$order." LIMIT ";
//une série
$SQL_BY_SERIE="SELECT DISTINCT ".$COLUMNS."
	FROM books LEFT OUTER JOIN books_series_link ON books_series_link.book=books.id
	    LEFT OUTER JOIN series ON books_series_link.series=series.id
	where books_series_link.series = ? ".$isread.$byseries."ORDER BY ".$order." LIMIT ";
//Une étiquette
$SQL_BY_TAG="SELECT DISTINCT ".$COLUMNS."
	FROM books_tags_link LEFT JOIN books ON books_tags_link.book = books.id
	    LEFT OUTER JOIN books_series_link ON books_series_link.book=books.id
	    LEFT OUTER JOIN series ON books_series_link.series=series.id
	where books_tags_link.tag = ? ".$isread.$byseries."ORDER BY ".$order." LIMIT ";

switch ($type)
{
case "title":
        $query=$SQL_BY_TITLE;
	if($gpseries=="-1") $params=array($find, $findserie);
        else $params=array($find);
break;

case "tagname":
        $query=$SQL_BY_TAGNAME;
	if($gpseries=="-1") $params=array($find, $findserie);
        else $params=array($find);
break;

case "authorname":
        $query=$SQL_BY_AUTHORNAME;
	if($gpseries=="-1") $params=array($find, $findserie);
        else $params=array($find);
break;

case "seriename":
        $query=$SQL_BY_SERIENAME;
	if($gpseries=="-1") $params=array($find, $findserie);
        else $params=array($find);
break;

case "author":
        $query=$SQL_BY_AUTHOR;
	if($gpseries=="-1") $params=array($idlist, $findserie);
        else $params=array($idlist);
break;

case "serie":
        $query=$SQL_BY_SERIE;
	if($gpseries=="-1") $params=array($idlist, $findserie);
        else $params=array($idlist);
break;

case "tag":
        $query=$SQL_BY_TAG;
	if($gpseries=="-1") $params=array($idlist, $findserie);
        else $params=array($idlist);
break;

default: //all - comme title mais sans texte à chercher
        $query=$SQL_ALL;
        if($gpseries=="-1") $params=array($findserie);
        else $params=array();
}

try{
    //$pdo = new PDO('sqlite:'.dirname(__FILE__).'/metadata.db');
    $pdo = new PDO('sqlite:'.$path.'metadata.db');
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // ERRMODE_WARNING | ERRMODE_EXCEPTION | ERRMODE_SILENT
    
    //$stmt = $pdo->prepare(str_format($query, $columns));
    $stmt = $pdo->prepare($query.$min.",".$count);
    $stmt->execute($params);
    $result["books"] = $stmt->fetchAll();
    
    //$json= '{"books":'.json_encode($result)."}";
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
