Ext.define('myreadings.controller.comic', {
	extend: 'Ext.app.Controller',
	config: {
		refs: {
			comicview: 'comicview',
			closebutton: 'comicview #closebutton',
			comictitle: 'comicview titlebar',
			toolbar: 'comicview toolbar',
			slider: 'comicview #slider',
			progressbutton: 'comicview #progressbutton',
			nextbutton: 'comicview #nextbutton',
			previousbutton: 'comicview #previousbutton',
			settingsbutton: 'comicview #settingsbutton',
			bookmark: 'comicview #bookmark',
			infobutton: 'comicview #infobutton',
			nextPageIcon: 'comicview #nextPageIcon',
			prevPageIcon: 'comicview #prevPageIcon',
			loadingIndicator: 'comicview #loadingIndicator',
			imageviewer: 'comicview #imageviewer',
			
			comicsettingsview: { selector: 'comicSettingsPopup', xtype: 'comicSettingsPopup', autoCreate: true }
		},
		control: {
			comicview: {
				show: 'onShow'
			},
			slider: {
				change: 'onSliderChange'
			},
			nextbutton: {
				tap: 'onNextButton'
			},
			previousbutton: {
				tap: 'onPreviousButton'
			},
			settingsbutton: {
				tap: 'onSettingsButton'
			},
			bookmark: {
				tap: 'onBookmark'
			},
			infobutton: {
				tap: 'onInfoButton'
			},
			closebutton: {
				tap: 'onCloseButton'
			},
			
			
			imageviewer: {
				imageLoaded: 'onImageLoaded',
				imageError: 'onImageError',
				zoomByTap: 'onZoomByTap',
				initDone: 'onImageViewerInitDone',
				singletap: 'onSingleTap'
			}
		}
		
		
	},
//***************Initialisation
	init: function() {
		var me = this;
		me.preload_count = 1; // number of pages to preload before and after the current page.
                           // if 0, preloading is disabled.
		
		me.cache = []; // cache of preloaded page info
		me.waiting_for_page = -1; // page that must be displayed once loaded.
		
		
		/* A voir
		Ext.Viewport.on("orientationchange", function() { 
				//alert("orientationchange"); 
				var imageviewer = me.getImageviewer();
				imageviewer.resize(); 
		});
		*/
	},
	//Lancé pour initialisé l'ouverture d'un livre
	initComic: function() {
		var me=this,
			titlebar = me.getComictitle(),
			imageviewer = me.getImageviewer();
		
		me.cache.length = 0;
		me.waiting_for_page = -1;
		imageviewer.setLoadingMask(false);
		
		titlebar.setTitle(myreadings.app.getController('articlesControl').localtxt.openingcomic);
		imageviewer.loadImage('resources/images/no_image_available.jpg');
		
		//Si pas de users, pas de bookmark
		if(myreadings.conf.current_user=="") me.getBookmark().hide();
		console.log('initComic' + myreadings.currentbook.idbook)
		Ext.data.JsonP.request({
			url: './comicsreader.php',
			callbackKey: 'callback',
			params: {
				id: myreadings.currentbook.idbook,
				idbase: myreadings.conf.txtbase,
				path: myreadings.currentbook.path,
				page: "number_of_pages",
				mylogin: myreadings.conf.username,
				mypass: myreadings.conf.password
			},
			success: function(result, request) {
				if(result.success==true) {
					myreadings.currentbook.number_of_pages=result.resultat.nbrpages;
					myreadings.currentbook.reading=true;
					me.ShowPage(myreadings.currentbook.current_page_nr);
					myreadings.app.getController('articlesControl').saveuser();
				} else Ext.Msg.alert("Error", result.message);
			},
			failure: function(result, request) {
				alert("Error opening book");
			}
		});
	},
	openComic: function() {
		if(!myreadings.currentbook.reading) {
			myreadings.currentbook.reading=true;
			myreadings.app.getController('articlesControl').saveuser();
		}
		this.ShowPage(myreadings.currentbook.current_page_nr);
	},
	onShow: function() {
		this.UpdateSettings();		
	},
	//Initialise le comportement de ImageViewer
	onImageViewerInitDone: function() {
		var me = this,
			imageviewer = me.getImageviewer();
		
		imageviewer.setResizeOnLoad(true);
		imageviewer.setErrorImage('resources/images/no_image_available.jpg');
		
		/*C'est déjà dans UpdateSettings
		
		// 1: Fit width, 2: Full page
		if (myreadings.settings.page_fit_mode == 2) {
			imageviewer.setAutoFitWidth(true);
			imageviewer.setAutoFitHeight(true);
		} else {
			// fit width
			imageviewer.setAutoFitWidth(true);
			imageviewer.setAutoFitHeight(false);
		}
		
		imageviewer.setZoomOnSingleTap(myreadings.settings.zoom_on_tap == 1);
		imageviewer.setZoomOnDoubleTap(myreadings.settings.zoom_on_tap == 2);
		*/
		
		// For some reason, I can't access the figure element via the controller refs and control options....
		
		imageviewer.figEl.addListener({
				scope: me,
				singletap: me.onSingleTap,
				doubletap: me.onDoubleTap,
				drag: me.onDrag,
				dragend: me.onDragEnd
		});
	},
	UpdateSettings: function() {
		var me = this,
		imageviewer = me.getImageviewer();
		
		// 1: Fit width, 2: Full page
		if (myreadings.settings.page_fit_mode == 2) {
			imageviewer.setAutoFitWidth(true);
			imageviewer.setAutoFitHeight(true);
		} else {
			// fit width
			imageviewer.setAutoFitWidth(true);
			imageviewer.setAutoFitHeight(false);
		}
		
		imageviewer.setZoomOnSingleTap(myreadings.settings.zoom_on_tap == 1);
		imageviewer.setZoomOnDoubleTap(myreadings.settings.zoom_on_tap == 2);
		
		imageviewer.resize();
	},
	
//Chargement des pages du livre
//ShowPage lance PreloadPages
	ShowPage: function(pagenr) {
		var me = this,
			imageviewer = me.getImageviewer(),
			scroller = imageviewer.getScrollable().getScroller(),
			titlebar = me.getComictitle(),
			progressbutton = me.getProgressbutton();
		
		if (pagenr < 0 || pagenr >= myreadings.currentbook.number_of_pages) {
			console.log("pagenr " + pagenr + " out of bounds [0.."+(myreadings.currentbook.number_of_pages-1)+"]");
			return;
		}
		titlebar.setTitle(myreadings.currentbook.name + " " + (pagenr + 1)+ "/" + myreadings.currentbook.number_of_pages);
		// todo: show loading indicator in toolbar and remove it when image is loaded.
		
		progressbutton.setText("" + (pagenr + 1)+ "/" + myreadings.currentbook.number_of_pages);
		scroller.scrollTo(0,0);
		if ((me.preload_count > 0) && me.cache[pagenr] && me.cache[pagenr].img) {
			console.log("ShowPage: use cache, page " + pagenr);
			imageviewer.loadImage(me.cache[pagenr].src);
		} else {
			console.log("ShowPage not in cache or loaded, page "+pagenr);
			me.waiting_for_page = pagenr;
			me.getLoadingIndicator().show();
		}
		this.PreloadPages();
	},
	//Préchargement des pages
	PreloadPages: function() {
	    var me = this,
	    	i = 0;
	    // Clear old cache images, not the page info.
	    //avant preload_count
	    for (i = 0; i <= myreadings.currentbook.current_page_nr - me.preload_count - 1; i++) {
		    if (me.cache[i] && me.cache[i].img) {
			    me.cache[i].img.destroy();
			    delete me.cache[i].img;
		    }
	    }
	    //avant preload_count
	    for (i = myreadings.currentbook.current_page_nr + me.preload_count + 1; i < myreadings.currentbook.number_of_pages; i++) {
		    if (me.cache[i] && me.cache[i].img) {
			    me.cache[i].img.destroy();
			    delete me.cache[i].img;
		    }
	    }
	    
	    // Preload the next and previous pages.
	    for (i = myreadings.currentbook.current_page_nr; i <= myreadings.currentbook.current_page_nr + me.preload_count; i++) me.PreloadPage(i);
	    
	    for (i = myreadings.currentbook.current_page_nr - 1; i >= myreadings.currentbook.current_page_nr - me.preload_count; i--) me.PreloadPage(i);
	},
	PreloadPage: function(pagenr) {
		var me = this;
		
		if (pagenr < 0 || pagenr >= myreadings.currentbook.number_of_pages) return;
		
		if (me.cache[pagenr]) {
			if (!me.cache[pagenr].img) {
				console.log("load Image (not in cache yet) " + pagenr);
				me.PreloadImage(pagenr);
			}
			return;
		}

		Ext.data.JsonP.request({
				url: './comicsreader.php',
				callbackKey: 'callback',
				params: {
					id: myreadings.currentbook.idbook,
					idbase: myreadings.conf.txtbase,
					path: myreadings.currentbook.path,
					page: pagenr,
					mylogin: myreadings.conf.username,
					mypass: myreadings.conf.password
				},
				success: function(result, request) {
					if(result.success==true) {
						me.cache[result.resultat.page] = result.resultat;
						me.PreloadImage(result.resultat.page);
					} else Ext.Msg.alert("Error", result.message);
				},
				failure: function(result, request) {
					alert("Error opening book");
				}
		});
	},
	PreloadImage: function(pagenr) {
	    var me = this;
	    if (pagenr < 0 || pagenr >= myreadings.currentbook.number_of_pages) return;
	    
	    if (!me.cache[pagenr]) {
		    console.log("PreloadImage called with no cache entry for page " + pagenr);
		    return;
	    }
	    
	    //console.log("PreloadImage" + pagenr);
	    me.cache[pagenr].img = Ext.create('Ext.Img', {
			    src: me.cache[pagenr].src,
			    mode: 'element', // create <img> instead of <div>
			    listeners: {
				    load: function( /*Ext.Img*/ image, /*Ext.EventObject*/ e, /*Object*/ eOpts ) {
					    me.ShowCacheStatus();
					    
					    if (me.waiting_for_page == pagenr)
					    {
						    me.waiting_for_page = -1;
						    me.getImageviewer().loadImage(image.getSrc());
					    }
				    },
				    error: function( /*Ext.Img*/ image, /*Ext.EventObject*/ e, /*Object*/ eOpts ) {
					    Ext.Msg.alert('Error while loading image ' + image.getSrc());
					    console.log('Error while loading image ' + image.getSrc());
					    me.cache[pagenr].img.destroy();
					    delete me.cache[pagenr].img;
					    me.ShowCacheStatus();
				    }
			    }
	    });
	},
	//affiche l'état du cache dans la console
	ShowCacheStatus: function() {
	    var me = this;
	    var s = "ImageCache: ";
	    var i = 0;
	    for (i = 0; i < myreadings.currentbook.number_of_pages; i++) {
		    if (me.cache[i] && me.cache[i].img) s += " " + (i+1);
	    }
	    
	    console.log(s);
	},
	
	//Déclenché quand l'image (la page du livre) est chargé
	onImageLoaded: function() {
		var me = this,
			imageviewer = me.getImageviewer(),
			scroller = imageviewer.getScrollable().getScroller(),
			nextPageIcon = me.getNextPageIcon(),
			previousPageIcon = me.getPrevPageIcon();
		//console.log('Image Loaded '+myreadings.currentbook.current_page_nr);
		me.getLoadingIndicator().hide();
		
		nextPageIcon.hide();
		previousPageIcon.hide();
		
		scroller.scrollTo(0,0);
		me.getSlider().setValue((myreadings.currentbook.current_page_nr / (myreadings.currentbook.number_of_pages-1)) * SLIDER_RANGE);
		
		myreadings.app.getController('articlesControl').saveuser();
	},

//*******Comportement des différents objets pour la navigation dans le livre
	
	onNextButton: function() {
		var me = this,
			nextPageIcon = me.getNextPageIcon();
		
		if (myreadings.currentbook.current_page_nr < (myreadings.currentbook.number_of_pages-1)) {
			nextPageIcon.show();
			Ext.defer(function() { me.ShowPage(++myreadings.currentbook.current_page_nr); }, 150);
		} else {
			// TODO: need a way to determine what is the next comic...	
			me.onCloseButton();
		}
	},
	onPreviousButton: function() {
		var me = this,
			prevPageIcon = me.getPrevPageIcon();
		
		if (myreadings.currentbook.current_page_nr > 0) {
			prevPageIcon.show();
			Ext.defer(function() { this.hide(); }, 500, prevPageIcon);
			Ext.defer(function() { me.ShowPage(--myreadings.currentbook.current_page_nr); }, 150);
		} else {
			me.onCloseButton();
		}
	},
	onDoubleTap: function(/*Ext.event.Event*/ event, /*HTMLElement*/ node, /*Object*/ options, /*Object*/ eOpts) {
		// This handler is called for both the figure and its image element, because of event bubbling.
		// If clicked in the image, then the event for the image comes before the event of the figure.
		// In order to prevent double page turns, stop event propagation here.
		var me = this;
		
		if (myreadings.settings.toggle_paging_bar == 2) me.onToggleToolbars();
		
		event.stopPropagation();
		return false;
	},
	
	onToggleToolbars: function(ev, t) {
		var titlebar = this.getComictitle(),
			toolbar = this.getToolbar();
		
		if (titlebar.isHidden()) {
			titlebar.show();
			toolbar.show();
		} else {
			titlebar.hide();
			toolbar.hide();
		}
		
		// no further processing
		return false;
	},
	onImageError: function() {
		var me = this;
		console.log('Error while loading the image.');
	},
	//Pourquoi ?
	onZoomByTap: function(ev, t) {
		console.log('onZoomByTap');
		return true;
	},
	onSingleTap: function(/*Ext.event.Event*/ event, /*HTMLElement*/ node, /*Object*/ options, /*Object*/ eOpts) {
		// This handler is called for both the figure and its image element, because of event bubbling.
		// If clicked in the image, then the event for the image comes before the event of the figure.
		// In order to prevent double page turns, stop event propagation here.
		var me = this;
		if (event.pageX < myreadings.settings.page_change_area_width) {
			me.onPreviousButton();
			event.stopPropagation();
			return true;
		} else {
			if (event.pageX > window.outerWidth - myreadings.settings.page_change_area_width) {
				me.onNextButton();
				event.stopPropagation();
				return true;
			} else {
				if (myreadings.settings.toggle_paging_bar == 1) {
					me.onToggleToolbars();
				}
				
				event.stopPropagation();
				return false;
			}
		}
	},
	onDrag: function(/*Ext.event.Event*/ event, /*HTMLElement*/ node, /*Object*/ options, /*Object*/ eOpts) {
		var me = this,
			imageviewer = me.getImageviewer(),
			scroller = imageviewer.getScrollable().getScroller(),
			nextPageIcon = me.getNextPageIcon(),
			prevPageIcon = me.getPrevPageIcon();
		
		if ((scroller.position.x < scroller.getMinPosition().x - myreadings.settings.page_turn_drag_threshold) || 
			(scroller.position.y < scroller.getMinPosition().y - myreadings.settings.page_turn_drag_threshold))
		{
			prevPageIcon.show();
		} else {
			if ((scroller.position.x > scroller.getMaxPosition().x + myreadings.settings.page_turn_drag_threshold) || 
				(scroller.position.y > scroller.getMaxPosition().y + myreadings.settings.page_turn_drag_threshold))
			{
				nextPageIcon.show();
			} else {
				prevPageIcon.hide();
				nextPageIcon.hide();
			}
		}
	},
	onDragEnd: function(/*Ext.event.Event*/ event, /*HTMLElement*/ node, /*Object*/ options, /*Object*/ eOpts) {
		var me = this,
			imageviewer = me.getImageviewer(),
			scroller = imageviewer.getScrollable().getScroller();
		
		if ((scroller.position.x < scroller.getMinPosition().x - myreadings.settings.page_turn_drag_threshold) || 
			(scroller.position.y < scroller.getMinPosition().y - myreadings.settings.page_turn_drag_threshold))
		{
			this.onPreviousButton();
		} else {
			if ((scroller.position.x > scroller.getMaxPosition().x + myreadings.settings.page_turn_drag_threshold) || 
				(scroller.position.y > scroller.getMaxPosition().y + myreadings.settings.page_turn_drag_threshold))
			{
				this.onNextButton();
			}
		}
	},
	onSliderChange: function(slider) {
		var me = this;
		myreadings.currentbook.current_page_nr = Math.round((myreadings.currentbook.number_of_pages-1) * slider.getValue() / SLIDER_RANGE);
		me.ShowPage(myreadings.currentbook.current_page_nr);
	},
	onCloseButton: function() {
		myreadings.currentbook.reading=false;
		myreadings.app.getController('articlesControl').saveuser();
		this.getComicview().hide();
	},
	
	onSettingsButton: function() {
		var me = this;
		
		if (!me.overlay) {
			me.overlay = Ext.Viewport.add(me.getComicsettingsview());
		}
		me.overlay.show();
	},
	onBookmark: function() {
		myreadings.app.getController('articlesControl').savebookmark();
	},
	onInfoButton: function() {
		myreadings.app.getController('articlesControl').openArticle_CurrentBook();
	}
});