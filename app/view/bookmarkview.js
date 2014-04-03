Ext.define('myreadings.view.bookmarkview', {
	extend: 'Ext.Panel',
	xtype: 'bookmarkview',
	config: {
		width: 200,
		height: 100,
		// We give it a left and top property to make it floating by default
		left: 0,
		top: 0,
		
		// Make it modal so you can click the mask to hide the overlay
		modal: true,
		hideOnMaskTap: true,
		items: [
		{
		itemId:"reading",
		margin:10,
		html:""
		},
		{
		itemId:'btread',
		text: "Nothing ?",
		xtype: 'button',
		margin:10
		}
		]
	}
});