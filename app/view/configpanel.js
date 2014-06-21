Ext.define('myreadings.view.configpanel', {
	extend: 'Ext.form.Panel',
	xtype: 'configpanel',
	id: 'configpanel',
	requires: ['Ext.field.Password','Ext.form.FieldSet', 'Ext.field.Select'],
	txtConfiguration: "",
	txtAccount: "",
	txtTitleLogin: "",
	txtLogin: "",
	txtPass: "",
	txtUser: "",
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
	txtSaveaccount: "",
	txtRestoreaccount: "",
	txtTools: "",

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
			title: this.txtConfiguration,
			//docked: 'bottom',
			items: [
			{
				ui: 'decline',
				itemId: 'bthide',
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
			title: this.txtAccount,
		items:[
		{
			xtype: 'fieldset',
			title: this.txtTitleLogin,
			itemId: 'loginfieldset',
			items:[
			{
				xtype: 'textfield',
				itemId: 'login',
				autoCapitalize: false,
				placeHolder: this.txtLogin
			},
			{
				xtype: 'passwordfield',
				itemId: 'pass',
				placeHolder: this.txtPass
			},
			{
				itemId:"txtlogin",
				hidden:true,
				padding: 10,
				html: ""
			},
			{
				xtype: 'selectfield',
				label: this.txtUser,
				name:'listuser',
				hidden:true,
				id:'listuser',
				itemId:'listuser',
				disabled: true,
				listeners:
				{
					change:function(selectbox,value,oldvalue){
						//Test si enabled, ne fait rien sinon (sert pour le setoption lors de l'initialisation)
						if(!this.getDisabled()) {
							myreadings.user.set('currentuser', value);
							myreadings.tempconf.current_userid="";
							
							//Cache la liste dans searchview si elle est ouverte
							Ext.getCmp('searchview').setActiveItem(0);
							myreadings.app.getController('articlesControl').isList=false;
							
							Ext.Viewport.setMasked({xtype: 'loadmask'});
							Ext.data.JsonP.request({
								url: './tools.php',
								callbackKey: 'callback',
								params: {
									action: "getuserid",
									mylogin: myreadings.user.get('username'),
									mypass: myreadings.user.get('password'),
									base: myreadings.tempconf.txtbase,
									user: myreadings.user.get('currentuser')
								},
								success: function(result, request) {
									Ext.Viewport.setMasked(false);
									if(result.success==false) {
										alert(result.message);
									} else {
										myreadings.tempconf.current_userid=result.resultat;
									}
									//Relance la consultation de la base (et lance save)
									myreadings.app.getController('articlesControl').showArticles({
										debut: 6
									});
									
								},
								failure: function(result, request) {
									Ext.Viewport.setMasked(false);
									//Relance la consultation de la base (et lance save)
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
				xtype: 'button',
				margin: '10 40 10 40',
				text: this.txtLoginButton,
				itemId: 'loginbutton',
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
							myreadings.user.set('open_current_comic_at_launch', value);
							myreadings.user.save();
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
							myreadings.user.set('showresize', value);
							myreadings.user.save();
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
							myreadings.user.set('hidemenu', value);
							myreadings.user.save();
						}
					}
				}
			}
			]
		},
		{
				xtype: 'button',
				margin: '10 40 10 40',
				hidden:true,
				text: this.txtSaveaccount,
				itemId: 'saveaccount',
				ui: 'confirm'
		},
		{
				xtype: 'button',
				margin: '10 40 10 40',
				text: this.txtRestoreaccount,
				hidden:true,
				itemId: 'restoreaccount'//,
				//ui: 'confirm'
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
			itemId: "tools",
			hidden: true,
			title: this.txtTools,
			items:[
			{
				xtype: 'togglefield',
				label: this.forced,
				labelWrap: true,
				labelWidth: '60%',
				//hidden:true,
				itemId: 'forced',
				listeners:
				{
					change:function(selectbox,value,oldvalue){
						//console.log(value);
						if(value==1) {
							myreadings.tempconf.forced="true";
							Ext.Msg.alert(this.getParent().getParent().info,this.getParent().getParent().forced_msg);
						} else myreadings.tempconf.forced="false";
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