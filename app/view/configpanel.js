Ext.define('myreadings.view.configpanel', {
	extend: 'Ext.form.Panel',
	xtype: 'configpanel',
	id: 'configpanel',
	requires: ['Ext.field.Password','Ext.form.FieldSet', 'Ext.field.Select'],
	txtSelectbase: "",
	txtTitleLogin: "",
	txtLogin: "",
	txtPass: "",
	txtLoginButton: "",
	config: {
		layout:'vbox',
		hidden: true
	},
	initialize: function() {
		this.setItems(
		[
		{
			xtype:'titlebar',
			docked: 'top',
			title: 'Configuration',
			//docked: 'bottom',
			items: [
			{
				ui: 'decline',
				name: 'bthide',
				align: 'left',
				iconCls: 'delete',
				iconMask: true,
				handler: function(){
					var form = this.getParent().getParent().getParent();
					form.down('#comicSettings').onSave();
					form.hide();
				}
			}]
		},
		{
			xtype: 'fieldset',
			title: this.txtTitleLogin,
			name: 'loginfieldset',
			items:[
			{
				xtype: 'textfield',
				name: 'login',
				autoCapitalize: false,
				placeHolder: this.txtLogin
			},
			{
				xtype: 'passwordfield',
				name: 'pass',
				placeHolder: this.txtPass
			},
			{
				xtype: 'button',
				margin: '10 40 10 40',
				text: this.txtLoginButton,
				name: 'loginbutton',
				ui: 'confirm'
			}
			]
		},
		{
			xtype: 'fieldset',
			items:[
			{
				xtype: 'selectfield',
				label: this.txtSelectbase,
				name:'base',
				id:'base',
				itemId:'base',
				disabled: true,
				//options: [{text:"test", value:"test"}],
				listeners:
				{
					change:function(selectbox,value,oldvalue){
						//Test si enabled, ne fait rien sinon (sert pour le setoption lors de l'initialisation)
						if(!this.getDisabled()) {
							var mycontroller = myreadings.app.getController('articlesControl');
							
							myreadings.conf.current_userid="";
							Ext.data.JsonP.request({
								url: './tools.php',
								callbackKey: 'callback',
								params: {
									action: "getuserid",
									mylogin: myreadings.conf.username,
									mypass: myreadings.conf.password,
									base: Ext.getCmp('base').getRecord().data.text,
									user: myreadings.conf.current_user
								},
								success: function(result, request) {
									//Ext.Viewport.setMasked(false);
									if(result.success==false) {
										alert(result.message);
									} else {
										myreadings.conf.current_userid=result.resultat;
									}
									console.log("userid "+myreadings.conf.current_userid);
									//Relance la consultation de la base - type=all (et lance saveuser)
									myreadings.app.getController('articlesControl').showArticles({
										pathbase: value,
										type: "all",
										debut: 5
									});
									
								},
								failure: function(result, request) {
									//Ext.Viewport.setMasked(false);
									//Relance la consultation de la base - type=all (et lance saveuser)
									myreadings.app.getController('articlesControl').showArticles({
										pathbase: value,
										type: "all",
										debut: 5
									});
									alert('Php Error for userid.');
								}
							});
							
							//Cache la liste dans searchview si elle est ouverte et vide le champs recherche
							Ext.getCmp('searchview').setActiveItem(0);
							Ext.getCmp('listviewSearchfield').setValue('');
							mycontroller.isList=false;
							
							myreadings.currentbook.idbook=null;
							mycontroller.showViewerBt();
							
							var form=this.getParent().getParent();
							//sauvegarde les paramètres du comic viewer au cas où ils auraient été modifés avant le changement de base
							form.down('#comicSettings').onSave();
							form.hide();
						}
					}
				}
			},
			{
				id:"profil",
				padding: 10,
				html:''
			},
			{
				xtype: 'selectfield',
				label: "User", //this.txtSelectbase,
				name:'listuser',
				id:'listuser',
				itemId:'listuser',
				disabled: true,
				listeners:
				{
					change:function(selectbox,value,oldvalue){
						//Test si enabled, ne fait rien sinon (sert pour le setoption lors de l'initialisation)
						if(!this.getDisabled()) {
							myreadings.conf.current_user=value;
							myreadings.conf.current_userid="";
							Ext.data.JsonP.request({
								url: './tools.php',
								callbackKey: 'callback',
								params: {
									action: "getuserid",
									mylogin: myreadings.conf.username,
									mypass: myreadings.conf.password,
									base: myreadings.conf.txtbase,
									user: myreadings.conf.current_user
								},
								success: function(result, request) {
									//Ext.Viewport.setMasked(false);
									if(result.success==false) {
										alert(result.message);
									} else {
										myreadings.conf.current_userid=result.resultat;
									}
									//Relance la consultation de la base (et lance saveuser)
									myreadings.app.getController('articlesControl').showArticles({
										debut: 6
									});
									
								},
								failure: function(result, request) {
									//Ext.Viewport.setMasked(false);
									//Relance la consultation de la base (et lance saveuser)
									myreadings.app.getController('articlesControl').showArticles({
										debut: 6
									});
									alert('Php Error for userid.');
								}
							});	
						}
					}
				}
			}
			]
		},
		{
			xtype:'comicSettings',
			name:'comicSettings',
			itemId:'comicSettings',
			height: 450,
			scrollable: false
			//layout: 'vbox'
			//flex: 1
		}
		]
		);
		this.callParent(arguments);
	}
});