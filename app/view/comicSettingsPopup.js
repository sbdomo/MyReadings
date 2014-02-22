Ext.define('myreadings.view.comicSettingsPopup', {
  extend: 'Ext.form.Panel',
  xtype: 'comicSettingsPopup',

  config: {
	  centered: true,
	  hideOnMaskTap: true,
	  modal: true,
	  width: '80%',
	  height: '80%',
	  items: [
	  {
		  xtype:'comicSettings',
		  name:'comicSettings',
		  itemId:'comicSettings',
		  height: 450,
		  scrollable: false
	  }
	  ],
	  listeners:{
		  show: function() {
			  this.down('#comicSettings').onInit();
		  },
		  hide: function() {
			  this.down('#comicSettings').onSave();
			  myreadings.app.getController('comic').UpdateSettings();
		  }
	  }
  }
});