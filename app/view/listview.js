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
	    //items:,
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
    	    this.setItems(
    	    [
	    {
		    xtype:'toolbar',
		    docked: 'top',
		    //ui: "searchbar",
		    //title: 'Liste des auteurs',
		    items: [
		    {
			    ui: 'decline',
			    //align: 'left',
			    iconCls: 'delete',
			    iconMask: true,
			    handler: function(){
				    Ext.getCmp('searchview').hide();
			    }
		    },
		    {
			    //ui: 'decline',
			    //align: 'left',
			    iconCls: 'arrow_left',
			    iconMask: true,
			    handler: function(){
				    Ext.getCmp('searchview').setActiveItem(0);
			    }
		    },
		    {
			    xtype: 'selectfield',
			    //label: 'la liste',
			    name: 'typelist',
			    itemId: 'typelist',
			    id:'listviewTypelist',
			    width: 150,
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
			    ],
			    listeners:
			    {
			    change:function(selectbox,value,oldvalue){
    	    	    		console.log("typelist change");
				myreadings.app.getController('articlesControl').loadliststore(value, this.getParent().down('#searchfield').getValue());
				
			    }
    	    	    }
		    },
		    {
			    xtype: 'searchfield',
			    itemId: 'searchfield',
			    id:'listviewSearchfield',
			    placeHolder: this.txtSearch,
			    flex: 1,
			    //width: 300,
			    listeners: {
				    action: function(searchfield, e) {
					    console.log("searchfield action");
					    myreadings.app.getController('articlesControl').loadliststore(this.getParent().down('#typelist').getValue(), searchfield.getValue());
				//	    myreadings.app.getController('articlesControl').loadliststore('', searchfield.getValue());
				    }
			    }
                    },
		    {
			    xtype: "button",
			    iconCls: 'search',
			    iconMask: true,
			    //text: "Search",
			    handler: function(){
				    myreadings.app.getController('articlesControl').loadliststore(this.getParent().down('#typelist').getValue(), this.getParent().down('#searchfield').getValue());
			    }
			    //scope: this
		    }
		    ]
	    }
	    ]    
    	    );
    	    this.callParent(arguments);
    }
});