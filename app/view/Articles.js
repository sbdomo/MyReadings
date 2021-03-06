Ext.define('myreadings.view.Articles', {
    extend: 'Ext.Component',
    xtype: 'articles',
    txtBy: "",
    config: {
        baseCls: 'articlescls',
        records: null
    },
    initialize: function() {
	//console.log("initialize");
	this.setTpl(
    	new Ext.XTemplate(
            this.tplinit(myreadings.app.getController('articlesControl').profil),
	    {
		    pathCover: function(relativepath, id) {
			    if(myreadings.tempconf.fetchmode=='direct') {
				    return myreadings.user.get('pathbase')+relativepath+"/cover.jpg";
			    } else {
				    var params = {
					    path: relativepath,
					    id: id,
					    base: myreadings.tempconf.txtbase,
					    mylogin: myreadings.user.get('username'),
					    mypass: myreadings.user.get('password')
				    };
				    var paramsencode = Ext.urlEncode(params);
				    return "./cover.php?"+paramsencode;
			    }
			   
		    }
	    }
        )
        );
    	this.callParent(arguments);
    },
    tplinit: function(profil) {
    	var showcust=myreadings.conf.get('showcust');
    	//version iPad - iPad mini
    	//Configuration de l'affichage d'un livre
    	var mytplipad= '<div class="clsarticle" ref="{data.id}"><div class="tablet">'+
    			'<div class="fond<tpl if="data.nbgp&&data.nbgp!=1">_grp</tpl>">'+
    				'<tpl if="data.nbgp&&data.nbgp!=1"><img class="vignette" src="./resources/images/empty.png"/></tpl>'+
    				'<img class="vignette<tpl if="data.nbgp&&data.nbgp!=1">_grp</tpl>" src="<tpl if="data.hasCover==\'1\'">{[this.pathCover(values.data.relativePath, values.data.id)]}<tpl else>./resources/images/white.jpg</tpl>"/>'+
    				'<div class="fbookmark'+
					'<tpl if="data.nbgp==null||data.nbgp==1">'+
						'<tpl if="data.bookmark==\'1\'">1'+
						'<tpl elseif="data.bookmark==\'-1\'">2'+
						'</tpl>'+
					'<tpl else>'+
						'<tpl if="data.reading!=null&&data.reading!=\'0\'">1'+
						'<tpl elseif="data.nbgp==data.read">2'+
						'</tpl>'+
					'</tpl>"> '+
				'</div>'+
				'<tpl if="data.nbgp&&data.nbgp!=1"><div class="nbgroup">{data.nbgp}</div></tpl>'+
    			'</div>'+
			'<tpl if="data.nbgp==null||data.nbgp==1">'+
				'<div class="title">{data.title}<tpl if="data.pubDate&&data.pubDate!=\'0101\'"> ({data.pubDate})</tpl></div>'+
			'</tpl>'+
                        '<div class="author"><tpl if="data.authorsName">'+this.txtBy+' {data.authorsName}</tpl></div>'+
                        '<tpl if="data.tagsName"><div class="tags">{data.tagsName}</div></tpl>'+
                        '<tpl if="data.seriesName"><div class="<tpl if="data.nbgp==null||data.nbgp==1">series<tpl else>seriesbig</tpl>">{data.seriesName}'+
                        '<tpl if="(data.nbgp==null||data.nbgp==1)&&data.seriesIndex"> ({data.seriesIndex})</tpl></div></tpl>'+
			'<tpl if="data.cust1value"><div class="custom">{data.cust1value}<tpl if="data.cust1extra"> ({data.cust1extra})</tpl></div></tpl>'+
			'</div></div>';
	
	//avec retour à la ligne pour title et seriesName (avec tapclass), sans pubDate, sans txtBy
	var mytpliphone= '<div class="clsarticle" ref="{data.id}"><div class="iphone">'+
    			'<div class="fond<tpl if="data.nbgp&&data.nbgp!=1">_grp</tpl>">'+
    				'<tpl if="data.nbgp&&data.nbgp!=1"><img class="vignette" src="./resources/images/empty.png"/></tpl>'+
    				'<img class="vignette<tpl if="data.nbgp&&data.nbgp!=1">_grp</tpl>" src="<tpl if="data.hasCover==\'1\'">{[this.pathCover(values.data.relativePath, values.data.id)]}<tpl else>./resources/images/white.jpg</tpl>"/>'+
   				'<div class="fbookmark'+
					'<tpl if="data.nbgp==null||data.nbgp==1">'+
						'<tpl if="data.bookmark==\'1\'">1'+
						'<tpl elseif="data.bookmark==\'-1\'">2'+
						'</tpl>'+
					'<tpl else>'+
						'<tpl if="data.reading!=null&&data.reading!=\'0\'">1'+
						'<tpl elseif="data.nbgp==data.read">2'+
						'</tpl>'+
					'</tpl>"> '+
					'</div>'+
				'<tpl if="data.nbgp&&data.nbgp!=1"><div class="nbgroup">{data.nbgp}</div></tpl>'+
			'</div>'+
			'<tpl if="data.nbgp==null||data.nbgp==1">'+
				'<div class="title"><span class="tapclass">{data.title}</span></div>'+
			'</tpl>'+
                        '<div class="author"><tpl if="data.authorsName">{data.authorsName}</tpl></div>'+
                        '<tpl if="data.tagsName"><div class="tags">{data.tagsName}</div></tpl>'+
                        '<tpl if="data.seriesName"><div class="<tpl if="data.nbgp==null||data.nbgp==1">series<tpl else>seriesbig</tpl>"><span class="tapclass">{data.seriesName}'+
                        '<tpl if="(data.nbgp==null||data.nbgp==1)&&data.seriesIndex"> ({data.seriesIndex})</tpl></span></div></tpl>'+
			'<tpl if="data.cust1value"><div class="custom">{data.cust1value}<tpl if="data.cust1extra"> ({data.cust1extra})</tpl></div></tpl>'+
			'</div></div>';
	//sans le retour à la ligne, sans tagsName
	var mytpliphone2= '<div class="clsarticle" ref="{data.id}"><div class="iphone">'+
    			'<div class="fond<tpl if="data.nbgp&&data.nbgp!=1">_grp</tpl>">'+
    				'<tpl if="data.nbgp&&data.nbgp!=1"><img class="vignette" src="./resources/images/empty.png"/></tpl>'+
    				'<img class="vignette<tpl if="data.nbgp&&data.nbgp!=1">_grp</tpl>" src="<tpl if="data.hasCover==\'1\'">{[this.pathCover(values.data.relativePath, values.data.id)]}<tpl else>./resources/images/white.jpg</tpl>"/>'+
   				'<div class="fbookmark'+
					'<tpl if="data.nbgp==null||data.nbgp==1">'+
						'<tpl if="data.bookmark==\'1\'">1'+
						'<tpl elseif="data.bookmark==\'-1\'">2'+
						'</tpl>'+
					'<tpl else>'+
						'<tpl if="data.reading!=null&&data.reading!=\'0\'">1'+
						'<tpl elseif="data.nbgp==data.read">2'+
						'</tpl>'+
					'</tpl>"> '+
					'</div>'+
				'<tpl if="data.nbgp&&data.nbgp!=1"><div class="nbgroup">{data.nbgp}</div></tpl>'+
			'</div>'+
			'<tpl if="data.nbgp==null||data.nbgp==1">'+
				'<div class="title">{data.title}</div>'+
			'</tpl>'+
                        '<div class="author"><tpl if="data.authorsName">{data.authorsName}</tpl></div>'+
                        '<tpl if="data.seriesName"><div class="<tpl if="data.nbgp==null||data.nbgp==1">series<tpl else>seriesbig</tpl>">{data.seriesName}'+
                        '<tpl if="(data.nbgp==null||data.nbgp==1)&&data.seriesIndex"> ({data.seriesIndex})</tpl></div></tpl>'+
			'<tpl if="data.cust1value"><div class="custom">{data.cust1value}<tpl if="data.cust1extra"> ({data.cust1extra})</tpl></div></tpl>'+
			'</div></div>';
	
	//version galaxy tab2 (images plus petite en mode paysage car en 16/9, idem à l'ipad sinon.
	//Mode paysage
	var mytplgtab1= '<div class="clsarticle" ref="{data.id}"><div class="gtab1">'+
    			'<div class="fond<tpl if="data.nbgp&&data.nbgp!=1">_grp</tpl>">'+
    				'<tpl if="data.nbgp&&data.nbgp!=1"><img class="vignette" src="./resources/images/empty.png"/></tpl>'+
    				'<img class="vignette<tpl if="data.nbgp&&data.nbgp!=1">_grp</tpl>" src="<tpl if="data.hasCover==\'1\'">{[this.pathCover(values.data.relativePath, values.data.id)]}<tpl else>./resources/images/white.jpg</tpl>"/>'+
   				'<div class="fbookmark'+
					'<tpl if="data.nbgp==null||data.nbgp==1">'+
						'<tpl if="data.bookmark==\'1\'">1'+
						'<tpl elseif="data.bookmark==\'-1\'">2'+
						'</tpl>'+
					'<tpl else>'+
						'<tpl if="data.reading!=null&&data.reading!=\'0\'">1'+
						'<tpl elseif="data.nbgp==data.read">2'+
						'</tpl>'+
					'</tpl>"> '+
					'</div>'+
				'<tpl if="data.nbgp&&data.nbgp!=1"><div class="nbgroup">{data.nbgp}</div></tpl>'+
			'</div>'+
			'<tpl if="data.nbgp==null||data.nbgp==1">'+
				'<div class="title">{data.title}<tpl if="data.pubDate&&data.pubDate!=\'0101\'"> ({data.pubDate})</tpl></div>'+
			'</tpl>'+
                        '<div class="author"><tpl if="data.authorsName">'+this.txtBy+' {data.authorsName}</tpl></div>'+
                        '<tpl if="data.tagsName"><div class="tags">{data.tagsName}</div></tpl>'+
                        '<tpl if="data.seriesName"><div class="<tpl if="data.nbgp==null||data.nbgp==1">series<tpl else>seriesbig</tpl>">{data.seriesName}'+
                        '<tpl if="(data.nbgp==null||data.nbgp==1)&&data.seriesIndex"> ({data.seriesIndex})</tpl></div></tpl>'+
			'<tpl if="data.cust1value"><div class="custom">{data.cust1value}<tpl if="data.cust1extra"> ({data.cust1extra})</tpl></div></tpl>'+
			'</div></div>';
	//Mode portrait
	var mytplgtab2='<div class="clsarticle" ref="{data.id}"><div class="gtab2">'+
    			'<div class="fond<tpl if="data.nbgp&&data.nbgp!=1">_grp</tpl>">'+
    				'<tpl if="data.nbgp&&data.nbgp!=1"><img class="vignette" src="./resources/images/empty.png"/></tpl>'+
    				'<img class="vignette<tpl if="data.nbgp&&data.nbgp!=1">_grp</tpl>" src="<tpl if="data.hasCover==\'1\'">{[this.pathCover(values.data.relativePath, values.data.id)]}<tpl else>./resources/images/white.jpg</tpl>"/>'+
    				'<div class="fbookmark'+
					'<tpl if="data.nbgp==null||data.nbgp==1">'+
						'<tpl if="data.bookmark==\'1\'">1'+
						'<tpl elseif="data.bookmark==\'-1\'">2'+
						'</tpl>'+
					'<tpl else>'+
						'<tpl if="data.reading!=null&&data.reading!=\'0\'">1'+
						'<tpl elseif="data.nbgp==data.read">2'+
						'</tpl>'+
					'</tpl>"> '+
				'</div>'+
				'<tpl if="data.nbgp&&data.nbgp!=1"><div class="nbgroup">{data.nbgp}</div></tpl>'+
    			'</div>'+
			'<tpl if="data.nbgp==null||data.nbgp==1">'+
				'<div class="title">{data.title}<tpl if="data.pubDate&&data.pubDate!=\'0101\'"> ({data.pubDate})</tpl></div>'+
			'</tpl>'+
                        '<div class="author"><tpl if="data.authorsName">'+this.txtBy+' {data.authorsName}</tpl></div>'+
                        '<tpl if="data.tagsName"><div class="tags">{data.tagsName}</div></tpl>'+
                        '<tpl if="data.seriesName"><div class="<tpl if="data.nbgp==null||data.nbgp==1">series<tpl else>seriesbig</tpl>">{data.seriesName}'+
                        '<tpl if="(data.nbgp==null||data.nbgp==1)&&data.seriesIndex"> ({data.seriesIndex})</tpl></div></tpl>'+
			'<tpl if="data.cust1value"><div class="custom">{data.cust1value}<tpl if="data.cust1extra"> ({data.cust1extra})</tpl></div></tpl>'+
			'</div></div>';
		    
	    var mycontroller = myreadings.app.getController('articlesControl');
	    var portline=myreadings.conf.get('portline');
	    var portbyline=myreadings.conf.get('portbyline');
	    var landline=myreadings.conf.get('landline');
	    var landbyline=myreadings.conf.get('landbyline');
	    var mytplportrait;
	    var mytpllandscape;
	    if(profil=="gtab") {
		    mytpllandscape=mytplgtab1;
		    mytplportrait=mytplgtab2;
	    } else if(profil=="iphone") {
		    mytpllandscape=mytpliphone;
		    mytplportrait=mytpliphone2;

	    } else {
		    mytpllandscape=mytplipad;
		    mytplportrait=mytplipad;
	    }
	    
	    mycontroller.countLandscape=landline*landbyline;
	    mycontroller.countPortrait=portline*portbyline;
	    var mytpl='<tpl if="landscape">'+
                '<div class="row landscape">'+
                    '<tpl for="items">'+
                        '{% if (xindex < '+(landbyline+1)+') { %}'+mytpllandscape+
                        '{% } %}'+
                    '</tpl>'+
                '</div>';
            for (var i = 2; i <= landline; i++) {
                mytpl=mytpl+
                '<div class="row landscape">'+
                    '<tpl for="items">'+
                        '{% if (xindex > '+((i-1)*landbyline)+' && xindex < '+(i*landbyline+1)+') { %}'+mytpllandscape+
                        '{% } %}'+
                    '</tpl>'+
                '</div>';
            }
	    mytpl=mytpl+
            '</tpl>'+
            '<tpl if="!landscape">'+
                '<div class="row portrait">'+
                    '<tpl for="items">'+
                        '{% if (xindex < '+(portbyline+1)+') { %}'+mytplportrait+
                        '{% } %}'+
                    '</tpl>'+
                '</div>';
            for (var i = 2; i <= portline; i++) {
                mytpl=mytpl+
                '<div class="row portrait">'+
                    '<tpl for="items">'+
                        '{% if (xindex > '+((i-1)*portbyline)+' && xindex < '+(i*portbyline+1)+') { %}'+mytplportrait+
                       '{% } %}'+
                    '</tpl>'+
                '</div>';
            }
	    mytpl=mytpl+
            '</tpl>';
            
            return mytpl;
    },
    updateRecords: function(newRecords) {
        this.setData({
            items: newRecords.items,
            landscape: Ext.Viewport.getOrientation() == "landscape"
        });
    }
});
