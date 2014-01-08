Ext.define('myreadings.controller.articlesControl', {
    extend: 'Ext.app.Controller',
    requires:['Ext.data.Store'],
    //views: ['ArticlesList'],
    config: {
    	models:['myreadings.model.article'],
        refs: {
            main: 'main',
//****
	    articleslist: 'articleslist',
	    searchview: 'searchview',
            searchpanel: 'searchpanel',
	    configpanel: 'configpanel',
	    searchBt: 'main [name=searchbutton]',
	    configBt: 'main [name=configbutton]',
	    titlebar: 'main [name=maintitlebar]',
	    
	    loginBt: 'configpanel [name=loginbutton]',
	    usernameCt: 'configpanel [name=login]',
	    passwordCt: 'configpanel [name=pass]',
	    //articleslist: 'articleslist',
            articleView: {
                autoCreate: true,
                xtype: 'article',
                selector: 'article'
            }
        },
        control: {
            //main: {
            //    beforepop: 'onMainBeforePop'
            //},
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
	    }
        }//,

        //routes: {
        //    '': 'showArticles',
        //    ':id': 'showArticles'
        //}//,

        //currentRecord: null,

        //stack: []
    },

    showArticles: function(data) {
 	var store = Ext.create("Ext.data.Store", {
    	    model: "myreadings.model.article",
    	    pageSize: 100,
    	    clearOnPageLoad: false
        });
        store.getProxy().setExtraParam('pathbase',this.pathbase);
        //lors du premier lancement, pas de data car requête par défaut, sans paramétrage
        if(data) {
        	if(data.debut==4) {//changement d'ordre de tri demandé
			store.getProxy().setExtraParam('order', data.order);
		} else if(data.debut==3) {//lancement depuis listview
			store.getProxy().setExtraParam('type', data.type);
			store.getProxy().setExtraParam('idlist', data.idlist);
		} else if(data.debut==5) {//changement de base calibre, ouvre tout: type=all
			store.getProxy().setExtraParam('type', data.type);
		} else {//lancement depuis searchpanel
			store.getProxy().setExtraParam('type', data.type);
			store.getProxy().setExtraParam('find', data.find);
			store.getProxy().setExtraParam('start', data.debut);
		}
        }
        console.log("store load");
	store.load();

//******	
	var articlesView= this.getArticleslist();

	//empty the store before adding the new one

//******        var articlesStore = this.articlesView.getStore();
	var  articlesStore = articlesView.getStore();
        //var articlesStore = this.getMain().getStore();
	if (articlesStore) {
            articlesStore.removeAll();
        }

//*****        this.articlesView.setStore(store);
	articlesView.setStore(store);

	//this.getMain().setStore(store);

        //this.getMain().setActiveItem(this.articlesView);
	/*
        var maintitle="";
	if(!data) {
		maintitle="Mes ebooks - tous";
	} else if(data.find=="") {
		maintitle="Mes ebooks - tous";
	} else {
	switch (data.type) {
		case 'title':
			maintitle="Mes ebooks - Titre contient: " + data.find;
		break;
		
		case 'authorname':
			maintitle="Mes ebooks - Auteur contient: " + data.find;
		break;
		
		case 'seriename':
			maintitle="Mes ebooks - Série contient: " + data.find;
		break;
		
		case 'tagname':
			maintitle="Mes ebooks - Etiquette contient: " + data.find;
		break;
		
		default:
			maintitle="Mes ebooks";
		break;
	}
	}
	this.getTitlebar().setTitle(maintitle);
	*/
	//this.getMain().add(this.articlesView);
    },
    init: function() {
	console.log('init controller');
	var me =this;
        me.callParent();
	me.isList = false;
	me.username="";
	me.password=""
	Ext.ModelMgr.getModel('myreadings.model.CurrentUser').load(1, {
			scope: this,
			success: function(cachedLoggedInUser) {
				delete cachedLoggedInUser.phantom;
				me.username=cachedLoggedInUser.get('name');
				me.password=cachedLoggedInUser.get('pass');
				
				console.info('Auto-Login succeeded.');
				
				me.logged = true;
				//me.LogIn();
			},
			failure : function() {
				console.warn('Auto-Login failed (user was not logged in).');
			}
	});
	
	Ext.data.JsonP.request({
            url: './php/getConfig.php',
            callbackKey: 'callback',
            success: function(result, request) {
		if(result.success==true) {
			//var me=myreadings.app.getController('articlesControl');	
			var translations = result.locale.views;
			for (var view in translations) {
				Ext.apply(myreadings.view[view].prototype,translations[view]);
			}
			
//****			me.articlesView = Ext.create('myreadings.view.ArticlesList');
			//this.getMain().add(this.articlesView);
			me.articleView = Ext.create('myreadings.view.article');
			
			Ext.Viewport.add(Ext.create('myreadings.view.Main'));
			Ext.Viewport.add(Ext.create('myreadings.view.searchview'));
			Ext.Viewport.add(Ext.create('myreadings.view.configpanel'));
			
			me.bases = result.config.bases;
			me.lang = result.locale.lang;
			me.localtxt=result.locale.controller;
			//console.log(bases);
			var newOptions = [];
			for (var base in me.bases) {
				console.log(base);
				console.log(me.bases[base]);
				newOptions.push({text: base,  value: me.bases[base]});
			}
			Ext.getCmp('base').setOptions(newOptions);
			//Etat disabled car test dans la fonction change du selectfield pour ne pas déclencher le lancement de change
			//Passe en enabled ensuite
			Ext.getCmp('base').enable();
			me.pathbase=Ext.getCmp('base').getValue();
			
			me.showArticles();
			
			if(me.logged==true) me.LogIn();
			
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
	    //Ext.getCmp('searchpanel').show();
	    Ext.getCmp('searchview').show();
    },
    onConfigTap: function() {
	    Ext.getCmp('configpanel').show();
    },
    
    loadliststore: function(list, search) {
        var listview = Ext.getCmp('listview');
        //if (search == '') return false;
        var store = listview.getStore();
	//if(list!='')
	store.getProxy().setExtraParam('pathbase',this.pathbase);
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
			var username = this.getUsernameCt().getValue(),
				password = this.getPasswordCt().getValue();
			if(!Ext.isEmpty(password) && !Ext.isEmpty(username)) {
				var user = Ext.create('myreadings.model.CurrentUser', {
					id: 1,
					name: username,
					pass: password
				});
				user.save();
				this.username=username;
				this.password=password;
				this.LogIn();
				
			} else Ext.Msg.alert(this.localtxt.error,this.localtxt.mustloginandpass);
		} else {
			Ext.ModelMgr.getModel('myreadings.model.CurrentUser').load(1, {
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
	LogIn: function() {
		this.logged = true;
		this.getLoginBt().setText(this.localtxt.notlogin);
		this.getUsernameCt().hide();
		this.getPasswordCt().hide();
	},
    
    nl2br: function(str) {
	    // Converts newlines to HTML line breaks
	    var breakTag = '<br />';
	    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
    }
    
});
