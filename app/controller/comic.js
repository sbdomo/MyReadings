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
			imageviewercontainer1: 'comicview #imageviewercontainer1',
			loadingIndicator1: 'comicview #loadingIndicator1',
			imageviewer1: 'comicview #imageviewer1',
			imageviewercontainer2: 'comicview #imageviewercontainer2',
			loadingIndicator2: 'comicview #loadingIndicator2',
			imageviewer2: 'comicview #imageviewer2',
			
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
			
			
			imageviewer1: {
				imageLoaded: 'onImageLoaded',
				imageLoading: 'onImageLoading1',
				imageError: 'onImageError',
				zoomByTap: 'onZoomByTap',
				initDone: 'onImageViewerInitDone1',
				singletap: 'onSingleTap'
			},
			imageviewer2: {
				imageLoaded: 'onImageLoaded',
				imageLoading: 'onImageLoading2',
				imageError: 'onImageError',
				zoomByTap: 'onZoomByTap',
				initDone: 'onImageViewerInitDone2',
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
		
		me.showresizemsg=0;
		
		/* A voir
		Ext.Viewport.on("orientationchange", function() { 
				//alert("orientationchange"); 
				var imageviewer = me.getImageviewer1();
				imageviewer.resize(); 
		});
		*/
	},
	//Lancé pour initialisé l'ouverture d'un livre
	initComic: function() {
		var me=this,
			titlebar = me.getComictitle();
			//imageviewer = me.getImageviewer1();
		
		//Cache le menu si demandé
		if(myreadings.settings.hidemenu==1) me.hideToolbars();
		
		me.showresizemsg=myreadings.settings.showresize;
		me.cache.length = 0;
		me.waiting_for_page = -1;
		//imageviewer.setLoadingMask(false);
		
		titlebar.setTitle(myreadings.app.getController('articlesControl').localtxt.openingcomic);
		//imageviewer.loadImage('resources/images/no_image_available.jpg');
		
		//Si pas de users, pas de bookmark
		if(myreadings.conf.current_user=="") me.getBookmark().hide();
		else  me.getBookmark().show();
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
					me.ShowPage(myreadings.currentbook.current_page_nr, null);
					myreadings.app.getController('articlesControl').saveuser();
				} else Ext.Msg.alert("Error", result.message);
			},
			failure: function(result, request) {
				alert("Error opening book");
			}
		});
	},
	openComic: function() {
		//Si pas de users, pas de bookmark
		if(myreadings.conf.current_user=="") this.getBookmark().hide();
		else  this.getBookmark().show();
		
		//Cache le menu si demandé
		if(myreadings.settings.hidemenu==1) this.hideToolbars();
		
		if(!myreadings.currentbook.reading) {
			myreadings.currentbook.reading=true;
			myreadings.app.getController('articlesControl').saveuser();
		}
		
		this.showresizemsg=myreadings.settings.showresize;
		this.ShowPage(myreadings.currentbook.current_page_nr, null);
	},
	onShow: function() {
		this.UpdateSettings();
	},
	//Initialise le comportement de ImageViewer
	onImageViewerInitDone1: function(imageviewer) {
		var me = this;
		me.onImageViewerInitDone(imageviewer);
		// For some reason, I can't access the figure element via the controller refs and control options....
		imageviewer.figEl.addListener({
				scope: me,
				singletap: me.onSingleTap,
				doubletap: me.onDoubleTap,
				drag: me.onDrag1,
				dragend: me.onDragEnd1
		});
	},
	onImageViewerInitDone2: function(imageviewer) {
		var me = this;
		me.onImageViewerInitDone(imageviewer);
		// For some reason, I can't access the figure element via the controller refs and control options....
		imageviewer.figEl.addListener({
				scope: me,
				singletap: me.onSingleTap,
				doubletap: me.onDoubleTap,
				drag: me.onDrag2,
				dragend: me.onDragEnd2
		});
	},
	onImageViewerInitDone: function(imageviewer) {
		var me = this;
			//imageviewer = me.getImageviewer1();
		
		imageviewer.setResizeOnLoad(true);
		imageviewer.setErrorImage('resources/images/no_image_available.jpg');
		imageviewer.setEmptyImage('resources/images/empty.png');
		
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
	},
	UpdateSettings: function() {
		this.UpdateSettingsImageViewer(this.getImageviewer1());
		this.UpdateSettingsImageViewer(this.getImageviewer2());
	},
	UpdateSettingsImageViewer: function(imageviewer) {
		var me = this;
		//imageviewer = me.getImageviewer1();
		
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
	ShowPage: function(pagenr,oldpagenr) {
		var me = this,
			imageviewer,
			//imageviewer = me.getImageviewer1(),
			//scroller = imageviewer.getScrollable().getScroller(),
			titlebar = me.getComictitle(),
			progressbutton = me.getProgressbutton();
		var sens="none";
		if(oldpagenr==null) sens="none"
		else if(oldpagenr<pagenr) sens="left";
		else if(oldpagenr>pagenr) sens="right";
		
		console.log("sens "+sens);
		//alert(sens+pagenr+" "+myreadings.currentbook.current_page_nr);
		if(sens=="none") imageviewer=me.getComicview().getActiveItem().down('imageviewer');
		else {
			if(me.getComicview().getActiveItem().getItemId()=='imageviewercontainer1') imageviewer = me.getImageviewer2();
			else  imageviewer = me.getImageviewer1();
			//if(me.getComicview().getActiveItem().down('imageviewer').getItemId()=='imageviewer1') imageviewer = me.getImageviewer2();
			//else  imageviewer = me.getImageviewer1();
		}
		
		
		var scroller = imageviewer.getScrollable().getScroller();
		
		if (pagenr < 0 || pagenr >= myreadings.currentbook.number_of_pages) {
			console.log("pagenr " + pagenr + " out of bounds [0.."+(myreadings.currentbook.number_of_pages-1)+"]");
			return;
		}
		titlebar.setTitle(myreadings.currentbook.name + " " + (pagenr + 1)+ "/" + myreadings.currentbook.number_of_pages);
		// todo: show loading indicator in toolbar and remove it when image is loaded.
		
		progressbutton.setText("" + (pagenr + 1)+ "/" + myreadings.currentbook.number_of_pages);
		scroller.scrollTo(0,0);
		if ((me.preload_count > 0) && me.cache[pagenr] && me.cache[pagenr].img) {

			if(sens!="none") imageviewer.hideImage();
				
			if(me.cache[pagenr].src!=imageviewer.getImageSrc()) {
				console.log("ShowPage: use cache, page " + pagenr);
				imageviewer.loadImage(me.cache[pagenr].src);
			} else {
				console.log("ShowPage: page load yet, page " + pagenr);
				imageviewer.showImage();
				me.getNextPageIcon().hide();
				me.getPrevPageIcon().hide();
			}
			if(sens!="none"){
				//var imageviewerOld=me.getComicview().getActiveItem().down('imageviewer');
				me.getComicview().getLayout().setAnimation({type: 'slide', direction: sens});
				me.getComicview().setActiveItem(imageviewer.getParent());
				//imageviewerOld.hideImage();
			}
		} else {
			console.log("ShowPage not in cache or loaded, page "+pagenr);
			me.waiting_for_page = pagenr;
			//me.getLoadingIndicator1().show();
			//Pas de rotation
			if(imageviewer.getItemId()=="imageviewer1") me.getLoadingIndicator1().show();
				else me.getLoadingIndicator2().show();
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
						if(me.showresizemsg==1&&result.resultat.msg!=null&&result.resultat.msg!="") {
							me.showresizemsg=0;
							Ext.Msg.alert("Info", "Image "+result.resultat.page+":"+result.resultat.msg);
						}
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
						    if(me.getComicview().getActiveItem().getItemId()=='imageviewercontainer1') {
							    var imageviewer= me.getImageviewer1();
						    } else {
							    var imageviewer= me.getImageviewer2();
						    }
						    imageviewer.loadImage(image.getSrc());
					    }
				    },
				    error: function( /*Ext.Img*/ image, /*Ext.EventObject*/ e, /*Object*/ eOpts ) {
					    alert('Error loading ' + image.getSrc());
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
	
	//Déclenché quand l'image (la page du livre) est en cours de chargement
	onImageLoading1: function(imageviewer) {
		var me = this;
		me.getLoadingIndicator1().show();
	},
	
	onImageLoading2: function(imageviewer) {
		var me = this;
		me.getLoadingIndicator2().show();
	},
	//Déclenché quand l'image (la page du livre) est chargé
	onImageLoaded: function(imageviewer) {
		var me = this,
			//imageviewer = me.getImageviewer1(),
			scroller = imageviewer.getScrollable().getScroller(),
			nextPageIcon = me.getNextPageIcon(),
			previousPageIcon = me.getPrevPageIcon();
		//console.log('Image Loaded '+myreadings.currentbook.current_page_nr);
		if(imageviewer.getItemId()=="imageviewer1") me.getLoadingIndicator1().hide();
		else me.getLoadingIndicator2().hide();
		
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
			var oldnr=myreadings.currentbook.current_page_nr;
			Ext.defer(function() { me.ShowPage(++myreadings.currentbook.current_page_nr, oldnr); }, 150);
		} else {
			// TODO: need a way to determine what is the next comic...
			me.onCloseButton();
			if(myreadings.conf.current_user!="") {
				Ext.Msg.confirm(myreadings.app.getController('articlesControl').localtxt.msg, myreadings.app.getController('articlesControl').localtxt.domarkread, function(confirmed) {
					if (confirmed == 'yes') {
						myreadings.app.getController('articlesControl').saveusermark(myreadings.currentbook.idbook, "", -1, "", "bookmark");
					}
				}, this);
			}
		}
	},
	onPreviousButton: function() {
		var me = this,
			prevPageIcon = me.getPrevPageIcon();
		
		if (myreadings.currentbook.current_page_nr > 0) {
			prevPageIcon.show();
			Ext.defer(function() { this.hide(); }, 500, prevPageIcon);
			var oldnr=myreadings.currentbook.current_page_nr;
			Ext.defer(function() { me.ShowPage(--myreadings.currentbook.current_page_nr, oldnr); }, 150);
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
	hideToolbars: function() {
		this.getComictitle().hide();
		this.getToolbar().hide();
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
	onImageError: function(imageviewer) {
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
	
	onDrag1: function(/*Ext.event.Event*/ event, /*HTMLElement*/ node, /*Object*/ options, /*Object*/ eOpts) {
		this.onDrag(event, node, options, eOpts, this.getImageviewer1());
	},
	onDrag2: function(/*Ext.event.Event*/ event, /*HTMLElement*/ node, /*Object*/ options, /*Object*/ eOpts) {
		this.onDrag(event, node, options, eOpts, this.getImageviewer2());
	},
	onDrag: function(/*Ext.event.Event*/ event, /*HTMLElement*/ node, /*Object*/ options, /*Object*/ eOpts, imageviewer) {
		var me = this,
			//imageviewer = me.getImageviewer1(),
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
	onDragEnd1: function(/*Ext.event.Event*/ event, /*HTMLElement*/ node, /*Object*/ options, /*Object*/ eOpts) {
		this.onDragEnd(event, node, options, eOpts, this.getImageviewer1());
	},
	onDragEnd2: function(/*Ext.event.Event*/ event, /*HTMLElement*/ node, /*Object*/ options, /*Object*/ eOpts) {
		this.onDragEnd(event, node, options, eOpts, this.getImageviewer2());
	},
	onDragEnd: function(/*Ext.event.Event*/ event, /*HTMLElement*/ node, /*Object*/ options, /*Object*/ eOpts, imageviewer) {
		var me = this,
			//imageviewer = me.getImageviewer1(),
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
		var me = this,
			oldnr=myreadings.currentbook.current_page_nr;
		myreadings.currentbook.current_page_nr = Math.round((myreadings.currentbook.number_of_pages-1) * slider.getValue() / SLIDER_RANGE);
		//Pas de rotation donc: null
		me.ShowPage(myreadings.currentbook.current_page_nr, null);
	},
	onCloseButton: function() {
		myreadings.currentbook.reading=false;
		myreadings.app.getController('articlesControl').saveuser();
		//UnloadImages
		this.getImageviewer1().unloadImage();
		this.getImageviewer2().unloadImage();
		
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