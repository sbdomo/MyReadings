<?php
header('Content-Type: application/javascript; charset=utf-8');
//header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-cache, must-revalidate'); // HTTP/1.1
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past

require_once('../config.php');

$result['bases']=$calibre;

$locale = file_get_contents("../resources/locale/local_".$language.".json");

$json=json_encode($result);
$json='{"config":'.$json.',"success":true,"locale":'.$locale.'}';


if (isset($_GET['callback'])) {
	echo $_GET['callback'].'('.$json.');';
} else {
	echo $json;
}
?>