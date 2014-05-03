<?php
if(isset($_GET['admin_login'])) $admin_login=$_GET['admin_login'];
else      $admin_login="";
if(isset($_GET['admin_pw'])) $admin_pw=$_GET['admin_pw'];
else      $admin_pw="";
if(isset($_GET['action_login'])) $action_login=$_GET['action_login'];
else      $action_login="";

$adminpass="./config/confadmin.php";
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
	<script src="./resources/jquery/jquery.validate.min.js"></script>
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

label.error {
	float: none;
	color: red;
	padding-top: .5em;
	vertical-align: top;
	font-weight:bold
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
<script type="text/javascript">
$(function() {
	
	$.validator.addMethod("passmatch", function(value) {
			return value == $("#admin_pw").val();
	}, 'Confirmation password must match.');
	
	$("#adminpass").validate({
		errorPlacement: function(error, element) {
			error.insertAfter($(element).parent());
		},
		//submitHandler: function(form) {
		//	console.log("Call Login Action");
		//}
	});
});
</script>
<div data-role="collapsible" data-collapsed="false">
	<h2><?php echo $title ?></h2>
	<form data-ajax="false" action="./admin.php" method="get" enctype="multipart/form-data" name="adminpass" id="adminpass" class="validate">
	<fieldset data-role="fieldcontain">
		<label for="admin_login">Login</label>
		<input type="text" value=""  id="admin_login" name="admin_login" class="required"/>
	</fieldset>
	<fieldset data-role="fieldcontain">
		<label for="admin_pw">Password</label>
		<input name="admin_pw" id="admin_pw" type="password" value="" class="required"/>
	</fieldset>
	<?php if ($action=="save") { ?>
	<fieldset data-role="fieldcontain">
		<label for="admin_pw2">Confirm Password</label>
		<input name="admin_pw2" id="admin_pw2" type="password" value="" class="required passmatch"/>
	</fieldset>
	<?php } ?>
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
	if(file_exists('./config/config.php')) {
		require_once('./config/config.php');
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
		$resizecbz=false;
		$maxsize=5242880;
	}
	if($maxsize==""||$maxsize==NULL) $maxsize=5242880;
?>
<script type="text/javascript">
function removecalibre(me){
	$(me).parents('li').remove();
	return false;
}

function removeuser(me){
	$(me).parents('li').remove();
	return false;
}

$(function() {
	var i = $('#calibrelibrary1 li').size();
	$.ajaxSetup({ cache: false });
        $('#addcalibre1').on('click', function() {
			listItem = '<li><fieldset class="ui-grid-b">'+
			'<div class="ui-block-a">'+
			'<input type="text" value="" id="calval' + i +'" name="calval' + i +'" data-wrapper-class="controlgroup-textinput ui-btn" placeholder="path"/>'+
			'</div><div class="ui-block-b">'+
			'<input type="text" value="" id="calkey' + i +'" name="calkey' + i +'" data-wrapper-class="controlgroup-textinput ui-btn" placeholder="name"/>'+
			'</div><div class="ui-block-c"><div data-role="controlgroup" data-type="horizontal">'+
			'<input type="text" value="" id="calcustom' + i +'" name="calcustom' + i +'" data-wrapper-class="controlgroup-textinput ui-btn" placeholder="custom columns labels"/>'+
			'<a href="#" id="calremove' + i +'" class="ui-btn ui-corner-all ui-icon-delete ui-btn-icon-notext" onclick="removecalibre(this);">Remove</a>'+
			'</div></div>'
			'</fieldset></li>';
			i++;
        		$('#calibrelibrary1').append(listItem);
        		$('#calibrelibrary1').listview('refresh').trigger('create');
        });
	
        var i2 = $('#calibrelibrary2 li').size();
        $('#addcalibre2').on('click', function() {
			listItem = '<li><fieldset class="ui-grid-b">'+
			'<div class="ui-block-a">'+
			'<input type="text" value="" id="limval' + i2 +'" name="limval' + i2 +'" data-wrapper-class="controlgroup-textinput ui-btn" placeholder="path"/>'+
			'</div><div class="ui-block-b">'+
			'<input type="text" value="" id="limkey' + i2 +'" name="limkey' + i2 +'" data-wrapper-class="controlgroup-textinput ui-btn" placeholder="name"/>'+
			'</div><div class="ui-block-c"><div data-role="controlgroup" data-type="horizontal">'+
			'<input type="text" value="" id="limcustom' + i2 +'" name="limcustom' + i2 +'" data-wrapper-class="controlgroup-textinput ui-btn" placeholder="custom columns labels"/>'+
			'<a href="#" id="limremove' + i2 +'" class="ui-btn ui-corner-all ui-icon-delete ui-btn-icon-notext" onclick="removecalibre(this);">Remove</a>'+
			'</div></div>'
			'</fieldset></li>';
			i2++;
        		$('#calibrelibrary2').append(listItem);
        		$('#calibrelibrary2').listview('refresh').trigger('create');
        });
        
	var i3 = $('#userlist li').size();
        $('#adduser').on('click', function() {
			listItem = '<li><div data-role="controlgroup" data-type="horizontal">'+
			'<input type="text" value="" id="userval' + i3 +'" name="userval' + i3 +'" data-wrapper-class="controlgroup-textinput ui-btn" placeholder="name"/>'+
			'<a href="#" id="userremove' + i3 +'" class="ui-btn ui-corner-all ui-icon-delete ui-btn-icon-notext" onclick="removeuser(this);">Remove</a>'+
			'</div></li>';
			i3++;
        		$('#userlist').append(listItem);
        		$('#userlist').listview('refresh').trigger('create');
        });
	
	
	$.validator.addMethod("passmatch1", function(value) {
			return value == $("#pass").val();
	}, 'Confirmation password must match.');
	
	$.validator.addMethod("passmatch2", function(value) {
			return value == $("#pass2").val();
	}, 'Confirmation password must match.');
	
	$("#editconfig").validate({
		errorPlacement: function(error, element) {
			error.insertAfter($(element).parent());
		},
		rules: {
			login: {
				required: { depends: function () { return $('#protect').val()=="true"; } }
			},
			pass: {
				required: { depends: function () { return $('#protect').val()=="true"; } }
			},
			login2: {
				required: { depends: function () { return $('#control').val()=="true"; } }
			},
			pass2: {
				required: { depends: function () { return $('#control').val()=="true"; } }
			},
			maxsize: {
				required: { depends: function () { return $('#resizecbz').val()=="true"; } },
				number: true
			}
		},
		submitHandler: function(form) {
			$.mobile.loading( "show");
			$('#nbcal').val(i);
			$('#nblim').val(i2);
			$('#nbuser').val(i3);
			$.get("./saveconfig.php", $('#editconfig').serialize(),
			function(data){
				if(data.success=="true") alert("Your configuration has been saved.");
				else alert(data.resultat);
			}, "json")
			.error(function() {
				alert("error");
			});
			$.mobile.loading( "hide" );
			//return false;
		}
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
		<option value="fr" <?php if($language=="spa") echo "selected";?> >Spanish</option>
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
	</fieldset>
	<fieldset data-role="fieldcontain">
		<label for="pass">Password</label>
		<input  type="password" value="<?php echo $pass;?>" id="pass" name="pass" />
	</fieldset>
	<fieldset data-role="fieldcontain">
		<label for="passconf">Confirm Password</label>
		<input  type="password" value="<?php echo $pass;?>" id="passconf" name="passconf" class="passmatch1"/>
	</fieldset>

	<ul class="ui-li" data-role="listview" id="calibrelibrary1" data-inset="true"  data-scroll="true">
	<li data-role="list-divider">Calibre libraries - Enter the path of your metadata file, the name that will appear in My Readings and, if you want, custom columns</li>
<?php
$nbcalibre1=0;
if($calibre) {
foreach ($calibre as $key => $value) {
	$nbcalibre1=$nbcalibre1+1;
?>
	<li>
		<fieldset class="ui-grid-b">
			<div class="ui-block-a">
				<input type="text" value="<?php echo $value;?>"  id="calval<?php echo $nbcalibre1;?>" name="calval<?php echo $nbcalibre1;?>" data-wrapper-class="controlgroup-textinput ui-btn" placeholder="path"/>
			</div>
			<div class="ui-block-b">
				<input type="text" value="<?php echo $key;?>"  id="calkey<?php echo $nbcalibre1;?>" name="calkey<?php echo $nbcalibre1;?>" data-wrapper-class="controlgroup-textinput ui-btn" placeholder="name"/>
			</div>
			<div class="ui-block-c">
				<div data-role="controlgroup" data-type="horizontal">
					<input type="text" value="<?php echo $customcolumn[$key];?>"  id="calcustom<?php echo $nbcalibre1;?>" name="calcustom<?php echo $nbcalibre1;?>" data-wrapper-class="controlgroup-textinput ui-btn" placeholder="custom columns labels"/>
					<a href="#" id="calremove<?php echo $nbcalibre1;?>" class="ui-btn ui-corner-all ui-icon-delete ui-btn-icon-notext" onclick="removecalibre(this);">Remove</a>
				</div>
			</div>
		</fieldset>
	</li>
<?php }} ?>
	</ul>
	<input type="button" id="addcalibre1" class="btn" value="Add library" />
	<p><b>Library path</b> can be a full path (for exemple //volume1/calibre1/), you can't use direct access mode in that case.<br/>
Or, if your library is in web directory, it can be a relative path (as ../calibre1/) and then you can use any access mode.<br/>
Note the <b>"/" at the end</b> of the path <b>is necessary</b>.<br/>
If you want to use <b>custom columns</b>, put the label of the custom columns you want with , as separator. Ex: custom1,custom2</p>
</div>

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
	</fieldset>
	<fieldset data-role="fieldcontain">
		<label for="pass2">Password</label>
		<input  type="password" value="<?php echo $pass2;?>" id="pass2" name="pass2"/>
	</fieldset>
	<fieldset data-role="fieldcontain">
		<label for="pass2conf">Confirm Password</label>
		<input  type="password" value="<?php echo $pass2;?>" id="pass2conf" name="pass2conf" class="passmatch2"/>
	</fieldset>

	<ul class="ui-li" data-role="listview" id="calibrelibrary2" data-inset="true"  data-scroll="true">
	<li data-role="list-divider">Calibre libraries with parental control</li>
<?php
$nbcalibre2=0;
if($limited) {
foreach ($limited as $key => $value) {
	$nbcalibre2=$nbcalibre2+1;
?>
	<li>
		<fieldset class="ui-grid-b">
			<div class="ui-block-a">
				<input type="text" value="<?php echo $value;?>"  id="limval<?php echo $nbcalibre2;?>" name="limval<?php echo $nbcalibre2;?>" data-wrapper-class="controlgroup-textinput ui-btn" placeholder="path"/>
			</div>
			<div class="ui-block-b">
				<input type="text" value="<?php echo $key;?>"  id="limkey<?php echo $nbcalibre2;?>" name="limkey<?php echo $nbcalibre2;?>" data-wrapper-class="controlgroup-textinput ui-btn" placeholder="name"/>
			</div>
			<div class="ui-block-c">
				<div data-role="controlgroup" data-type="horizontal">
					<input type="text" value="<?php echo $customcolumn[$key];?>"  id="limcustom<?php echo $nbcalibre2;?>" name="limcustom<?php echo $nbcalibre2;?>" data-wrapper-class="controlgroup-textinput ui-btn" placeholder="custom columns labels"/>
					<a href="#" id="limremove<?php echo $nbcalibre2;?>" class="ui-btn ui-corner-all ui-icon-delete ui-btn-icon-notext" onclick="removecalibre(this);">Remove</a>
				</div>
			</div>
		</fieldset>
	</li>
<?php }} ?>
	</ul>
	<input type="button" id="addcalibre2" class="btn" value="Add library" />
</div>

<div data-role="collapsible" data-collapsed="false">
	<h2>Viewers</h2>
	<fieldset data-role="controlgroup">
        <input type="checkbox" name="epubview" id="epubview" <?php if($epubview=="on") echo "checked";?>>
        <label for="epubview">Epub</label>
        <input type="checkbox" name="cbzview" id="cbzview" <?php if($cbzview=="on") echo "checked";?>>
        <label for="cbzview">Cbz</label>
        <input type="checkbox" name="cbrview" id="cbrview" <?php if($cbrview=="on") echo "checked";?>>
        <label for="cbrview">Cbr</label>
	</fieldset>
	<p>For cbz viewer, you must have PHP ZIP extension and for cbr viewer, PHP RAR extension. You can verify that in compatibility test.</p>
	<fieldset data-role="fieldcontain">
	<label for="resizecbz">Resize?</label>
	<select name="resizecbz" id="resizecbz" data-role="slider">
		<option value="false" <?php if(!$resizecbz) echo "selected";?> >
			No
		</option>
		<option value="true" <?php if($resizecbz) echo "selected";?> >
			Yes
		</option>
	</select>
	</fieldset>
	<fieldset data-role="fieldcontain">
		<label for="maxsize">Size max.</label>
		<input type="text" value="<?php echo $maxsize;?>" id="maxsize" name="maxsize" />
	</fieldset>
	<p>Some devices as those under iOS seem to have a limit of size for the images which can be shown. By activating this function, the images will be resized to 5242880 pixels (5x1024x1024= 5Mpx) by default. The original book will not be changed. You can change this size.</p>
</div>

<div data-role="collapsible" data-collapsed="false">
	<h2>Users (For bookmarks)</h2>
	<ul class="ui-li" data-role="listview" id="userlist" data-inset="true"  data-scroll="true">
	<li data-role="list-divider">Add names of users - all names must be different</li>
<?php
$nbusers=0;
if($users) {
foreach ($users as $key => $value) {
	$nbusers=$nbusers+1;
?>
<li><div data-role="controlgroup" data-type="horizontal">
	<input type="text" value="<?php echo $value;?>" id="userval<?php echo $nbusers;?>" name="userval<?php echo $nbusers;?>" data-wrapper-class="controlgroup-textinput ui-btn" placeholder="name"/>
	<a href="#" id="userremove<?php echo $nbusers;?>" class="ui-btn ui-corner-all ui-icon-delete ui-btn-icon-notext" onclick="removeuser(this);">Remove</a>
</div></li>
<?php }} ?>


	</ul>
	<input type="button" id="adduser" class="btn" value="Add user" />
	<p>For each user, you can save a bookmark of a book or indicate that the book has been read. 
For that, you must create a custom column in calibre for each user. The datatype must be "integer". 
For example, you create a custom column with label user1 and name "Toto" and then, here, you add Toto. 
If you want use that, I recommend you to add, in the first one, a "guest" user who will be the account used by default.</p>
</div>



<input name="nbcal" id="nbcal" type="hidden" value=""/>
<input name="nblim" id="nblim" type="hidden" value=""/>
<input name="nbuser" id="nbuser" type="hidden" value=""/>
<input name="admin_login" type="hidden" value="<?php echo $admin_login;?>"/>
<input name="admin_pw" type="hidden" value="<?php echo $admin_pw;?>"/>
<input type="submit" name="Submit" value="Save configuration" data-theme="b" />
</form>
</div><!-- /config tab -->

<div id="runtest">
<form action="#" method="get" enctype="multipart/form-data" name="testform" id="testform" >
	<input name="admin_login"type="hidden" value="<?php echo $admin_login;?>"/>
	<input name="admin_pw" type="hidden" value="<?php echo $admin_pw;?>"/>
	<input type="submit" name="Submit" value="Run compatibility tests" data-theme="b" />
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
		For iPad/iPad mini: <a href="./index.html" class="ui-btn ui-corner-all  ui-btn-inline" data-ajax="false">Flat</a><a href="./index.html?platform=wood" class="ui-btn ui-corner-all ui-btn-inline" data-ajax="false">Wood</a><br/>
		For iphone: <a href="./index.html#profil/iphone" class="ui-btn ui-corner-all ui-btn-inline" data-ajax="false">Flat</a><a href="./index.html?platform=wood#profil/iphone" class="ui-btn ui-corner-all ui-btn-inline" data-ajax="false">Wood</a><br/>
		For Galaxy Tab: <a href="./index.html#profil/gtab" class="ui-btn ui-corner-all ui-btn-inline" data-ajax="false">Flat</a><a href="./index.html?platform=wood#profil/gtab" class="ui-btn ui-corner-all ui-btn-inline" data-ajax="false">Wood</a>
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
	<div data-role="collapsible" data-collapsed="false">
		<h2>Skins to test the aspect on tablet or smartphone</h2>
		<a  target="_blank" href="./skin/ipad.html"><img src="./skin/ipadview1.jpg" /></a> <a  target="_blank" href="./skin/ipad_wood.html"><img src="./skin/ipadview2.jpg" /></a>
		 <a  target="_blank" href="./skin/iphone.html"><img src="./skin/iphoneview.jpg" /></a>
		 <a  target="_blank" href="./skin/galaxytab.html"><img src="./skin/gtabview.jpg" /></a>
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
