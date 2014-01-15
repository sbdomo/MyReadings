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
							mycontroller.pathbase=value;
							//toute la base : type=all
							mycontroller.showArticles({
									type: "all",
									debut: 5
							});
							//Cache la liste dans searchview si elle est ouverte et vide le champs recherche
							Ext.getCmp('searchview').setActiveItem(0);
							Ext.getCmp('listviewSearchfield').setValue('');
							mycontroller.isList=false;
							this.getParent().getParent().hide();
						}
					}
				}
			},
			{
				id:"profil",
				padding: 10,
				html:''
			}
			]
		}
		]
		);
		this.callParent(arguments);
	}
});