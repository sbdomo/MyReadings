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
    readcbz:"",
    readepub:"",
    config: {
        baseCls: 'article-view',
        centered: true,
        //dans articlesControl: width et height à 100% si iphone, 92% sinon
        //width: '92%',
        //height: '92%',
        modal: true,
        hideOnMaskTap: true,
	scrollable: {
		direction: 'vertical',
		directionLock: true
	},
	//styleHtmlContent: true,
	//scrollable: true,
        /*layout: {
            type: 'vbox'
        },*/
        /*showAnimation: {
            type: 'pop'//,
            //duration: 250,
            //easing: 'ease-out'
        },
        hideAnimation: {
            type: 'popOut',
            duration: 250,
            easing: 'ease-in'
        }*/
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
		},
		{
			xtype: "button",
			itemId: "bookmark",
			align: 'right',
			iconCls: 'eye', //bank: bookmark, truck: not read, box: read
			iconMask: true,
			handler: function(button) {
				myreadings.app.getController('articlesControl').onBookmarkbt(button, me.bookmark);
			}
		}
		]
	},
	{
		id:'contenu',
		xtype: 'panel',
		cls: 'description',
		tpl:  new Ext.XTemplate(
		    this.tplinit(myreadings.app.getController('articlesControl').profil),
		    {
			    pathCover: function(relativepath, id) {
				    if(myreadings.conf.fetchmode=='direct') {
					    return myreadings.conf.pathbase+relativepath+"/cover.jpg";
				    } else {
					    var params = {
						    path: relativepath,
						    id: id,
						    base: myreadings.conf.txtbase,
						    mylogin: myreadings.conf.username,
						    mypass: myreadings.conf.password
					    };
					    var paramsencode = Ext.urlEncode(params);
					    return "./cover.php?"+paramsencode;
				    }
			    },
			    pathepub: function(filename, extension) {
				    if(myreadings.conf.fetchmode=='direct') {
					    return myreadings.conf.pathbase+me.relativePath+"/"+filename+"."+extension.toLowerCase();
				    } else {
					    var params = {
						    path: me.relativePath,
						    filename: filename,
						    extension: extension.toLowerCase(),
						    base: myreadings.conf.txtbase,
						    mylogin: myreadings.conf.username,
						    mypass: myreadings.conf.password
					    };
					    var paramsencode = Ext.urlEncode(params);
					    return "./getbook.php?"+paramsencode;
				    }
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
	},
	{
		id:'epubview',
		text: this.readepub,
		xtype: 'button',
		margin:20,
		handler: function() {
			var result=Ext.getCmp('contenu').getData();
			me.hide();
			myreadings.app.getController('articlesControl').epubviewer(result, me.epubpath, me.bookmark);
		}
	},
	{
		id:'cbzview',
		text: "viewer",
		xtype: 'button',
		margin:20,
		handler: function() {
			var result=Ext.getCmp('contenu').getData();
			me.hide();
			myreadings.app.getController('articlesControl').comicviewer(result, me.cbzpath, me.bookmark);
		}
	}
	]
	);
	this.callParent(arguments);
    },

    updateData: function(newData) {
    	var me = this;
	me.setMasked({xtype: 'loadmask'});
	Ext.getCmp('articletitle').setTitle(newData.title);
	if(myreadings.conf.current_userid=="") {
		Ext.getCmp('articletitle').down('#bookmark').hide();
	} else {
		Ext.getCmp('articletitle').down('#bookmark').show();
		if(newData.bookmark==null||newData.bookmark=="0") Ext.getCmp('articletitle').down('#bookmark').setIconCls('truck');
		else if(newData.bookmark=="-1") Ext.getCmp('articletitle').down('#bookmark').setIconCls('box');
		else Ext.getCmp('articletitle').down('#bookmark').setIconCls('bank');
	}
	me.bookmark=newData.bookmark;
	me.bookid=newData.id;
	//console.log("id: " + newData.id + " title: " + newData.title);
	
	Ext.getCmp('contenu').setData({});
	//Ext.getCmp('contenu').hide();
	Ext.getCmp('epubview').hide();
	Ext.getCmp('cbzview').hide();
	//var mycontrol=myreadings.app.getController('articlesControl');
	
	//console.log("pathbase: "+mycontrol.pathbase);
	
	Ext.data.JsonP.request({
            url: './recordjson.php',
            callbackKey: 'callback',
            params: {
		    id: newData.id,
		    //pathbase: myreadings.conf.pathbase,
		    txtbase: myreadings.conf.txtbase,
		    mylogin: myreadings.conf.username,
		    mypass: myreadings.conf.password
            },
            success: function(result, request) {
                // Unmask the viewport
		me.setMasked(false);
                //Ext.Viewport.unmask();
		if(result.success==true) {
			var resultat = result.resultat;
			if (resultat) {
				me.relativePath = resultat.books[0].relativePath;
				Ext.getCmp('contenu').setData(resultat);
				//Ext.getCmp('contenu').show();
				//console.log(resultat);
				if(!newData.viewer) {
				for (var fileId in resultat.files) {
					//console.log(resultat.files[fileId].extension);
					if(resultat.files[fileId].extension=="EPUB"&&myreadings.conf.epubview=="on") {
						//console.log("show");
						me.epubpath=myreadings.conf.pathbase+me.relativePath+"/"+resultat.files[fileId].filename+".epub";
						Ext.getCmp('epubview').show();
					} else if (resultat.files[fileId].extension=="CBZ"&&myreadings.conf.cbzview=="on") {
						//console.log("show");
						me.cbzpath=myreadings.conf.pathbase+me.relativePath+"/"+resultat.files[fileId].filename+".cbz";
						Ext.getCmp('cbzview').setText(me.read+" cbz");
						Ext.getCmp('cbzview').show();
					} else if (resultat.files[fileId].extension=="CBR"&&myreadings.conf.cbrview=="on") {
						//console.log("show");
						me.cbzpath=myreadings.conf.pathbase+me.relativePath+"/"+resultat.files[fileId].filename+".cbr";
						Ext.getCmp('cbzview').setText(me.read+" cbr");
						Ext.getCmp('cbzview').show();
					}
				}
				}
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
				'<div class="divcover"><tpl if="hasCover==1"><img src="{[this.pathCover(values.relativePath, values.id)]}" class="cover"/></tpl></div>'+
				'<tpl if="authorsName"><div class="titre">'+this.txtBy+' {authorsName}</div></tpl>'+
				'<div><span class="txt_normal">'+
					'<tpl if="tagsName"><span class="txt_fonce">'+this.txtTags+'</span> {tagsName}<br /></tpl>'+
					'<tpl if="seriesName"><span class="txt_fonce">'+this.txtSeries+'</span> {seriesName}<tpl if="seriesIndex"> ({seriesIndex})</tpl><br /></tpl>'+
					'<tpl if="pubDate&&pubDate!=\'0101\'"> <span class="txt_fonce">'+this.txtPubdate+'</span> {pubDate}<br /></tpl>'+
					'<tpl if="languagesName"> <span class="txt_fonce">'+this.txtLang+'</span> {languagesName:this.lang}<br /></tpl>'+
					'<tpl for="customs">'+
						'<span class="txt_fonce">{name}:</span> {value}<tpl if="num"> ({num})</tpl><br />'+
					'</tpl>'+
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
				'<div class="divcover"><tpl if="hasCover==1"><img src="{[this.pathCover(values.relativePath, values.id)]}" class="coveriphone"/></tpl></div>'+
				'<tpl if="authorsName"><div class="titreiphone">'+this.txtBy+' {authorsName}</div></tpl>'+
				'<div><span class="txt_normaliphone">'+
					'<tpl if="tagsName"><span class="txt_fonce">'+this.txtTags+'</span> {tagsName}<br /></tpl>'+
					'<tpl if="seriesName"><span class="txt_fonce">'+this.txtSeries+'</span> {seriesName}<tpl if="seriesIndex"> ({seriesIndex})</tpl><br /></tpl>'+
					'<tpl if="pubDate&&pubDate!=\'0101\'"> <span class="txt_fonce">'+this.txtPubdate+'</span> {pubDate}<br /></tpl>'+
					'<tpl if="languagesName"> <span class="txt_fonce">'+this.txtLang+'</span> {languagesName:this.lang}<br /></tpl>'+
					'<tpl for="customs">'+
						'<span class="txt_fonce">{name}:</span> {value}<tpl if="num"> ({num})</tpl><br />'+
					'</tpl>'+
					'<br /><span class="commentiphone">{comment}</span>'+
				'</span></div>'+
				'</div>'+
			'</tpl>'+
			'<tpl for="files">'+
				'<div class="clear"><a class="epubiphone" href="{[this.pathepub(values.filename, values.extension)]}">{extension}  ({size:this.octToMo} Mo)</a></div>'+
			'</tpl>';
	    //pour galaxy tab comme ipad mais avec image plus petite
	    var tplgtab='<p>&nbsp;</p>'+
			'<tpl for="books">'+
				'<div>'+
				'<div class="divcover"><tpl if="hasCover==1"><img src="{[this.pathCover(values.relativePath, values.id)]}" class="covergtab"/></tpl></div>'+
				'<tpl if="authorsName"><div class="titre">'+this.txtBy+' {authorsName}</div></tpl>'+
				'<div><span class="txt_normal">'+
					'<tpl if="tagsName"><span class="txt_fonce">'+this.txtTags+'</span> {tagsName}<br /></tpl>'+
					'<tpl if="seriesName"><span class="txt_fonce">'+this.txtSeries+'</span> {seriesName}<tpl if="seriesIndex"> ({seriesIndex})</tpl><br /></tpl>'+
					'<tpl if="pubDate&&pubDate!=\'0101\'"> <span class="txt_fonce">'+this.txtPubdate+'</span> {pubDate}<br /></tpl>'+
					'<tpl if="languagesName"> <span class="txt_fonce">'+this.txtLang+'</span> {languagesName:this.lang}<br /></tpl>'+
					'<tpl for="customs">'+
						'<span class="txt_fonce">{name}:</span> {value}<tpl if="num"> ({num})</tpl><br />'+
					'</tpl>'+
					'<br /><span class="comment">{comment}</span>'+
				'</span><br /></div>'+
				'</div>'+
			'</tpl>'+
			'<tpl for="files">'+
				'<div class="clear"><a class="epub" href="{[this.pathepub(values.filename, values.extension)]}">{extension}  ({size:this.octToMo} Mo)</a></div>'+
			'</tpl>';
	    //var mycontroller = myreadings.app.getController('articlesControl');
	    if(profil=="gtab") {
		    return tplgtab;
	    } else if(profil=="iphone") {
		    return tpliphone;

	    } else {
		    return tplipad;
	    }
    }
});
