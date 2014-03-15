<?php
header('Content-Type: application/javascript; charset=utf-8');
header('Cache-Control: no-cache, must-revalidate'); // HTTP/1.1
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past
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

//$defaut_maxwidth=2048;
$defaut_maxwidth=8192;

if($page=="number_of_pages") {
	$result=GetNumberPages($path);
} else {
	$comic_id=$idbase."_".$id;
	
	//GetPage appel InternalGetPage (avec possiblité de mettre $max_width différent de la valeur par défaut)
	//InternalGetPage: idem mais avec comme paramètre $filelist si elle existe déjà
	//Appel ParseComicArchive pour faire $filelist (liste du contenu du zip)
	//test :IsZipFile
	//resize image
	//la met en cache
	
	//ParseComicArchive : appel de ParseCBZ (liste du cbz)
	$result=GetPage($path, $page, NULL);
}

$json=json_encode($result);
$json = '{"success":"'.true.'","resultat":'.$json."}";
if (isset($_GET['callback'])) {
	echo $_GET['callback'].'('.$json.');';
} else {
	echo $json;
}



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
      trigger_error("ParseCBZ: cannot open $filename!\n", E_USER_ERROR);
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

//test si c'est un fichier zip
function IsZipFile($filename) {
    $level = error_reporting(0);
    $zip = new ZipArchive();
    error_reporting($level);
    if ($zip->open($filename) === TRUE)
    {
      $zip->close();
      return true;
    } 
    
    return false;
}

function ParseComicArchive($filename) {
    global $number_of_page;
    // Check file type based on first characters in the file....
    
    $path_parts = pathinfo($filename);
    $ext = strtolower($path_parts["extension"]);
    //if (($ext == "cbr" || $ext == "rar") && Comics::IsRarFile($filename))
    //{
    //  return $this->ParseCBR($filename);
    //}
    //else
    if (($ext == "cbz" || $ext == "zip") && IsZipFile($filename)) {
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
function GetPage($filename, $page_id, $max_width) {
    $result = InternalGetPage($filename, $page_id, $max_width, NULL);
    return $result;
}

  /**
   * InternalGetPage
   * If the page is not already present in cache:
   *   - extract the file from archive
   *   - resize image to max_width
   *   - store file in the cache
   * Returns the url to extracted file, the width and height.
   
   
   max_width is not the max width, is it the width of the device.
   TODO: also take device height into account for landscape pages.
   
   */
function InternalGetPage($filename, $page_id, $max_width, $filelist = NULL)
  {
    global $number_of_page, $defaut_maxwidth, $comic_id, $cache;
    // TODO: check if $page_id is a number and 0 < page_id < comic.numpages
    
    if (!$filelist) $filelist = ParseComicArchive($filename);
    
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
    $max_width = $max_width ? $max_width : $defaut_maxwidth;
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
      /*
	    if (Comics::IsRarFile($filename))
      {
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
          trigger_error($e.getMessage(), E_USER_NOTICE);
        }
      }
      else*/
      if (IsZipFile($filename)) {
        $zip = new ZipArchive();
        if ($zip->open($filename) === TRUE) 
        {
          try
          {
            $contents = $zip->getFromName($page_filename);
            if ($contents == false)
            {
              trigger_error("Unable to extract page $page_filename from file $filename", E_USER_NOTICE);
            }
            else
            {
              $success = file_put_contents($cachepathname, $contents);
              if ($success === false)
              {
                trigger_error("Error while extracting page $page_filename from file $filename", E_USER_NOTICE);
              }
            }
          }
          catch(Exception $e)
          {
            trigger_error($e.getMessage(), E_USER_NOTICE);
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

      $size = resize($cachepathname, $max_width);
    }
    else
    {
      $size = getimagesize($cachepathname);
      if ($size === false)
      {
        //$this->Log(SL_ERROR, "InternalGetPage", "Unable to get image size of '$cachepathname'");
        return array(
            "page" => $page_id,
            "width" => 100,	
            "height" => 100, 
            "src" => "resources/images/no_image_available.jpg",
            "error" => "INVALID_FILE_FORMAT"
            );
      }
    }
    
    return array(
      "page" => $page_id,
      "width" => $size[0],
      "height" => $size[1],
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
function resize($filename, $maxwidth = "1024", $maxheight = "768", $outputfunction = NULL)
{
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
  
	if ($currentwidth <= 0 || $currentwidth < $maxwidth)
	{
		return $imageinfo;
	}
  
	$img = $inputfunctions[$imageinfo['mime']]($filename);
  
	$newwidth = $maxwidth;
	$newheight = ($currentheight/$currentwidth)*$newwidth;
	$newimage = imagecreatetruecolor($newwidth,$newheight);
	imagecopyresampled($newimage,$img,0,0,0,0,$newwidth,$newheight,$currentwidth,$currentheight);
  
  if (!$outputfunction)
  {
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