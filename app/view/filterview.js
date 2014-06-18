Ext.define("myreadings.view.filterview",{
    extend: "Ext.dataview.List",
    xtype: "filterview",
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
	    store: "filterstore",
	    fullscreen: true,
	    infinite: true,
	    style: 'background-image:none; background-color: white;',

	    itemTpl: [
            '{name} (<tpl if="read!=null&&read!=0">{[values.count-values.read]}/{count}<tpl else>{count}</tpl>)'
	    ],
	    listeners: {
		    itemtap: function(view, index, target, record, event){
			    myreadings.app.getController('articlesControl').changefilter(record.get('id'), this.getStore().getProxy().getExtraParams()['list'], record.get('name'), this.down('#typelist').getRecord().data.text);
			    this.hide();
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
		    itemId: 'bthide',
		    iconMask: true
	    };
	    var typeliste = {
		    xtype: 'selectfield',
		    itemId: 'typelist',
		    options: [{
			    text: this.txtTag,
			    value: 'tag'
		    }, {
			    text: this.txtAuthor,
			    value: 'author'
		    }, {
			    text: this.txtSerie,
			    value: 'serie'
		    }
		    ]
	    };
	    var searchfld =  {
		    xtype: 'searchfield',
		    itemId: 'searchfield',
		    placeHolder: this.txtSearch,
		    flex: 1
	    };
	    var searchbt = {
		    xtype: "button",
		    iconCls: 'search',
		    itemId: 'btsearch',
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