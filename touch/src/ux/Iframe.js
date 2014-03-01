Ext.define('Ext.ux.Iframe', {
	extend: 'Ext.Component',
	xtype: 'iframe',
	
	config: {
		style: '-webkit-overflow-scrolling: touch; height: 100%; overflow: auto;',
		href: false
	},
	
	template: [
		{
			reference: 'iframeElement',
			tag: 'iframe',
			style: 'height: 100%; width: 100%; border: 0;'
		}
	],
	
	updateHref: function(href){
		this.iframeElement.set({ src: href });
		this.setHref(href);
	}
});
