<?php
if(isset($_GET['mylogin'])) $mylogin=$_GET['mylogin'];
else      $mylogin="";
if(isset($_GET['mypass'])) $mypass=$_GET['mypass'];
else      $mypass="";
require_once('config.php');

if($protect==true&&(($mylogin==$login&&$mypass==$pass)||($mylogin==$login2&&$mypass==$pass2&&$control==true))) {
	 //OK
} else {
	erreur("login error");
}

if(isset($_GET['path'])) $path=$_GET['path'];
else      $path="";

if(isset($_GET['filename'])) $filename=$_GET['filename'];
else      $filename="";

if(isset($_GET['extension'])) $extension=$_GET['extension'];
else      $extension="";

if(isset($_GET['base'])) $base=$_GET['base'];
else      $base="";

if($control==true&&$limited) $calibre=array_merge ($calibre, $limited);

$ebook=$calibre[$base].$path."/".$filename.".".$extension;

if(!file_exists ($ebook)) {
	erreur('not available');
}

$mimetypes = array(
        'azw'   => 'application/x-mobipocket-ebook',
        'azw3'  => 'application/x-mobipocket-ebook',
        'cbz'   => 'application/x-cbz',
        'cbr'   => 'application/x-cbr',
        'doc'   => 'application/msword',
        'epub'  => 'application/epub+zip',
        'fb2'   => 'text/fb2+xml',
        'kobo'  => 'application/x-koboreader-ebook',
        'mobi'  => 'application/x-mobipocket-ebook',
        'lit'   => 'application/x-ms-reader',
        'lrs'   => 'text/x-sony-bbeb+xml',
        'lrf'   => 'application/x-sony-bbeb',
        'lrx'   => 'application/x-sony-bbeb',
        'ncx'   => 'application/x-dtbncx+xml',
        'opf'   => 'application/oebps-package+xml',
        'otf'   => 'application/x-font-opentype',
        'pdb'   => 'application/vnd.palm',
        'pdf'   => 'application/pdf',
        'prc'   => 'application/x-mobipocket-ebook',
        'rtf'   => 'application/rtf',
        'svg'   => 'image/svg+xml',
        'ttf'   => 'application/x-font-truetype',
        'wmf'   => 'image/wmf',
        'xhtml' => 'application/xhtml+xml',
        'xpgt'  => 'application/adobe-page-template+xml',
        'zip'   => 'application/zip'
);

//Utile ?
//$expires = 60*60*24*14;
//header("Pragma: public");
//header("Cache-Control: maxage=".$expires);
//header('Expires: ' . gmdate('D, d M Y H:i:s', time()+$expires) . ' GMT');


//N'accepte que des fichier par les extension ci-dessus
//pour ne pas permettre le téléchargement de n'importe quoi...
if(array_key_exists ($extension, $mimetypes)) header("Content-Type: ".$mimetypes[$extenion]);
else erreur('unknown extension');

//Non géré: mise à jour epub

header('Content-Disposition: attachment; filename="'.basename ($ebook).'"');

if($XSendfile) {
	header('X-Sendfile: '.realpath($ebook));
	//Utile ?
	//header("Content-Length: ".filesize($ebook));
} else {
	//$fp = fopen($ebook, 'rb');	
	header("Content-Length: ".filesize($ebook));
	//fpassthru($fp);
	readfile($ebook);
}


function erreur($message) {
	echo $message;
	die();
}
?>