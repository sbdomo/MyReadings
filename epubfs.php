<?php
/**
* source code : COPS (Calibre OPDS PHP Server) class file
*
* @license    GPL 2 (http://www.gnu.org/licenses/gpl.html)
* @author     Sébastien Lucas <sebastien@slucas.fr>
* modified for My readings
*/
  
if(isset($_GET['mylogin'])) $mylogin=$_GET['mylogin'];
else      $mylogin="";
if(isset($_GET['mypass'])) $mypass=$_GET['mypass'];
else      $mypass="";
require_once('config.php');

if($protect==false||(($mylogin==$login&&$mypass==$pass)||($mylogin==$login2&&$mypass==$pass2&&$control==true))) {
	 //OK
} else {
	echo "Non autorisé";
	die;
}

//Chemin de l'epub
if(isset($_GET['path'])) $mypath=$_GET['path'];
else {
	echo "No book path";
	die;
}

if(isset($_GET['comp'])) $component=$_GET['comp'];
else {
	echo "No component";
	die;
}

$add="mylogin=".$mylogin."&mypass=".$mypass."&path=".urlencode($mypath)."&";

require_once ("resources/epub/php-epub-meta/epub.php");

$book = new EPub($mypath);
$book->initSpineComponent ();

try {
    $data = getComponentContent ($book, $component, $add);

    $expires = 60*60*24*14;
    header("Pragma: public");
    header("Cache-Control: maxage=".$expires);
    header('Expires: ' . gmdate('D, d M Y H:i:s', time()+$expires) . ' GMT');
    header ("Content-Type: " . $book->componentContentType($component));
    echo $data;
}
catch (Exception $e) {
    echo $e;
}

function getComponentContent ($book, $component, $add) {
    $data = $book->component ($component);

    $callback = function ($m) use ($book, $component, $add) {
        $method = $m[1];
        $path = $m[2];
        $end = "";
        if (preg_match ("/^src\s*:/", $method)) {
            $end = ")";
        }
        if (preg_match ("/^#/", $path)) {
            return "{$method}'{$path}'{$end}";
        }
        $hash = "";
        if (preg_match ("/^(.+)#(.+)$/", $path, $matches)) {
            $path = $matches [1];
            $hash = "#" . $matches [2];
        }
        $comp = $book->getComponentName ($component, $path);
        if (!$comp) return "{$method}'#'{$end}";
        $out = "{$method}'epubfs.php?{$add}comp={$comp}{$hash}'{$end}";
        if ($end) {
            return $out;
        }
        return str_replace ("&", "&amp;", $out);
    };

    $data = preg_replace_callback ("/(src=)[\"']([^:]*?)[\"']/", $callback, $data);
    $data = preg_replace_callback ("/(href=)[\"']([^:]*?)[\"']/", $callback, $data);
    $data = preg_replace_callback ("/(\@import\s+)[\"'](.*?)[\"'];/", $callback, $data);
    $data = preg_replace_callback ("/(src\s*:\s*url\()(.*?)\)/", $callback, $data);

    return $data;
}
?>