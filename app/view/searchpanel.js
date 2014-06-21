Ext.define('myreadings.view.searchpanel', {
	extend: 'Ext.form.Panel',
	xtype: 'searchpanel',
	id: 'searchpanel',
	requires: ['Ext.form.FieldSet', 'Ext.field.Toggle', 'Ext.field.Search', 'Ext.field.Select'],
	txtTitle: "",
	txtFieldsetFindText: "",
	txtSearchfiledFind: "",
	txtFindTextType: "",
	txtFindTextTypeTitle: "",
	txtFindTextTypeAuthor: "",
	txtFindTextTypeSerie: "",
	txtFindTextTypeTag: "",
	txtFindTextToStart: "",
	txtFindTextButton: "",
	txtFieldsetList: "",
	txtFieldsetListButton: "",
	txtSelectbase: "",
	txtNoFilter: "",
	txtFilterChoice: "",
	//config: {
		//fullscreen: true,
		//modal: true,
		//hideOnMaskTap: true,
		//centered: true,
		//hidden: true//,
		//width: '500px',
		//height: '600px',
		//maxWidth: '95%',
		//maxHeight: '95%',
		//items:
	//},
	initialize: function() {
    	    this.setItems(
    	    [
    	    {
    	    	    xtype:'titlebar',
    	    	    docked: 'top',
    	    	    title: this.txtTitle,
    	    	    items: [
    	    	    	   {
    	    	    	   	   ui: 'decline',
    	    	    	   	   align: 'left',
    	    	    	   	   name: 'bthide',
    	    	    	   	   iconCls: 'delete',
    	    	    	   	   iconMask: true//,
    	    	    	   	   //handler: function(){
    	    	    	   	   //	   Ext.getCmp('searchview').hide();
    	    	    	   	   //}
    	    	    	   }
    	    	    ]
    	    },
	    {
    	    	    xtype: 'fieldset',
    	    	    //title: this.txtFilter,
    	    	    defaults: {
    	    	    	    labelWidth: '35%'
    	    	    },
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
							if(myreadings.user.get('currentuser')!="") {
								myreadings.tempconf.current_userid="";
								Ext.Viewport.setMasked({xtype: 'loadmask'});
								Ext.data.JsonP.request({
										url: './tools.php',
										callbackKey: 'callback',
										params: {
											action: "getuserid",
											mylogin: myreadings.user.get('username'),
											mypass: myreadings.user.get('password'),
											base: selectbox.getRecord().data.text,
											user: myreadings.user.get('currentuser')
										},
										success: function(result, request) {
											Ext.Viewport.setMasked(false);
											if(result.success==false) {
												alert(result.message);
											} else {
												myreadings.tempconf.current_userid=result.resultat;
											}
											//console.log("userid "+);
											//Relance la consultation de la base - type=all (et lance save)
											myreadings.app.getController('articlesControl').showArticles({
													pathbase: value,
													type: "all",
													debut: 5
											});
									
										},
										failure: function(result, request) {
											Ext.Viewport.setMasked(false);
											//Relance la consultation de la base - type=all (et lance save)
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
							
							myreadings.user.set('book_id', null);
							mycontroller.showViewerBt();
							
							//var form=this.getParent().getParent();
							//form.hide();
							myreadings.app.getController('articlesControl').activateCarousel();
						}
					}
				  }
    	    	    	  },
    	    	    	  {
				  itemId:"txtfilter",
				  padding: 10,
				  html: ""
			  },
    	    	    	  {
			  	  xtype: 'button',
				  itemId: 'btnofilter',
			  	  text: this.txtNoFilter,
				  hidden: true,
			  	  ui: 'action',
			  	  margin: '10 40 10 40'
			  },
    	    	    	  {
			  	  xtype: 'button',
				  itemId: 'btshowfilter',
			  	  text: this.txtFilterChoice,
			  	  ui: 'action',
			  	  margin: '10 40 10 40'
			  }
		    ]
	    },
    	    {
    	    	    xtype: 'fieldset',
    	    	    title: this.txtFieldsetFindText,
    	    	    defaults: {
    	    	    	    labelWidth: '35%'
    	    	    },
    	    	    items:[
    	    	    	  {
    	    	    	  	  xtype:'searchfield',
    	    	    	  	  name: 'find',
    	    	    	  	  autoCapitalize: false,
    	    	    	  	  placeHolder: this.txtSearchfieldFind
    	    	    	  },
    	    	    	  {
    	    	    	  	  xtype: 'selectfield',
    	    	    	  	  label: this.txtFindTextType,
    	    	    	  	  name: 'type',
    	    	    	  	  itemId: 'type',
    	    	    	  	  options: [
    	    	    	  	  {
    	    	    	  	  	  text: this.txtFindTextTypeTitle,
    	    	    	  	  	  value: 'title'
    	    	    	  	  }, {
    	    	    	  	  	  text: this.txtFindTextTypeAuthor,
    	    	    	  	  	  value: 'authorname'
    	    	    	  	  }, {
    	    	    	  	  	  text: this.txtFindTextTypeSerie,
    	    	    	  	  	  value: 'seriename'
    	    	    	  	  }, {
    	    	    	  	  	  text: this.txtFindTextTypeTag,
    	    	    	  	  	  value: 'tagname'
    	    	    	  	  }
    	    	    	  	  ]
			  },
			  {
			  	  xtype: 'togglefield',
			  	  label: this.txtFindTextToStart,
			  	  name: 'debut',
			  	  value: 0
			  },
			  {
			  	  xtype: 'button',
			  	  text: this.txtFindTextButton,
			  	  ui: 'action',
			  	  margin: '10 40 10 40',
			  	  handler: function(){
			  	  	  var form = Ext.getCmp('searchpanel');
			  	  	  var data = form.getValues();
			  	  	  //Ext.getCmp('searchview').hide();
			  	  	  myreadings.app.getController('articlesControl').showArticles(data);
			  	  	  myreadings.app.getController('articlesControl').activateCarousel();
			  	  }
			  }
		    ]},
		    {
		    	    xtype: 'fieldset',
		    	    title: this.txtFieldsetList,
		    	    items:[
		    	    {
		    	    	    xtype: 'button',
		    	    	    text: this.txtFieldsetListButton,
		    	    	    margin: '10 40 10 40',
		    	    	    handler: function(){
					    var mycontroller = myreadings.app.getController('articlesControl');
					    if(mycontroller.isList==false) {
						    mycontroller.loadliststore(Ext.getCmp('listviewTypelist').getValue(), '');
					    }
					    Ext.getCmp('searchview').setActiveItem(1);
		    	    	    }
		    	    }
		    	    ]
		    }
	    ]
	    );
    	    this.callParent(arguments);
    	}
	
});