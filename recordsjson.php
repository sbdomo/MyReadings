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

if(isset($_GET['min'])) $min=$_GET['min'];
else      $min=0;
if(isset($_GET['count'])) $count=$_GET['count'];
else      $count=100;

//Chemin de calibre
if(isset($_GET['pathbase'])) $path=$_GET['pathbase'];
else erreur("No pathbase");

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

$COLUMNS="books.id as id, books.title as title, books.path as relativePath, books.series_index as seriesIndex, 
	has_cover as hasCover, substr(books.pubdate,1,4) as pubDate,
	(SELECT group_concat(name,', ') FROM tags WHERE tags.id IN (SELECT tag from books_tags_link WHERE book=books.id)) tagsName,
	(SELECT group_concat(name,', ') FROM series WHERE series.id IN (SELECT series from books_series_link WHERE book=books.id)) seriesName,
	(SELECT group_concat(name,', ') FROM authors WHERE authors.id IN (SELECT author from books_authors_link WHERE book=books.id)) authorsName";
	
$SQL_ALL="SELECT ".$COLUMNS."
	FROM books ORDER BY ".$order." LIMIT ";

$SQL_BY_TITLE="SELECT ".$COLUMNS."
	FROM books where books.title LIKE ? ORDER BY ".$order." LIMIT ";
	
$SQL_BY_TAGNAME="SELECT DISTINCT ".$COLUMNS."
	FROM books, books_tags_link, tags
	where books_tags_link.book = books.id and tags.id = books_tags_link.tag and
	tags.name LIKE ? ORDER BY ".$order." LIMIT ";
	
$SQL_BY_AUTHORNAME="SELECT DISTINCT ".$COLUMNS."
	FROM books, books_authors_link, authors
	where books_authors_link.book = books.id and authors.id = books_authors_link.author and
	authors.name LIKE ? ORDER BY ".$order." LIMIT ";
	
$SQL_BY_SERIENAME="SELECT DISTINCT ".$COLUMNS."
	FROM books, books_series_link, series
	where books_series_link.book = books.id and series.id = books_series_link.series and
	series.name LIKE ? ORDER BY ".$order." LIMIT ";
	
$SQL_BY_AUTHOR ="SELECT ".$COLUMNS."
	FROM books_authors_link LEFT JOIN books ON books_authors_link.book = books.id
	where books_authors_link.author = ? ORDER BY ".$order." LIMIT ";
	
$SQL_BY_SERIE ="SELECT ".$COLUMNS."
	FROM books_series_link LEFT JOIN books ON books_series_link.book = books.id
	where books_series_link.series = ? ORDER BY ".$order." LIMIT ";
	
$SQL_BY_TAG ="SELECT ".$COLUMNS."
	FROM books_tags_link LEFT JOIN books ON books_tags_link.book = books.id
	where books_tags_link.tag = ? ORDER BY ".$order." LIMIT ";
	
switch ($type)
{
case "title":
        $query=$SQL_BY_TITLE;
	$params=array($find);
break;

case "tagname":
        $query=$SQL_BY_TAGNAME;
	$params=array($find);
break;

case "authorname":
        $query=$SQL_BY_AUTHORNAME;
	$params=array($find);
break;

case "seriename":
        $query=$SQL_BY_SERIENAME;
	$params=array($find);
break;

case "author":
        $query=$SQL_BY_AUTHOR;
	$params=array($idlist);
break;

case "serie":
        $query=$SQL_BY_SERIE;
	$params=array($idlist);
break;

case "tag":
        $query=$SQL_BY_TAG;
	$params=array($idlist);
break;

default: //all
        $query=$SQL_ALL;
	$params=array();
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
