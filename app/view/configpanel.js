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
	txtViewer: "",
	txtbook_at_launch: "",
	txtresize: "",
	forced: "",
	info: "",
	forced_msg: "",
	hidemenu: "",
	chg_nbbook: "",
	showcust: "",
	portrait: "",
	landscape: "",
	nbline: "",
	nbbyline: "",
	txtchgbookButton: "",

	config: {
		//layout:'vbox',
		//hidden: true
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
				iconMask: true//,
				/*handler: function(){
					var form = this.getParent().getParent().getParent();
					//form.down('#comicSettings').onSave();
					form.hide();
				}*/
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
				labelWrap: true,
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
							if(myreadings.conf.current_user!="") {
								myreadings.conf.current_userid="";
								Ext.Viewport.setMasked({xtype: 'loadmask'});
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
											Ext.Viewport.setMasked(false);
											if(result.success==false) {
												alert(result.message);
											} else {
												myreadings.conf.current_userid=result.resultat;
											}
											//console.log("userid "+myreadings.conf.current_userid);
											//Relance la consultation de la base - type=all (et lance saveuser)
											myreadings.app.getController('articlesControl').showArticles({
													pathbase: value,
													type: "all",
													debut: 5
											});
									
										},
										failure: function(result, request) {
											Ext.Viewport.setMasked(false);
											//Relance la consultation de la base - type=all (et lance saveuser)
											myreadings.app.getController('articlesControl').showArticles({
													pathbase: value,
													type: "all",
													debut: 5
											});
											alert('Php Error for userid.');
										}
								});
							} else {
								myreadings.app.getController('articlesControl').showArticles({
										pathbase: value,
										type: "all",
										debut: 5
								});
							}
							//Cache la liste dans searchview si elle est ouverte et vide le champs recherche
							Ext.getCmp('searchview').setActiveItem(0);
							Ext.getCmp('listviewSearchfield').setValue('');
							mycontroller.isList=false;
							
							myreadings.currentbook.idbook=null;
							mycontroller.showViewerBt();
							
							//var form=this.getParent().getParent();
							//form.hide();
							myreadings.app.getController('articlesControl').activateCarousel();
						}
					}
				}
			},
			{
				xtype: 'togglefield',
				label: this.forced,
				labelWrap: true,
				hidden: true,
				labelWidth: '60%',
				itemId: 'forced',
				listeners:
				{
					change:function(selectbox,value,oldvalue){
						//console.log(value);
						if(value==1) {
							myreadings.conf.forced="true";
							Ext.Msg.alert(this.getParent().getParent().info,this.getParent().getParent().forced_msg);
						} else myreadings.conf.forced="false";
					}
				}
			}
			
			]
		},
		{
			xtype: 'fieldset',
			id:"profil",
			itemId: "profil",
			hidden: true,
			title: "Profil",
			items:[
			{
				xtype: 'togglefield',
				label: this.chg_nbbook,
				labelWrap: true,
				labelWidth: '60%',
				itemId: 'chg_nbbook',
				disabled: true
			},
			{
				xtype: 'togglefield',
				label: this.showcust,
				labelWrap: true,
				labelWidth: '60%',
				itemId: 'showcust'//,
				//disabled: true
			},
			{
			xtype: 'fieldset',
			itemId: "configland",
			hidden: true,
			title: this.landscape,
			items:[
			{
				xtype: 'spinnerfield',
				labelWrap: true,
				labelWidth: '45%',
				label: this.nbline,
				minValue: 1,
				maxValue: 8,
				stepValue: 1,
				itemId: 'landline'
			},
			{
				xtype: 'spinnerfield',
				label: this.nbbyline,
				labelWrap: true,
				labelWidth: '45%',
				minValue: 1,
				maxValue: 10,
				stepValue: 1,
				itemId: 'landbyline'
			}
			]
			},
			{
			xtype: 'fieldset',
			itemId: "configport",
			hidden: true,
			title: this.portrait,
			items:[
			{
				xtype: 'spinnerfield',
				labelWrap: true,
				labelWidth: '45%',
				label: this.nbline,
				minValue: 1,
				maxValue: 8,
				stepValue: 1,
				itemId: 'portline'
			},
			{
				xtype: 'spinnerfield',
				label: this.nbbyline,
				labelWrap: true,
				labelWidth: '45%',
				minValue: 1,
				maxValue: 10,
				stepValue: 1,
				itemId: 'portbyline'
			}
			]
			},
			{
				xtype: 'button',
				margin: '10 40 10 40',
				text: this.txtchgbookButton,
				itemId: 'chgcarouselbutton',
				ui: 'confirm'
			}
			]
		},
		{
			xtype: 'fieldset',
			itemId: 'configViewer',
			title: this.txtViewer,
			items: [
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
							
							//Cache la liste dans searchview si elle est ouverte
							Ext.getCmp('searchview').setActiveItem(0);
							myreadings.app.getController('articlesControl').isList=false;
							
							Ext.Viewport.setMasked({xtype: 'loadmask'});
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
									Ext.Viewport.setMasked(false);
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
									Ext.Viewport.setMasked(false);
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
			},
			{
				xtype: 'togglefield',
				label: this.txtbook_at_launch,
				labelWrap: true,
				labelWidth: '60%',
				itemId: 'open_book_at_launch',
				disabled: true,
				listeners:
				{
					change:function(selectbox,value,oldvalue){
						//Test si enabled, ne fait rien sinon (sert pour le setoption lors de l'initialisation)
						if(!this.getDisabled()) {
							myreadings.settings.open_current_comic_at_launch=value;
							myreadings.app.getController('articlesControl').saveuser();
						}
					}
				}
			},
			{
				xtype: 'togglefield',
				label: this.txtresize,
				labelWrap: true,
				labelWidth: '60%',
				itemId: 'showresize',
				disabled: true,
				listeners:
				{
					change:function(selectbox,value,oldvalue){
						//Test si enabled, ne fait rien sinon (sert pour le setoption lors de l'initialisation)
						if(!this.getDisabled()) {
							myreadings.settings.showresize=value;
							myreadings.app.getController('articlesControl').saveuser();
						}
					}
				}
			},
			{
				xtype: 'togglefield',
				label: this.hidemenu,
				labelWrap: true,
				labelWidth: '60%',
				itemId: 'hidemenu',
				disabled: true,
				listeners:
				{
					change:function(selectbox,value,oldvalue){
						//Test si enabled, ne fait rien sinon (sert pour le setoption lors de l'initialisation)
						if(!this.getDisabled()) {
							myreadings.settings.hidemenu=value;
							myreadings.app.getController('articlesControl').saveuser();
						}
					}
				}
			}
			]
		}
		]
		);
		this.callParent(arguments);
	}
});