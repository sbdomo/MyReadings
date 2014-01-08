Ext.define('myreadings.view.searchview', {
	extend: 'Ext.tab.Panel',
	xtype: 'searchview',
	id: 'searchview',
	config: {
		hidden: true,
		tabBar: {hidden: true},
		fullscreen: true,
		tabBarPosition: 'bottom',
		autoDestroy: false,
		items:[
		{
			title: 'liste',
			//id:'searchpanel',
			xtype: 'searchpanel'
		},
		{
			title: 'liste2',
			//id:'searchpanel',
			xtype: 'listview'
		}
		]
	}
});