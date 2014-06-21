<?php
header('Content-Type: application/javascript; charset=utf-8');
header('Cache-Control: no-cache, must-revalidate'); // HTTP/1.1
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past
if(isset($_GET['mylogin'])) $mylogin=$_GET['mylogin'];
else      $mylogin="";
if(isset($_GET['mypass'])) $mypass=$_GET['mypass'];
else      $mypass="";
require_once('./config/config.php');

if($protect==false||($account[$mylogin]&&$account[$mylogin][0]==$mypass)) {
	 //OK
} else {
	erreur("login error");
}

//id du livre
if(isset($_GET['id'])) $id=$_GET['id'];
else      erreur("No id");

//id de la base
if(isset($_GET['idbase'])) $idbase=$_GET['idbase'];
else      erreur("No id for base");

//Chemin du cbz
if(isset($_GET['path'])) $path=$_GET['path'];
else erreur("No pathbase");

//numéro de page
if(isset($_GET['page'])) $page=$_GET['page'];
else erreur("No page number");

//Le chemin est en dur pour éviter le détournement de ClearCache
$cache="./cache";

//Sera initialisé par ParseComicArchive
$number_of_page=0;

//indique le format si IsRarFile ou IsZipFile = true
$fileformat="";

if($maxsize>0) {
	$defaut_maxsize=$maxsize;
} else $defaut_maxsize= 5242880; //5 MégaPixel : 5x1024x1024

$resizemsg="";

if($page=="number_of_pages") {
	$result=GetNumberPages($path);
} else {
	$comic_id=$idbase."_".$id;
	
	//GetPage :
	//Appel ParseComicArchive pour faire $filelist (liste du contenu du zip), affectation de $fileformat et de $number_of_page
	//resize image
	//la met en cache
	
	//ParseComicArchive : appel de IsRarFile et/ou IsZipFile puis ParseCBZ (liste du cbz) ou ParceCBR, $number_of_page
	$result=GetPage($path, $page, $defaut_maxsize, $resizecbz);
}

$json=json_encode($result);
$json = '{"success":"'.true.'","resultat":'.$json."}";
if (isset($_GET['callback'])) {
	echo $_GET['callback'].'('.$json.');';
} else {
	echo $json;
}


//Non utilisé (fonction dans cache.php)
function ClearCache($days) {
	global $cache;
	$folder = new DirectoryIterator($cache);
	foreach($folder as $file) {
		if($file->isFile() && !$file->isDot() && (time() - $file->getMTime() > 86400*$days))
		unlink($file->getPathname());
	}
}

// Liste triée du contenu d'un CBZ.
function ParseCBZ($filename)   {
    $zip = new ZipArchive();
    $filelist = array();

    if (!$zip->open($filename))
    {
      //trigger_error("ParseCBZ: cannot open $filename!\n", E_USER_ERROR);
      return "ParseCBZ: cannot open $filename!";
    }
    for ($i = 0; $i < $zip->numFiles; $i++) 
    {
      $entry = $zip->statIndex($i);
      if ($entry["size"] > 0)
      {
        if (preg_match('/(jp(e?)g|png|gif)$/i',$entry["name"]))
        {
          $filelist[] = $entry["name"];
        }
          
        //if (preg_match('/ComicInfo.xml$/i',$entry["name"]))
        //{
        //  $comicinfo = $entry["name"];
        //}
      }
    }
    
    $zip->close();
    //natcasesort($filelist);
    sort($filelist);
    //return array($filelist, $comicinfo);
    return $filelist;
}

// Liste triée du contenu d'un CBR
function ParseCBR($filename)
  {
    if (!extension_loaded("rar"))
    {
      erreur("ParseCBR: CBR files not supported, because of missing php_rar extension.");
    }
    
    $rar_file = rar_open($filename);
    
    if ($rar_file == FALSE)
    {
      erreur("ParseCBR: not a rar file.");
    }
        
    $entries = rar_list($rar_file);
        
    if ($entries === FALSE)
      erreur("ParseCBR: Failed fetching entries");
    
    $filelist = array();
    //$comicinfo = null;
    
    foreach ($entries as $file) 
    {
      if ((!$file->isDirectory()) && ($file->getUnpackedSize() > 0))
      {
        if (preg_match('/(jp(e?)g|gif|png)$/i',$file->getName()))
        {
          $filelist[] = $file->getName();
        }
        
        //if (preg_match('/ComicInfo.xml$/i',$file->getName()))
        //{
        //  $comicinfo = $entry["name"];
        //}
      }
    }
    
    rar_close($rar_file);
    //natcasesort($filelist);
    sort($filelist);
    return $filelist;
}

//test si c'est un fichier rar
function IsRarFile($filename) {
    global $fileformat;
    if (!extension_loaded("rar")) return false;
    $level = error_reporting(0);
    $rar_file = rar_open($filename);
    error_reporting($level);
    
    if ($rar_file == FALSE)
    {
      return false;
    }
    
    rar_close($rar_file);
    $fileformat="rar";
    return true;
}

//test si c'est un fichier zip
function IsZipFile($filename) {
    global $fileformat;
    if (!extension_loaded("zip")) return false;
    $level = error_reporting(0);
    $zip = new ZipArchive();
    error_reporting($level);
    if ($zip->open($filename) === TRUE)
    {
      $zip->close();
      $fileformat="zip";
      return true;
    }
    return false;
}

function ParseComicArchive($filename) {
    global $number_of_page;
    // Check file type based on first characters in the file....
    
    $path_parts = pathinfo($filename);
    $ext = strtolower($path_parts["extension"]);
    if (($ext == "cbr" || $ext == "rar") && IsRarFile($filename))
    {
	    $result =ParseCBR($filename);
	    $number_of_page=count($result);
	    return $result;
    }
    else if (($ext == "cbz" || $ext == "zip") && IsZipFile($filename)) {
	    $result =ParseCBZ($filename);
	    $number_of_page=count($result);
	    return $result;
    } else {
      // unsupported format
      return "ParseComicArchive: unsupported format";
    }
}

// Get page for display
// Updates the read state of the comic
// If the page is not already present in cache:
//   - extract the file from archive
//   - resize image to max_width
//   - store file in the cache
//   Returns the url to extracted file, the width and height.
function GetPage($filename, $page_id, $max_size, $doresize) {

    global $number_of_page, $fileformat, $comic_id, $cache, $resizemsg;
    // TODO: check if $page_id is a number and 0 < page_id < comic.numpages
    
    $filelist = ParseComicArchive($filename);
    
    if (gettype($filelist) == 'string') {
      return array(
          "page" => $page_id,
          "width" => 100,	
          "height" => 100, 
          "src" => "resources/images/no_image_available.jpg",
          "error" => "INVALID_ARCHIVE",
          "message" => $filelist
          );
    }
    
    if ($page_id < 0 || $page_id >= $number_of_page)
    {
      return array(
        "page" => $page_id,
      	"width" => 100,	
        "height" => 100, 
        "src" => "resources/images/no_image_available.jpg",
        "error" => "INVALID_PAGE_NR"
        );
    }

    //$defaut_maxwidth=$this->settings["max_width"];
    //$max_width = $max_width ? $max_width : $defaut_maxwidth;
    //$filename = $comic["filename"];
    // Extract the page from the comic archive to a temp file in the cache folder.
    
    $path_parts = pathinfo($filename);
    $ext = strtolower($path_parts["extension"]);
    
    $page_filename = $filelist[$page_id];
    $page_path_parts = pathinfo($page_filename);
    $page_ext = strtolower($page_path_parts["extension"]);
    $cachepathname = $cache . "/" . $comic_id . "_" . $page_id . "." . $page_ext;
    if (!file_exists($cachepathname))
    {
      //if (IsRarFile($filename))
      if ($fileformat=="rar") {
        try
        {
          $rar_file = rar_open($filename);
          $entry = rar_entry_get($rar_file, $page_filename);
          if (!$entry->isDirectory())
            $entry->extract(false, $cachepathname);
            
          rar_close($rar_file);
        }
        catch(Exception $e)
        {
           erreur($e.getMessage());
           //trigger_error($e.getMessage(), E_USER_NOTICE);
        }
      }
      //else if (IsZipFile($filename))
      else if ($fileformat=="zip") {
        $zip = new ZipArchive();
        if ($zip->open($filename) === TRUE) 
        {
          try
          {
            $contents = $zip->getFromName($page_filename);
            if ($contents == false)
            {
              erreur("Unable to extract page $page_filename from file $filename");
              //trigger_error("Unable to extract page $page_filename from file $filename", E_USER_NOTICE);
            }
            else
            {
              $success = file_put_contents($cachepathname, $contents);
              if ($success === false)
              {
                erreur("Error while extracting page $page_filename");
                //trigger_error("Error while extracting page $page_filename from file $filename", E_USER_NOTICE);
              }
            }
          }
          catch(Exception $e)
          {
            erreur($e.getMessage());
            //trigger_error($e.getMessage(), E_USER_NOTICE);
          }
          
          $zip->close();
        }
        else
        {
          //$this->Log(SL_ERROR, "InternalGetPage", "Unable to open the file $filename");
        }
      }
      else
      {
        return array(
          "page" => $page_id,
          "width" => 100,	
          "height" => 100, 
          "src" => "resources/images/no_image_available.jpg",
          "error" => "INVALID_FILE_FORMAT"
          );
      }
      //Il pourrait être nécessaire de tester la taille du fichier avec $filesize=filesize($cachepathname);
      if($doresize==true) {
      	      //Lance fonction pour changer la taille si nécessaire
      	      $size = resize($cachepathname, $max_size);
      } else {
      	      $size = getimagesize($cachepathname);
      }
    }
    else
    {
      $size = getimagesize($cachepathname);
   }
   
   if ($size === false) {
        //$this->Log(SL_ERROR, "InternalGetPage", "Unable to get image size of '$cachepathname'");
        return array(
            "page" => $page_id,
            "width" => 100,	
            "height" => 100, 
            "src" => "resources/images/no_image_available.jpg",
            "error" => "INVALID_FILE_FORMAT"
            );
   }
   
   //Tout est OK - array contient les infos sur l'image mise en cache.
    return array(
      "page" => $page_id,
      "width" => $size[0],
      "height" => $size[1],
      "msg" => $resizemsg,
      "src" => $cache . "/" . $comic_id . "_" . $page_id . "." . $page_ext
    );
}


function GetNumberPages($filename) {
    global $number_of_page;
    
    $filelist = ParseComicArchive($filename);
    
    if (gettype($filelist) == 'string') erreur("INVALID_ARCHIVE");
    return array(
      "nbrpages" => $number_of_page
    );
}



/**
 * Resizes an image if width of image is bigger than the maximum width
 * @return array the imageinfo of the resized image
 * @param $filename String The path where the image is located
 * @param $maxwidth String[optional] The maximum width the image is allowed to be
 */
function resize($filename, $maxsize, $outputfunction = NULL)
{
	global $resizemsg;
	$inputfunctions = array(
		'image/jpeg'=>'imagecreatefromjpeg',
		'image/png'=>'imagecreatefrompng',
		'image/gif'=>'imagecreatefromgif'
		);
	
	$outputfunctions = array(
		'image/jpeg'=>'imagejpeg',
		'image/png'=>'imagepng',
		'image/gif'=>'imagegif'
		);
    
	$imageinfo = getimagesize($filename);
	
	$currentheight = $imageinfo[1];
	$currentwidth = $imageinfo[0];
	
	if($currentwidth <= 0||$currentheight<=0) {
		return $imageinfo;
	} elseif($currentwidth*$currentheight>$maxsize) {
		$ratio= sqrt($maxsize/($currentwidth*$currentheight));
		$newwidth = $ratio*$currentwidth;
		$newheight= $ratio*$currentheight;
	} else {
		return $imageinfo;
	}
	//Il faut changer la taille
	$resizemsg="Resized ".$currentwidth."x".$currentheight;
 
	$img = $inputfunctions[$imageinfo['mime']]($filename);
	
	$newimage = imagecreatetruecolor($newwidth,$newheight);
	imagecopyresampled($newimage,$img,0,0,0,0,$newwidth,$newheight,$currentwidth,$currentheight);
	
	if (!$outputfunction) {
		$outputfunction = $outputfunctions[$imageinfo['mime']];
	}
	$outputfunction($newimage,$filename);
	return getimagesize($filename);
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