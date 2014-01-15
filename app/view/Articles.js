Ext.define('myreadings.view.Articles', {
    extend: 'Ext.Component',
    xtype: 'articles',
    txtBy: "",
    config: {
        baseCls: 'articlescls',
        records: null
    },
    initialize: function() {
	this.setTpl(
    	new Ext.XTemplate(
            this.tplinit(myreadings.app.getController('articlesControl').profil),
	    {
		    pathCover: function(relativepath) {
			   return myreadings.app.getController('articlesControl').pathbase+relativepath+"/cover.jpg";
		    }
	    }
        )
        );
    	this.callParent(arguments);
    },
    tplinit: function(profil) {
    	//version iPad - iPad mini
    	//Configuration de l'affichage d'un livre
    	var mytplipad= '<div class="clsarticle" ref="{data.id}"><div class="tablet">'+
    			'<div class="fond">'+
    				'<img class="vignette" src="<tpl if="data.hasCover==\'1\'">{data.relativePath:this.pathCover}<tpl else>./resources/images/white.jpg</tpl>"/>'+
			'</div>'+
			'<div class="name">{data.title}<tpl if="data.pubDate&&data.pubDate!=\'0101\'"> ({data.pubDate})</tpl></div>'+
                        '<div class="txt"><tpl if="data.authorsName">'+this.txtBy+' {data.authorsName}</tpl></div>'+
                        '<tpl if="data.tagsName"><div class="txtpetit">{data.tagsName}</div></tpl>'+
                        '<tpl if="data.seriesName"><div class="txtpetititalique">{data.seriesName}<tpl if="data.seriesIndex"> ({data.seriesIndex})</tpl></div></tpl>'+
                    '</div></div>';
	//Mise en page des livres
        //mode portrait: 2 lignes et 4 livres par ligne
        //mode paysage: 3 lignes et 3 livres par ligne
	var tplipad = '<tpl if="landscape">'+
                '<div class="row landscape">'+
                    '<tpl for="items">'+
                        '{% if (xindex < 5) { %}'+mytplipad+
                        '{% } %}'+
                    '</tpl>'+
                '</div>'+
                '<div class="row landscape">'+
                    '<tpl for="items">'+
                        '{% if (xindex > 4 && xindex < 9) { %}'+mytplipad+
                        '{% } %}'+
                    '</tpl>'+
                '</div>'+
            '</tpl>'+

            '<tpl if="!landscape">'+
                '<div class="row portrait">'+
                    '<tpl for="items">'+
                        '{% if (xindex < 4) { %}'+mytplipad+
                        '{% } %}'+
                    '</tpl>'+
                '</div>'+
                '<div class="row portrait">'+
                    '<tpl for="items">'+
                        '{% if (xindex > 3 && xindex < 7) { %}'+mytplipad+
                       '{% } %}'+
                    '</tpl>'+
                '</div>'+
                '<div class="row portrait">'+
                    '<tpl for="items">'+
                        '{% if (xindex > 6 && xindex <10) { %}'+mytplipad+
                        '{% } %}'+
                    '</tpl>'+
                '</div>'+
            '</tpl>';
	    
	    var tplgtab = '<tpl if="landscape">'+
                '<div class="row landscape">'+
                    '<tpl for="items">'+
                        '{% if (xindex < 5) { %}'+mytplipad+
                        '{% } %}'+
                    '</tpl>'+
                '</div>'+

            '</tpl>'+

            '<tpl if="!landscape">'+
                '<div class="row portrait">'+
                    '<tpl for="items">'+
                        '{% if (xindex < 4) { %}'+mytplipad+
                        '{% } %}'+
                    '</tpl>'+
                '</div>'+
                '<div class="row portrait">'+
                    '<tpl for="items">'+
                        '{% if (xindex > 3 && xindex < 7) { %}'+mytplipad+
                       '{% } %}'+
                    '</tpl>'+
                '</div>'+
                '<div class="row portrait">'+
                    '<tpl for="items">'+
                        '{% if (xindex > 6 && xindex <10) { %}'+mytplipad+
                        '{% } %}'+
                    '</tpl>'+
                '</div>'+
            '</tpl>';
	    
            //avec retour à la ligne pour title (avec tapclass), sans pubDate, sans txtBy
	    var mytpliphone= '<div class="clsarticle" ref="{data.id}"><div class="iphone">'+
    			'<div class="fond">'+
    				'<img class="vignette" src="<tpl if="data.hasCover==\'1\'">{data.relativePath:this.pathCover}<tpl else>./resources/images/white.jpg</tpl>"/>'+
			'</div>'+
			'<div class="name"><span class="tapclass">{data.title}</span></div>'+
                        '<div class="txt"><tpl if="data.authorsName">{data.authorsName}</tpl></div>'+
                        '<tpl if="data.tagsName"><div class="txtpetit">{data.tagsName}</div></tpl>'+
                        '<tpl if="data.seriesName"><div class="txtpetititalique">{data.seriesName}<tpl if="data.seriesIndex"> ({data.seriesIndex})</tpl></div></tpl>'+
                    '</div></div>';
		    //sans le retour à la ligne, sans tagsName
	var mytpliphone2= '<div class="clsarticle" ref="{data.id}"><div class="iphone">'+
    			'<div class="fond">'+
    				'<img class="vignette" src="<tpl if="data.hasCover==\'1\'">{data.relativePath:this.pathCover}<tpl else>./resources/images/white.jpg</tpl>"/>'+
			'</div>'+
			'<div class="name">{data.title}</div>'+
                        '<div class="txt"><tpl if="data.authorsName">{data.authorsName}</tpl></div>'+
                        '<tpl if="data.seriesName"><div class="txtpetititalique">{data.seriesName}<tpl if="data.seriesIndex"> ({data.seriesIndex})</tpl></div></tpl>'+
                    '</div></div>';

	    
	    var tpliphone = '<tpl if="landscape">'+
                '<div class="row landscape">'+
                    '<tpl for="items">'+
                        '{% if (xindex < 5) { %}'+mytpliphone+
                        '{% } %}'+
                    '</tpl>'+
                '</div>'+

            '</tpl>'+

            '<tpl if="!landscape">'+
                '<div class="row portrait">'+
                    '<tpl for="items">'+
                        '{% if (xindex < 4) { %}'+mytpliphone2+
                        '{% } %}'+
                    '</tpl>'+
                '</div>'+
                '<div class="row portrait">'+
                    '<tpl for="items">'+
                        '{% if (xindex > 3 && xindex < 7) { %}'+mytpliphone2+
                       '{% } %}'+
                    '</tpl>'+
                '</div>'+
            '</tpl>';
	    
	    
	    
	    var mycontroller = myreadings.app.getController('articlesControl');
	    if(profil=="gtab") {
		    mycontroller.countPortrait=9;
		    mycontroller.countLandscape=4;
		    return tplgtab;
	    } else if(profil=="iphone") {
		    mycontroller.countPortrait=6;
		    mycontroller.countLandscape=4;
		    return tpliphone;

	    } else {
		    mycontroller.countPortrait=9;
		    mycontroller.countLandscape=8;
		    return tplipad;
	    }
    },
    updateRecords: function(newRecords) {
        this.setData({
            items: newRecords.items,
            landscape: Ext.Viewport.getOrientation() == "landscape"
        });
    }
});
