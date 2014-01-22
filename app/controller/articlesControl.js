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
	    
	    loginBt: 'configpanel [name=loginbutton]',
	    usernameCt: 'configpanel [name=login]',
	    passwordCt: 'configpanel [name=pass]',
	    loginfieldset: 'configpanel [name=loginfieldset]',
	    btconfigpanelhide: 'configpanel [name=bthide]',
	    
	    typelistfind: 'listview [name=typelist]',
	    searchfieldfind: 'listview [name=listviewSearchfield]',
	    btsearchfind: 'listview [name=btsearch]',
	    
            articleView: {
                autoCreate: true,
                xtype: 'article',
                selector: 'article'
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
			this.pathbase=data.pathbase;
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
		store.getProxy().setExtraParam('pathbase',this.pathbase);
		store.getProxy().setExtraParam('mylogin',this.username);
		store.getProxy().setExtraParam('mypass',this.password);
		store.getProxy().setExtraParam('order', this.order);
		store.getProxy().setExtraParam('type', this.type);
		store.getProxy().setExtraParam('find', this.find);
		store.getProxy().setExtraParam('start', this.start);
		store.getProxy().setExtraParam('idlist', this.idlist);
	}
        //console.log("store load");
	store.load();
	var articlesView= this.getArticleslist();

	//empty the store before adding the new one
	var  articlesStore = articlesView.getStore();
	if (articlesStore) {
            articlesStore.removeAll();
        }

	articlesView.setStore(store);
    },
    init: function() {
	//console.log('init controller');
	var me=this;
	//var me=myreadings.app.getController('articlesControl');
        me.callParent();
	me.isList = false;
	if(!me.isInit) {
		Ext.ModelMgr.getModel('myreadings.model.myreadingsUser').load(1, {
			scope: this,
			success: function(cachedLoggedInUser) {
				delete cachedLoggedInUser.phantom;
				me.username=cachedLoggedInUser.get('name');
				me.password=cachedLoggedInUser.get('pass');
				
				me.pathbase=cachedLoggedInUser.get('pathbase');
				me.order=cachedLoggedInUser.get('order');
				
				me.type=cachedLoggedInUser.get('type');
				me.find=cachedLoggedInUser.get('find');
				me.start=cachedLoggedInUser.get('start');
				me.idlist=cachedLoggedInUser.get('idlist');
				//me.list=cachedLoggedInUser.get('list');
				//me.search=cachedLoggedInUser.get('search');
				
				
				console.info('Auto-Login succeeded.');
			},
			failure : function() {
				me.username="";
				me.password="";
				me.pathbase="";
				me.order="recent";
				me.type="";
				me.find="";
				me.start="0";
				me.idlist="";
				//me.list="author";
				//me.search="";
				console.warn('Auto-Login failed (user was not logged in).');
			}
		});
	}
	Ext.data.JsonP.request({
            url: './getConfig.php',
            callbackKey: 'callback',
            params: {
            	   mylogin: me.username,
            	   mypass: me.password
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
				
				me.articleView = Ext.create('myreadings.view.article');
				Ext.Viewport.add(Ext.create('myreadings.view.ArticlesList'));
				Ext.Viewport.add(Ext.create('myreadings.view.configpanel'));
				Ext.Viewport.add(Ext.create('myreadings.view.searchview'));
			}
			
			if(result.config.connect=="noprotect"||result.config.connect=="protectok") {
				if(me.isInit==true) {
					me.getBtconfigpanelhide().show();
					me.getConfigpanel().hide();
				}
				
				me.bases = result.config.bases;
				var newOptions = [];
				var basevalue="";
				for (var base in me.bases) {
					newOptions.push({text: base,  value: me.bases[base]});
					//Cherche si la dernière base utilisée peut être réouverte
					if(me.bases[base]==me.pathbase) basevalue=me.bases[base];
				}
				Ext.getCmp('base').setOptions(newOptions);
				if(basevalue!="") Ext.getCmp('base').setValue(basevalue);
				
				//Etat disabled car test dans la fonction change du selectfield pour ne pas déclencher le lancement de change
				//Passe en enabled ensuite
				Ext.getCmp('base').enable();
				me.pathbase=Ext.getCmp('base').getValue();
				
				//console.log("set profil dans config panel " + me.profil);
				Ext.getCmp('profil').setHtml(me.localtxt.txtProfil+": "+me.localtxt[me.profil])
				
				//Initialisation de order
				var orderfield=me.getOrderfield().getOptions();
				for (var myorder in orderfield) {
					if(orderfield[myorder].value==me.order) me.getOrderfield().setValue(me.order);
				}
				me.getOrderfield().enable();
				
				me.showArticles();
				
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
			} else {
				//Login/pass incorrect
				if(me.isInit!=true) {
					me.logged=false;
					me.getBtconfigpanelhide().hide();
					me.getConfigpanel().show();
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
    
    onSearchTap: function() {
	    Ext.getCmp('searchview').show();
    },
    onConfigTap: function() {
	    Ext.getCmp('configpanel').show();
    },
    
    loadliststore: function(list, search) {
        var listview = Ext.getCmp('listview');
        var store = listview.getStore();
	store.getProxy().setExtraParam('pathbase',this.pathbase);
	store.getProxy().setExtraParam('mylogin',this.username);
        store.getProxy().setExtraParam('mypass',this.password);
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
		this.username = this.getUsernameCt().getValue(),
		this.password = this.getPasswordCt().getValue();
		if(!Ext.isEmpty(this.password) && !Ext.isEmpty(this.username)) {
			var user = Ext.create('myreadings.model.myreadingsUser', {
				id: 1,
				name: this.username,
				pass: this.password
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
				name: this.username,
				pass: this.password,
				pathbase: this.pathbase,
				order: this.order,
				type: this.type,
				find: this.find,
				start: this.start,
				idlist: this.idlist//,
				//list: this.list,
				//search: this.search
	    });
	    user.save();
    },
    //Non nécessaire pour le résumé du livre.
    nl2br: function(str) {
	    // Converts newlines to HTML line breaks
	    var breakTag = '<br />';
	    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
    }
    
});
