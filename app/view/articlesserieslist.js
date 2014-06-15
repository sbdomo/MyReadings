Ext.define('myreadings.view.articlesserieslist', {
    extend: 'Ext.carousel.Infinite',
    xtype: 'articlesserieslist',
    requires: ['myreadings.view.Articles'],
    config: {
        //title:'My Readings Two',
        hidden: true,
    	direction: 'horizontal',
        innerItemConfig: {
            xclass: 'myreadings.view.Articles'
        },

        count: 'auto',
        offsetLimit: 50,
        store: null,
	cls: 'seriescolor',

        animation: {
            duration: 650
        },

        listeners: {
            activeitemchange: 'onActiveItemChange',
            itemindexchange: 'onItemIndexChange'
        }
    },

    initialize: function() {
	//console.log("ArticlesList init");
	this.setItems(
        [
	{
    	    xtype: 'titlebar',
    	    itemId: 'titlebarserie',
    	    docked: 'top',
    	    title: 'My readings',
    	    items: [
	    {
    	    	    ui: 'decline',
	    	    align: 'left',
	    	    iconCls: 'delete',
	    	    iconMask: true,
	    	    handler: function(){
	    	    	    var form = this.getParent().getParent().getParent();
	    	    	    form.hide();
	    	    }
    	    },
	    {
    	    	    iconCls: 'eye',
    	    	    itemId: 'viewer',
    	    	    iconMask: true
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
    	    myreadings.app.getController('articlesControl').onTapCarousel(e, this);
    },

    applyCount: function(count) {
	//console.log("applyCount");
	var mycontroller = myreadings.app.getController('articlesControl');
        if (count == "auto") {
            //count = 9;
	    count = mycontroller.countPortrait;
            if (Ext.Viewport.getOrientation() == "landscape") {
                //count = 8;
		count = mycontroller.countLandscape;
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