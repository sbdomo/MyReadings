<?php
header('Content-Type: application/javascript; charset=utf-8');
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

if($control==true&&$limited) $calibre=array_merge ($calibre, $limited);

$request="";
if(isset($_GET['id'])) $id=$_GET['id'];
else      $id="";

//Chemin de calibre
//if(isset($_GET['pathbase'])) $path=$_GET['pathbase'];
//else erreur("No pathbase");

//biblio calibre
if(isset($_GET['txtbase'])) $txtbase=$_GET['txtbase'];
else erreur("No base");

$path=$calibre[$txtbase];
if(!$path) erreur("No base");

//Custom columns
$customs=$customcolumn[$txtbase];
if($customs!=""&&$customs!=Null) $customarray= explode(",", $customs);

$sql="SELECT books.id as id, books.title as title, books.path as relativePath, books.series_index as seriesIndex,
	has_cover as hasCover, substr(books.pubdate,1,4) as pubDate,
	(SELECT group_concat(name,', ') FROM tags WHERE tags.id IN (SELECT tag from books_tags_link WHERE book=books.id)) tagsName,
	(SELECT group_concat(name,', ') FROM series WHERE series.id IN (SELECT series from books_series_link WHERE book=books.id)) seriesName,
	(SELECT group_concat(name,', ') FROM authors WHERE authors.id IN (SELECT author from books_authors_link WHERE book=books.id)) authorsName,
	(SELECT group_concat(lang_code,', ') FROM languages WHERE languages.id IN (SELECT lang_code from books_languages_link WHERE book=books.id)) languagesName,
	comments.text as comment
	FROM books left join comments on comments.book = books.id where books.id = ?;";

//$sql2 = "select books.path as relativePath, data.format as extension, data.name as filename, data.uncompressed_size as size from data, books where books.id=data.book and book = ?";
$sql2 = "select data.format as extension, data.name as filename, data.uncompressed_size as size from data where book = ?";

$sql3 ="select * from custom_columns where label = ?";

try{
    $pdo = new PDO('sqlite:'.$path.'metadata.db');
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // ERRMODE_WARNING | ERRMODE_EXCEPTION | ERRMODE_SILENT
    
    $params=array($id);
    
    $query=$sql;
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $phpvars['books'] = $stmt->fetchAll();
    
    $query=$sql2;
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $phpvars['files'] = $stmt->fetchAll();
    
    //Traitement des custom columns
    $customresult= array();
    if($customarray) {
    foreach($customarray as $custom ) {
    	    $query=$sql3;
    	    $stmt = $pdo->prepare($query);
    	    $stmt->execute(array($custom));
    	    $custominfo=$stmt->fetch();
    	    if($custominfo) {
    	    if($custominfo["datatype"]=="series") {
    	    	    $query="select b.value, a.extra from books_custom_column_".$custominfo["id"]."_link as a
    	    	    left join custom_column_".$custominfo["id"]." as b on b.id = a.value
    	    	    where a.book = ?";
    	    	    $stmt = $pdo->prepare($query);
    	    	    $stmt->execute($params);
    	    	    $custresult=$stmt->fetch();
    	    	    if($custresult) $customresult[]=array('name'=>$custominfo["name"], 'value'=>$custresult["value"], 'num'=>$custresult["extra"]);
    	    } else if($custominfo["datatype"]=="enumeration") {
    	    	    $query="select b.value from books_custom_column_".$custominfo["id"]."_link as a
    	    	    left join custom_column_".$custominfo["id"]." as b on b.id = a.value
    	    	    where a.book = ?";
    	    	    $stmt = $pdo->prepare($query);
    	    	    $stmt->execute($params);
    	    	    $custresult=$stmt->fetch();
    	    	    if($custresult) $customresult[]=array('name'=>$custominfo["name"], 'value'=>$custresult["value"], 'num'=>"");
    	    } else if($custominfo["datatype"]=="int") {
    	    	    $query="select a.value from custom_column_".$custominfo["id"]." as a
    	    	    where a.book = ?";
    	    	    $stmt = $pdo->prepare($query);
    	    	    $stmt->execute($params);
    	    	    $custresult=$stmt->fetch();
    	    	    if($custresult) $customresult[]=array('name'=>$custominfo["name"], 'value'=>$custresult["value"], 'num'=>"");
    	    } else if($custominfo["datatype"]=="bool") {
    	    	    $query="select a.value from custom_column_".$custominfo["id"]." as a
    	    	    where a.book = ?";
    	    	    $stmt = $pdo->prepare($query);
    	    	    $stmt->execute($params);
    	    	    $custresult=$stmt->fetch();
    	    	    if($custresult) $customresult[]=array('name'=>$custominfo["name"], 'value'=>$custresult["value"], 'num'=>"");
    	    } else if($custominfo["datatype"]=="text") {//Réponse multiple possible (comme les tags)
    	    	    $query="select b.value from books_custom_column_".$custominfo["id"]."_link as a
    	    	    left join custom_column_".$custominfo["id"]." as b on b.id = a.value
    	    	    where a.book = ?";
    	    	    $stmt = $pdo->prepare($query);
    	    	    $stmt->execute($params);
    	    	    $custresult=$stmt->fetchAll();
    	    	    if($custresult) {
    	    	    	    $values="";
    	    	    	    $i=0;
    	    	    	    foreach ($custresult as $enr) {
    	    	    	    	    if($i>0) $values=$values.", ";
    	    	    	    	    $values=$values.$enr["value"];
    	    	    	    	    $i=$i+1;
    	    	    	    	    
    	    	    	    }
    	    	    	    $customresult[]=array('name'=>$custominfo["name"], 'value'=>$values, 'num'=>"");
    	    	    }
    	    } else if($custominfo["datatype"]=="float") {
    	    	    $query="select a.value from custom_column_".$custominfo["id"]." as a
    	    	    where a.book = ?";
    	    	    $stmt = $pdo->prepare($query);
    	    	    $stmt->execute($params);
    	    	    $custresult=$stmt->fetch();
    	    	    if($custresult) $customresult[]=array('name'=>$custominfo["name"], 'value'=>$custresult["value"], 'num'=>"");
    	    }
    	    
    	    }
    }}
    $phpvars['books'][0]['customs']=$customresult;
    
    //$json= '{"books":'.json_encode($result)."}";
    $json = json_encode($phpvars);
    $json = '{"success":"'.true.'","resultat":'.$json."}";

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
