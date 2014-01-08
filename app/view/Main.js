Ext.define('myreadings.view.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'main',
    requires: [
        'Ext.TitleBar',
	//'myreadings.view.Articles',
	//'myreadings.view.ArticlesList',
        'myreadings.view.article',
    ],
    views: ['ArticlesList'],
    config: {
        //tabBarPosition: 'bottom',
        tabBar: {hidden: true},
        fullscreen: true,
        autoDestroy: false//,
	//items:
    },
    initialize: function() {
        this.setItems(
        [
	{ xtype: "articleslist" }
	]
	);
	this.callParent(arguments);
    }
});
