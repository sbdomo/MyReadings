Ext.define('myreadings.controller.articlesControl', {
    extend: 'Ext.app.Controller',
    requires:['Ext.data.Store'],
    config: {
    	models:['myreadings.model.article'],
        refs: {
	    articleslist: 'articleslist',
	    searchview: 'searchview',
            searchpanel: 'searchpanel',
	    configpanel: 'configpanel',
	    listview: 'listview',
	    searchBt: 'articleslist [name=searchbutton]',
	    configBt: 'articleslist [name=configbutton]',
	    titlebar: 'articleslist [name=maintitlebar]',
	    orderfield: 'articleslist [name=order]',
	    viewerBt: 'articleslist [name=viewer]',
	    
	    loginBt: 'configpanel [name=loginbutton]',
	    usernameCt: 'configpanel [name=login]',
	    passwordCt: 'configpanel [name=pass]',
	    loginfieldset: 'configpanel [name=loginfieldset]',
	    btconfigpanelhide: 'configpanel [name=bthide]',
	    comicSettings: 'configpanel [name=comicSettings]',
	    
	    typelistfind: 'listview [name=typelist]',
	    searchfieldfind: 'listview [name=listviewSearchfield]',
	    btsearchfind: 'listview [name=btsearch]',
	    
            articleView: {
                autoCreate: true,
                xtype: 'article',
                selector: 'article'
            },
	    comicView: {
                autoCreate: true,
                xtype: 'comicview',
                selector: 'comicview'
            },
	    epubView: {
                autoCreate: true,
                xtype: 'epubview',
                selector: 'epubview'
            }
        },
        control: {
            articleslist: {
                itemtap: 'onArticleTap'
            },
	    searchBt: {
		    tap: 'onSearchTap'
	    },
	    configBt: {
		    tap: 'onConfigTap'
	    },
	    loginBt: {
		    tap: 'onLoginTap'
	    },
	    viewerBt: {
		    tap: 'openviewer'
	    },
	    
	    typelistfind: {
		    change: 'onChangeListView'
	    },
	    searchfieldfind: {
		    action: 'onChangeListView'
	    },
	    btsearchfind: {
		    tap: 'onChangeListView'
	    }
        },

        routes: {
	//pour une url du type: http://myurl/#profil/ipad
		'profil/:id': 'profilchoice',
	//si par de paramètre, lance profilchoice et initialise avec profil=ipad par défaut
		'':  'profilchoice'
        }//,

        //stack: []
    },

    init: function() {
	//console.log('init controller');
	var me=this;
	
	//var me=myreadings.app.getController('articlesControl');
        me.callParent();
	me.isList = false;
	if(!me.isInit) {
		myreadings.currentbook = {};
		myreadings.settings = {};
		myreadings.conf = {};
		
		Ext.ModelMgr.getModel('myreadings.model.myreadingsUser').load(1, {
			scope: this,
			success: function(cachedLoggedInUser) {
				delete cachedLoggedInUser.phantom;
				myreadings.conf.username=cachedLoggedInUser.get('name');
				myreadings.conf.password=cachedLoggedInUser.get('pass');
				
				myreadings.conf.pathbase=cachedLoggedInUser.get('pathbase');
				me.order=cachedLoggedInUser.get('order');
				
				me.type=cachedLoggedInUser.get('type');
				me.find=cachedLoggedInUser.get('find');
				me.start=cachedLoggedInUser.get('start');
				me.idlist=cachedLoggedInUser.get('idlist');
				//me.list=cachedLoggedInUser.get('list');
				//me.search=cachedLoggedInUser.get('search');
				
				myreadings.settings.zoom_on_tap=cachedLoggedInUser.get('zoom_on_tap');
				myreadings.settings.toggle_paging_bar=cachedLoggedInUser.get('toggle_paging_bar');
				myreadings.settings.page_turn_drag_threshold=cachedLoggedInUser.get('page_turn_drag_threshold');
				myreadings.settings.page_fit_mode=cachedLoggedInUser.get('page_fit_mode');
				myreadings.settings.page_change_area_width=cachedLoggedInUser.get('page_change_area_width');
				myreadings.settings.open_current_comic_at_launch=cachedLoggedInUser.get('open_current_comic_at_launch');
				
				myreadings.settings.epub_mode=cachedLoggedInUser.get('epub_mode');
				myreadings.settings.epub_font=cachedLoggedInUser.get('epub_font');
				myreadings.settings.epub_fontsize=cachedLoggedInUser.get('epub_fontsize');
				
				myreadings.currentbook.idbook=cachedLoggedInUser.get('book_id');
				myreadings.currentbook.reading=cachedLoggedInUser.get('book_reading');
				myreadings.currentbook.name=cachedLoggedInUser.get('book_title');
				myreadings.currentbook.idbase=cachedLoggedInUser.get('book_idbase');
				myreadings.currentbook.path=cachedLoggedInUser.get('book_path');
				myreadings.currentbook.current_page_nr=cachedLoggedInUser.get('book_currentpage');
				myreadings.currentbook.number_of_pages=cachedLoggedInUser.get('book_pages');
				myreadings.currentbook.book_type=cachedLoggedInUser.get('book_type');
				
				
				console.info('Auto-Login succeeded.');
			},
			failure : function() {
				myreadings.conf.username="";
				myreadings.conf.password="";
				myreadings.conf.pathbase="";
				me.order="recent";
				me.type="";
				me.find="";
				me.start="0";
				me.idlist="";
				//me.list="author";
				//me.search="";
				
				//*************SETTINGS*****************
				//Zoom: 1:SingleTap, 2:DoubleTap
				myreadings.settings.zoom_on_tap =1;
				//Cache barre d'outils: 1:SingleTap, 2:DoubleTap
				myreadings.settings.toggle_paging_bar=2;
				//taille déplacement pour swipe
				myreadings.settings.page_turn_drag_threshold=75;
				// 1: Fit width, 2: Full page
				myreadings.settings.page_fit_mode=1;
				//Largeur bande pour changement de page
				myreadings.settings.page_change_area_width=50;
				//Open comic at launch
				myreadings.settings.open_current_comic_at_launch=1;
				
				//epub
				myreadings.settings.epub_mode="jour";
				myreadings.settings.epub_font="arial";
				myreadings.settings.epub_fontsize="1.45";
				
				
				myreadings.currentbook.reading=false;
				
				console.warn('Auto-Login failed (user was not logged in).');
			}
		});
	}
	Ext.data.JsonP.request({
            url: './getConfig.php',
            callbackKey: 'callback',
            params: {
            	   mylogin: myreadings.conf.username,
            	   mypass: myreadings.conf.password
            },
            success: function(result, request) {
		if(result.success==true) {
			if(me.isInit!=true) {
				var translations = result.locale.views;
				for (var view in translations) {
					Ext.apply(myreadings.view[view].prototype,translations[view]);
				}
				me.lang = result.locale.lang;
				me.localtxt=result.locale.controller;
				
				var MB = Ext.MessageBox;
				MB.OK.text = me.localtxt.ok;
				MB.CANCEL.text = me.localtxt.cancel;
				MB.YES.text = me.localtxt.yes;
				MB.NO.text = me.localtxt.no;
				MB.OKCANCEL[0].text = me.localtxt.cancel;    // Cancel
				MB.OKCANCEL[1].text = me.localtxt.ok;        // OK
				MB.YESNOCANCEL[0].text = me.localtxt.cancel; // Cancel
				MB.YESNOCANCEL[1].text = me.localtxt.no;     // No
				MB.YESNOCANCEL[2].text = me.localtxt.yes;    // Yes
				MB.YESNO[0].text = me.localtxt.no;           // No
				MB.YESNO[1].text = me.localtxt.yes;          // Yes
				//A faire pour la version iphone
				if (Ext.picker) {
				if (Ext.picker.Picker){
					Ext.override(Ext.picker.Picker, {
						config: {
							doneButton: {
								text: me.localtxt.ok
							},
							cancelButton: {
								text: me.localtxt.cancel
							}
						}
					});
				}
				}
				
				me.comicView = Ext.create('myreadings.view.comicview');
				me.epubView = Ext.create('myreadings.view.epubview');
				me.articleView = Ext.create('myreadings.view.article');
				Ext.Viewport.add(Ext.create('myreadings.view.ArticlesList'));
				Ext.Viewport.add(Ext.create('myreadings.view.configpanel'));
				Ext.Viewport.add(Ext.create('myreadings.view.searchview'));
			}
			
			if(result.config.connect=="noprotect"||result.config.connect=="protectok") {
				if(me.isInit==true) {
					me.getBtconfigpanelhide().show();
					me.getComicSettings().show();
					me.getConfigpanel().hide();
				}
				
				myreadings.conf.fetchmode=result.config.fetchmode;
				
				me.bases = result.config.bases;
				var newOptions = [];
				var basevalue="";
				for (var base in me.bases) {
					newOptions.push({text: base,  value: me.bases[base]});
					//Cherche si la dernière base utilisée peut être réouverte
					if(me.bases[base]==myreadings.conf.pathbase) basevalue=me.bases[base];
				}
				Ext.getCmp('base').setOptions(newOptions);
				if(basevalue!="") Ext.getCmp('base').setValue(basevalue);
				
				//Etat disabled car test dans la fonction change du selectfield pour ne pas déclencher le lancement de change
				//Passe en enabled ensuite
				Ext.getCmp('base').enable();
				
				myreadings.conf.pathbase=Ext.getCmp('base').getValue();
				myreadings.conf.txtbase=Ext.getCmp('base').getRecord().data.text;
				
				
				//console.log("set profil dans config panel " + me.profil);
				Ext.getCmp('profil').setHtml(me.localtxt.txtProfil+": "+me.localtxt[me.profil])
				
				//Initialisation de order
				var orderfield=me.getOrderfield().getOptions();
				for (var myorder in orderfield) {
					if(orderfield[myorder].value==me.order) me.getOrderfield().setValue(me.order);
				}
				me.getOrderfield().enable();
				
				me.showArticles();
				
				me.showViewerBt();
				
				if(myreadings.settings.open_current_comic_at_launch==1&&myreadings.currentbook.reading) me.openviewer();
				
				if(me.profil=="iphone") {
					me.getTitlebar().setTitle('');
					Ext.getCmp('order').setFlex(1);
					me.getTypelistfind().setFlex(1);
					me.articleView.setWidth('100%');
					me.articleView.setHeight('100%');
				} else {
					Ext.getCmp('order').setWidth(230);
					me.getTypelistfind().setWidth(150);
					me.articleView.setWidth('92%');
					me.articleView.setHeight('92%');
				}
				
				if(result.config.connect=="noprotect") {
					me.getLoginfieldset().hide();
				} else {
					me.logged = true;
					me.getLoginBt().setText(me.localtxt.notlogin);
					me.getUsernameCt().hide();
					me.getPasswordCt().hide();
				}
				
				//Ouverture OK - Effacement du cache ancien des cbz
				Ext.data.JsonP.request({
						url: './cache.php',
						callbackKey: 'callback',
						params: {
							mylogin: myreadings.conf.username,
							mypass: myreadings.conf.password
						},
						success: function(result, request) {
							if(result.success==false) console.log('Error in cache.');
							else console.log('Cache: '+result.resultat);
						},
						failure: function(result, request) {
							console.log('Php Error for cache.');
						}
				});
				
			} else {
				//Login/pass incorrect
				if(me.isInit!=true) {
					me.logged=false;
					me.getBtconfigpanelhide().hide();
					me.getConfigpanel().show();
					me.getComicSettings().hide();
					Ext.Msg.alert(me.localtxt.error,me.localtxt.mustloginandpass);
					me.isInit=true;
				} else {
					Ext.Msg.alert(me.localtxt.error,me.localtxt.errorlogin);
				}
			}
			
		} else alert('Error Configuration.');
            }
        });
    },
    
    showArticles: function(data) {
 	var store = Ext.create("Ext.data.Store", {
    	    model: "myreadings.model.article",
    	    pageSize: 100,
    	    clearOnPageLoad: false
        });
        if(data) {
        	if(data.debut==4) {//changement d'ordre de tri demandé
			store.getProxy().setExtraParam('order', data.order);
			this.order=data.order;
		} else if(data.debut==3) {//lancement depuis listview
			store.getProxy().setExtraParam('type', data.type);
			store.getProxy().setExtraParam('idlist', data.idlist);
			this.type=data.type;
			this.idlist=data.idlist;
		} else if(data.debut==5) {//changement de base calibre, ouvre tout: type=all
			store.getProxy().setExtraParam('pathbase',data.pathbase);
			store.getProxy().setExtraParam('type', data.type);
			myreadings.conf.pathbase=data.pathbase;
			myreadings.conf.txtbase=Ext.getCmp('base').getRecord().data.text;
			this.type=data.type;
		} else {//lancement depuis searchpanel
			store.getProxy().setExtraParam('type', data.type);
			store.getProxy().setExtraParam('find', data.find);
			store.getProxy().setExtraParam('start', data.debut);
			this.type=data.type;
			this.find=data.find;
			this.start=data.debut;
		}
		this.saveuser(); //pour sauver la base par défaut
        } else {
		//lors du premier lancement, pas de data car requête par défaut
		store.getProxy().setExtraParam('pathbase', myreadings.conf.pathbase);
		store.getProxy().setExtraParam('mylogin', myreadings.conf.username);
		store.getProxy().setExtraParam('mypass', myreadings.conf.password);
		store.getProxy().setExtraParam('order', this.order);
		store.getProxy().setExtraParam('type', this.type);
		store.getProxy().setExtraParam('find', this.find);
		store.getProxy().setExtraParam('start', this.start);
		store.getProxy().setExtraParam('idlist', this.idlist);
	}
	store.load();
	var articlesView= this.getArticleslist();

	//empty the store before adding the new one
	var  articlesStore = articlesView.getStore();
	if (articlesStore) {
            articlesStore.removeAll();
        }

	articlesView.setStore(store);
    },
    getArticleView: function() {
    	    //console.log('getArticleView');
        return this.articleView;
    },
    
    onArticleTap: function(view, record) {
        	//console.log('onArticleTap');
        var articleView = this.getArticleView();

        articleView.setData(record.data);

        if (!articleView.getParent()) {
            Ext.Viewport.add(articleView);
        }

        articleView.show();
    },
    openArticle_CurrentBook: function() {
        var articleView = this.getArticleView();
	
	articleView.setData({
			id: myreadings.currentbook.idbook,
			title: myreadings.currentbook.name,
			viewer: true
	});
	
	if (!articleView.getParent()) {
		Ext.Viewport.add(articleView);
        }
	
        articleView.show();
    },
    
    onSearchTap: function() {
	    Ext.getCmp('searchview').show();
    },
    onConfigTap: function() {
	    Ext.getCmp('configpanel').down('#comicSettings').onInit();
	    Ext.getCmp('configpanel').show();
    },
    
    loadliststore: function(list, search) {
        var listview = Ext.getCmp('listview');
        var store = listview.getStore();
	store.getProxy().setExtraParam('pathbase',myreadings.conf.pathbase);
	store.getProxy().setExtraParam('mylogin',myreadings.conf.username);
        store.getProxy().setExtraParam('mypass',myreadings.conf.password);
	store.getProxy().setExtraParam('list', list);
        store.getProxy().setExtraParam('search', search);
	//Affiche le début de la liste
	if(listview.getScrollable().getScroller()) listview.getScrollable().getScroller().scrollTo(0, 0);
	//Autre solution:
	//me.doComponentLayout();
	//me.refresh();
	store.loadPage(1);
	this.isList=true;
    },
    
    onLoginTap: function() {
	if(this.logged!=true) {
		myreadings.conf.username = this.getUsernameCt().getValue(),
		myreadings.conf.password = this.getPasswordCt().getValue();
		if(!Ext.isEmpty(myreadings.conf.password) && !Ext.isEmpty(myreadings.conf.username)) {
			var user = Ext.create('myreadings.model.myreadingsUser', {
				id: 1,
				name: myreadings.conf.username,
				pass: myreadings.conf.password,
				
				zoom_on_tap: myreadings.settings.zoom_on_tap,
				toggle_paging_bar: myreadings.settings.toggle_paging_bar,
				page_turn_drag_threshold: myreadings.settings.page_turn_drag_threshold,
				page_fit_mode: myreadings.settings.page_fit_mode,
				page_change_area_width: myreadings.settings.page_change_area_width,
				open_current_comic_at_launch: myreadings.settings.open_current_comic_at_launch
			});
			user.save();
			this.init();
		} else Ext.Msg.alert(this.localtxt.error,this.localtxt.mustloginandpass);
	} else {
		Ext.ModelMgr.getModel('myreadings.model.myreadingsUser').load(1, {
			success: function(user) {
				Ext.Msg.confirm(this.localtxt.msg, this.localtxt.notloginconfirm, function(confirmed) {
					if (confirmed == 'yes') {
						user.erase({success: function() {window.location.reload(); } });
					}
				}, this);
			},
			failure: function() {
				// this should not happen, nevertheless:
				window.location.reload();
			}
		}, this);
	}
    },
    //Lancé si dans routes une profil existant est indiqué
    profilchoice: function(profil) {
	    //console.log("profilchoice"+ profil);
	    if(profil=="ipad"||profil=="gtab"||profil=="iphone") this.profil=profil;
	    else this.profil="ipad";
    },
    
    onChangeListView: function() {
	    this.loadliststore(this.getTypelistfind().getValue(), this.getSearchfieldfind().getValue());
    },
    saveuser: function() {
	    var user = Ext.create('myreadings.model.myreadingsUser', {
				id: 1,
				name: myreadings.conf.username,
				pass: myreadings.conf.password,
				pathbase: myreadings.conf.pathbase,
				order: this.order,
				type: this.type,
				find: this.find,
				start: this.start,
				idlist: this.idlist,
				
				zoom_on_tap: myreadings.settings.zoom_on_tap,
				toggle_paging_bar: myreadings.settings.toggle_paging_bar,
				page_turn_drag_threshold: myreadings.settings.page_turn_drag_threshold,
				page_fit_mode: myreadings.settings.page_fit_mode,
				page_change_area_width: myreadings.settings.page_change_area_width,
				open_current_comic_at_launch: myreadings.settings.open_current_comic_at_launch,
				
				epub_mode: myreadings.settings.epub_mode,
				epub_font: myreadings.settings.epub_font,
				epub_fontsize: myreadings.settings.epub_fontsize,
				
				book_id: myreadings.currentbook.idbook,
				book_reading: myreadings.currentbook.reading,
				book_title: myreadings.currentbook.name,
				book_idbase: myreadings.currentbook.idbase,
				book_path: myreadings.currentbook.path,
				book_currentpage: myreadings.currentbook.current_page_nr,
				book_pages: myreadings.currentbook.number_of_pages,
				book_type: myreadings.currentbook.book_type
				
				//list: this.list,
				//search: this.search
	    });
	    user.save();
    },
    comicviewer: function(book, path) {
	    var comicView = this.getComicView();
	    //articleView.setData(record.data);
	    if (!comicView.getParent()) {
		    Ext.Viewport.add(comicView);
	    }
	    
	    //Mise à jour currentbook
	    myreadings.currentbook.idbook=book.books[0].id;
	    myreadings.currentbook.name=book.books[0].title;
	    myreadings.currentbook.idbase=Ext.getCmp('base').getRecord().data.text;
	    myreadings.currentbook.path=path;
	    myreadings.currentbook.current_page_nr=0;
	    myreadings.currentbook.book_type="comic";
	    //InitComic réinitialise la lecture en cours et renseigne myreadings.currentbook.number_of_pages
	    myreadings.app.getController('comic').initComic();
	    comicView.show();
	    this.showViewerBt();
    },
    epubviewer: function(book, path) {
    	   var epubView = this.getEpubView();
	    if (!epubView.getParent()) {
		    Ext.Viewport.add(epubView);
	    }
	    //Mise à jour currentbook
	    myreadings.currentbook.idbook=book.books[0].id;
	    myreadings.currentbook.name=book.books[0].title;
	    myreadings.currentbook.path=path;
	    myreadings.currentbook.book_type="epub";
	    
	    myreadings.app.getController('epub').initEpub();
	    this.showViewerBt();
	    //epubView.show();
    },
    openviewer: function() {
    	    if(myreadings.currentbook.book_type=="epub") {
    	    	  this.openepubviewer();
    	    } else if(myreadings.currentbook.book_type=="comic") {
    	    	    this.opencomicviewer();
    	    }
    },
    opencomicviewer: function() {
	    var comicView = this.getComicView();
	    if (!comicView.getParent()) {
		    Ext.Viewport.add(comicView);
	    }
	    myreadings.app.getController('comic').openComic();
	    comicView.show();
    },
    openepubviewer: function() {
	    var epubView = this.getEpubView();
	    if (!epubView.getParent()) {
		    Ext.Viewport.add(epubView);
	    }
	    myreadings.app.getController('epub').openEpub();
	    //comicView.show();
    },
    showViewerBt: function() {
	    if(myreadings.currentbook.idbook==null) {
		    this.getViewerBt().hide();
	    } else {
		    this.getViewerBt().show();
	    }
    },
    //Non nécessaire pour le résumé du livre.
    nl2br: function(str) {
	    // Converts newlines to HTML line breaks
	    var breakTag = '<br />';
	    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
    }
    
});
