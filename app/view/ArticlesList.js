Ext.define('myreadings.view.ArticlesList', {
    extend: 'Ext.carousel.Infinite',
    xtype: 'articleslist',
    requires: ['myreadings.view.Articles'],
    txtOrderRecent: "",
    txtOrderPubdate: "",
    txtOrderTitle: "",
    txtOrderSerie: "",
    config: {
        title:'My Readings',
    	direction: 'horizontal',
        innerItemConfig: {
            xclass: 'myreadings.view.Articles'
        },

        count: 'auto',
        offsetLimit: 50,
        store: null,

        animation: {
            duration: 650
        },

        listeners: {
            activeitemchange: 'onActiveItemChange',
            itemindexchange: 'onItemIndexChange'
        }
    },

    initialize: function() {
	this.setItems(
        [
	{
    	    xtype: 'titlebar',
    	    name: 'maintitlebar',
    	    id:'maintitlebar',
    	    docked: 'top',
    	    title: 'My Readings',
    	    items: [
    	    {
    	    	    iconCls: 'search',
    	    	    name: 'searchbutton',
    	    	    id:'searchbutton',
    	    	    iconMask: true,
    	    	    align: 'left'
    	    },
    	    {
    	    	    xtype: 'selectfield',
    	    	    //label: 'Tri',
    	    	    name: 'order',
    	    	    width: 230,
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
    	    	    		myreadings.app.getController('articlesControl').showArticles({
    	    	    			order: value,
    	    	    			debut: 4
    	    	    		});
    	    	    	}
    	    	    }
    	    },
    	    {
    	    	   iconCls: 'settings',
    	    	   name: 'configbutton',
    	    	   id:'configbutton',
    	    	   iconMask: true,
    	    	   align: 'right'
    	    }
    	    ]
	}
	]
	);
        Ext.Viewport.on('orientationchange', this.onOrientationChange, this);
        this.element.on({
            scope: this,
            tap: 'onTap'
        });
    },

    onTap: function(e) {
        var element = Ext.get(e.target),
            store = this.getStore(),
            idarticle;
            //console.log("id:"+element.id);
        if(element.hasCls('vignette')||element.hasCls('fond')||element.hasCls('name')||element.hasCls('txtpetit')) {
        	if (!element.hasCls('clsarticle')) {
        		element = Ext.get(e.target).parent('.clsarticle');
        	}
        	idarticle = Math.abs(element.getAttribute('ref'));
        	record = store.getById(idarticle);
        	if (record) {
        		//console.log("fireEvent itemtap");
        		this.fireEvent('itemtap', this, record);
        	}
        } else {
        	console.log('no tap');
        }
    },

    applyCount: function(count) {
        if (count == "auto") {
            count = 9;
            if (Ext.Viewport.getOrientation() == "landscape") {
                count = 8;
            }
        }

        return count;
    },

    onOrientationChange: function(vewport, orientation) {
        var oldCount = this.getCount(),
            newCount = this.applyCount(this.config.count);

        if (oldCount != newCount) {
            this.setCount(newCount);
            this.refreshItems();
        }
    },

    updateStore: function(newStore) {
        var me = this;

        if (newStore.isLoading()) {
            me.setMasked({
                xtype: 'loadmask'
            });

            newStore.on('load', function() {
                me.setMasked(false);

                me.updateStore(newStore);
            }, me, {
                single: true
            });
        } else {
            me.reset();
        }
    },

    onActiveItemChange: function(carousel, newItem, oldItem) {
        var index = carousel.getActiveIndex(),
            count = this.getCount(),
            offsetLimit = this.getOffsetLimit(),
            store = this.getStore(),
            storeCount = store.getCount();

        if (storeCount - (count * index) < offsetLimit && !store.isLoading()) {
            store.nextPage();
        }
    },

    onItemIndexChange: function(me, item, index) {
        var store = this.getStore(),
            count = this.getCount(),
            records, startIndex, endIndex,
            i;

        if (!store) {
            return;
        }

        startIndex = index * count;

        if (count > 1) {
            endIndex = startIndex + count;
        } else {
            endIndex = startIndex;
        }

        records = store.queryBy(function(record, id) {
            i = store.indexOf(record);
            if (i >= startIndex && i <= endIndex) {
                return record;
            }
        }, this);

        item.setRecords(records);
    }
});