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
    	    	    	   	   iconCls: 'delete',
    	    	    	   	   iconMask: true,
    	    	    	   	   handler: function(){
    	    	    	   	   	   Ext.getCmp('searchview').hide();
    	    	    	   	   }
    	    	    	   }
    	    	    ]
    	    },
    	    {
    	    	    xtype: 'fieldset',
    	    	    title: this.txtFieldsetFindText,
    	    	    //defaults: {
    	    	    //	    labelWidth: '90px'
    	    	    //},
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
			  	  	  Ext.getCmp('searchview').hide();
			  	  	  myreadings.app.getController('articlesControl').showArticles(data);
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