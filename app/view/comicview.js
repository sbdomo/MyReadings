var SLIDER_RANGE = 10000;
Ext.define('myreadings.view.comicview', {
    extend: 'Ext.Panel',
    
    xtype: 'comicview',
    requires: [
        'Ext.field.Slider'
    ],
    config: {
	    layout: 'card',
	    items: [
	    {
		    xtype: 'titlebar',
		    itemId: 'comictitle',
		    docked: 'top',
		    //style: 'opacity: 0.6;',
		    style: 'background: rgba(0, 0, 0, 0.4);',
		    top: '0px',
		    width: '100%',
		    title: 'Comic',
		    items: [
			{
			xtype: "button",
			itemId: "closebutton",
			ui: 'decline',
			align: 'left',
			iconCls: 'delete',
			iconMask: true
			},
			{
			xtype: 'button',
			align: 'right',
			itemId: 'bookmark',
			iconCls: 'cart',
			iconMask: true
			},
			{
			xtype: 'button',
			align: 'right',
			itemId: 'settingsbutton',
			iconCls: 'settings',
			iconMask: true
			}
			]
	    },
      {
        xtype: 'container',
        itemId: 'imageviewercontainer1',
        layout: 'fit',
        items: [
        {
          xtype: 'imageviewer',
          itemId: 'imageviewer1',
          style: {
              backgroundColor: '#000'
          },
	  imageSrc: ''
          //imageSrc: 'resources/images/no_image_available.jpg'
        },
	{
	itemId: 'loadingIndicator1',
	left: '10px',
        top: '60px',
	width: 128,
        height: 15,
	cls: "loadIndic",
        hidden: true
	}
      ]

      },
      {
        xtype: 'container',
        itemId: 'imageviewercontainer2',
        layout: 'fit',
        items: [
        {
          xtype: 'imageviewer',
          itemId: 'imageviewer2',
          style: {
              backgroundColor: '#000'
          },
	  imageSrc: ''
          //imageSrc: 'resources/images/no_image_available.jpg'
        },
	{
	itemId: 'loadingIndicator2',
	left: '10px',
        top: '60px',
	width: 128,
        height: 15,
	cls: "loadIndic",
        hidden: true
	}
      ]

      },
      {
        xtype: 'toolbar',
        docked: 'bottom',
        //ui: 'transparent',
        //style: 'background: transparent;',
	style: 'background: rgba(0, 0, 0, 0.4);',
	//style: 'opacity: 0.6;',
        bottom: '0px',
        width: '100%',
        height: 75,
        items: [
          {
            xtype: 'sliderfield',
            itemId: 'slider',
            minValue: 0,
            maxValue: SLIDER_RANGE,
            //width: '50%',
            flex: 1
          },
          {
            //nouveau
	    xtype: 'button',
            itemId: 'progressbutton'
          },
          {
            xtype: 'button',
            itemId: 'infobutton',
            iconCls: 'info',
            iconMask: true
          },
	  
          {
            xtype: 'button',
            itemId: 'previousbutton',
            iconCls: 'arrow_left',
            iconMask: true
          },
          {
            xtype: 'button',
            itemId: 'nextbutton',
            iconCls: 'arrow_right',
            iconMask: true
          }
        ]
      },
      {
         itemId: 'prevPageIcon',
        left: '10px',
        top: '50%',
	cls: "prevPageIcon",
        width: 64,
        height: 64,
        hidden: true
      },
      {
        itemId: 'nextPageIcon',
        right: '10px',
        top: '50%',
	cls: "nextPageIcon",
        width: 64,
        height: 64,
        hidden: true
      }
	    ]
    }
});