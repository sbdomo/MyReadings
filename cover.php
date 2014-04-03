<?php
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

if(isset($_GET['path'])) $path=$_GET['path'];
else      $path="";

if(isset($_GET['base'])) $base=$_GET['base'];
else      $base="";

if(isset($_GET['id'])) $id=$_GET['id'];
else      $id="1";

if($control==true&&$limited) $calibre=array_merge ($calibre, $limited);

$cover=$calibre[$base].$path."/cover.jpg";
$thumb_path="./thumb/";

//vignettes ipad:
//width: 142px
//height: 211px et 2X pour du retina
$height=422;

if(!file_exists ($cover)) {
	erreur('not available');
}

if($fetchmode=="resize") {
	writehead();
	//test si resize
	if(!makeThumbnail($cover, false, NULL, $height)) {
		//envoi l'image d'origine sinon
		header('Content-Disposition: attachement; filename="cover.jpg"');
		if($XSendfile) header('X-Sendfile: '.realpath($cover));
		else {
			header("Content-Length: " . filesize($cover));
			readfile($cover);
		}
	}
} else if($fetchmode=="resize_and_cache") {
	$outputfile=$thumb_path.$base."_".$id.".jpg";
	if (!file_exists($outputfile)) {
		$result = makeThumbnail($cover, true, NULL, $height, $outputfile);
		if(!$result) $outputfile="./resources/images/no_image_available.jpg";
	}
	writehead();
	if($XSendfile) header('X-Sendfile: '.$outputfile);
	else {
		header("Content-Length: " . filesize($outputfile));
		readfile($outputfile);
	}
} else { //noresize no cache
	writehead();
	header('Content-Disposition: attachement; filename="cover.jpg"');
	
	if($XSendfile) header('X-Sendfile: '.realpath($cover));
	else {
		header("Content-Length: " . filesize($cover));
		readfile($cover);
	}
}

function makeThumbnail($file, $cache, $width, $height, $outputfile = NULL) {
        if (is_null ($width) && is_null ($height)) {
            erreur("error resize");
        }
        // In case something bad happen below set a default size
        $nw = "284";
        $nh = "422";

        // get image size
        if ($size = GetImageSize($file)) {
            $w = $size[0];
            $h = $size[1];
            //set new size
            if (!is_null ($width)) {
                $nw = $width;
                if ($nw >= $w) {
			if($cache) {
				copy($file, $outputfile);
				return true;
			} else return false;
		}
                $nh = floor(($nw*$h)/$w);
            } else {
                $nh = $height;
                if ($nh >= $h) {
			if($cache) {
				copy($file, $outputfile);
				return true;
			} else return false;
		}
                $nw = floor(($nh*$w)/$h);
            }
        }
	
        //draw the image
        $src_img = imagecreatefromjpeg($file);
        $dst_img = imagecreatetruecolor($nw,$nh);
        imagecopyresampled($dst_img, $src_img, 0, 0, 0, 0, $nw, $nh, $w, $h);//resizing the image
        
	if($cache) $created = imagejpeg($dst_img,$outputfile,80);
	else imagejpeg($dst_img,$outputfile,80);
        
	imagedestroy($src_img);
        imagedestroy($dst_img);
        if($cache) return $created;
	else return true;
}

function writehead() {
	$expires = 60*60*24*14;
	//Est-ce utile ?
	//header("Pragma: public");
	//header("Cache-Control: maxage=".$expires);
	//header('Expires: ' . gmdate('D, d M Y H:i:s', time()+$expires) . ' GMT');
	
	header("Content-Type: image/jpeg");
}

function erreur($msg) {
	if($msg=="login error") {
		$outputfile="./resources/images/no_login.jpg";
	} else if($msg=="error resize") {
		$outputfile="./resources/images/errorresize.jpg";
	} else {
		$outputfile="./resources/images/no_image_available.jpg";
	}
	header("Content-Type: image/jpeg");
	header('Content-Disposition: attachement; filename="no_image.jpg"');
	header("Content-Length: " . filesize($outputfile));
	readfile($outputfile);
	die();
}
?>