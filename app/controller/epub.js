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
		if(myreadings.user.get('epub_fontsize')==""||myreadings.user.get('epub_fontsize')==null) myreadings.user.set('epub_fontsize', "1.45");
		me.getBookview().updateHref("");
		
		var params = {
			path: myreadings.user.get('book_path'),
			title: myreadings.user.get('book_title') + " - " +myreadings.user.get('book_id'),
			
			isnew: isnew,
			componentId: componentId,
			percent: percent,
			
			mode: myreadings.user.get('epub_mode'),
			font: myreadings.user.get('epub_font'),
			taille: myreadings.user.get('epub_fontsize'),
			
			mylogin: myreadings.user.get('username'),
			mypass: myreadings.user.get('password')
		};
		var paramsencode = Ext.urlEncode(params);
		
		me.getBookview().updateHref("./epubreader.php?"+paramsencode);
		if(!me.isInit) {
			me.getFsize().setValue(myreadings.user.get('epub_fontsize'));
			me.getFsize().enable();
			
			if(myreadings.user.get('epub_mode')=='nuit') {
				me.getTogglemode().setPressedButtons([1]);
			} else {
				me.getTogglemode().setPressedButtons([0]);
			}
			
			if(myreadings.user.get('epub_font')=='arial') {
				me.getFontfamily().setPressedButtons([1]);
			} else {
				me.getFontfamily().setPressedButtons([0]);
			}
			
			me.isInit=true;
		}
		myreadings.user.set('book_reading', true);
		this.getEpubview().setMasked(true);
		
		//Si pas de users, pas de bookmark
		if(myreadings.user.get('currentuser')=="") me.getBookmarkbutton().hide();
		else  me.getBookmarkbutton().show();
		
		this.getEpubview().show();
		myreadings.user.save();
	},
	openEpub: function() {
		var me=this;
		if(me.getBookview().getHref()=="") {
			me.initEpub("current", "", "");
		} else {
			if(!myreadings.user.get('book_reading')) {
				myreadings.user.set('book_reading', true);
				myreadings.user.save();
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
		myreadings.user.set('book_reading', false);
		myreadings.user.save();
		this.getEpubview().hide();
	},
	
	onToc: function() {
		var y = Ext.getCmp('bookview').iframeElement;
		y.dom.contentWindow.openToc();
	},
	
	onTogglemode: function(container, button, pressed) {
			if(pressed) {
				if(this.isInitTogglemode) {
					myreadings.user.set('epub_mode', button.getItemId());
					var y = Ext.getCmp('bookview').iframeElement;
					y.dom.contentWindow.setMode(myreadings.user.get('epub_mode'));
					
					myreadings.user.save();
				} else this.isInitTogglemode=true;
			}
	},
	onToggleFontfamily: function(container, button, pressed) {
		if(pressed) {
			if(this.isInitToggleFontfamily) {
				myreadings.user.set('epub_font', button.getItemId());
				var y = Ext.getCmp('bookview').iframeElement;
				y.dom.contentWindow.setFont(myreadings.user.get('epub_font'));
				
				myreadings.user.save();
			} else this.isInitToggleFontfamily=true;
		}
	},
	onChangefsize:function(selectbox,value,oldvalue) {
		if(!this.getFsize().getDisabled()) {
			myreadings.user.set('epub_fontsize', value);
			var y = Ext.getCmp('bookview').iframeElement;
			y.dom.contentWindow.setFontsize(myreadings.user.get('epub_fontsize'));
			
			myreadings.user.save();
		}
	},
	onBookmarkbutton: function() {
		var y = Ext.getCmp('bookview').iframeElement;
		var bookmark=y.dom.contentWindow.getbookmark();
		if(bookmark.componentId&&bookmark.percent) {
			myreadings.app.getController('articlesControl').saveusermark(myreadings.user.get('book_id'), myreadings.user.get('book_type'), bookmark.percent, bookmark.componentId, "bookmarkpage");
		}
	},
	onInfoButton: function() {
		myreadings.app.getController('articlesControl').openArticle_CurrentBook();
	},
	isloaded: function() {
		this.getEpubview().setMasked(false);
	}
});