Ext.define('myreadings.view.epubview', {
    extend: 'Ext.Panel',
    requires: ['Ext.field.Select', 'Ext.SegmentedButton'],
    xtype: 'epubview',
    config: {
    },
    initialize: function() {
	    if(myreadings.app.getController('articlesControl').profil=="iphone") {
	    this.setItems(
	    [
	    {
		    xtype: 'toolbar',
		    itemId: 'minitoolbar',
		    docked: 'top',
		    style: 'background: transparent;',
		    top: '3px',
		    width: '100%',
		    items: [
			{
			xtype: "button",
			itemId: "closeminibutton",
			ui: 'decline',
			iconCls: 'delete',
			iconMask: true
			},
			{
			xtype:'button',
			itemId:'showbar',
			iconCls: 'settings',
			iconMask: true
			}
		    ]
    	    },
	    {
		    xtype: 'toolbar',
		    itemId: 'epubtoolbar',
		    name: 'epubtoolbar',
		    docked: 'top',
		    hidden: true,
		    //style: 'opacity: 0.6;',
		    style: 'background: transparent;',
		    top: '3px',
		    width: '100%',
		    items: [
			{
			xtype: "button",
			itemId: "closebutton",
			ui: 'decline',
			iconCls: 'delete',
			iconMask: true
			},
			{
			xtype: "button",
			itemId: "closetoolbar",
			iconCls: 'arrow_left',
			iconMask: true
			},
			{
				xtype: 'segmentedbutton',
				itemId: 'togglemode',
				allowMultiple: false,
				items: [
				 	 {
				 	 	 itemId: 'jour',
						 iconCls: 'bird',
						 iconMask: true
				 	 },
				 	 {
				 	 	 itemId: 'nuit',
						 iconCls: 'switch',
						 iconMask: true
				 	 }
				 ]
			},
			{
			xtype: 'button',
			itemId: 'infobutton',
			iconCls: 'info',
			iconMask: true
			}
		    ]
	    },
	    {
		    xtype: 'toolbar',
		    itemId: 'epubtoolbar1',
		    name: 'epubtoolbar1',
		    docked: 'bottom',
		    hidden: true,
		    //style: 'opacity: 0.6;',
		    style: 'background: transparent;',
		    bottom: '3px',
		    width: '100%',
		    //title: 'Epub',
		    items: [
			
			{
				xtype: 'selectfield',
				name:'fsize',
				id:'fsize',
				itemId:'fsize',
				disabled: true,
				width: '110px',
				options: [
    	    	    	  	  {
    	    	    	  	  	  text: '70%',
    	    	    	  	  	  value: "1.00"
    	    	    	  	  },
				  {
    	    	    	  	  	  text: '80%',
    	    	    	  	  	  value: "1.15"
    	    	    	  	  },
				  {
    	    	    	  	  	  text: '90%',
    	    	    	  	  	  value: "1.28"
    	    	    	  	  },
				  {
    	    	    	  	  	  text: '100%',
    	    	    	  	  	  value: "1.45"
    	    	    	  	  },
				  {
    	    	    	  	  	  text: '110%',
    	    	    	  	  	  value: "1.60"
    	    	    	  	  },
				  
				  {
    	    	    	  	  	  text: '130%',
    	    	    	  	  	  value: "1.90"
    	    	    	  	  }
				  ]
			},
			{
				xtype: 'segmentedbutton',
				itemId: 'fontfamily',
				allowMultiple: false,
				items: [
				 	 {
				 	 	 itemId: 'times',
						 iconCls: 'anchor',
						 iconMask: true
				 	 },
				 	 {
				 	 	 itemId: 'arial',
						 iconCls: 'plane',
						 iconMask: true
				 	 }
				 ]
			},
			{
			xtype: "button",
			itemId: "toc",
			iconCls: 'list',
			iconMask: true
			}
			]
	    },
	    {
		    xtype:"iframe",
		    itemId: "bookview",
		    id: "bookview",
		    name: "bookview",
		    href:""
	    }
	    ]
	    );
	    } else {
	    this.setItems(
	    [
	    {
		    xtype: 'toolbar',
		    itemId: 'minitoolbar',
		    docked: 'top',
		    style: 'background: transparent;',
		    top: '3px',
		    width: '100%',
		    items: [
			{
			xtype: "button",
			itemId: "closeminibutton",
			ui: 'decline',
			iconCls: 'delete',
			iconMask: true
			},
			{
			xtype:'button',
			itemId:'showbar',
			iconCls: 'settings',
			iconMask: true
			}
		    ]
    	    },    
	    {
		    xtype: 'toolbar',
		    itemId: 'epubtoolbar',
		    name: 'epubtoolbar',
		    docked: 'top',
		    hidden: true,
		    //style: 'opacity: 0.6;',
		    style: 'background: transparent;',
		    top: '3px',
		    width: '100%',
		    //title: 'Epub',
		    items: [
			{
			xtype: "button",
			itemId: "closebutton",
			ui: 'decline',
			iconCls: 'delete',
			iconMask: true
			},
			{
			xtype: "button",
			itemId: "closetoolbar",
			iconCls: 'arrow_left',
			iconMask: true
			},
			{
				xtype: 'segmentedbutton',
				itemId: 'togglemode',
				allowMultiple: false,
				items: [
				 	 {
				 	 	 itemId: 'jour',
						 iconCls: 'bird',
						 iconMask: true
				 	 },
				 	 {
				 	 	 itemId: 'nuit',
						 iconCls: 'switch',
						 iconMask: true
				 	 }
				 ]
			},
			{
				xtype: 'selectfield',
				name:'fsize',
				id:'fsize',
				itemId:'fsize',
				disabled: true,
				width: '110px',
				options: [
    	    	    	  	  {
    	    	    	  	  	  text: '70%',
    	    	    	  	  	  value: "1.00"
    	    	    	  	  },
				  {
    	    	    	  	  	  text: '80%',
    	    	    	  	  	  value: "1.15"
    	    	    	  	  },
				  {
    	    	    	  	  	  text: '90%',
    	    	    	  	  	  value: "1.28"
    	    	    	  	  },
				  {
    	    	    	  	  	  text: '100%',
    	    	    	  	  	  value: "1.45"
    	    	    	  	  },
				  {
    	    	    	  	  	  text: '110%',
    	    	    	  	  	  value: "1.60"
    	    	    	  	  },
				  
				  {
    	    	    	  	  	  text: '130%',
    	    	    	  	  	  value: "1.90"
    	    	    	  	  }
				  ]
			},
			{
				xtype: 'segmentedbutton',
				itemId: 'fontfamily',
				allowMultiple: false,
				items: [
				 	 {
				 	 	 itemId: 'times',
						 iconCls: 'anchor',
						 iconMask: true
				 	 },
				 	 {
				 	 	 itemId: 'arial',
						 iconCls: 'plane',
						 iconMask: true
				 	 }
				 ]
			},
			{
			xtype: "button",
			itemId: "toc",
			iconCls: 'list',
			iconMask: true
			},
			{
			xtype: 'button',
			itemId: 'infobutton',
			iconCls: 'info',
			iconMask: true
			}
			]
	    },
	    {
		    xtype:"iframe",
		    itemId: "bookview",
		    id: "bookview",
		    name: "bookview",
		    href:""
	    }
	    ]
	    );
	    }
	    this.callParent(arguments);
    }
});