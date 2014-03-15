<?php
if(isset($_GET['mylogin'])) $mylogin=$_GET['mylogin'];
else      $mylogin="";
if(isset($_GET['mypass'])) $mypass=$_GET['mypass'];
else      $mypass="";
require_once('config.php');

if($protect==true&&(($mylogin==$login&&$mypass==$pass)||($mylogin==$login2&&$mypass==$pass2&&$control==true))) {
	 //OK
} else {
	echo "Non autorisé";
	die;
}

//Chemin de l'epub
if(isset($_GET['path'])) $path=$_GET['path'];
else {
	echo "No book path";
	die;
}

if(isset($_GET['title'])) $title=$_GET['title'];
else $title="no title";


//Format:
if(isset($_GET['mode'])) $mode=$_GET['mode'];
else $mode="jour";

if(isset($_GET['font'])) $font=$_GET['font'];
else $font="arial";

if(isset($_GET['taille'])) $taille=$_GET['taille'];
else $taille="";
if($taille=="") $taille="1.45";

$bodyday="background-color: #FFFEFC; color: #210;";
$bodynight="background-color: #191919; color: white;";
if($mode=="nuit") {
	$body=$bodynight;
} else {
	$body=$bodyday;
}

//font-family
//Thonburi, Helvetica, Arial, sans-serif
//Times New Roman, Georgia, serif
//Cochin, Baskerville, Palatino, serif
//Arial Rounded MT Bold, monospace 
$fontarial="font-family: Thonburi, Helvetica, Arial, sans-serif;";
$fontTimes="font-family: Palatino, Georgia, Times New Roman, serif;";
if($font=="arial"||$font=="") {
	$fontfamily=$fontarial;
} else {
	$fontfamily=$fontTimes;
}
$add="mylogin=".$mylogin."&mypass=".$mypass."&path=".urlencode($path)."&";
?>
<!DOCTYPE html>
<html>
<?php
require_once ("resources/epub/php-epub-meta/epub.php");

$book = new EPub ($path);

$book->initSpineComponent ();
?>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
    />
    <title>MyReadings Epub Reader</title>
    <link rel="stylesheet" type="text/css" href="resources/epub/monocle/monocore.css" />
    <link rel="stylesheet" type="text/css" href="resources/epub/monocle/monoctrl.css" />
    <link rel="stylesheet" type="text/css" href="resources/epub/monocle/test.css" />
    <style type="text/css">
      #rabbit {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }
      .dark {
	      background-color: black;
      }
    </style>
    <script type="text/javascript" src="resources/epub/monocle/monocore.js"></script>
    <script type="text/javascript" src="resources/epub/monocle/monoctrl.js"></script>
<script type="text/javascript">
Monocle.DEBUG = false; 
var bookData = {
          getComponents: function () {
            <?php echo "return [" . implode (", ", array_map (function ($comp) { return "'" . $comp . "'"; }, $book->components ())) . "];"; ?>
          },
          getContents: function () {
            <?php echo "return [" . implode (", ", array_map (function ($content) { return "{title: '" . $content["title"] . "', src: '". $content["src"] . "'}"; }, $book->contents ())) . "];"; ?>
          },
          getComponent: function (componentId) {
            return { url: "epubfs.php?<?php echo $add ?>comp="  + componentId };
          },
          getMetaData: function(key) {
            return {
              title: "<?php echo $title; ?>",
              creator: "My Readings"
            }[key];
          }
}

//Pour accéder au menu listant les chapitres du livre
var bookContentsMenu = {};
var scrubber = {};
var bodyreader = '<?php echo $body; ?>';
var fontreader = '<?php echo $fontfamily; ?>';
var taillefont = <?php echo $taille ?>;

// Initialize the reader element.
Monocle.Events.listen(
	window,
	'load',
	function () {
		var readerOptions = {};
		
		/* PLACE SAVER */
		var bkTitle = bookData.getMetaData('title');
		var placeSaver = new Monocle.Controls.PlaceSaver(bkTitle);
		readerOptions.place = placeSaver.savedPlace();
		
		//readerOptions.panels = Monocle.Panels.Marginal;
		readerOptions.panels = Monocle.Panels.Magic;
		readerOptions.stylesheet = "body { "+bodyreader+fontreader+"}";
			
		readerOptions.fontScale = taillefont;
		
		//launch when loaded
		Monocle.Events.listen('rabbit', 'monocle:loaded', isloaded);
		
		/* Initialize the reader */
		window.reader = Monocle.Reader(
			'rabbit',
			bookData,
			readerOptions,
			function(reader) {
				reader.addControl(placeSaver, 'invisible');
				
				/* Because the 'reader' element changes size on window resize,
				* we should notify it of this event. */
				Monocle.Events.listen(
					window,
					'resize',
					function () { window.reader.resized() }
				);
				
				/* BOOK Contents Menu */
				bookContentsMenu = Monocle.Controls.Contents(reader);
				reader.addControl(bookContentsMenu, 'popover', { hidden: true });
				
				/* CHAPTER TITLE RUNNING HEAD */
				var chapterTitle = {
					runners: [],
					createControlElements: function (page) {
						var cntr = document.createElement('div');
						cntr.className = "chapterTitle";
						var runner = document.createElement('div');
						runner.className = "runner";
						cntr.appendChild(runner);
						this.runners.push(runner);
						this.update(page);
						return cntr;
					},
					update: function (page) {
						var place = reader.getPlace(page);
						if (place) {
							this.runners[page.m.pageIndex].innerHTML = place.chapterTitle();
						}
					}
				}
				reader.addControl(chapterTitle, 'page');
				reader.listen(
					'monocle:pagechange',
					function (evt) { chapterTitle.update(evt.m.page); }
					);
				
				/* PAGE NUMBER RUNNING HEAD */
				var pageNumber = {
					runners: [],
					createControlElements: function (page) {
						var cntr = document.createElement('div');
						cntr.className = "pageNumber";
						var runner = document.createElement('div');
						runner.className = "runner";
						cntr.appendChild(runner);
						this.runners.push(runner);
						this.update(page, page.m.place.pageNumber());
						return cntr;
					},
					update: function (page, pageNumber) {
						if (pageNumber) {
							this.runners[page.m.pageIndex].innerHTML = pageNumber;
						}
					}
				}
				reader.addControl(pageNumber, 'page');
				reader.listen(
					'monocle:pagechange',
					function (evt) {
						pageNumber.update(evt.m.page, evt.m.pageNumber);
					}
					);
				
				/* Scrubber */
				scrubber = new Monocle.Controls.Scrubber(reader);
				reader.addControl(scrubber, 'popover', { hidden: true });
				var showFn = function (evt) {
					evt.stopPropagation();
					reader.showControl(scrubber);
					scrubber.updateNeedles();
				}
				for (var i = 0; i < chapterTitle.runners.length; ++i) {
					Monocle.Events.listenForContact(
						chapterTitle.runners[i].parentNode,
						{ start: showFn }
						);
					Monocle.Events.listenForContact(
						pageNumber.runners[i].parentNode,
						{ start: showFn }
						);
				}
				
			}
		);
		<?php if($mode=="nuit") echo 'window.reader.dom.addClass("moonlight");' ?>
	}
);

//******fonction supplémentaires
//Pour indiquer à My Readings que le chargement est fini. (cache le "loading mask")
function isloaded() {
	parent.myreadings.app.getController('epub').isloaded();
	
}
	//Changement de la taille de la police
	function setFontsize(taille) {
		window.reader.formatting.setFontScale(parseFloat(taille), true);
        }

        function setMode(mode) {
        	if(mode=="nuit") {
        		window.reader.dom.addClass("moonlight");
			bodyreader="<?php echo $bodynight; ?>";
        	} else {
        		window.reader.dom.removeClass("moonlight");
			bodyreader="<?php echo $bodyday; ?>";
        	}
		window.reader.formatting.updatePageStyles(
        		window.reader.formatting.properties.initialStyles,
        		'body { '+bodyreader+fontreader+'}',
        		true
		);
        }
	
	function setFont(font) {
		if(font=="arial") {
			fontreader="<?php echo $fontarial; ?>";
		} else {
			fontreader="<?php echo $fontTimes; ?>";
		}
		window.reader.formatting.updatePageStyles(
        		window.reader.formatting.properties.initialStyles,
        		'body { '+bodyreader+fontreader+'}',
        		true
		);
	}
	
	function openToc() {
		if(window.reader.showingControl(bookContentsMenu)) {
			window.reader.hideControl(bookContentsMenu);
		} else {
			window.reader.hideControl(scrubber);
			window.reader.showControl(bookContentsMenu);
		}
	}
    </script>
</head>
<body>
    <div id="rabbit"></div>
</body>
</html>