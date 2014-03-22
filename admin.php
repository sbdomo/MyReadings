<?php
if(isset($_GET['admin_login'])) $admin_login=$_GET['admin_login'];
else      $admin_login="";
if(isset($_GET['admin_pw'])) $admin_pw=$_GET['admin_pw'];
else      $admin_pw="";
if(isset($_GET['action_login'])) $action_login=$_GET['action_login'];
else      $action_login="";

$adminpass="./confadmin.php";
//Create $adminpass
if($action_login=="save"&&!file_exists($adminpass)&&$admin_pw!=""&&$admin_login!="") {
	$result='<?php $adpw="'.$admin_pw.'"; $adlogin="'.$admin_login.'"; ?>';
	file_put_contents($adminpass, $result);
}
?>
<!DOCTYPE html>
<html>
	<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="default" />
	<link rel="apple-touch-icon-precomposed" href="./resources/icons/Icon.png"/>
	
	<link rel="apple-touch-startup-image" href="resources/startup/768x1004.png" media="screen and (min-device-width: 481px) and (max-device-width: 1024px) and (orientation:portrait)" />
	<link rel="apple-touch-startup-image" href="resources/startup/768x1004.png"  media="screen and (min-device-width: 481px) and (max-device-width: 1024px) and (orientation:landscape)" />
	<link rel="apple-touch-startup-image" href="resources/startup/320x460.jpg" media="screen and (min-device-width: 200px) and (max-device-width: 320) and (orientation:portrait)" />
	
	<title>My Readings - Configuration</title> 
	<link rel="stylesheet" href="./resources/jquery/myreadings.min.css" />
	<link rel="stylesheet" href="./resources/jquery/jquery.mobile.icons.min.css" />
	<link rel="stylesheet" href="./resources/jquery/jquery.mobile.structure-1.4.2.min.css" />
	
	<script src="./resources/jquery/jquery.js"></script>
	<script src="./resources/jquery/jquery.mobile-1.4.2.js"></script>
	
<style type="text/css">
.controlgroup-textinput{
    padding-top:.22em;
    padding-bottom:.22em;
}
.red {
	background-color: #ff494d;
	font-weight: bold;
}
.yellow {
	background-color: #ff8c02;
}

</style>
</head>
<body>
<!-- Start of first page -->
<div data-role="page" id="admin1">
<div data-role="header" data-position="inline">
<span  class="ui-title">My Readings - Configuration</span>
</div><!-- /header -->

<div data-role="content">

<?php
$testconnect=true;
if(!file_exists($adminpass)) {
	$action="save";
	$title="Create admin login";
	$message="Enter a login and password (not empty) to protect the admin page from changes by others.";
	$testconnect=false;
} else if($admin_pw==""||$admin_login=="") {
	$action="connect";
	$title="Admin login";
	$message="Enter your login and password.";
	$testconnect=false;

}
if($testconnect==false)	{?>
<div data-role="collapsible" data-collapsed="false">
	<h2><?php echo $title ?></h2>
	<form data-ajax="false" action="./admin.php" method="get" enctype="multipart/form-data" name="adminpass" id="adminpass" >
	<fieldset data-role="fieldcontain">
		<label for="admin_login">Login</label>
		<input type="text" value=""  id="admin_login" name="admin_login" />
		<label for="admin_pw">Password</label>
		<input name="admin_pw" id="admin_pw" type="text" value=""/>
		<input name="action_login"type="hidden" value="<?php echo $action ?>"/><br/>
		<input data-inline="true" type="submit" name="Submit" value="Submit" />
		<p><?php echo $message ?></p>
	</fieldset>
	</form>
</div>

<?php } else {
//there is a login then test
require_once($adminpass);
if($admin_login!=$adlogin||$admin_pw!=$adpw) echo "login error";
else {
	if(file_exists('config.php')) {
		require_once('config.php');
	} else {
		$language="en";
		$protect=false;
		$login="";
		$pass="";
		$control=false;
		$epubview=true;
		$cbzview=true;
		$cbrview=true;
		$login2="";
		$pass2="";
		$fetchmode="resize_and_cache";
		$XSendfile=false;
		$calibre=array();
		$limited=array();
	}
?>
<script type="text/javascript">
function removecalibre(me){
	$(me).parents('li').remove();
	return false;
}

$(function() {
        var i = $('#calibrelibrary1 li').size();
        $('#addcalibre1').on('click', function() {
			listItem = '<li><fieldset class="ui-grid-a">'+
			'<div class="ui-block-a">'+
			'<input type="text" value="" id="calval' + i +'" name="calval' + i +'" data-wrapper-class="controlgroup-textinput ui-btn" placeholder="path"/>'+
			'</div><div class="ui-block-b"><div data-role="controlgroup" data-type="horizontal">'+
			'<input type="text" value="" id="calkey' + i +'" name="calkey' + i +'" data-wrapper-class="controlgroup-textinput ui-btn" placeholder="name"/>'+
			'<a href="#" id="calremove' + i +'" class="ui-btn ui-corner-all ui-icon-delete ui-btn-icon-notext" onclick="removecalibre(this);">Remove</a>'+
			'</div></div>'
			'</fieldset></li>';
			i++;
        		$('#calibrelibrary1').append(listItem);
        		$('#calibrelibrary1').listview('refresh').trigger('create');
        });
	
        var i2 = $('#calibrelibrary2 li').size();
        $('#addcalibre2').on('click', function() {
			listItem = '<li><fieldset class="ui-grid-a">'+
			'<div class="ui-block-a">'+
			'<input type="text" value="" id="limval' + i2 +'" name="limval' + i2 +'" data-wrapper-class="controlgroup-textinput ui-btn" placeholder="path"/>'+
			'</div><div class="ui-block-b"><div data-role="controlgroup" data-type="horizontal">'+
			'<input type="text" value="" id="limkey' + i2 +'" name="limkey' + i2 +'" data-wrapper-class="controlgroup-textinput ui-btn" placeholder="name"/>'+
			'<a href="#" id="limremove' + i2 +'" class="ui-btn ui-corner-all ui-icon-delete ui-btn-icon-notext" onclick="removecalibre(this);">Remove</a>'+
			'</div></div>'
			'</fieldset></li>';
			i2++;
        		$('#calibrelibrary2').append(listItem);
        		$('#calibrelibrary2').listview('refresh').trigger('create');
        });
        
	$('#editconfig').submit(function(){
		$.mobile.loading( "show");
		$('#nbcal').val(i);
		$('#nblim').val(i2);
		$.get("./saveconfig.php", $('#editconfig').serialize(),
		function(data){
			if(data.success=="true") alert("Your configuration has been saved.");
			else alert(data.resultat);
		}, "json")
		.error(function() {
			alert("error");
		});
		$.mobile.loading( "hide" );
		return false;
	});
	
	$('#testform').submit(function(){
		$.mobile.loading( "show");
		$.get("./tests.php", $('#testform').serialize(),
		function(data){
			$.mobile.loading( "hide" );
			if(data.success=="true") {
				$('#testresult').html(data.resultat);
			} else alert(data.resultat);
		}, "json")
		.error(function() {
			$.mobile.loading( "hide" );
			alert("error");
		});
		return false;
	});
	$('#testexistform').submit(function(){
		$.mobile.loading( "show");
		$.get("./testexist.php", $('#testexistform').serialize(),
		function(data){
			$('#testexistresult').html(data);
			$.mobile.loading( "hide" );
		}, "html")
		.error(function() {
			$.mobile.loading( "hide" );
			alert("error");
		});
		return false;
	});
	$('#deletethumbform').submit(function(){
		$.mobile.loading( "show");
		$.get("./admintools.php", $('#deletethumbform').serialize(),
		function(data){
			if(data.success=="true") alert("Thumb was emptied.");
			else alert(data.resultat);
		}, "json")
		.error(function() {
			alert("error");
		});
		$.mobile.loading( "hide" );
		return false;
	});
});
</script>
<div data-role="tabs" id="tabs">
  <div data-role="navbar">
    <ul>
      <li><a href="#makeconfig" data-ajax="false">Configuration</a></li>
      <li><a href="#runtest" data-ajax="false">Compatibility test</a></li>
      <li><a href="#runtestexist" data-ajax="false">Test covers and ebooks</a></li>
      <li><a href="#tools" data-ajax="false">Tools</a></li>
    </ul>
  </div>

<div id="makeconfig" class="ui-body-d ui-content">
<form action="#" method="get" enctype="multipart/form-data" name="editconfig" id="editconfig" >
<fieldset data-role="fieldcontain">
	<label for="language" class="select">Language</label>
	<select name="language" id="language" data-native-menu="false">
		<option>Language</option>
		<option value="en" <?php if($language=="en") echo "selected";?> >English</option>
		<option value="fr" <?php if($language=="fr") echo "selected";?> >French</option>
	</select>
	<label for="fetchmode" class="select">Access mode to libraries </label>
	<select name="fetchmode" id="fetchmode" data-native-menu="false">
		<option>Access to libraries</option>
		<option value="direct" <?php if($fetchmode=="direct") echo "selected";?> >Direct (in web directory)</option>
		<option value="resize" <?php if($fetchmode=="resize") echo "selected";?> >with resize</option>
		<option value="resize_and_cache" <?php if($fetchmode=="resize_and_cache") echo "selected";?> >with resize and cache</option>
		<option value="noresize" <?php if($fetchmode=="noresize") echo "selected";?> >without resize</option>
	</select>
	<br/><p>If one library is not in your web directory, you can't use direct access.
	<br />If you don't use direct access, you can choose to use X-Senfile mode or not.</p>
	<label for="XSendfile">Use X-Sendfile?</label>
		<select name="XSendfile" id="XSendfile" data-role="slider">
			<option value="false" <?php if(!$XSendfile) echo "selected";?> >
			No
			</option>
			<option value="true" <?php if($XSendfile) echo "selected";?> >
			Yes
			</option>
		</select>
</fieldset>
<div data-role="collapsible" data-collapsed="false">
	<h2>Calibre libraries</h2>
	<fieldset data-role="fieldcontain">
		<label for="protect">Protect access?</label>
		<select name="protect" id="protect" data-role="slider">
			<option value="false" <?php if(!$protect) echo "selected";?> >
			No
			</option>
			<option value="true" <?php if($protect) echo "selected";?> >
			Yes
			</option>
			</select>
			<br/><p>If yes, use login and password enter below</p>
	</fieldset>
	<fieldset data-role="fieldcontain">
		<label for="login">Login</label>
		<input type="text" value="<?php echo $login;?>"  id="login" name="login" />
		<label for="pass">Password</label>
		<input type="text" value="<?php echo $pass;?>" id="pass" name="pass" />
	</fieldset>

	<ul class="ui-li" data-role="listview" id="calibrelibrary1" data-inset="true"  data-scroll="true">
	<li data-role="list-divider">Calibre libraries - Enter the path of your metadata file and the name that will appear in My Readings</li>
<?php
$nbcalibre1=0;
foreach ($calibre as $key => $value) {
	$nbcalibre1=$nbcalibre1+1;
?>
	<li>
		<fieldset class="ui-grid-a">
			<div class="ui-block-a">
				<input type="text" value="<?php echo $value;?>"  id="calval<?php echo $nbcalibre1;?>" name="calval<?php echo $nbcalibre1;?>" data-wrapper-class="controlgroup-textinput ui-btn" placeholder="path"/>
			</div>
			<div class="ui-block-b">
				<div data-role="controlgroup" data-type="horizontal">
					<input type="text" value="<?php echo $key;?>"  id="calkey<?php echo $nbcalibre1;?>" name="calkey<?php echo $nbcalibre1;?>" data-wrapper-class="controlgroup-textinput ui-btn" placeholder="name"/>
					<a href="#" id="calremove<?php echo $nbcalibre1;?>" class="ui-btn ui-corner-all ui-icon-delete ui-btn-icon-notext" onclick="removecalibre(this);">Remove</a>
				</div>
			</div>
		</fieldset>
	</li>
<?php } ?>
	</ul>
	<input type="button" id="addcalibre1" class="btn" value="Add library" />
</div>
<p>Library path can be a full path (for exemple //volume1/calibre1/), you can't use direct access mode in that case.<br/>
Or, if your library is in web directory, it can be a relative path (as ../calibre1/) and then you can use any access mode.<br/>
Note the "/" at the end of the path is necessary.</p>

<div data-role="collapsible" data-collapsed="false">
	<h2>Calibre libraries with parental control</h2>
	<fieldset data-role="fieldcontain">
		<label for="control">Parental control?</label>
		<select name="control" id="control" data-role="slider">
			<option value="false" <?php if(!$control) echo "selected";?> >
			No
			</option>
			<option value="true" <?php if($control) echo "selected";?> >
			Yes
			</option>
		</select>
		<br/><p>If yes, use login and password enter below</p>
	</fieldset>
	<fieldset data-role="fieldcontain">
		<label for="login2">Login</label>
		<input type="text" value="<?php echo $login2;?>"  id="login2" name="login2" />
		<label for="pass2">Password</label>
		<input type="text" value="<?php echo $pass2;?>" id="pass2" name="pass2"/>
	</fieldset>

	<ul class="ui-li" data-role="listview" id="calibrelibrary2" data-inset="true"  data-scroll="true">
	<li data-role="list-divider">Calibre libraries with parental control</li>
<?php
$nbcalibre2=0;
foreach ($limited as $key => $value) {
	$nbcalibre2=$nbcalibre2+1;
?>
	<li>
		<fieldset class="ui-grid-a">
			<div class="ui-block-a">
				<input type="text" value="<?php echo $value;?>"  id="limval<?php echo $nbcalibre2;?>" name="limval<?php echo $nbcalibre2;?>" data-wrapper-class="controlgroup-textinput ui-btn" placeholder="path"/>
			</div>
			<div class="ui-block-b">
				<div data-role="controlgroup" data-type="horizontal">
					<input type="text" value="<?php echo $key;?>"  id="limkey<?php echo $nbcalibre2;?>" name="limkey<?php echo $nbcalibre2;?>" data-wrapper-class="controlgroup-textinput ui-btn" placeholder="name"/>
					<a href="#" id="limremove<?php echo $nbcalibre2;?>" class="ui-btn ui-corner-all ui-icon-delete ui-btn-icon-notext" onclick="removecalibre(this);">Remove</a>
				</div>
			</div>
		</fieldset>
	</li>
<?php }
?>
	</ul>
	<input type="button" id="addcalibre2" class="btn" value="Add library" />
</div>

<div data-role="collapsible" data-collapsed="false">
	<h2>Viewers</h2>
	<fieldset data-role="fieldcontain">
	
	<fieldset data-role="controlgroup">
        <input type="checkbox" name="epubview" id="epubview" <?php if($epubview) echo "selected";?>>
        <label for="epubview">Epub</label>
        <input type="checkbox" name="cbzview" id="cbzview" <?php if($cbzview) echo "selected";?>>
        <label for="cbzview">Cbz</label>
        <input type="checkbox" name="cbrview" id="cbrview" <?php if($cbrview) echo "selected";?>>
        <label for="cbrview">Cbr</label>
	</fieldset>
	<p>For cbz viewer, you must have zip extension and for cbr viewer, rar extension. You can verify that in compatibility test.</p>
	</fieldset>
</div>

<input name="nbcal" id="nbcal" type="hidden" value=""/>
<input name="nblim" id="nblim" type="hidden" value=""/>
<input name="admin_login" type="hidden" value="<?php echo $admin_login;?>"/>
<input name="admin_pw" type="hidden" value="<?php echo $admin_pw;?>"/>
<input type="submit" name="Submit" value="Save configuration" data-theme="b" />
</form>
</div><!-- /config tab -->

<div id="runtest">
<form action="#" method="get" enctype="multipart/form-data" name="testform" id="testform" >
	<input name="admin_login"type="hidden" value="<?php echo $admin_login;?>"/>
	<input name="admin_pw" type="hidden" value="<?php echo $admin_pw;?>"/>
	<input type="submit" name="Submit" value="Run tests" data-theme="b" />
</form>
<div id="testresult"></div>
</div><!-- /runtest tab -->
<div id="runtestexist">
<form action="#" method="get" enctype="multipart/form-data" name="testexistform" id="testexistform" >
	<input name="admin_login"type="hidden" value="<?php echo $admin_login;?>"/>
	<input name="admin_pw" type="hidden" value="<?php echo $admin_pw;?>"/>
	<input type="submit" name="Submit" value="Run tests" data-theme="b" />
</form>
<div id="testexistresult"></div>
</div><!-- /runtestexist tab -->
<div id="tools">
	<div data-role="collapsible" data-collapsed="false">
		<h2>Examples of syntax for the url of My Readings</h2>
		For iPad/iPad mini: <a href="./" class="ui-btn ui-corner-all  ui-btn-inline" data-ajax="false">Flat</a><a href="./?platform=wood" class="ui-btn ui-corner-all ui-btn-inline" data-ajax="false">Wood</a><br/>
		For iphone: <a href="./#profil/iphone" class="ui-btn ui-corner-all ui-btn-inline" data-ajax="false">Flat</a><a href="./?platform=wood#profil/iphone" class="ui-btn ui-corner-all ui-btn-inline" data-ajax="false">Wood</a><br/>
		For Galaxy Tab: <a href="./#profil/gtab" class="ui-btn ui-corner-all ui-btn-inline" data-ajax="false">Flat</a><a href="./?platform=wood#profil/gtab" class="ui-btn ui-corner-all ui-btn-inline" data-ajax="false">Wood</a>
	</div>
	<div data-role="collapsible" data-collapsed="false">
		<h2>Management of the directory thumb</h2>
		<p>This directory is use to store thumbnail of book cover in access mode with resize and cache</p>
		<form action="#" method="get" enctype="multipart/form-data" name="deletethumbform" id="deletethumbform" >
		<input name="admin_login"type="hidden" value="<?php echo $admin_login;?>"/>
		<input name="admin_pw" type="hidden" value="<?php echo $admin_pw;?>"/>
		<input name="action" type="hidden" value="deletethumb"/>
		<input type="submit" name="Submit" value="Delete files in cache" data-theme="b" />
		</form>
	</div>

</div><!-- /tools tab -->

</div>

<?php //end of if connect
	}
} ?>

</div><!-- /content -->
<div data-role="footer" data-position="inline">
&nbsp;&nbsp;by sbdomo
</div>

</body>
</html>
