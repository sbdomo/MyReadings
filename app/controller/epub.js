Ext.define('myreadings.controller.epub', {
	extend: 'Ext.app.Controller',
	config: {
		refs: {
			epubview: 'epubview',
			btshowbar: 'epubview #showbar',
			closeminibutton: 'epubview #closeminibutton',
			closebutton: 'epubview #closebutton',
			epubtoolbar: 'epubview #epubtoolbar',
			minitoolbar: 'epubview #minitoolbar',
			btClosetoolbar: 'epubview #closetoolbar',
			togglemode: 'epubview #togglemode',
			fontfamily: 'epubview #fontfamily',
			fsize: 'epubview #fsize',
			tocbt: 'epubview #toc',
			bookview: 'epubview #bookview',
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
			}
		}
	},
	initEpub: function() {
		var me=this;
		
		me.getBookview().updateHref("");
		var params = {
			path: myreadings.currentbook.path,
			title: myreadings.currentbook.name + " - " + myreadings.currentbook.idbook,
			
			mode: myreadings.settings.epub_mode,
			font: myreadings.settings.epub_font,
			taille: myreadings.settings.epub_fontsize,
			
			mylogin: myreadings.app.getController('articlesControl').username,
			mypass: myreadings.app.getController('articlesControl').password
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
		this.getEpubview().show();
		myreadings.app.getController('articlesControl').saveuser();
	},
	openEpub: function() {
		var me=this;
		if(me.getBookview().getHref()=="") {
			me.initEpub();
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
		this.getEpubtoolbar().show();
	},
	onBtClosetoolbar: function() {
		this.getEpubtoolbar().hide();
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
	onInfoButton: function() {
		myreadings.app.getController('articlesControl').openArticle_CurrentBook();
	}
});