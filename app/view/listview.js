Ext.define("myreadings.view.listview",{
    extend: "Ext.dataview.List",
    xtype: "listview",
    id:'listview',
    requires: ["Ext.plugin.ListPaging"],
    txtAuthor:"",
    txtSerie:"",
    txtTag:"",
    txtSearch:"",
    txtLoadMore:"",
    txtnoMoreRecords:"",
    txtEmpty:"",
    config: {
	    onItemDisclosure: true,
	    store: "liststore",
	    fullscreen: true,
	    infinite: true,
	    style: 'background-image:none; background-color: white;',

	    itemTpl: [
            '{name} ({count})'
	    ],
	    listeners: {
		    disclose: function(list, record) {
			    Ext.getCmp('searchview').hide();
			    myreadings.app.getController('articlesControl').showArticles({
			    	type: this.getStore().getProxy().getExtraParams()['list'],
				idlist: record.get('id'),
				debut: 3
			    });
		    }
	    }
    },
    initialize: function() {
    	    this.setPlugins( [
	    {
		    xclass: "Ext.plugin.ListPaging",
		    autoPaging: true,
		    loadMoreText: this.txtLoadMore,
		    noMoreRecordsText: this.txtnoMoreRecords
	    }
	    ]),
	    this.setEmptyText(this.txtEmpty);
	    
	    var decline = {
		    ui: 'decline',
		    iconCls: 'delete',
		    iconMask: true,
		    handler: function(){
			    Ext.getCmp('searchview').hide();
		    }
	    };
	    var retour = {
		    iconCls: 'arrow_left',
		    iconMask: true,
		    handler: function(){
			    Ext.getCmp('searchview').setActiveItem(0);
		    }
	    };
	    var typeliste = {
		    xtype: 'selectfield',
		    name: 'typelist',
		    itemId: 'typelist',
		    id:'listviewTypelist',
		    //dans articlesControl: flex: 1 si iphone, width: 150 sinon
		    //width: 150,
		    itemId: 'typelist',
		    options: [{
			    text: this.txtAuthor,
			    value: 'author'
		    }, {
			    text: this.txtSerie,
			    value: 'serie'
		    }, {
			    text: this.txtTag,
			    value: 'tag'
		    }
		    ]
	    };
	    var searchfld =  {
		    xtype: 'searchfield',
		    name: 'listviewSearchfield',
		    itemId: 'searchfield',
		    id:'listviewSearchfield',
		    placeHolder: this.txtSearch,
		    flex: 1
	    };
	    var searchbt = {
		    xtype: "button",
		    iconCls: 'search',
		    name: 'btsearch',
		    iconMask: true
	    };
	    
	    if(myreadings.app.getController('articlesControl').profil=="iphone") {
	    this.setItems(
    	    [
	    {
		    xtype:'toolbar',
		    docked: 'top',
		    ui: "flat",
		    style: "border-style:none;",
		    items: [
		    decline,
		    retour,
		    typeliste
		    ]
	    },
	    {
		    xtype:'toolbar',
		    docked: 'top',
		    //style: "border-style:none;",
		    ui: "flat",
		    items: [
		    searchfld,
		    searchbt
		    ]
	    }
	    ]
    	    );
	    } else {
    	    this.setItems(
    	    [
	    {
		    xtype:'toolbar',
		    docked: 'top',
		    items: [
		    decline,
		    retour,
		    typeliste,
		    searchfld,
		    searchbt
		    ]
	    }
	    ]
    	    );
	    }
    	    this.callParent(arguments);
    }
});