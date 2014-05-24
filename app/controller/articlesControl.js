Ext.define('myreadings.controller.articlesControl', {
    extend: 'Ext.app.Controller',
    requires:['Ext.data.Store'],
    config: {
    	models:['myreadings.model.article'],
        refs: {
	    main: 'main',
	    articleslist: 'articleslist',
	    articlesserieslist: 'articlesserieslist',
	    searchview: 'searchview',
            searchpanel: 'searchpanel',
	    configpanel: 'configpanel',
	    listview: 'listview',
	    searchBt: 'articleslist [name=searchbutton]',
	    configBt: 'articleslist [name=configbutton]',
	    titlebar: 'articleslist [name=maintitlebar]',
	    viewerBt: 'articleslist #viewer',
	    viewerBt2: 'articlesserieslist #viewer',
	    titlebarserie: 'articlesserieslist #titlebarserie',
	    loginBt: 'configpanel [name=loginbutton]',
	    usernameCt: 'configpanel [name=login]',
	    passwordCt: 'configpanel [name=pass]',
	    loginfieldset: 'configpanel [name=loginfieldset]',
	    btconfigpanelhide: 'configpanel [name=bthide]',
	    
	    //comicSettings: 'configpanel [name=comicSettings]',
	    configViewer: 'configpanel #configViewer',
	    open_book_at_launch: 'configpanel #open_book_at_launch',
	    showresize: 'configpanel #showresize',
	    hidemenu: 'configpanel #hidemenu',
	    forcedThumb: 'configpanel #forced',
	    
	    typelistfind: 'listview [name=typelist]',
	    searchfieldfind: 'listview [name=listviewSearchfield]',
	    btsearchfind: 'listview [name=btsearch]',
	    btlistviewhide: 'listview [name=bthide]',
	    btsearchhide: 'searchpanel [name=bthide]',
	    
            articleView: {
                autoCreate: true,
                xtype: 'article',
                selector: 'article'
            },
	    bookmarkbt: 'article #bookmark',
	    
	    comicView: {
                autoCreate: true,
                xtype: 'comicview',
                selector: 'comicview'
            },
	    epubView: {
                autoCreate: true,
                xtype: 'epubview',
                selector: 'epubview'
            },
	    bookmarkView: {
                autoCreate: true,
                xtype: 'bookmarkview',
                selector: 'bookmarkview'
            },
	    titleBookmarkView: 'bookmarkview #titlepanel',
            txtBookmarkView: 'bookmarkview #reading',
            btBookmarkView: 'bookmarkview #btread',
            
            orderview: {
                autoCreate: true,
                xtype: 'orderview',
                selector: 'orderview'
            },
            //orderfield: 'articleslist [name=order]',
	    orderfield: 'orderview #order',
	    seriegroup: 'orderview #seriegroup',
	    showIfRead: 'orderview #showIfRead',
	    btOrder: 'articleslist #btOrder'
        },
        control: {
            articleslist: {
                itemtap: 'onArticleTap'
            },
            articlesserieslist: {
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
	    viewerBt2: {
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
	    },
	    btOrder: {
		    tap: 'onBtOrderTap'
	    },
	    btBookmarkView: {
		    tap: 'onBtBookmarkViewTap'
	    },
	    btconfigpanelhide: {
		    tap: 'activateCarousel'
	    },
	    btsearchhide: {
		    tap: 'activateCarousel'
	    },
	    btlistviewhide: {
		    tap: 'activateCarousel'
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
		myreadings.conf.current_userid="";
		
		myreadings.conf.offset=0;
		myreadings.conf.offset2=0;
		myreadings.conf.forced="false";
		
		Ext.ModelMgr.getModel('myreadings.model.myreadingsUser').load(1, {
			scope: this,
			success: function(cachedLoggedInUser) {
				delete cachedLoggedInUser.phantom;
				myreadings.conf.username=cachedLoggedInUser.get('name');
				myreadings.conf.password=cachedLoggedInUser.get('pass');
				
				myreadings.conf.pathbase=cachedLoggedInUser.get('pathbase');
				myreadings.conf.current_user=cachedLoggedInUser.get('currentuser');
				myreadings.conf.showifread=cachedLoggedInUser.get('showifread');
				me.order=cachedLoggedInUser.get('order');
				me.gpseries=cachedLoggedInUser.get('gpseries');
				
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
				myreadings.settings.showresize=cachedLoggedInUser.get('showresize');
				myreadings.settings.hidemenu=cachedLoggedInUser.get('hidemenu');
				
				myreadings.settings.epub_mode=cachedLoggedInUser.get('epub_mode');
				myreadings.settings.epub_font=cachedLoggedInUser.get('epub_font');
				myreadings.settings.epub_fontsize=cachedLoggedInUser.get('epub_fontsize');
				
				myreadings.currentbook.idbook=cachedLoggedInUser.get('book_id');
				myreadings.currentbook.reading=cachedLoggedInUser.get('book_reading');
				myreadings.currentbook.name=cachedLoggedInUser.get('book_title');
				//myreadings.currentbook.idbase=cachedLoggedInUser.get('book_idbase');
				//Contiendra le path complet du fichier
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
				myreadings.conf.current_user="";
				myreadings.conf.showifread="all";
				me.order="recent";
				me.gpseries=0;
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
				//show message if comic page is resized
				myreadings.settings.showresize=0;
				//hide menu when comic is open
				myreadings.settings.hidemenu=0;
				
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
				
				Ext.Viewport.add(Ext.create('myreadings.view.main'));
				me.articleView = Ext.create('myreadings.view.article');
				//Ext.Viewport.add(Ext.create('myreadings.view.ArticlesList'));
				Ext.Viewport.add(Ext.create('myreadings.view.articlesserieslist'));
				//Ext.Viewport.add(Ext.create('myreadings.view.configpanel'));
				//Ext.Viewport.add(Ext.create('myreadings.view.searchview'));
				Ext.create('myreadings.view.orderview');
			}
			
			if(result.config.connect=="noprotect"||result.config.connect=="protectok") {
				if(me.isInit==true) {
					me.getBtconfigpanelhide().show();
					//me.getComicSettings().show();
					me.getConfigViewer().show();
					//me.getConfigpanel().hide();
					me.getMain().setActiveItem(0);
					
				}
				
				myreadings.conf.fetchmode=result.config.fetchmode;
				
				myreadings.conf.epubview=result.config.epubview;
				myreadings.conf.cbzview=result.config.cbzview;
				myreadings.conf.cbrview=result.config.cbrview;
				
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
				Ext.getCmp('profil').setHtml(me.localtxt.txtProfil+": "+me.localtxt[me.profil]);
				
				me.getOpen_book_at_launch().setValue(myreadings.settings.open_current_comic_at_launch);
				me.getOpen_book_at_launch().enable();
				me.getShowresize().setValue(myreadings.settings.showresize);
				me.getShowresize().enable();
				
				me.getHidemenu().setValue(myreadings.settings.hidemenu);
				me.getHidemenu().enable();
				
				if(myreadings.conf.fetchmode=="resize_and_cache") me.getForcedThumb().show();
				
				//Init user
				//console.log(result.config.users);
				var listusers = result.config.users;
				if(listusers!="") {
					newOptions = [];
					var uservalue="";
					for (var usernum in listusers) {
						newOptions.push({text: listusers[usernum],  value: listusers[usernum]});
						//Cherche si la dernière base utilisée peut être réouverte
						if(listusers[usernum]==myreadings.conf.current_user) uservalue=listusers[usernum];
					}
					Ext.getCmp('listuser').setOptions(newOptions);
					if(uservalue!="") Ext.getCmp('listuser').setValue(uservalue);
					
					//Etat disabled car test dans la fonction change du selectfield pour ne pas déclencher le lancement de change
					//Passe en enabled ensuite
					Ext.getCmp('listuser').enable();
					
					myreadings.conf.current_user=Ext.getCmp('listuser').getValue();
					
					me.getShowIfRead().setValue(myreadings.conf.showifread);
					me.getShowIfRead().enable();
					
				} else {
					myreadings.conf.current_user="";
					Ext.getCmp('listuser').hide();
				}
				
				//Initialisation de order
				var orderfield=me.getOrderfield().getOptions();
				for (var myorder in orderfield) {
					if(orderfield[myorder].value==me.order) me.getOrderfield().setValue(me.order);
				}
				me.getOrderfield().enable();
				
				me.getSeriegroup().setValue(me.gpseries);
				me.getSeriegroup().enable();
				
				//S'il y a un user, il faut récupérer son id (qui peut changer suivant la base utilisée)
				if(myreadings.conf.current_user!="") {
				Ext.data.JsonP.request({
					url: './tools.php',
					callbackKey: 'callback',
					params: {
						action: "getuserid",
						mylogin: myreadings.conf.username,
						mypass: myreadings.conf.password,
						base: myreadings.conf.txtbase,
						user: myreadings.conf.current_user
					},
					success: function(result, request) {
						//Ext.Viewport.setMasked(false);
						if(result.success==false) alert(result.message);
						else {
							myreadings.conf.current_userid=result.resultat;
						}
						me.showArticles();
						if(myreadings.settings.open_current_comic_at_launch==1&&myreadings.currentbook.reading) me.openviewer();
					},
					failure: function(result, request) {
						Ext.Viewport.setMasked(false);
						alert('Php Error for userid.');
					}
				});
				} else {
				me.showArticles();
				if(myreadings.settings.open_current_comic_at_launch==1&&myreadings.currentbook.reading) me.openviewer();
				}
				
				me.showViewerBt();
				
				
				if(me.profil=="iphone") {
					me.getTitlebar().setTitle('');
					//Ext.getCmp('order').setFlex(1);
					me.getTypelistfind().setFlex(1);
					me.articleView.setWidth('100%');
					me.articleView.setHeight('100%');
				} else {
					//Ext.getCmp('order').setWidth(230);
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
						url: './tools.php',
						callbackKey: 'callback',
						params: {
							action: "cache",
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
					//me.getConfigpanel().show();
					me.getMain().setActiveItem(1);
					//me.getComicSettings().hide();
					me.getConfigViewer().hide();
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
 	myreadings.conf.offset=0;
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
			//console.log("changement de base calibre, ouvre tout: type=all");
			store.getProxy().setExtraParam('pathbase',data.pathbase);
			store.getProxy().setExtraParam('type', data.type);
			store.getProxy().setExtraParam('userid', myreadings.conf.current_userid);			
			myreadings.conf.pathbase=data.pathbase;
			myreadings.conf.txtbase=Ext.getCmp('base').getRecord().data.text;
			this.type=data.type;
		} else if(data.debut==6) {//changement de user	
			store.getProxy().setExtraParam('userid', myreadings.conf.current_userid);
		} else if(data.debut==7) {//groupé pas serie ou pas
			this.gpseries=data.gpseries
			store.getProxy().setExtraParam('gpseries', this.gpseries);
		} else if(data.debut==8) {//pour choisir tous, non lus, lus
			myreadings.conf.showifread=data.showifread
			store.getProxy().setExtraParam('showifread', myreadings.conf.showifread);
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
		store.getProxy().setExtraParam('gpseries', this.gpseries);
		store.getProxy().setExtraParam('type', this.type);
		store.getProxy().setExtraParam('find', this.find);
		store.getProxy().setExtraParam('start', this.start);
		store.getProxy().setExtraParam('idlist', this.idlist);
		store.getProxy().setExtraParam('userid', myreadings.conf.current_userid);
		store.getProxy().setExtraParam('showifread', myreadings.conf.showifread);
	}
	
	store.getProxy().setExtraParam('offset', myreadings.conf.offset);
	store.load();
	//console.log(store.getProxy().getExtraParams());
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
    	    if(this.getArticlesserieslist().isHidden()&&this.gpseries=="1"&&record.data.nbgp!=1) {
    	    	    this.showArticlesSeries(record.data)
		    this.getTitlebarserie().setTitle(record.data.seriesName);
    	    	    this.getArticlesserieslist().show();
    	    } else {
		    if(myreadings.conf.forced=="true") {
		    Ext.Viewport.setMasked({xtype: 'loadmask'});
		    var me= this;
		    Ext.data.JsonP.request({
			    url: './cover.php',
			    callbackKey: 'callback',
			    params: {
				    path: record.data.relativePath,
				    id: record.data.id,
				    forced: "true",
				    base: myreadings.conf.txtbase,
				    mylogin: myreadings.conf.username,
				    mypass: myreadings.conf.password
			    },
			    success: function(result, request) {
				    if(result.success==false) {
					    Ext.Viewport.setMasked(false);
					    alert('Create thumbnail: error');
				    } else {
				    	 if(!me.getArticlesserieslist().isHidden()) me.getArticlesserieslist().refreshItems();
					 me.getArticleslist().refreshItems();
					 Ext.Viewport.setMasked(false);
				    }
			    },
			    failure: function(result, request) {
				    Ext.Viewport.setMasked(false);
				    alert('Create thumbnail: error');
			    }
		    });
		    } else {
			    var articleView = this.getArticleView();
			    articleView.setData(record.data);
			    
			    if (!articleView.getParent()) {
				    Ext.Viewport.add(articleView);
			    }
			    articleView.show();
		    }
    	    }
    },
    showArticlesSeries: function(data) {
    	myreadings.conf.offset2=0;
 	var store = Ext.create("Ext.data.Store", {
    	    model: "myreadings.model.article2",
    	    pageSize: 100,
    	    clearOnPageLoad: false
        });
        //console.log(data);
        	
	//Initialise le proxy
	store.getProxy().setExtraParam('pathbase', myreadings.conf.pathbase);
	store.getProxy().setExtraParam('mylogin', myreadings.conf.username);
	store.getProxy().setExtraParam('mypass', myreadings.conf.password);
	store.getProxy().setExtraParam('order', this.order);
	store.getProxy().setExtraParam('type', this.type);
	store.getProxy().setExtraParam('find', this.find);
	store.getProxy().setExtraParam('start', this.start);
	store.getProxy().setExtraParam('idlist', this.idlist);
	store.getProxy().setExtraParam('userid', myreadings.conf.current_userid);
	store.getProxy().setExtraParam('showifread', myreadings.conf.showifread);
	
	//cherche par seriesName
	store.getProxy().setExtraParam('gpseries', -1);
	store.getProxy().setExtraParam('findserie', data.serieid);
	//store.getProxy().setExtraParam('findserie', data.seriesName);
	
	store.getProxy().setExtraParam('offset', myreadings.conf.offset2);
	store.load();
	var articlesView= this.getArticlesserieslist();

	//empty the store before adding the new one
	var  articlesStore = articlesView.getStore();
	if (articlesStore) {
            articlesStore.removeAll();
        }

	articlesView.setStore(store);
	
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
	    //Ext.getCmp('searchview').show();
	    this.getMain().setActiveItem(2);
    },
    onConfigTap: function() {
	    //Ext.getCmp('configpanel').down('#comicSettings').onInit();
	    this.getMain().setActiveItem(1);
	    //Ext.getCmp('configpanel').show();
    },
    activateCarousel: function() {
	    this.getMain().setActiveItem(0);
    },
    
    loadliststore: function(list, search) {
        var listview = Ext.getCmp('listview');
        var store = listview.getStore();
	store.getProxy().setExtraParam('pathbase',myreadings.conf.pathbase);
	store.getProxy().setExtraParam('mylogin',myreadings.conf.username);
        store.getProxy().setExtraParam('mypass',myreadings.conf.password);
	store.getProxy().setExtraParam('list', list);
	store.getProxy().setExtraParam('userid', myreadings.conf.current_userid);
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
				open_current_comic_at_launch: myreadings.settings.open_current_comic_at_launch,
				showresize: myreadings.settings.showresize,
				hidemenu: myreadings.settings.hidemenu
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
				currentuser: myreadings.conf.current_user,
				showifread: myreadings.conf.showifread,
				order: this.order,
				gpseries: this.gpseries,
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
				showresize: myreadings.settings.showresize,
				hidemenu: myreadings.settings.hidemenu,
				
				epub_mode: myreadings.settings.epub_mode,
				epub_font: myreadings.settings.epub_font,
				epub_fontsize: myreadings.settings.epub_fontsize,
				
				book_id: myreadings.currentbook.idbook,
				book_reading: myreadings.currentbook.reading,
				book_title: myreadings.currentbook.name,
				//book_idbase: myreadings.currentbook.idbase,
				book_path: myreadings.currentbook.path,
				book_currentpage: myreadings.currentbook.current_page_nr,
				book_pages: myreadings.currentbook.number_of_pages,
				book_type: myreadings.currentbook.book_type
				
				//list: this.list,
				//search: this.search
	    });
	    user.save();
    },
    
    
    //Pour réouvrir un livre
    openviewer: function() {
    	    if(myreadings.currentbook.book_type=="epub") {
    	    	  this.openepubviewer();
    	    } else if(myreadings.currentbook.book_type=="comic") {
    	    	    this.opencomicviewer();
    	    }
    },
    //Lecture cbz
    //Ouvert par bouton "Lire cbz" de article.js
    //Pour ouvrir un nouveau cbz au niveau du bookmark s'il existe ou à la page 1 sinon
    //Lance initComic
    comicviewer: function(book, path, bookmark) {
	    var comicView = this.getComicView();
	    //articleView.setData(record.data);
	    if (!comicView.getParent()) {
		    Ext.Viewport.add(comicView);
	    }
	    
	    //Mise à jour currentbook
	    //console.log(book.books[0]);
	    myreadings.currentbook.idbook=book.books[0].id;
	    myreadings.currentbook.name=book.books[0].title;
	    //myreadings.currentbook.idbase=Ext.getCmp('base').getRecord().data.text;
	    myreadings.currentbook.path=path;
	    myreadings.currentbook.book_type="comic";
	    
	    if(bookmark=="1"&&myreadings.conf.current_userid!="") {
		    Ext.Viewport.setMasked({xtype: 'loadmask'});
		    Ext.data.JsonP.request({
			    url: './tools.php',
			    callbackKey: 'callback',
			    params: {
				    action: "getpage",
				    mylogin: myreadings.conf.username,
				    mypass: myreadings.conf.password,
				    id: myreadings.currentbook.idbook,
				    base: myreadings.conf.txtbase,
				    type: myreadings.currentbook.book_type,
				    userid: myreadings.conf.current_userid
			    },
			    success: function(result, request) {
				    Ext.Viewport.setMasked(false);
				    if(result.success==false) alert(result.message);
				    else {
					 myreadings.currentbook.current_page_nr=parseInt(result.resultat.percent)-1;
				    	 //InitComic réinitialise la lecture en cours et renseigne myreadings.currentbook.number_of_pages
				    	 myreadings.app.getController('comic').initComic();
				    	 comicView.show();
				    }
			    },
			    failure: function(result, request) {
				    Ext.Viewport.setMasked(false);
				    alert('Php Error for bookmark.');
			    }
		    });
	    } else {
		    myreadings.currentbook.current_page_nr=0;
		    //InitComic réinitialise la lecture en cours et renseigne myreadings.currentbook.number_of_pages
		    myreadings.app.getController('comic').initComic();
		    comicView.show();
	    }
	    this.showViewerBt();
    },
    //Réouvre cbz à la page en cours: myreadings.currentbook.current_page_nr
    //Lance opencomic
    opencomicviewer: function() {
	    var comicView = (!this.getComicView()) ? Ext.create('App.view.comicview') : this.getComicView();
	    if (!comicView.getParent()) {
		    Ext.Viewport.add(comicView);
	    }
	    myreadings.app.getController('comic').openComic();
	    comicView.show();
    },
    
    //Lecture epub
    //Ouvert par bouton "Lire epub" de article.js
    //Pour ouvrir un nouvel epub au niveau du bookmark s'il existe ou à la page 1 sinon
    epubviewer: function(book, path, bookmark) {
    	   var epubView = this.getEpubView();
	    if (!epubView.getParent()) {
		    Ext.Viewport.add(epubView);
	    }
	    //Mise à jour currentbook
	    myreadings.currentbook.idbook=book.books[0].id;
	    myreadings.currentbook.name=book.books[0].title;
	    //myreadings.currentbook.idbase=Ext.getCmp('base').getRecord().data.text;
	    myreadings.currentbook.path=path;
	    myreadings.currentbook.book_type="epub";
	    if(bookmark=="1"&&myreadings.conf.current_userid!="") {
		    Ext.Viewport.setMasked({xtype: 'loadmask'});
		    Ext.data.JsonP.request({
			    url: './tools.php',
			    callbackKey: 'callback',
			    params: {
				    action: "getpage",
				    mylogin: myreadings.conf.username,
				    mypass: myreadings.conf.password,
				    id: myreadings.currentbook.idbook,
				    base: myreadings.conf.txtbase,
				    type: myreadings.currentbook.book_type,
				    userid: myreadings.conf.current_userid
			    },
			    success: function(result, request) {
				    Ext.Viewport.setMasked(false);
				    if(result.success==false) alert(result.message);
				    else {
				    	    myreadings.app.getController('epub').initEpub("new", result.resultat.componentId, result.resultat.percent);
				    }
			    },
			    failure: function(result, request) {
				    Ext.Viewport.setMasked(false);
				    alert('Php Error for bookmark.');
			    }
		    });
	    } else {
		    myreadings.app.getController('epub').initEpub("new", "", "");
	    }
	    this.showViewerBt();
	    //epubView.show();
    },
    //Pour réouvrir un epub à la page en cours (stocké dans un cookies par Monocle)
    openepubviewer: function() {
	    var epubView = (!this.getEpubView()) ? Ext.create('App.view.epubview') : this.getEpubView();
	    if (!epubView.getParent()) {
		    Ext.Viewport.add(epubView);
	    }
	    myreadings.app.getController('epub').openEpub();
    },
    
    showViewerBt: function() {
	    if(myreadings.currentbook.idbook==null) {
		    this.getViewerBt().hide();
		    this.getViewerBt2().hide();
	    } else {
		    this.getViewerBt().show();
		    this.getViewerBt2().show();
	    }
    },
    savebookmark: function() {
    	    this.saveusermark(myreadings.currentbook.idbook, myreadings.currentbook.book_type, myreadings.currentbook.current_page_nr+1, "", "bookmarkpage");
    },
    //idbook: id calibre du livre, type: epub ou comic (book_type)
    //mark: -1:lu, 0:non lu, numéro de page ou percent (pour epub)
    //componentId:Chapitre (fichier) de l'epub, action: bookmark: lu ou non lu ou bookmarkpage: marque l'emplacement
    saveusermark: function(idbook, type, mark, componentId, action) {
	    Ext.Viewport.setMasked({xtype: 'loadmask'});
	    var me=this;
	    Ext.data.JsonP.request({
		url: './tools.php',
		callbackKey: 'callback',
		params: {
			action: action,
			mylogin: myreadings.conf.username,
			mypass: myreadings.conf.password,
			id: idbook,
			base: myreadings.conf.txtbase,
			userid: myreadings.conf.current_userid,
			type: type,
			page: mark,
			componentId: componentId
		},
		success: function(result, request) {
			if(result.success==false) {
				alert(result.message);
				Ext.Viewport.setMasked(false);
			} else {
				var curbookmark;
				//Si c'est un marque-page (un numéro de page),
				//alors c'est 1 qui est la valeur du bookmark pour indiqué qu'il y a un marque page
				if(action=="bookmarkpage") mark=1;
				
				//Traitement du store du groupe
				if(!me.getArticlesserieslist().isHidden()&&me.getArticlesserieslist().getStore().findRecord('id',idbook)) {
					var store2=me.getArticlesserieslist().getStore();
					curbookmark=store2.findRecord('id',idbook).get("bookmark");
					store2.findRecord('id',idbook).set("bookmark",mark);
					me.getArticlesserieslist().refreshItems();
					//Explication dans la partie suivante...
					if(myreadings.conf.showifread!="all") {
						if(myreadings.conf.showifread!="notread") {
							if(mark==-1) {
								myreadings.conf.offse2t=myreadings.conf.offset2+1;
								store2.getProxy().setExtraParam('offset', myreadings.conf.offset2);
							} else if(curbookmark==-1) {
								myreadings.conf.offset2=myreadings.conf.offset2-1;
								store2.getProxy().setExtraParam('offset', myreadings.conf.offset2);
							}
						} else {//read
							if(mark==-1) {
								myreadings.conf.offset2=myreadings.conf.offset2-1;
								store2.getProxy().setExtraParam('offset', myreadings.conf.offset2);
							} else if(curbookmark==-1) {
								myreadings.conf.offset2=myreadings.conf.offset2+1;
								store2.getProxy().setExtraParam('offset', myreadings.conf.offset2);
							}
						}
					}
				}
				
				var record=me.getArticleslist().getStore().findRecord('id',idbook);
				//Si le livre est dans la liste et n'est pas dans un groupe
				if(record&&(record.get("nbgp")==null||record.get("nbgp")==1)) {
					curbookmark=record.get("bookmark");
					record.set("bookmark",mark);
					me.getArticleslist().refreshItems();
					//Gestion du offset (pour décaler la limite du min/max dans recordsjson: max=max-offset)
					if(myreadings.conf.showifread!="all") {
						//Cas de l'affichage des non lus
						if(myreadings.conf.showifread!="notread") {
							//Le nouveau bookmark indique lu, il ne l'était donc pas
							if(mark==-1) {
								//Il faut augmenter l'offset car il y aura un livre de moins dans la requête
								myreadings.conf.offset=myreadings.conf.offset+1;
								me.getArticleslist().getStore().getProxy().setExtraParam('offset', myreadings.conf.offset);
								//Remove pour l'enlever du store, non utilisé...
								//me.getArticleslist().getStore().remove(record);
							} else if(curbookmark==-1) {
								//Il n'est plus indiqué comme lu mais il l'était: diminuer l'offset car le livre revient dans la liste
								//S'il n'était pas lu (affectation d'un marque-page), pas de changment d'offset
								myreadings.conf.offset=myreadings.conf.offset-1;
								me.getArticleslist().getStore().getProxy().setExtraParam('offset', myreadings.conf.offset);
							}
						} else {//Cas des lus
							//Le nouveau bookmark indique lu, il sera de nouveau dans la liste
							if(mark==-1) {
								myreadings.conf.offset=myreadings.conf.offset-1;
								me.getArticleslist().getStore().getProxy().setExtraParam('offset', myreadings.conf.offset);
							} else if(curbookmark==-1) {
								//Il n'est plus lu mais il l'était : augmenter l'offset
								//S'il n'était pas lu (affectation d'un marque-page), pas de changment d'offset
								myreadings.conf.offset=myreadings.conf.offset+1;
								me.getArticleslist().getStore().getProxy().setExtraParam('offset', myreadings.conf.offset);
							}
						}
					}
					Ext.Viewport.setMasked(false);
				} else {
					var serieid="";
					//S'il est dans un groupe pour une série, il faut chercher ce groupe
					if(!record&&me.gpseries==1) {
						serieid=result.resultat.serieid;
						record=me.getArticleslist().getStore().findRecord('serieid',serieid);
					}
					//si le livre ou son groupe est trouvé
					if(record) {
						serieid=record.get("serieid");
						//Récupère l'état du groupe
						var params= me.getArticleslist().getStore().getProxy().getExtraParams();
						Ext.data.JsonP.request({
							url: './recordsjson.php',
							callbackKey: 'callback',
							params: {
								mylogin: params.mylogin,
								mypass: params.mypass,
								pathbase: params.pathbase,
								order: params.order,
								gpseries: 2,
								type: params.type,
								find: params.find,
								start: params.start,
								idlist: params.idlist,
								userid: params.userid,
								showifread: params.showifread,
								findserie: serieid,
								offset: 0
							},
							success: function(result, request) {
								if(result.books[0]) {
									record.set("bookmark", result.books[0].bookmark);
									record.set("hasCover", result.books[0].hasCover);
									record.set("id", result.books[0].id);
									record.set("relativePath", result.books[0].relativePath);
									record.set("seriesIndex", result.books[0].seriesIndex);
									record.set("pubDate", result.books[0].pubDate);
									record.set("tagsName", result.books[0].tagsName);
									record.set("title", result.books[0].title);
									record.set("nbgp", result.books[0].nbgp);
									record.set("read", result.books[0].read);
									record.set("reading", result.books[0].reading);
								} else {
									//Should no exist
									console.log("No result");
									//Affecte 0 à ngp car le groupe reste affiché mais indique qu'il n'y a plus rien
									record.set("nbgp", 0);
									if(myreadings.conf.showifread=="notread") {
										//Pour indiquer que c'est lu: ngp=read
										record.set("read", 0);
									} else {
										//pour indiquer que c'est non lu ngp!=read
										record.set("read", 1);
									}
								}
								me.getArticleslist().refreshItems();
								Ext.Viewport.setMasked(false);
							},
							failure: function(result, request) {
								Ext.Viewport.setMasked(false);
								alert('Php Error.');
							}
						});
					}
				}					    
			}
		},
		failure: function(result, request) {
			Ext.Viewport.setMasked(false);
			alert('Php Error for bookmark.');
		}
	    });
    },
    onBookmarkbt: function(button, cur_bookmark) {
	    var view = (!this.getBookmarkView()) ? Ext.create('App.view.bookmarkview') : this.getBookmarkView();
	    if (!view.getParent()) {
		Ext.Viewport.add(view);
		this.getTitleBookmarkView().setTitle(this.localtxt.txtBookmark);
	    }
	    //console.log(cur_bookmark);
	    if(cur_bookmark==null||cur_bookmark=="0") {
	    	    this.getTxtBookmarkView().setHtml(this.localtxt.notread);
	    	    this.getBtBookmarkView().setText(this.localtxt.markread);
	    } else if(cur_bookmark=="-1") {
	    	    this.getTxtBookmarkView().setHtml(this.localtxt.read);
	    	    this.getBtBookmarkView().setText(this.localtxt.marknotread);
	    } else {
	    	   this.getTxtBookmarkView().setHtml(this.localtxt.reading);
	    	   this.getBtBookmarkView().setText(this.localtxt.markread);
	    }
	    view.showBy(button);
    },
    onBtOrderTap: function(button) {
    	    var view = this.getOrderview();
    	    if (!view.getParent()) {
		Ext.Viewport.add(view);
	    }
	    view.showBy(button);
    },
    onBtBookmarkViewTap: function() {
    	    var bookid=this.getArticleView().bookid;
    	    var bookmark=this.getArticleView().bookmark;
    	    //var bookmark=this.getArticleslist().getStore().findRecord('id',bookid).get("bookmark");
    	   if(bookmark=="-1") {
    	   	   this.saveusermark(bookid, "", "0", "", "bookmark");
    	   } else {
    	   	   this.saveusermark(bookid, "", -1, "", "bookmark");
    	   }
    	   this.getBookmarkView().hide();
    	   this.getArticleView().hide();
    },
    //Non nécessaire pour le résumé du livre.
    nl2br: function(str) {
	    // Converts newlines to HTML line breaks
	    var breakTag = '<br />';
	    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
    }
    
});
