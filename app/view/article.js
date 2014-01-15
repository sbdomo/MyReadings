Ext.define('myreadings.view.article', {
    //extend: 'Ext.Sheet',
    extend: 'Ext.Panel',
    
    xtype: 'article',
    txtBy: "de",
    txtTags:"",
    txtSeries:"",
    txtPubdate:"",
    txtLang:"",
    msgError:"",
    config: {
        baseCls: 'article-view',
        centered: true,
        //dans articlesControl: width et height à 100% si iphone, 92% sinon
        //width: '92%',
        //height: '92%',
        modal: true,
        hideOnMaskTap: true,
	scrollable: true,
        layout: {
            type: 'vbox'
        },
        showAnimation: {
            type: 'pop'//,
            //duration: 250,
            //easing: 'ease-out'
        },
        hideAnimation: {
            type: 'popOut',
            duration: 250,
            easing: 'ease-in'
        }
    },
    initialize: function() {
	var me = this;
	this.setItems(
	[
	{
		xtype:'titlebar',
		    docked: 'top',
		    id:"articletitle",
		    ui: "searchbar",
		    items: [
	{
    	    	xtype: "button",
		ui: 'decline',
    	    	    	   	   align: 'left',
    	    	    	   	   iconCls: 'delete',
    	    	    	   	   iconMask: true,
    	    	    	   	   handler: function(){
    	    	    	   	   	   me.hide();
    	    	    	   	   }
    	}
	]
	},
	{
		id:'contenu',
		cls: 'description',
		tpl:  new Ext.XTemplate(
		    this.tplinit(myreadings.app.getController('articlesControl').profil),
		    {
			    pathCover: function(relativepath) {
				    return myreadings.app.getController('articlesControl').pathbase+relativepath+"/cover.jpg";
			    },
			    pathepub: function(filename, extension) {
				    return myreadings.app.getController('articlesControl').pathbase+me.relativePath+"/"+filename+"."+extension.toLowerCase();
			    },
			    lang: function(language) {
				    var localelang = myreadings.app.getController('articlesControl').lang[language];
				    if(localelang!=null) {
					    return localelang;
				    } else { return language; }
			    },
			    octToMo: function(oct) {
			    	    return Math.round(oct/1048576*100)/100;
			    },
			    nl2br: function(str) {
				    return myreadings.app.getController('articlesControl').nl2br(str);
			    }
		    }
		)
	}
	]
	);
	this.callParent(arguments);
    },

    updateData: function(newData) {
    	var me = this;
	me.setMasked({xtype: 'loadmask'});
	Ext.getCmp('articletitle').setTitle(newData.title);
	me.relativePath = newData.relativePath;
	Ext.getCmp('contenu').setData({});
	var mycontrol=myreadings.app.getController('articlesControl');
	Ext.data.JsonP.request({
            url: './recordjson.php',
            callbackKey: 'callback',
            params: {
		    id: newData.id,
		    pathbase: mycontrol.pathbase,
		    mylogin: mycontrol.username,
		    mypass: mycontrol.password
            },
            success: function(result, request) {
                // Unmask the viewport
		me.setMasked(false);
                //Ext.Viewport.unmask();
		if(result.success==true) {
			var resultat = result.resultat;
			if (result.resultat) {
				//console.log("fiche OK " + result.resultat.films[0].datesortie);
				Ext.getCmp('contenu').setData(result.resultat);
			} else alert(me.msgError);
		} else Ext.Msg.alert("Error",result.message);
            },
	    failure: function(result, request) {
		    alert(me.msgError);
	    }
        });
    },
    tplinit: function(profil) {
	    var tplipad='<p>&nbsp;</p>'+
			'<tpl for="books">'+
				'<div>'+
				'<div class="divcover"><tpl if="hasCover==1"><img src="{relativePath:this.pathCover}" class="cover"/></tpl></div>'+
				'<tpl if="authorsName"><div class="titre">'+this.txtBy+' {authorsName}</div></tpl>'+
				'<div><span class="txt_normal">'+
					'<tpl if="tagsName"><span class="txt_fonce">'+this.txtTags+'</span> {tagsName}<br /></tpl>'+
					'<tpl if="seriesName"><span class="txt_fonce">'+this.txtSeries+'</span> {seriesName}<tpl if="seriesIndex"> ({seriesIndex})</tpl><br /></tpl>'+
					'<tpl if="pubDate&&pubDate!=\'0101\'"> <span class="txt_fonce">'+this.txtPubdate+'</span> {pubDate}<br /></tpl>'+
					'<tpl if="languagesName"> <span class="txt_fonce">'+this.txtLang+'</span> {languagesName:this.lang}<br /></tpl>'+
					'<br /><span class="comment">{comment}</span>'+
				'</span><br /></div>'+
				'</div>'+
			'</tpl>'+
			'<tpl for="files">'+
				'<div class="clear"><a class="epub" href="{[this.pathepub(values.filename, values.extension)]}">{extension}  ({size:this.octToMo} Mo)</a></div>'+
			'</tpl>';
	    var tpliphone='<p>&nbsp;</p>'+
			'<tpl for="books">'+
				'<div>'+
				'<div class="divcover"><tpl if="hasCover==1"><img src="{relativePath:this.pathCover}" class="coveriphone"/></tpl></div>'+
				'<tpl if="authorsName"><div class="titreiphone">'+this.txtBy+' {authorsName}</div></tpl>'+
				'<div><span class="txt_normaliphone">'+
					'<tpl if="tagsName"><span class="txt_fonce">'+this.txtTags+'</span> {tagsName}<br /></tpl>'+
					'<tpl if="seriesName"><span class="txt_fonce">'+this.txtSeries+'</span> {seriesName}<tpl if="seriesIndex"> ({seriesIndex})</tpl><br /></tpl>'+
					'<tpl if="pubDate&&pubDate!=\'0101\'"> <span class="txt_fonce">'+this.txtPubdate+'</span> {pubDate}<br /></tpl>'+
					'<tpl if="languagesName"> <span class="txt_fonce">'+this.txtLang+'</span> {languagesName:this.lang}<br /></tpl>'+
					'<br /><span class="commentiphone">{comment}</span>'+
				'</span></div>'+
				'</div>'+
			'</tpl>'+
			'<tpl for="files">'+
				'<div class="clear"><a class="epubiphone" href="{[this.pathepub(values.filename, values.extension)]}">{extension}  ({size:this.octToMo} Mo)</a></div>'+
			'</tpl>';
	    var mycontroller = myreadings.app.getController('articlesControl');
	    if(profil=="gtab") {
		    return tplgtab;
	    } else if(profil=="iphone") {
		    return tpliphone;

	    } else {
		    return tplipad;
	    }
    }
});
