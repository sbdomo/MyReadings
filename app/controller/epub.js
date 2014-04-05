Ext.define('myreadings.controller.epub', {
	extend: 'Ext.app.Controller',
	config: {
		refs: {
			epubview: 'epubview',
			btshowbar: 'epubview #showbar',
			closeminibutton: 'epubview #closeminibutton',
			closebutton: 'epubview #closebutton',
			epubtoolbar: 'epubview #epubtoolbar',
			epubtoolbar1: 'epubview #epubtoolbar1',
			minitoolbar: 'epubview #minitoolbar',
			btClosetoolbar: 'epubview #closetoolbar',
			togglemode: 'epubview #togglemode',
			fontfamily: 'epubview #fontfamily',
			fsize: 'epubview #fsize',
			tocbt: 'epubview #toc',
			bookview: 'epubview #bookview',
			bookmarkbutton: 'epubview #bookmark',
			infobutton: 'epubview #infobutton'
		},
		control: {
			btshowbar: {
				tap: 'onBtshowbarTap'
			},
			btClosetoolbar: {
				tap: 'onBtClosetoolbar'
			},
			closeminibutton: {
				tap: 'onClosebutton'
			},
			closebutton: {
				tap: 'onClosebutton'
			},
			togglemode: {
				toggle: 'onTogglemode'
			},
			fontfamily: {
				toggle: 'onToggleFontfamily'
			},
			fsize: {
				change: 'onChangefsize'
			},
			tocbt: {
				tap: 'onToc'
			},
			infobutton: {
				tap: 'onInfoButton'
			},
			bookmarkbutton: {
				tap: 'onBookmarkbutton'
			}
		}
	},
	initEpub: function(isnew, componentId, percent) {
		var me=this;
		if(myreadings.settings.epub_fontsize==""||myreadings.settings.epub_fontsize==null) myreadings.settings.epub_fontsize="1.45";
		me.getBookview().updateHref("");
		
		var params = {
			path: myreadings.currentbook.path,
			title: myreadings.currentbook.name + " - " + myreadings.currentbook.idbook,
			
			isnew: isnew,
			componentId: componentId,
			percent: percent,
			
			mode: myreadings.settings.epub_mode,
			font: myreadings.settings.epub_font,
			taille: myreadings.settings.epub_fontsize,
			
			mylogin: myreadings.conf.username,
			mypass: myreadings.conf.password
		};
		var paramsencode = Ext.urlEncode(params);
		
		me.getBookview().updateHref("./epubreader.php?"+paramsencode);
		if(!me.isInit) {
			me.getFsize().setValue(myreadings.settings.epub_fontsize);
			me.getFsize().enable();
			
			if(myreadings.settings.epub_mode=='nuit') {
				me.getTogglemode().setPressedButtons([1]);
			} else {
				me.getTogglemode().setPressedButtons([0]);
			}
			
			if(myreadings.settings.epub_font=='arial') {
				me.getFontfamily().setPressedButtons([1]);
			} else {
				me.getFontfamily().setPressedButtons([0]);
			}
			
			me.isInit=true;
		}
		myreadings.currentbook.reading=true;
		this.getEpubview().setMasked(true);
		
		//Si pas de users, pas de bookmark
		if(myreadings.conf.current_user=="") me.getBookmarkbutton().hide();
		else  me.getBookmarkbutton().show();
		
		this.getEpubview().show();
		myreadings.app.getController('articlesControl').saveuser();
	},
	openEpub: function() {
		var me=this;
		if(me.getBookview().getHref()=="") {
			me.initEpub("current", "", "");
		} else {
			if(!myreadings.currentbook.reading) {
				myreadings.currentbook.reading=true;
				myreadings.app.getController('articlesControl').saveuser();
			}
			this.getEpubview().show();
		}
	},
	onBtshowbarTap: function() {
		this.getMinitoolbar().hide();
		if(myreadings.app.getController('articlesControl').profil=="iphone") {
			this.getEpubtoolbar().show();
			this.getEpubtoolbar1().show();
		} else {
			this.getEpubtoolbar().show();
		}
	},
	onBtClosetoolbar: function() {
		if(myreadings.app.getController('articlesControl').profil=="iphone") {
			this.getEpubtoolbar().hide();
			this.getEpubtoolbar1().hide();
		} else {
			this.getEpubtoolbar().hide();
		}
		this.getMinitoolbar().show();
		
	},
	onClosebutton: function() {
		myreadings.currentbook.reading=false;
		myreadings.app.getController('articlesControl').saveuser();
		this.getEpubview().hide();
	},
	
	onToc: function() {
		var y = Ext.getCmp('bookview').iframeElement;
		y.dom.contentWindow.openToc();
	},
	
	onTogglemode: function(container, button, pressed) {
			if(pressed) {
				if(this.isInitTogglemode) {
					myreadings.settings.epub_mode=button.getItemId();
					var y = Ext.getCmp('bookview').iframeElement;
					y.dom.contentWindow.setMode(myreadings.settings.epub_mode);
					
					myreadings.app.getController('articlesControl').saveuser();
				} else this.isInitTogglemode=true;
			}
	},
	onToggleFontfamily: function(container, button, pressed) {
		if(pressed) {
			if(this.isInitToggleFontfamily) {
				myreadings.settings.epub_font=button.getItemId();
				var y = Ext.getCmp('bookview').iframeElement;
				y.dom.contentWindow.setFont(myreadings.settings.epub_font);
				
				myreadings.app.getController('articlesControl').saveuser();
			} else this.isInitToggleFontfamily=true;
		}
	},
	onChangefsize:function(selectbox,value,oldvalue) {
		if(!this.getFsize().getDisabled()) {
			myreadings.settings.epub_fontsize=value;
			var y = Ext.getCmp('bookview').iframeElement;
			y.dom.contentWindow.setFontsize(myreadings.settings.epub_fontsize);
			
			myreadings.app.getController('articlesControl').saveuser();
		}
	},
	onBookmarkbutton: function() {
		var y = Ext.getCmp('bookview').iframeElement;
		var bookmark=y.dom.contentWindow.getbookmark();
		if(bookmark.componentId&&bookmark.percent) {
			myreadings.app.getController('articlesControl').saveusermark(myreadings.currentbook.idbook, bookmark.percent, bookmark.componentId, "bookmarkepub");
		}
	},
	onInfoButton: function() {
		myreadings.app.getController('articlesControl').openArticle_CurrentBook();
	},
	isloaded: function() {
		this.getEpubview().setMasked(false);
	}
});