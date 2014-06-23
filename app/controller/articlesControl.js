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
	    loginfieldset: 'configpanel #loginfieldset',
	    loginBt: 'configpanel #loginbutton',
	    saveaccount: 'configpanel #saveaccount',
	    restoreaccount: 'configpanel #restoreaccount',
	    usernameCt: 'configpanel #login',
	    passwordCt: 'configpanel #pass',
	    btconfigpanelhide: 'configpanel #bthide',
	    txtlogin: 'configpanel #txtlogin',
	    configlistuser: 'configpanel #listuser',
	    configtools: 'configpanel #tools',
	    configViewer: 'configpanel #configViewer',
	    open_book_at_launch: 'configpanel #open_book_at_launch',
	    showresize: 'configpanel #showresize',
	    hidemenu: 'configpanel #hidemenu',
	    forcedThumb: 'configpanel #forced',
	    profil: 'configpanel #profil',
	    chg_nbbook: 'configpanel #chg_nbbook',
	    showcust: 'configpanel #showcust',
	    configport: 'configpanel #configport',
	    configland: 'configpanel #configland',
	    landline: 'configpanel #landline',
	    landbyline: 'configpanel #landbyline',
	    portline: 'configpanel #portline',
	    portbyline: 'configpanel #portbyline',
	    chgcarouselbutton: 'configpanel #chgcarouselbutton',
	    
	    typelistfind: 'listview [name=typelist]',
	    searchfieldfind: 'listview [name=listviewSearchfield]',
	    btsearchfind: 'listview [name=btsearch]',
	    btlistviewhide: 'listview [name=bthide]',
	    btsearchhide: 'searchpanel [name=bthide]',
	    btshowfilter: 'searchpanel #btshowfilter',
	    btnofilter: 'searchpanel #btnofilter',
	    txtfilter: 'searchpanel #txtfilter',
	    
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
	    orderfield: 'orderview #order',
	    seriegroup: 'orderview #seriegroup',
	    showIfRead: 'orderview #showIfRead',
	    btOrder: 'articleslist #btOrder',
	    
	    filterview: 'filterview',
	    bthidefilter: 'filterview #bthide',
	    typelistfindfilter: 'filterview #typelist',
	    searchfieldfindfilter: 'filterview #searchfield',
	    btsearchfindfilter: 'filterview #btsearch'
	    
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
	    btshowfilter: {
		    tap: 'showfilter'
	    },
	    btnofilter: {
		    tap: 'nofilter'
	    },
	    btlistviewhide: {
		    tap: 'activateCarousel'
	    },
	    chg_nbbook: {
		    change: 'onChangeChg_nbbook'
	    },
	    chgcarouselbutton: {
		    tap: 'onChgcarouselbuttonTap'
	    },
	    bthidefilter: {
		    tap: 'hidefilter'
	    },
	    typelistfindfilter: {
		    change: 'onChangeFilterView'
	    },
	    searchfieldfindfilter: {
		    action: 'onChangeFilterView'
	    },
	    btsearchfindfilter: {
		    tap: 'onChangeFilterView'
	    },
	    saveaccount: {
		    tap: 'onSaveaccount'
	    },
	    restoreaccount: {
		    tap: 'onRestoreaccount'
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
	
        me.callParent();
	me.isList = false;
	if(!me.isInit) {
		myreadings.tempconf = {};
		myreadings.tempconf.offset=0; //Pour calculer le décalage dans le carousel avec les bookmarks
		myreadings.tempconf.offset2=0; //Pour calculer le décalage dans le carousel d'une série avec les bookmarks
		myreadings.tempconf.forced="false"; //Pour refaire la couverture
		myreadings.tempconf.current_userid=""; //Id du user (suivant la base)
		myreadings.tempconf.userchoice="no";
		//Sera configuré en fonction des paramètres serveur:
		//myreadings.tempconf.fetchmode
		//myreadings.tempconf.epubview
		//myreadings.tempconf.cbzview
		//myreadings.tempconf.cbrview
		//myreadings.tempconf.txtbase
		
		Ext.ModelMgr.getModel('myreadings.model.myreadingsConf').load("1", {
			scope: this,
			success: function(cachedLoggedInUser) {
				delete cachedLoggedInUser.phantom;
				myreadings.conf = cachedLoggedInUser;
			},
			failure : function() {				
				myreadings.conf= Ext.create('myreadings.model.myreadingsConf', {
					id: "1",
					chg_nbbook: 0
				});
				//myreadings.conf.save();
			}
		});
		
		
		Ext.ModelMgr.getModel('myreadings.model.myreadingsUser').load("1", {
			scope: this,
			success: function(cachedLoggedInUser) {
				delete cachedLoggedInUser.phantom;
				
				myreadings.user = cachedLoggedInUser;				

				
				console.info('Auto-Login succeeded.');
			},
			failure : function() {				
				myreadings.user= Ext.create('myreadings.model.myreadingsUser', {
					id: "1",
					username: "",
					password: "",
					
					order: "recent",
					gpseries: 0,
					showifread: "all",
					
					currentuser: "",
					open_current_comic_at_launch: 1,
					showresize: 0,
					hidemenu: 0,
					
					zoom_on_tap: 1,
					toggle_paging_bar: 2,
					page_turn_drag_threshold: 75,
					page_fit_mode: 1,
					page_change_area_width: 50,
					epub_mode: "jour",
					epub_font: "arial",
					epub_fontsize: "1.45",
					
					pathbase: "",
					namelistfilter: "",
					listfilter: "",
					namefilter: "",
					find: "",
					type: "",
					start: "",
					idlist: "",
					
					book_reading: false
				});
				//myreadings.tempconf.newaccount=true;
				//myreadings.user.save();
				

				console.warn('Auto-Login failed (user was not logged in).');
			}
		});
	}
	Ext.data.JsonP.request({
            url: './getConfig.php',
            callbackKey: 'callback',
            params: {
            	   mylogin: myreadings.user.get('username'),
            	   mypass: myreadings.user.get('password'),
		   isinit: me.isInit
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
				
				if(myreadings.conf.get('chg_nbbook')!=1) me.defaultProfil();
				Ext.Viewport.add(Ext.create('myreadings.view.main'));
				me.articleView = Ext.create('myreadings.view.article');
				Ext.Viewport.add(Ext.create('myreadings.view.articlesserieslist'));
				Ext.create('myreadings.view.orderview');
			}
			
			if(result.config.connect=="noprotect"||result.config.connect=="protectok") {
				//Lancé s'il y a eu un premier refus de connection.
				if(me.isInit==true) {
					//Nouvelle connection, récupère les paramètres du compte sur le serveur s'ils existent
					//(résultats dans getconfig.php si me.isInit==true)
					
					if(result.account) {
						for (var param in result.account) {
							myreadings.user.set(param, result.account[param]);
							myreadings.user.save();
						}
					} else myreadings.user.save();
					
					me.getBtconfigpanelhide().show();
					me.getConfigViewer().show();
					me.getMain().setActiveItem(0);
					
				}
				
				myreadings.tempconf.fetchmode=result.config.fetchmode;
				
				myreadings.tempconf.epubview=result.config.epubview;
				myreadings.tempconf.cbzview=result.config.cbzview;
				myreadings.tempconf.cbrview=result.config.cbrview;
				
				me.bases = result.config.bases;
				var newOptions = [];
				var basevalue="";
				for (var base in me.bases) {
					newOptions.push({text: base,  value: me.bases[base]});
					//Cherche si la dernière base utilisée peut être réouverte
					if(me.bases[base]==myreadings.user.get('pathbase')) basevalue=me.bases[base];
				}
				Ext.getCmp('base').setOptions(newOptions);
				if(basevalue!="") Ext.getCmp('base').setValue(basevalue);
				else myreadings.user.set('book_reading', false);
				
				//Etat disabled car test dans la fonction change du selectfield pour ne pas déclencher le lancement de change
				//Passe en enabled ensuite
				Ext.getCmp('base').enable();
				
				myreadings.user.set('pathbase', Ext.getCmp('base').getValue());
				myreadings.tempconf.txtbase=Ext.getCmp('base').getRecord().data.text;
				
				//console.log("set profil dans config panel " + me.profil);
				me.getProfil().setTitle(me.localtxt.txtProfil+": "+me.localtxt[me.profil]);
				me.getChg_nbbook().setValue(myreadings.conf.get('chg_nbbook'));
				me.getShowcust().setValue(myreadings.conf.get('showcust'));
				me.getLandline().setValue(myreadings.conf.get('landline'));
				me.getLandbyline().setValue(myreadings.conf.get('landbyline'));
				me.getPortline().setValue(myreadings.conf.get('portline'));
				me.getPortbyline().setValue(myreadings.conf.get('portbyline'));
				me.getChg_nbbook().enable();
				me.getProfil().show();
				if(myreadings.conf.get('chg_nbbook')==1) {
					me.getConfigport().show();
					me.getConfigland().show();
				}
				me.getOpen_book_at_launch().setValue(myreadings.user.get('open_current_comic_at_launch'));
				me.getOpen_book_at_launch().enable();
				me.getShowresize().setValue(myreadings.user.get('showresize'));
				me.getShowresize().enable();
				
				me.getHidemenu().setValue(myreadings.user.get('hidemenu'));
				me.getHidemenu().enable();
				
				if(myreadings.tempconf.fetchmode=="resize_and_cache") {
					//me.getForcedThumb().show();
					me.getConfigtools().show();
				}
				
				//Init user
				if(result.config.connect=="noprotect") {
					myreadings.tempconf.userchoice="free";
					me.getTxtlogin().hide();
				} else {
					if(result.config.account[0]=="Forced") myreadings.tempconf.userchoice="forced";
					else if(result.config.account[0]=="Free") myreadings.tempconf.userchoice="free";
				}
				if(myreadings.tempconf.userchoice=="no") {
					myreadings.user.set('currentuser', "");
					me.getTxtlogin().setHtml(me.localtxt.account+": "+myreadings.user.get('username'));
					me.getShowIfRead().hide();
				} else if(myreadings.tempconf.userchoice=="forced") {
					myreadings.user.set('currentuser', result.config.account[1]);
					me.getTxtlogin().setHtml(me.localtxt.account+": "+myreadings.user.get('username')+ " " + me.localtxt.user+": "+myreadings.user.get('currentuser'));
					me.getShowIfRead().setValue(myreadings.user.get('showifread'));
					me.getShowIfRead().enable();
				} else {
					if(result.config.connect!="noprotect") {
						me.getTxtlogin().setHtml(me.localtxt.account+": "+myreadings.user.get('username'));
						if(myreadings.user.get('currentuser')=="") myreadings.user.set('currentuser', result.config.account[1]);
					}
					var listusers = result.config.users;
					if(listusers!="") {
						newOptions = [];
						var uservalue="";
						for (var usernum in listusers) {
							newOptions.push({text: listusers[usernum],  value: listusers[usernum]});
							//Cherche si la dernière base utilisée peut être réouverte
							if(listusers[usernum]==myreadings.user.get('currentuser')) uservalue=listusers[usernum];
						}
						me.getConfiglistuser().setOptions(newOptions);
						if(uservalue!="") me.getConfiglistuser().setValue(uservalue);
						
						//Etat disabled car test dans la fonction change du selectfield pour ne pas déclencher le lancement de change
						//Passe en enabled ensuite
						me.getConfiglistuser().enable();
						
						myreadings.user.set('currentuser', me.getConfiglistuser().getValue());
						
						me.getShowIfRead().setValue(myreadings.user.get('showifread'));
						me.getShowIfRead().enable();
						me.getConfiglistuser().show();
						
					} else {
						myreadings.user.set('currentuser', "");
					}
				}
				
				//Initialisation de order
				var orderfield=me.getOrderfield().getOptions();
				for (var myorder in orderfield) {
					if(orderfield[myorder].value==myreadings.user.get('order')) me.getOrderfield().setValue(myreadings.user.get('order'));
				}
				me.getOrderfield().enable();
				
				me.getSeriegroup().setValue(myreadings.user.get('gpseries'));
				me.getSeriegroup().enable();
				
				//Indique le filtre en cours dans searchpanel
				if(myreadings.user.get('listfilter')!="") {
					me.getTxtfilter().setHtml(me.localtxt.txtFilter+" - "+ myreadings.user.get('namelistfilter') + ": " + myreadings.user.get('namefilter'));
					me.getBtnofilter().show();
				} else {
					me.getTxtfilter().setHtml(me.localtxt.nofilter);
				}
				
				//S'il y a un user, il faut récupérer son id (qui peut changer suivant la base utilisée)
				if(myreadings.user.get('currentuser')!="") {
				Ext.data.JsonP.request({
					url: './tools.php',
					callbackKey: 'callback',
					params: {
						action: "getuserid",
						mylogin: myreadings.user.get('username'),
						mypass: myreadings.user.get('password'),
						base: myreadings.tempconf.txtbase,
						user: myreadings.user.get('currentuser')
					},
					success: function(result, request) {
						//Ext.Viewport.setMasked(false);
						if(result.success==false) alert(result.message);
						else {
							myreadings.tempconf.current_userid=result.resultat;
						}
						me.showArticles();
						if(myreadings.user.get('open_current_comic_at_launch')==1&&myreadings.user.get('book_reading')) me.openviewer();
					},
					failure: function(result, request) {
						Ext.Viewport.setMasked(false);
						alert('Php Error for userid.');
					}
				});
				} else {
				me.showArticles();
				if(myreadings.user.get('open_current_comic_at_launch')==1&&myreadings.user.get('book_reading')) me.openviewer();
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
					me.getUsernameCt().hide();
					me.getPasswordCt().hide();
					me.getLoginBt().hide();
					me.getLoginfieldset().setTitle("");
				} else {
					me.logged = true;
					me.getLoginBt().setText(me.localtxt.notlogin);
					me.getUsernameCt().hide();
					me.getPasswordCt().hide();
					me.getTxtlogin().show(); 
					me.getSaveaccount().show();
					me.getRestoreaccount().show();
				}
				
				//Ouverture OK - Effacement du cache ancien des cbz
				Ext.data.JsonP.request({
						url: './tools.php',
						callbackKey: 'callback',
						params: {
							action: "cache",
							mylogin: myreadings.user.get('username'),
							mypass: myreadings.user.get('password')
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
 	myreadings.tempconf.offset=0;
 	var store = Ext.create("Ext.data.Store", {
    	    model: "myreadings.model.article",
    	    pageSize: 100,
    	    clearOnPageLoad: false
        });
        if(data) {
        	if(data.debut==4) {//changement d'ordre de tri demandé
			store.getProxy().setExtraParam('order', data.order);
			myreadings.user.set('order', data.order);
		} else if(data.debut==3) {//lancement depuis listview
			store.getProxy().setExtraParam('type', data.type);
			store.getProxy().setExtraParam('idlist', data.idlist);
			myreadings.user.set('type', data.type);
			myreadings.user.set('idlist', data.idlist);
		} else if(data.debut==5) {//changement de base calibre, ouvre tout: type=all
			//et enlever le filtre
			//console.log("changement de base calibre, ouvre tout: type=all");
			//store.getProxy().setExtraParam('pathbase',data.pathbase);
			store.getProxy().setExtraParam('type', data.type);
			store.getProxy().setExtraParam('userid', myreadings.tempconf.current_userid);			
			myreadings.user.set('pathbase', data.pathbase);
			myreadings.tempconf.txtbase=Ext.getCmp('base').getRecord().data.text;
			store.getProxy().setExtraParam('txtbase', myreadings.tempconf.txtbase);
			
			//enlève le filtre
			store.getProxy().setExtraParam('listfilter', "");
			myreadings.user.set('listfilter', "");
			this.getTxtfilter().setHtml(this.localtxt.nofilter);
			this.getBtnofilter().hide();
			//et vide le proxy de la liste du filtre pour indiquer qu'il faut la réinitialiser
			if(this.getFilterview()) {
				this.getFilterview().getStore().getProxy().setExtraParam('list', "");
			}
			myreadings.user.set('type', data.type);
		} else if(data.debut==6) {//changement de user	
			store.getProxy().setExtraParam('userid', myreadings.tempconf.current_userid);
		} else if(data.debut==7) {//groupé pas serie ou pas
			myreadings.user.set('gpseries', data.gpseries);
			store.getProxy().setExtraParam('gpseries', myreadings.user.get('gpseries'));
		} else if(data.debut==8) {//pour choisir tous, non lus, lus
			myreadings.user.set('showifread', data.showifread);
			store.getProxy().setExtraParam('showifread', myreadings.user.get('showifread'));
		} else if(data.debut==9) {//applique un premier filtre
			store.getProxy().setExtraParam('listfilter', data.listfilter);
			store.getProxy().setExtraParam('idfilter', data.idfilter);
			myreadings.user.set('listfilter', data.listfilter);
			myreadings.user.set('idfilter', data.idfilter);
			myreadings.user.set('namelistfilter', data.namelistfilter);
			myreadings.user.set('namefilter', data.namefilter);
			if(data.listfilter!="") {
				this.getTxtfilter().setHtml(this.localtxt.txtFilter+" - "+myreadings.user.get('namelistfilter') + ": " + myreadings.user.get('namefilter'));
				this.getBtnofilter().show();
			} else {
				this.getTxtfilter().setHtml(this.localtxt.nofilter);
				this.getBtnofilter().hide();
			}
		} else {//lancement depuis searchpanel
			store.getProxy().setExtraParam('type', data.type);
			store.getProxy().setExtraParam('find', data.find);
			store.getProxy().setExtraParam('start', data.debut);
			
			myreadings.user.set('type', data.type);
			myreadings.user.set('debut', data.debut);
			myreadings.user.set('find', data.find);
		}
		myreadings.user.save();
        } else {
		//lors du premier lancement, pas de data car requête par défaut
		store.getProxy().setExtraParam('txtbase', myreadings.tempconf.txtbase);
		
		store.getProxy().setExtraParam('mylogin', myreadings.user.get('username'));
		store.getProxy().setExtraParam('mypass', myreadings.user.get('password'));
		store.getProxy().setExtraParam('order', myreadings.user.get('order'));
		store.getProxy().setExtraParam('gpseries', myreadings.user.get('gpseries'));
		store.getProxy().setExtraParam('type', myreadings.user.get('type'));
		store.getProxy().setExtraParam('find', myreadings.user.get('find'));
		store.getProxy().setExtraParam('start', myreadings.user.get('start'));
		store.getProxy().setExtraParam('idlist', myreadings.user.get('idlist'));
		store.getProxy().setExtraParam('userid', myreadings.tempconf.current_userid);
		store.getProxy().setExtraParam('showifread', myreadings.user.get('showifread'));
		store.getProxy().setExtraParam('showcust', myreadings.conf.get('showcust'));
		store.getProxy().setExtraParam('listfilter', myreadings.user.get('listfilter'));
		store.getProxy().setExtraParam('idfilter', myreadings.user.get('idfilter'));
	}
	
	store.getProxy().setExtraParam('offset', myreadings.tempconf.offset);
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
    	    if(this.getArticlesserieslist().isHidden()&&myreadings.user.get('gpseries')=="1"&&record.data.nbgp!=1) {
    	    	    this.showArticlesSeries(record.data)
		    this.getTitlebarserie().setTitle(record.data.seriesName);
    	    	    this.getArticlesserieslist().show();
    	    } else {
		    if(myreadings.tempconf.forced=="true") {
		    Ext.Viewport.setMasked({xtype: 'loadmask'});
		    var me= this;
		    Ext.data.JsonP.request({
			    url: './cover.php',
			    callbackKey: 'callback',
			    params: {
				    path: record.data.relativePath,
				    id: record.data.id,
				    forced: "true",
				    base: myreadings.tempconf.txtbase,
				    mylogin: myreadings.user.get('username'),
				    mypass: myreadings.user.get('password')
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
    	myreadings.tempconf.offset2=0;
 	var store = Ext.create("Ext.data.Store", {
    	    model: "myreadings.model.article2",
    	    pageSize: 100,
    	    clearOnPageLoad: false
        });
        //console.log(data);
        	
	//Initialise le proxy
	store.getProxy().setExtraParam('txtbase', myreadings.tempconf.txtbase);
	store.getProxy().setExtraParam('mylogin', myreadings.user.get('username'));
	store.getProxy().setExtraParam('mypass', myreadings.user.get('password'));
	store.getProxy().setExtraParam('order', myreadings.user.get('order'));
	store.getProxy().setExtraParam('type', myreadings.user.get('type'));
	store.getProxy().setExtraParam('find', myreadings.user.get('find'));
	store.getProxy().setExtraParam('start', myreadings.user.get('start'));
	store.getProxy().setExtraParam('idlist', myreadings.user.get('idlist'));
	store.getProxy().setExtraParam('userid', myreadings.tempconf.current_userid);
	store.getProxy().setExtraParam('showifread',myreadings.user.get('showifread'));
	store.getProxy().setExtraParam('listfilter', myreadings.user.get('listfilter'));
	store.getProxy().setExtraParam('idfilter', myreadings.user.get('idfilter'));

	//cherche par seriesName
	store.getProxy().setExtraParam('gpseries', -1);
	store.getProxy().setExtraParam('findserie', data.serieid);
	//store.getProxy().setExtraParam('findserie', data.seriesName);
	
	store.getProxy().setExtraParam('offset', myreadings.tempconf.offset2);
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
			id: myreadings.user.get('book_id'),
			title:myreadings.user.get('book_title'),
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
	store.getProxy().setExtraParam('pathbase',myreadings.user.get('pathbase'));
	store.getProxy().setExtraParam('mylogin',myreadings.user.get('username'));
        store.getProxy().setExtraParam('mypass',myreadings.user.get('password'));
	store.getProxy().setExtraParam('list', list);
	store.getProxy().setExtraParam('userid', myreadings.tempconf.current_userid);
        store.getProxy().setExtraParam('search', search);
	//Affiche le début de la liste
	if(listview.getScrollable().getScroller()) listview.getScrollable().getScroller().scrollTo(0, 0);
	//Autre solution:
	//me.doComponentLayout();
	//me.refresh();
	store.loadPage(1);
	this.isList=true;
    },
    showfilter: function() {
        var filterview = this.getFilterview();
	if (!filterview) {
		console.log("no in view");
		Ext.Viewport.add(Ext.create('myreadings.view.filterview'));
		filterview = this.getFilterview();
		this.loadfilterstore("tag", "");
	} else {
		//réinit si pas de liste par défaut (en cas de changement de base)
		if(filterview.getStore().getProxy().getExtraParams()['list']=="") {
			this.getSearchfieldfindfilter().setValue("");
			this.loadfilterstore(this.getTypelistfindfilter().getValue(), "");
		}
	}
	filterview.show();
    },
    nofilter: function() {
	    this.changefilter(0, "", "", "");
    },
    changefilter: function(idfilter, listfilter, namefilter, namelistfilter) {
	    this.showArticles({
		idfilter: idfilter,
		listfilter: listfilter,
		namefilter: namefilter,
		namelistfilter: namelistfilter,
		debut: 9
	    });
	    this.activateCarousel();
    },
    loadfilterstore: function(list, search) {
	var filterview = this.getFilterview();
	var store = filterview.getStore();
	store.getProxy().setExtraParam('pathbase',myreadings.user.get('pathbase'));
	store.getProxy().setExtraParam('mylogin',myreadings.user.get('username'));
        store.getProxy().setExtraParam('mypass',myreadings.user.get('password'));
	store.getProxy().setExtraParam('list', list);
	store.getProxy().setExtraParam('userid', myreadings.tempconf.current_userid);
        store.getProxy().setExtraParam('search', search);
	//Affiche le début de la liste
	if(filterview.getScrollable().getScroller()) filterview.getScrollable().getScroller().scrollTo(0, 0);
	store.loadPage(1);
    },
    hidefilter: function() {
	    this.getFilterview().hide();
    },
    onChangeFilterView: function() {
	    this.loadfilterstore(this.getTypelistfindfilter().getValue(), this.getSearchfieldfindfilter().getValue());
    },
    onSaveaccount: function() {
    	    Ext.Viewport.setMasked({xtype: 'loadmask'});
    	    Ext.Ajax.request({
		url: './tools.php',
		callbackKey: 'callback',
		method: 'POST',
		params: {
			action: "saveaccount",
			mylogin: myreadings.user.get('username'),
			mypass: myreadings.user.get('password')
		},
		jsonData: {
			account: myreadings.user.getData()
		},
		success: function(result){
			Ext.Viewport.setMasked(false);
			
		},
		failure: function(response) {
			Ext.Viewport.setMasked(false);
			alert('Save Account: Error.');
		}
	    }); 
     },
    onRestoreaccount: function() {
    	    var accountinit = {
		    order: "recent",
		    gpseries: 0,
		    showifread: "all",
		    
		    open_current_comic_at_launch: 1,
		    showresize: 0,
		    hidemenu: 0,
		    
		    zoom_on_tap: 1,
		    toggle_paging_bar: 2,
		    page_turn_drag_threshold: 75,
		    page_fit_mode: 1,
		    page_change_area_width: 50,
		    epub_mode: "jour",
		    epub_font: "arial",
		    epub_fontsize: "1.45"
	    };
	    for (var param in accountinit) {
		    myreadings.user.set(param, accountinit[param]);
		    myreadings.user.save();
		    window.location.reload();
	    }
    },
    
    onLoginTap: function() {
	if(this.logged!=true) {
		if(!Ext.isEmpty(this.getPasswordCt().getValue()) && !Ext.isEmpty(this.getUsernameCt().getValue())) {
			console.log("save login");
			myreadings.user.set('username', this.getUsernameCt().getValue());
			myreadings.user.set('password', this.getPasswordCt().getValue());
			//myreadings.user.save();
			this.init();
		} else Ext.Msg.alert(this.localtxt.error,this.localtxt.mustloginandpass);
	} else {
		Ext.Msg.confirm(this.localtxt.msg, this.localtxt.notloginconfirm, function(confirmed) {
					if (confirmed == 'yes') {
						Ext.ModelMgr.getModel('myreadings.model.myreadingsUser').getProxy().clear();
						window.location.reload();
					}
				}, this);
		
		/*Ext.ModelMgr.getModel('myreadings.model.myreadingsUser').load(1, {
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
		}, this);*/
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

    
    //Pour réouvrir un livre
    openviewer: function() {
    	    if(myreadings.user.get('book_type')=="epub") {
    	    	  this.openepubviewer();
    	    } else if(myreadings.user.get('book_type')=="comic") {
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
	    myreadings.user.set('book_id', book.books[0].id);
	    myreadings.user.set('book_title', book.books[0].title);
	    myreadings.user.set('book_path', path);
	    myreadings.user.set('book_type', "comic");
	    
	    if(bookmark=="1"&&myreadings.tempconf.current_userid!="") {
		    Ext.Viewport.setMasked({xtype: 'loadmask'});
		    Ext.data.JsonP.request({
			    url: './tools.php',
			    callbackKey: 'callback',
			    params: {
				    action: "getpage",
				    mylogin: myreadings.user.get('username'),
				    mypass: myreadings.user.get('password'),
				    id: myreadings.user.get('book_id'),
				    base: myreadings.tempconf.txtbase,
				    type: myreadings.user.get('book_type'),
				    userid: myreadings.tempconf.current_userid
			    },
			    success: function(result, request) {
				    Ext.Viewport.setMasked(false);
				    if(result.success==false) alert(result.message);
				    else {
					 myreadings.user.set('book_currentpage', parseInt(result.resultat.percent)-1);
				    	 //InitComic réinitialise la lecture en cours et renseigne book_pages
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
		    myreadings.user.set('book_currentpage', 0);
		    //InitComic réinitialise la lecture en cours et renseigne book_pages
		    myreadings.app.getController('comic').initComic();
		    comicView.show();
	    }
	    this.showViewerBt();
    },
    //Réouvre cbz à la page en cours: book_currentpage
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
	    myreadings.user.set('book_id', book.books[0].id);
	    myreadings.user.set('book_title', book.books[0].title);
	    myreadings.user.set('book_path', path);
	    myreadings.user.set('book_type', "epub");
	    if(bookmark=="1"&&myreadings.tempconf.current_userid!="") {
		    Ext.Viewport.setMasked({xtype: 'loadmask'});
		    Ext.data.JsonP.request({
			    url: './tools.php',
			    callbackKey: 'callback',
			    params: {
				    action: "getpage",
				    mylogin: myreadings.user.get('username'),
				    mypass: myreadings.user.get('password'),
				    id: myreadings.user.get('book_id'),
				    base: myreadings.tempconf.txtbase,
				    type: myreadings.user.get('book_type'),
				    userid: myreadings.tempconf.current_userid
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
	    if(myreadings.user.get('book_id')==null) {
		    this.getViewerBt().hide();
		    this.getViewerBt2().hide();
	    } else {
		    this.getViewerBt().show();
		    this.getViewerBt2().show();
	    }
    },
    savebookmark: function() {
    	    this.saveusermark(myreadings.user.get('book_id'), myreadings.user.get('book_type'), myreadings.user.get('book_currentpage')+1, "", "bookmarkpage");
    },
    //book_id: id calibre du livre, type: epub ou comic (book_type)
    //mark: -1:lu, 0:non lu, numéro de page ou percent (pour epub)
    //componentId:Chapitre (fichier) de l'epub, action: bookmark: lu ou non lu ou bookmarkpage: marque l'emplacement
    saveusermark: function(book_id, type, mark, componentId, action) {
	    Ext.Viewport.setMasked({xtype: 'loadmask'});
	    var me=this;
	    Ext.data.JsonP.request({
		url: './tools.php',
		callbackKey: 'callback',
		params: {
			action: action,
			mylogin: myreadings.user.get('username'),
			mypass: myreadings.user.get('password'),
			id: book_id,
			base: myreadings.tempconf.txtbase,
			userid: myreadings.tempconf.current_userid,
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
				if(!me.getArticlesserieslist().isHidden()&&me.getArticlesserieslist().getStore().findRecord('id',book_id)) {
					var store2=me.getArticlesserieslist().getStore();
					curbookmark=store2.findRecord('id',book_id).get("bookmark");
					store2.findRecord('id',book_id).set("bookmark",mark);
					me.getArticlesserieslist().refreshItems();
					//Explication dans la partie suivante...
					if(myreadings.user.get('showifread')!="all") {
						if(myreadings.user.get('showifread')!="notread") {
							if(mark==-1) {
								myreadings.tempconf.offse2t=myreadings.tempconf.offset2+1;
								store2.getProxy().setExtraParam('offset', myreadings.tempconf.offset2);
							} else if(curbookmark==-1) {
								myreadings.tempconf.offset2=myreadings.tempconf.offset2-1;
								store2.getProxy().setExtraParam('offset', myreadings.tempconf.offset2);
							}
						} else {//read
							if(mark==-1) {
								myreadings.tempconf.offset2=myreadings.tempconf.offset2-1;
								store2.getProxy().setExtraParam('offset', myreadings.tempconf.offset2);
							} else if(curbookmark==-1) {
								myreadings.tempconf.offset2=myreadings.tempconf.offset2+1;
								store2.getProxy().setExtraParam('offset', myreadings.tempconf.offset2);
							}
						}
					}
				}
				
				var record=me.getArticleslist().getStore().findRecord('id',book_id);
				//Si le livre est dans la liste et n'est pas dans un groupe
				if(record&&(record.get("nbgp")==null||record.get("nbgp")==1)) {
					curbookmark=record.get("bookmark");
					record.set("bookmark",mark);
					me.getArticleslist().refreshItems();
					//Gestion du offset (pour décaler la limite du min/max dans recordsjson: max=max-offset)
					if(myreadings.user.get('showifread')!="all") {
						//Cas de l'affichage des non lus
						if(myreadings.user.get('showifread')!="notread") {
							//Le nouveau bookmark indique lu, il ne l'était donc pas
							if(mark==-1) {
								//Il faut augmenter l'offset car il y aura un livre de moins dans la requête
								myreadings.tempconf.offset=myreadings.tempconf.offset+1;
								me.getArticleslist().getStore().getProxy().setExtraParam('offset', myreadings.tempconf.offset);
								//Remove pour l'enlever du store, non utilisé...
								//me.getArticleslist().getStore().remove(record);
							} else if(curbookmark==-1) {
								//Il n'est plus indiqué comme lu mais il l'était: diminuer l'offset car le livre revient dans la liste
								//S'il n'était pas lu (affectation d'un marque-page), pas de changment d'offset
								myreadings.tempconf.offset=myreadings.tempconf.offset-1;
								me.getArticleslist().getStore().getProxy().setExtraParam('offset', myreadings.tempconf.offset);
							}
						} else {//Cas des lus
							//Le nouveau bookmark indique lu, il sera de nouveau dans la liste
							if(mark==-1) {
								myreadings.tempconf.offset=myreadings.tempconf.offset-1;
								me.getArticleslist().getStore().getProxy().setExtraParam('offset', myreadings.tempconf.offset);
							} else if(curbookmark==-1) {
								//Il n'est plus lu mais il l'était : augmenter l'offset
								//S'il n'était pas lu (affectation d'un marque-page), pas de changment d'offset
								myreadings.tempconf.offset=myreadings.tempconf.offset+1;
								me.getArticleslist().getStore().getProxy().setExtraParam('offset', myreadings.tempconf.offset);
							}
						}
					}
					Ext.Viewport.setMasked(false);
				} else {
					var serieid="";
					//S'il est dans un groupe pour une série, il faut chercher ce groupe
					if(!record&&myreadings.user.get('gpseries')==1) {
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
								//pathbase: params.pathbase,
								txtbase: params.txtbase,
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
									if(myreadings.user.get('showifread')=="notread") {
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
					} else Ext.Viewport.setMasked(false);
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
    defaultProfil: function() {
    	    var me=this;
    	    if(me.profil=="gtab") {
		    //mode paysage: 1 lignes et 4 livres par ligne
		    //mode portrait: 3 lignes et 3 livres par ligne
    	    	    myreadings.conf.set('landline', 2);
    	    	    myreadings.conf.set('landbyline', 4);
    	    	    myreadings.conf.set('portline', 3);
    	    	    myreadings.conf.set('portbyline', 3);
    	    } else if(me.profil=="iphone") {
		    //mode paysage: 1 ligne et 4 livres par ligne
		    //mode portrait: 2 lignes et 3 livres par ligne
    	    	    myreadings.conf.set('landline', 1);
    	    	    myreadings.conf.set('landbyline', 4);
    	    	    myreadings.conf.set('portline', 2);
    	    	    myreadings.conf.set('portbyline', 3);
    	    } else {
		    //mode paysage: 2 lignes et 4 livres par ligne
		    //mode portrait: 3 lignes et 3 livres par ligne
    	    	    myreadings.conf.set('landline', 2);
    	    	    myreadings.conf.set('landbyline', 4);
    	    	    myreadings.conf.set('portline', 3);
    	    	    myreadings.conf.set('portbyline', 3);
    	    }
    },
    onChangeChg_nbbook: function(item,value,oldvalue){
    	    //Test si enabled, ne fait rien sinon (sert pour le setoption lors de l'initialisation)
    	    if(!item.getDisabled()) {
    	    	    if(value==0) {
    	    	    	    this.defaultProfil();
    	    	    	    this.getLandline().setValue(myreadings.conf.get('landline'));
    	    	    	    this.getLandbyline().setValue(myreadings.conf.get('landbyline'));
    	    	    	    this.getPortline().setValue(myreadings.conf.get('portline'));
    	    	    	    this.getPortbyline().setValue(myreadings.conf.get('portbyline'));
    	    	    	    this.getConfigport().hide();
    	    	    	    this.getConfigland().hide();
    	    	    } else {
    	    	    	    this.getConfigport().show();
    	    	    	    this.getConfigland().show();
    	    	    }
    	    }
    },
    onChgcarouselbuttonTap: function() {
    	    myreadings.conf.set('chg_nbbook', this.getChg_nbbook().getValue());
    	    myreadings.conf.set('showcust', this.getShowcust().getValue());
    	    myreadings.conf.set('landline', this.getLandline().getValue());
    	    myreadings.conf.set('landbyline', this.getLandbyline().getValue());
    	    myreadings.conf.set('portline', this.getPortline().getValue());
    	    myreadings.conf.set('portbyline', this.getPortbyline().getValue());
    	    myreadings.conf.save();
    	    window.location.reload();
    },
    onTapCarousel: function(e, me) {
        var element = Ext.get(e.target),
            store = me.getStore(),
            idarticle;
            //console.log("id:"+element.id);
        if(element.hasCls('nbgroup')||element.hasCls('fbookmark2')||element.hasCls('fbookmark1')||element.hasCls('fbookmark')||
        	element.hasCls('vignette')||element.hasCls('fond')||
        	element.hasCls('vignette_grp')||element.hasCls('fond_grp')||element.hasCls('title')||element.hasCls('author')||
        	element.hasCls('tags')||element.hasCls('series')||element.hasCls('seriesbig')||element.hasCls('custom')||element.hasCls('tapclass')) {
        	if (!element.hasCls('clsarticle')) {
        		element = Ext.get(e.target).parent('.clsarticle');
        	}
        	idarticle = Math.abs(element.getAttribute('ref'));
        	record = store.getById(idarticle);
        	if (record) {
        		//console.log("fireEvent itemtap");
        		me.fireEvent('itemtap', me, record);
        	}
        } else {
        	console.log('no tap');
        }
    },
    //Non nécessaire pour le résumé du livre.
    nl2br: function(str) {
	    // Converts newlines to HTML line breaks
	    var breakTag = '<br />';
	    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
    }
    
});
