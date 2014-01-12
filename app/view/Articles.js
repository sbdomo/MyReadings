Ext.define('myreadings.view.Articles', {
    extend: 'Ext.Component',
    xtype: 'articles',
    txtBy: "",
    config: {
        baseCls: 'articlescls',
        records: null
    },
    initialize: function() {
	//Pour l'instant seul l'affichage iPad est géré.
	this.setTpl(
    	new Ext.XTemplate(
            this.tplinit("ipad"),
	    {
		    pathCover: function(relativepath) {
			   return myreadings.app.getController('articlesControl').pathbase+relativepath+"/cover.jpg";
		    },
		     txtBy: function() {
		     	     return this.getId();
		     }
	    }
        )	    
        );
    	this.callParent(arguments);
    },
    tplinit: function(profil) {
	 //version iPad - iPad mini
	//Configuration de l'affichage d'un livre
    	var mytpl= '<div class="clsarticle" ref="{data.id}">'+
    			'<div class="fond">'+
    				'<img class="vignette" src="<tpl if="data.hasCover==\'1\'">{data.relativePath:this.pathCover}<tpl else>./resources/images/white.jpg</tpl>"/>'+
			'</div>'+
			'<div class="name">{data.title}<tpl if="data.pubDate&&data.pubDate!=\'0101\'"> ({data.pubDate})</tpl></div>'+
                        '<div class="txt"><tpl if="data.authorsName">'+this.txtBy+' {data.authorsName}</tpl></div>'+
                        '<tpl if="data.tagsName"><div class="txtpetit">{data.tagsName}</div></tpl>'+
                        '<tpl if="data.seriesName"><div class="txtpetititalique">{data.seriesName}<tpl if="data.seriesIndex"> ({data.seriesIndex})</tpl></div></tpl>'+
                    '</div>';
	//Mise en page des livres
        //mode portrait: 2 lignes et 4 livres par ligne
        //mode paysage: 3 lignes et 3 livres par ligne
	return '<tpl if="landscape">'+
                '<div class="row landscape">'+
                    '<tpl for="items">'+
                        '{% if (xindex < 5) { %}'+mytpl+
                        '{% } %}'+
                    '</tpl>'+
                '</div>'+
                '<div class="row landscape">'+
                    '<tpl for="items">'+
                        '{% if (xindex > 4 && xindex < 9) { %}'+mytpl+
                        '{% } %}'+
                    '</tpl>'+
                '</div>'+
            '</tpl>'+

            '<tpl if="!landscape">'+
                '<div class="row portrait">'+
                    '<tpl for="items">'+
                        '{% if (xindex < 4) { %}'+mytpl+
                        '{% } %}'+
                    '</tpl>'+
                '</div>'+
                '<div class="row portrait">'+
                    '<tpl for="items">'+
                        '{% if (xindex > 3 && xindex < 7) { %}'+mytpl+
                       '{% } %}'+
                    '</tpl>'+
                '</div>'+
                '<div class="row portrait">'+
                    '<tpl for="items">'+
                        '{% if (xindex > 6 && xindex <10) { %}'+mytpl+
                        '{% } %}'+
                    '</tpl>'+
                '</div>'+
            '</tpl>'
    },
    updateRecords: function(newRecords) {
        this.setData({
            items: newRecords.items,
            landscape: Ext.Viewport.getOrientation() == "landscape"
        });
    }
});
