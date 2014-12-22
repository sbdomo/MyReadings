<?php
if(isset($_POST['admin_login'])) $admin_login=$_POST['admin_login'];
else      $admin_login="";
if(isset($_POST['admin_pw'])) $admin_pw=$_POST['admin_pw'];
else      $admin_pw="";
if(isset($_POST['action_login'])) $action_login=$_POST['action_login'];
else      $action_login="";

if(isset($_POST['language0'])) $language0=$_POST['language0'];
else      $language0="";

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

.grey {
	background-color: grey;
	text-shadow: 0 0px;
	font-size: 1.1em;
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
if($testconnect==false)	{
	if(file_exists('./config/language.php')) {
		require_once('./config/language.php');
	} else {
		$language0="en";	
	}
?>	
	
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
	<form data-ajax="false" action="./admin.php" method="post" enctype="multipart/form-data" name="adminpass" id="adminpass" class="validate">
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
	<fieldset data-role="fieldcontain">
	<label for="language0" class="select">Language</label>
	<select name="language0" id="language0" data-native-menu="false">
		<option>Language</option>
		<option value="en" <?php if($language0=="en") echo "selected";?> >English</option>
		<option value="fr" <?php if($language0=="fr") echo "selected";?> >French</option>
		<option value="es" <?php if($language0=="es") echo "selected";?> >Spanish</option>
	</select>
	</fieldset>
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
		$control=false;
		$epubview=true;
		$cbzview=true;
		$cbrview=true;
		$fetchmode="resize_and_cache";
		$XSendfile=false;
		$calibre=array();
		$limited=array();
		$resizecbz=false;
		$maxsize=5242880;
	}
	if($language0!="") $language=$language0;
	if($maxsize==""||$maxsize==NULL) $maxsize=5242880;
	$languagejson="./resources/locale/admin_".$language.".json";
	if(!file_exists($languagejson)) $languagejson="./resources/locale/admin_en.json";
	$json = file_get_contents($languagejson);
	$json = json_decode($json, true);
	$msg= $json['msg'];
?>
<script type="text/javascript">
function removeline(me){
	$(me).parents('li').remove();
	return false;
}

function editaccount(index){
	$("#poplogin").val($("#acc_login"+index).val());
	$("#poppass").val($("#acc_pass"+index).val());
	$("#poppassconf").val($("#acc_pass"+index).val());
	
	$("input[name=popaccess]").prop( "checked", false ).checkboxradio( "refresh" );
	$("input[name=popaccess][value='"+$("#acc_access"+index).val()+"']").prop( "checked", true ).checkboxradio( "refresh" );
	
	$("input[name=popuserchoice]").prop( "checked", false ).checkboxradio( "refresh" );
	$("input[name=popuserchoice][value='"+$("#acc_userchoice"+index).val()+"']").prop( "checked", true ).checkboxradio( "refresh" );
	
	$("#popuser").val($("#acc_user"+index).val());
	$("#popid").val(index);
	
	$( "#popupLogin" ).popup( "open" );
	//Pour réinitialiser le test de validité (et ne pas afficher le résultat précédent)
	var test=$("#editlogin").valid();
	
	return false;
}

$(function() {
	var i = $('#calibrelibrary1 li').size();
	$.ajaxSetup({ cache: false });
        $('#addcalibre1').on('click', function() {
			listItem = '<li><fieldset class="ui-grid-b">'+
			'<div class="ui-block-a">'+
			'<input type="text" value="" id="calval' + i +'" name="calval' + i +'" data-wrapper-class="controlgroup-textinput ui-btn" placeholder="<?php echo $msg["path"]; ?>"/>'+
			'</div><div class="ui-block-b">'+
			'<input type="text" value="" id="calkey' + i +'" name="calkey' + i +'" data-wrapper-class="controlgroup-textinput ui-btn" placeholder="<?php echo $msg["name"]; ?>"/>'+
			'</div><div class="ui-block-c"><div data-role="controlgroup" data-type="horizontal">'+
			'<input type="text" value="" id="calcustom' + i +'" name="calcustom' + i +'" data-wrapper-class="controlgroup-textinput ui-btn" placeholder="<?php echo $msg["cust_col_labels"]; ?>"/>'+
			'<a href="#" id="calremove' + i +'" class="ui-btn ui-corner-all ui-icon-delete ui-btn-icon-notext" onclick="removeline(this);"><?php echo $msg["remove"]; ?></a>'+
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
			'<input type="text" value="" id="limval' + i2 +'" name="limval' + i2 +'" data-wrapper-class="controlgroup-textinput ui-btn" placeholder="<?php echo $msg["path"]; ?>"/>'+
			'</div><div class="ui-block-b">'+
			'<input type="text" value="" id="limkey' + i2 +'" name="limkey' + i2 +'" data-wrapper-class="controlgroup-textinput ui-btn" placeholder="<?php echo $msg["name"]; ?>"/>'+
			'</div><div class="ui-block-c"><div data-role="controlgroup" data-type="horizontal">'+
			'<input type="text" value="" id="limcustom' + i2 +'" name="limcustom' + i2 +'" data-wrapper-class="controlgroup-textinput ui-btn" placeholder="<?php echo $msg["cust_col_labels"]; ?>"/>'+
			'<a href="#" id="limremove' + i2 +'" class="ui-btn ui-corner-all ui-icon-delete ui-btn-icon-notext" onclick="removeline(this);"><?php echo $msg["remove"]; ?></a>'+
			'</div></div>'
			'</fieldset></li>';
			i2++;
        		$('#calibrelibrary2').append(listItem);
        		$('#calibrelibrary2').listview('refresh').trigger('create');
        });
        
	var i3 = $('#userlist li').size();
        $('#adduser').on('click', function() {
			listItem = '<li><div data-role="controlgroup" data-type="horizontal">'+
			'<input type="text" value="" id="userval' + i3 +'" name="userval' + i3 +'" data-wrapper-class="controlgroup-textinput ui-btn" placeholder="<?php echo $msg["name"]; ?>"/>'+
			'<a href="#" id="userremove' + i3 +'" class="ui-btn ui-corner-all ui-icon-delete ui-btn-icon-notext" onclick="removeline(this);"><?php echo $msg["remove"]; ?></a>'+
			'</div></li>';
			i3++;
        		$('#userlist').append(listItem);
        		$('#userlist').listview('refresh').trigger('create');
        });
	
	$('#newaccount').on('click', function() {
			$("#poplogin").val("");
			$("#poppass").val("");
			$("#poppassconf").val("");
			
			$("input[name=popaccess]").prop( "checked", false ).checkboxradio( "refresh" );
			$("input[name=popaccess][value='"+"Normal"+"']").prop( "checked", true ).checkboxradio( "refresh" );
			
			$("input[name=popuserchoice]").prop( "checked", false ).checkboxradio( "refresh" );
			$("input[name=popuserchoice][value='"+"No user"+"']").prop( "checked", true ).checkboxradio( "refresh" );
			
			$("#popuser").val("");
			$("#popid").val(0);
			
			$( "#popupLogin" ).popup( "open" );
	});
	
	var i4 = $('#accountlist li').size();
	$('#addaccount').on('click', function() {
	   if($("#editlogin").valid()) {
		$( "#popupLogin" ).popup( "close" );
		var newacc=$("#poplogin").val()+": "+$('input[name=popaccess]:checked').val()+" / "+$('input[name=popuserchoice]:checked').val()+" / "+$("#popuser").val();
		if($("#popid").val()==0) {
			var index = i4;
			listItem = '<li><div data-role="controlgroup" data-type="horizontal">'+
			'<a href="#" id="accountbt' + index +'" class="ui-btn ui-corner-all" onclick="editaccount(' + index +');">'+newacc+'</a>'+
			'<input name="acc_login' + index +'" id="acc_login' + index +'" type="hidden" value="'+$("#poplogin").val()+'"/>'+
			'<input name="acc_pass' + index +'" id="acc_pass' + index +'" type="hidden" value="'+$("#poppass").val()+'"/>'+
			'<input name="acc_access' + index +'" id="acc_access' + index +'" type="hidden" value="'+$('input[name=popaccess]:checked').val()+'"/>'+
			'<input name="acc_userchoice' + index +'" id="acc_userchoice' + index +'" type="hidden" value="'+$('input[name=popuserchoice]:checked').val()+'"/>'+
			'<input name="acc_user' + index +'" id="acc_user' + index +'" type="hidden" value="'+$("#popuser").val()+'"/>'+
			'<a href="#" id="accountdel' + index +'" class="ui-btn ui-corner-all ui-icon-delete ui-btn-icon-notext" onclick="removeline(this);"><?php echo $msg["remove"]; ?></a>'+
			'</div></li>';
			i4++;
        		$('#accountlist').append(listItem);
        		$('#accountlist').listview('refresh').trigger('create');
		} else {
			var index=$("#popid").val();
			$('#accountbt' + index).text(newacc);
			$('#acc_login' + index).val($("#poplogin").val());
			$('#acc_pass' + index).val($("#poppass").val());
			$('#acc_access' + index).val($('input[name=popaccess]:checked').val());
			$('#acc_userchoice' + index).val($('input[name=popuserchoice]:checked').val());
			$('#acc_user' + index).val($("#popuser").val());
		}
	   }
	   return false;
	});
	
	$.validator.addMethod("poppassmatch", function(value) {
			return value == $("#poppass").val();
	}, '<?php echo $msg["pass_match"]; ?>');
	
	$("#editlogin").validate({
		errorPlacement: function(error, element) {
			error.insertAfter($(element).parent());
		}//,
		//submitHandler: function(form) {
		//	console.log("Call Login Action");
		//}
	});
	
	
	
	$("#editconfig").validate({
		errorPlacement: function(error, element) {
			error.insertAfter($(element).parent());
		},
		rules: {
			/*login: {
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
			},*/
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
			$('#nbaccount').val(i4);
			$.get("./saveconfig.php", $('#editconfig').serialize(),
			function(data){
				if(data.success=="true") alert("<?php echo $msg["save_config"]; ?>");
				else alert(data.resultat);
			}, "json")
			.error(function() {
				alert("<?php echo $msg["error"]; ?>");
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
			alert("<?php echo $msg["error"]; ?>");
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
			alert("<?php echo $msg["error"]; ?>");
		});
		return false;
	});
	$('#deletethumbform').submit(function(){
		$.mobile.loading( "show");
		$.get("./admintools.php", $('#deletethumbform').serialize(),
		function(data){
			if(data.success=="true") alert("<?php echo $msg["empty_thumb"]; ?>");
			else alert(data.resultat);
		}, "json")
		.error(function() {
			alert("<?php echo $msg["error"]; ?>");
		});
		$.mobile.loading( "hide" );
		return false;
	});
	
	$('#deletesavingaccount').on('click', function() {
		$.mobile.loading( "show");

		var $container = $('#accountoptionsgroup').find('.ui-controlgroup-controls');
		var params=$('#deleteaccount').serialize();
		$.get("./admintools.php", params,
		function(data){
			$.mobile.loading( "hide" );
			if(data.success==true) {
				if($('#deletesaveaccountaction').val()!="initdeletesaveaccount"||data.resultat!="") {
					$container.find('.ui-radio').remove();
					var i=0;
					$.each(data.resultat, function(key, value) {
						var id = 'accountsav_' + i;
						
						$('<input />', {
							'id': id,
							'type': 'radio',
							'name': 'accountsav',
							'value': value
						}).append('<label for="' + id + '">' + value + '</label>').appendTo($container);
						i=i+1;
					});
					$container.find('input[type=radio]').checkboxradio();
					$("#accountoptionsgroup").controlgroup("refresh");
					if($('#deletesaveaccountaction').val()=="initdeletesaveaccount") {
						$('#deletesaveaccountaction').val("deletesaveaccount");
						$('#deletesavingaccount').val("<?php echo $msg["delete_saving"]; ?>").button('refresh');
					} else if(data.resultat=="") {
						$('#deletesaveaccountaction').val("initdeletesaveaccount");
						$('#deletesavingaccount').val("<?php echo $msg["show_list"]; ?>").button('refresh');
					}
				} else alert("<?php echo $msg["no_account"]; ?>");
			} else alert(data.resultat);
		}, "json")
		.error(function() {
			$.mobile.loading( "hide" );
			alert("<?php echo $msg["error"]; ?>");
		});

	});
});
</script>
<div data-role="tabs" id="tabs">
  <div data-role="navbar">
    <ul>
      <li><a href="#makeconfig" data-ajax="false"><?php echo $msg["configuration"]; ?></a></li>
      <li><a href="#runtest" data-ajax="false"><?php echo $msg["compat_test"]; ?></a></li>
      <li><a href="#runtestexist" data-ajax="false"><?php echo $msg["test_covers"]; ?></a></li>
      <li><a href="#tools" data-ajax="false"><?php echo $msg["tools"]; ?></a></li>
    </ul>
  </div>

<div id="makeconfig" class="ui-body-d ui-content">
<form action="#" method="get" enctype="multipart/form-data" name="editconfig" id="editconfig" >
<fieldset data-role="fieldcontain">
	<label for="language" class="select"><?php echo $msg["language"]; ?></label>
	<select name="language" id="language" data-native-menu="false">
		<option><?php echo $msg["language"]; ?></option>
		<option value="en" <?php if($language=="en") echo "selected";?> ><?php echo $msg["english"]; ?></option>
		<option value="fr" <?php if($language=="fr") echo "selected";?> ><?php echo $msg["french"]; ?></option>
		<option value="es" <?php if($language=="es") echo "selected";?> ><?php echo $msg["spanish"]; ?></option>
	</select>
	<label for="fetchmode" class="select"><?php echo $msg["access_mode"]; ?></label>
	<select name="fetchmode" id="fetchmode" data-native-menu="false">
		<option><?php echo $msg["access_libraries"]; ?></option>
		<option value="direct" <?php if($fetchmode=="direct") echo "selected";?> ><?php echo $msg["access_direct"]; ?></option>
		<option value="resize" <?php if($fetchmode=="resize") echo "selected";?> ><?php echo $msg["access_resize"]; ?></option>
		<option value="resize_and_cache" <?php if($fetchmode=="resize_and_cache") echo "selected";?> ><?php echo $msg["access_resize_cache"]; ?></option>
		<option value="noresize" <?php if($fetchmode=="noresize") echo "selected";?> ><?php echo $msg["access_no_resize"]; ?></option>
	</select>
	<br/><p><?php echo $msg["msg1"]; ?></p>
	<label for="XSendfile"><?php echo $msg["use_xsendfile"]; ?></label>
		<select name="XSendfile" id="XSendfile" data-role="slider">
			<option value="false" <?php if(!$XSendfile) echo "selected";?> >
			<?php echo $msg["no"]; ?>
			</option>
			<option value="true" <?php if($XSendfile) echo "selected";?> >
			<?php echo $msg["yes"]; ?>
			</option>
		</select>
</fieldset>
<div data-role="collapsible" data-collapsed="false">
	<h2><?php echo $msg["calibre_libraries"]; ?></h2>
	<fieldset data-role="fieldcontain">
		<label for="protect"><?php echo $msg["protect_access"]; ?></label>
		<select name="protect" id="protect" data-role="slider">
			<option value="false" <?php if(!$protect) echo "selected";?> >
			<?php echo $msg["no"]; ?>
			</option>
			<option value="true" <?php if($protect) echo "selected";?> >
			<?php echo $msg["yes"]; ?>
			</option>
			</select>
			<br/><p><?php echo $msg["msg2"]; ?></p>
	</fieldset>
	<ul class="ui-li" data-role="listview" id="calibrelibrary1" data-inset="true"  data-scroll="true">
	<li data-role="list-divider"><?php echo $msg["msg3"]; ?></li>
<?php
$nbcalibre1=0;
if($calibre) {
foreach ($calibre as $key => $value) {
	$nbcalibre1=$nbcalibre1+1;
?>
	<li>
		<fieldset class="ui-grid-b">
			<div class="ui-block-a">
				<input type="text" value="<?php echo $value;?>"  id="calval<?php echo $nbcalibre1;?>" name="calval<?php echo $nbcalibre1;?>" data-wrapper-class="controlgroup-textinput ui-btn" placeholder="<?php echo $msg["path"]; ?>"/>
			</div>
			<div class="ui-block-b">
				<input type="text" value="<?php echo $key;?>"  id="calkey<?php echo $nbcalibre1;?>" name="calkey<?php echo $nbcalibre1;?>" data-wrapper-class="controlgroup-textinput ui-btn" placeholder="<?php echo $msg["name"]; ?>"/>
			</div>
			<div class="ui-block-c">
				<div data-role="controlgroup" data-type="horizontal">
					<input type="text" value="<?php echo $customcolumn[$key];?>"  id="calcustom<?php echo $nbcalibre1;?>" name="calcustom<?php echo $nbcalibre1;?>" data-wrapper-class="controlgroup-textinput ui-btn" placeholder="<?php echo $msg["cust_col_labels"]; ?>"/>
					<a href="#" id="calremove<?php echo $nbcalibre1;?>" class="ui-btn ui-corner-all ui-icon-delete ui-btn-icon-notext" onclick="removeline(this);"><?php echo $msg["remove"]; ?></a>
				</div>
			</div>
		</fieldset>
	</li>
<?php }} ?>
	</ul>
	<input type="button" id="addcalibre1" class="btn" value='<?php echo $msg["add_normal_library"]; ?>' />
	
	
	
	<ul class="ui-li" data-role="listview" id="calibrelibrary2" data-inset="true"  data-scroll="true">
	<li data-role="list-divider"><?php echo $msg["protected_libraries"]; ?></li>
<?php
$nbcalibre2=0;
if($limited) {
foreach ($limited as $key => $value) {
	$nbcalibre2=$nbcalibre2+1;
?>
	<li>
		<fieldset class="ui-grid-b">
			<div class="ui-block-a">
				<input type="text" value="<?php echo $value;?>"  id="limval<?php echo $nbcalibre2;?>" name="limval<?php echo $nbcalibre2;?>" data-wrapper-class="controlgroup-textinput ui-btn" placeholder="<?php echo $msg["path"]; ?>"/>
			</div>
			<div class="ui-block-b">
				<input type="text" value="<?php echo $key;?>"  id="limkey<?php echo $nbcalibre2;?>" name="limkey<?php echo $nbcalibre2;?>" data-wrapper-class="controlgroup-textinput ui-btn" placeholder="<?php echo $msg["name"]; ?>"/>
			</div>
			<div class="ui-block-c">
				<div data-role="controlgroup" data-type="horizontal">
					<input type="text" value="<?php echo $customcolumn[$key];?>"  id="limcustom<?php echo $nbcalibre2;?>" name="limcustom<?php echo $nbcalibre2;?>" data-wrapper-class="controlgroup-textinput ui-btn" placeholder="<?php echo $msg["cust_col_labels"]; ?>"/>
					<a href="#" id="limremove<?php echo $nbcalibre2;?>" class="ui-btn ui-corner-all ui-icon-delete ui-btn-icon-notext" onclick="removeline(this);"><?php echo $msg["remove"]; ?></a>
				</div>
			</div>
		</fieldset>
	</li>
<?php }} ?>
	</ul>
	<input type="button" id="addcalibre2" class="btn" value="<?php echo $msg["add_protected_library"]; ?>" />
	
	<p><?php echo $msg["msg4"]; ?></p>
</div>

<div data-role="collapsible" data-collapsed="false">
<h2><?php echo $msg["accounts_and_users"]; ?></h2>
<ul class="ui-li" data-role="listview" id="accountlist" data-inset="true"  data-scroll="true">
<li data-role="list-divider"><?php echo $msg["accounts"]; ?></li>
<?php
$nbaccount=0;
if($account) {
foreach ($account as $key => $value) {
	$nbaccount=$nbaccount+1;
	$newacc=$key.": ".$value[1]." / ".$value[2]." / ".$value[3];
?>
<li><div data-role="controlgroup" data-type="horizontal">
	<a href="#" id="accountbt<?php echo $nbaccount;?>" class="ui-btn ui-corner-all" onclick="editaccount(<?php echo $nbaccount;?>);"><?php echo $newacc;?></a>
	<input name="acc_login<?php echo $nbaccount;?>" id="acc_login<?php echo $nbaccount;?>" type="hidden" value="<?php echo $key;?>"/>
	<input name="acc_pass<?php echo $nbaccount;?>" id="acc_pass<?php echo $nbaccount;?>" type="hidden" value="<?php echo $value[0];?>"/>
	<input name="acc_access<?php echo $nbaccount;?>" id="acc_access<?php echo $nbaccount;?>" type="hidden" value="<?php echo $value[1];?>"/>
	<input name="acc_userchoice<?php echo $nbaccount;?>" id="acc_userchoice<?php echo $nbaccount;?>" type="hidden" value="<?php echo $value[2];?>"/>
	<input name="acc_user<?php echo $nbaccount;?>" id="acc_user<?php echo $nbaccount;?>" type="hidden" value="<?php echo $value[3];?>"/>
	<a href="#" id="accountdel<?php echo $nbaccount;?>" class="ui-btn ui-corner-all ui-icon-delete ui-btn-icon-notext" onclick="removeline(this);"><?php echo $msg["remove"]; ?></a>
</div></li>
<?php }} ?>
</ul>
	<input type="button" id="newaccount" class="btn" value="<?php echo $msg["add_account"];?>" />
	<?php echo $msg["msg5"]; ?>

	<ul class="ui-li" data-role="listview" id="userlist" data-inset="true"  data-scroll="true">
	<li data-role="list-divider"><?php echo $msg["users_name"];?></li>
<?php
$nbusers=0;
if($users) {
foreach ($users as $key => $value) {
	$nbusers=$nbusers+1;
?>
<li><div data-role="controlgroup" data-type="horizontal">
	<input type="text" value="<?php echo $value;?>" id="userval<?php echo $nbusers;?>" name="userval<?php echo $nbusers;?>" data-wrapper-class="controlgroup-textinput ui-btn" placeholder="<?php echo $msg["name"];?>"/>
	<a href="#" id="userremove<?php echo $nbusers;?>" class="ui-btn ui-corner-all ui-icon-delete ui-btn-icon-notext" onclick="removeline(this);"><?php echo $msg["remove"];?></a>
</div></li>
<?php }} ?>

	</ul>
	<input type="button" id="adduser" class="btn" value="<?php echo $msg["add_user"];?>" />
	<?php echo $msg["msg6"];?>

</div>


<div data-role="collapsible" data-collapsed="false">
	<h2><?php echo $msg["viewers"];?></h2>
	<fieldset data-role="controlgroup">
        <input type="checkbox" name="epubview" id="epubview" <?php if($epubview=="on") echo "checked";?>>
        <label for="epubview">Epub</label>
        <input type="checkbox" name="cbzview" id="cbzview" <?php if($cbzview=="on") echo "checked";?>>
        <label for="cbzview">Cbz</label>
        <input type="checkbox" name="cbrview" id="cbrview" <?php if($cbrview=="on") echo "checked";?>>
        <label for="cbrview">Cbr</label>
	</fieldset>
	<?php echo $msg["msg7"];?>
	<fieldset data-role="fieldcontain">
	<label for="resizecbz"><?php echo $msg["resize"];?></label>
	<select name="resizecbz" id="resizecbz" data-role="slider">
		<option value="false" <?php if(!$resizecbz) echo "selected";?> >
			<?php echo $msg["no"];?>
		</option>
		<option value="true" <?php if($resizecbz) echo "selected";?> >
			<?php echo $msg["yes"];?>
		</option>
	</select>
	</fieldset>
	<fieldset data-role="fieldcontain">
		<label for="maxsize"><?php echo $msg["size_max"];?></label>
		<input type="text" value="<?php echo $maxsize;?>" id="maxsize" name="maxsize" />
	</fieldset>
	<?php echo $msg["msg8"];?>
</div>

<input name="nbcal" id="nbcal" type="hidden" value=""/>
<input name="nblim" id="nblim" type="hidden" value=""/>
<input name="nbuser" id="nbuser" type="hidden" value=""/>
<input name="nbaccount" id="nbaccount" type="hidden" value=""/>
<input name="admin_login" type="hidden" value="<?php echo $admin_login;?>"/>
<input name="admin_pw" type="hidden" value="<?php echo $admin_pw;?>"/>
<input type="submit" name="Submit" value="<?php echo $msg["save_configuration"];?>" data-theme="b" />
</form>

<div data-role="popup" id="popupLogin"  class="ui-content">
    <form action="#" method="get" enctype="multipart/form-data" name="editlogin" id="editlogin" >
        <div>
            <label for="poplogin" class="ui-hidden-accessible"><?php echo $msg["login"];?>:</label>
            <input type="text" name="poplogin" id="poplogin" value="" placeholder="Login" class="required"/>
            <label for="poppass"><?php echo $msg["password"];?>:</label>
            <input type="password" name="poppass" id="poppass" value="" class="required">
	    <label for="poppassconf"><?php echo $msg["confirm_password"];?>:</label>
            <input type="password" name="poppassconf" id="poppassconf" value="" class="required poppassmatch">
	    <legend><?php echo $msg["libraries_access"];?>:</legend>
	    <fieldset data-role="controlgroup" data-type="horizontal">
	    	<input type="radio" name="popaccess" id="popaccessa" value="Normal" checked="checked">
		<label for="popaccessa">Normal</label>
		<input type="radio" name="popaccess" id="popaccessb" value="Parental">
		<label for="popaccessb">Parental</label>
	    </fieldset>
	    <legend><?php echo $msg["user_choice"];?>:</legend>
	    <fieldset data-role="controlgroup" data-type="horizontal">
	    	<input type="radio" name="popuserchoice" id="popuserchoicea" value="No user" checked="checked">
		<label for="popuserchoicea">No user</label>
		<input type="radio" name="popuserchoice" id="popuserchoiceb" value="Forced">
		<label for="popuserchoiceb">Forced</label>
		<input type="radio" name="popuserchoice" id="popuserchoicec" value="Free">
		<label for="popuserchoicec">Free</label>
	    </fieldset>
	    <label for="popuser"><?php echo $msg["user"];?>:</label>
            <input type="text" name="popuser" id="popuser" value="" />
	    <input type="hidden"  name="popid" id="popid" value="" />
            <button type="button" id="addaccount" class="ui-btn ui-corner-all ui-shadow ui-btn-b ui-btn-icon-left ui-icon-check"><?php echo $msg["update"];?></button>
        </div>
    </form>
</div>

</div><!-- /config tab -->

<div id="runtest">
<form action="#" method="get" enctype="multipart/form-data" name="testform" id="testform" >
	<input name="admin_login"type="hidden" value="<?php echo $admin_login;?>"/>
	<input name="admin_pw" type="hidden" value="<?php echo $admin_pw;?>"/>
	<input name="language" type="hidden" value="<?php echo $language;?>"/>
	<input type="submit" name="Submit" value="<?php echo $msg["run_compatibility_tests"];?>" data-theme="b" />
</form>
<div id="testresult"></div>
</div><!-- /runtest tab -->
<div id="runtestexist">
<form action="#" method="get" enctype="multipart/form-data" name="testexistform" id="testexistform" >
	<input name="admin_login"type="hidden" value="<?php echo $admin_login;?>"/>
	<input name="admin_pw" type="hidden" value="<?php echo $admin_pw;?>"/>
	<input name="language" type="hidden" value="<?php echo $language;?>"/>
	<input type="submit" name="Submit" value="<?php echo $msg["run_tests"];?>" data-theme="b" />
</form>
<div id="testexistresult"></div>
</div><!-- /runtestexist tab -->
<div id="tools">
	<div data-role="collapsible" data-collapsed="false">
		<h2><?php echo $msg["url_syntax"];?></h2>
		<?php echo $msg["for_ipad"];?>: <a href="./index.html" class="ui-btn ui-corner-all  ui-btn-inline" data-ajax="false">Flat</a><a href="./index.html?platform=wood" class="ui-btn ui-corner-all ui-btn-inline" data-ajax="false">Wood</a><br/>
		<?php echo $msg["for_iphone"];?>: <a href="./index.html#profil/iphone" class="ui-btn ui-corner-all ui-btn-inline" data-ajax="false">Flat</a><a href="./index.html?platform=wood#profil/iphone" class="ui-btn ui-corner-all ui-btn-inline" data-ajax="false">Wood</a><br/>
		<?php echo $msg["for_galaxy"];?>: <a href="./index.html#profil/gtab" class="ui-btn ui-corner-all ui-btn-inline" data-ajax="false">Flat</a><a href="./index.html?platform=wood#profil/gtab" class="ui-btn ui-corner-all ui-btn-inline" data-ajax="false">Wood</a>
	</div>
	<div data-role="collapsible" data-collapsed="false">
		<h2><?php echo $msg["thumb_management"];?></h2>
		<?php echo $msg["msg9"];?>
		<form action="#" method="get" enctype="multipart/form-data" name="deletethumbform" id="deletethumbform" >
		<input name="admin_login"type="hidden" value="<?php echo $admin_login;?>"/>
		<input name="admin_pw" type="hidden" value="<?php echo $admin_pw;?>"/>
		<input name="action" type="hidden" value="deletethumb"/>
		<input type="submit" name="Submit" value="<?php echo $msg["delete_cache"];?>" data-theme="b" />
		</form>
	</div>
	
	<div data-role="collapsible" data-collapsed="false">
	<h2><?php echo $msg["account_saving"];?></h2>
	<?php echo $msg["msg10"];?>
	<form action="#" method="get" enctype="multipart/form-data" name="deleteaccount" id="deleteaccount" >
                <fieldset id="accountoptionsgroup" data-role="controlgroup">
                	<legend><?php echo $msg["choose_account"];?></legend>
                </fieldset>
		<input name="admin_login"type="hidden" value="<?php echo $admin_login;?>"/>
		<input name="admin_pw" type="hidden" value="<?php echo $admin_pw;?>"/>
		<input name="action" id="deletesaveaccountaction" type="hidden" value="initdeletesaveaccount"/>
		<input type="button" id="deletesavingaccount" class="btn" value="<?php echo $msg["show_list"];?>" data-theme="b" />
	</form>
	</div>
	<div data-role="collapsible" data-collapsed="false">
		<h2><?php echo $msg["skin_test"];?></h2>
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
