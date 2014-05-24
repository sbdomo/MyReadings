Ext.define('myreadings.view.main', {
	extend: 'Ext.tab.Panel',
	xtype: 'main',
	config: {
		//fullscreen: true,
		tabBar: {hidden: true},
		layout:{
			animation: false
		},
		items: [
		{
			title: 'articleslist',
			xtype: 'articleslist'

		},
		{
			xtype: 'configpanel',
			title: "configpanel"
		},
		{
			xtype: 'searchview',
			title: "searchview"
		}
		]
	}
});