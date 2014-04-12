Ext.define('myreadings.view.orderview', {
	extend: 'Ext.Panel',
	xtype: 'orderview',
	txtTitle: "",
	txtOrderRecent: "",
	txtOrderPubdate: "",
	txtOrderTitle: "",
	txtOrderSerie: "",
	txtAll: "",
	txtNotRead: "",
	txtRead: "",
	txtSerie: "",

	config: {
		width: 290,
		height: 220,
		// We give it a left and top property to make it floating by default
		left: 0,
		top: 0,
		// Make it modal so you can click the mask to hide the overlay
		modal: true,
		hideOnMaskTap: true
	},
	initialize: function() {
	  this.setItems([
		{
                    docked: 'top',
                    xtype: 'toolbar',
		    itemId:"titlepanel",
                    title: this.txtTitle
                },
		{
    	    	    xtype: 'selectfield',
    	    	    name: 'order',
		    disabled: true, //Pour ne pas activer l'événement change lors de l'initialisation
    	    	    //dans articlesControl: flex: 1 si iphone, width: 230 sinon
    	    	    //width: 230,
    	    	    margin: 5,
    	    	    id: 'order',
    	    	    itemId: 'order',
    	    	    options: [{
    	    	    	text: this.txtOrderRecent,
    	    	    	value: 'recent'
    	    	    }, {
    	    	    	text: this.txtOrderPubdate,
    	    	    	value: 'pubdate'
    	    	    }, {
    	    	    	text: this.txtOrderTitle,
    	    	    	value: 'title'
    	    	    }, {
    	    	    	text: this.txtOrderSerie,
    	    	    	value: 'serie'
    	    	    }
    	    	    ],
    	    	    listeners:
    	    	    {
    	    	    	change:function(selectbox,value,oldvalue){
				//Test si enabled, ne fait rien sinon (sert lors de l'initialisation)
				if(!this.getDisabled()) {
    	    	    		myreadings.app.getController('articlesControl').showArticles({
    	    	    			order: value,
    	    	    			debut: 4
    	    	    		});
				}
    	    	    	}
    	    	    }
    	    	},
    	    	{
			xtype: 'togglefield',
			itemId: 'seriegroup',
			label: this.txtSerie,
			labelWidth: '70%',
			disabled: true, //Pour ne pas activer l'événement change lors de l'initialisation
			listeners: 
			{
			 change:function(selectbox,newValue,oldvalue){
			   //Test si enabled, ne fait rien sinon (sert lors de l'initialisation)
			   if(!this.getDisabled()) {
			 	 myreadings.app.getController('articlesControl').showArticles({
    	    	    			gpseries: newValue,
    	    	    			debut: 7
    	    	    		});
				//var pageTurnDragThreshold = this.getParent().down('#page_turn_drag_threshold');
				
				//if (newValue == 1) {
				//	pageTurnDragThreshold.enable();
				//} else {
				//	pageTurnDragThreshold.disable();
				//}
			   }
			 }
			}
		},
    	    	{
    	    	    xtype: 'selectfield',
		    disabled: true, //Pour ne pas activer l'événement change lors de l'initialisation
    	    	    //dans articlesControl: flex: 1 si iphone, width: 230 sinon
    	    	    //width: 230,
    	    	    margin: 5,
    	    	    itemId: 'showIfRead',
    	    	    options: [{
    	    	    	text: this.txtAll,
    	    	    	value: 'all'
    	    	    }, {
    	    	    	text: this.txtNotRead,
    	    	    	value: 'notread'
    	    	    }, {
    	    	    	text: this.txtRead,
    	    	    	value: 'read'
    	    	    }
    	    	    ],
    	    	    listeners:
    	    	    {
    	    	    	change:function(selectbox,value,oldvalue){
				//Test si enabled, ne fait rien sinon (sert lors de l'initialisation)
				if(!this.getDisabled()) {
    	    	    		myreadings.app.getController('articlesControl').showArticles({
    	    	    			showifread: value,
    	    	    			debut: 8
    	    	    		});
				}
    	    	    	}
    	    	    }
    	    	}
	  ]);
		this.callParent(arguments);
	}
});