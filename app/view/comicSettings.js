Ext.define('myreadings.view.comicSettings', {
	extend: 'Ext.form.Panel',
	xtype: 'comicSettings',
	requires:['Ext.field.Spinner'],
	txtTitle: "Comic Viewer Settings",
	txtcomic_at_launch: "Open current comic at app launch",
	txtpage_fit_mode: "Page fit mode",
	txtFitWidth: "Fit width",
	txtFullPage: "Full page",
	txtZoom: "Tap to zoom",
	txtOff: "Off",
	txtSingleTap: "Single tap",
	txtDoubleTap: "Double tap",
	txtToggleBar: "Toggle nav controls",
	txtDrag: "Drag page to change page",
	txtDragThreshold: "Page turn drag threshold",
	txtChange: "Tap sides to change page",
	txtChangeWidth: "Page turn area width",
	
	
	
	
	config: {
	},
	initialize: function() {
		this.setItems(
		[
	 {
	  xtype: 'fieldset',
	  title: this.txtTitle,
		items: [
		{
			xtype: 'togglefield',
			label: this.txtcomic_at_launch,
			labelWidth: '60%',
			name: 'open_current_comic_at_launch'
		},
		/*{
			xtype: 'togglefield',
			label: 'Open next comic on comic finish',
			labelWidth: '60%',
			name: 'open_next_comic',
			disabled: true
		},*/
		{
			xtype: 'selectfield',
			label: this.txtpage_fit_mode,
			labelWidth: '60%',
			name: 'page_fit_mode',
			value: 1,
			options: [
			{
				text: this.txtFitWidth,
				value: 1
			},
			{
				text: this.txtFullPage,
				value: 2
			}
			]
		},
		{
			xtype: 'selectfield',
			label: this.txtZoom,
			labelWidth: '60%',
			name: 'zoom_on_tap',
			value: 2,
			options: [
			{
				text: this.txtOff,
				value: 0
			},
			{
				text: this.txtSingleTap,
				value: 1
			},
			{
				text: this.txtDoubleTap,
				value: 2
			}
			]
		},
		{
			xtype: 'selectfield',
			label: this.txtToggleBar,
			labelWidth: '60%',
			name: 'toggle_paging_bar',
			value: 2,
			options: [
			{
				text: this.txtOff,
				value: 0
			},
			{
				text: this.txtSingleTap,
				value: 1
			},
			{
				text: this.txtDoubleTap,
				value: 2
			}
			]
		},
		{
			xtype: 'togglefield',
			name: 'use_page_turn_drag',
			label: this.txtDrag,
			labelWidth: '60%',
			listeners: 
			{
			 change:function(selectbox,newValue,oldvalue){
				var pageTurnDragThreshold = this.getParent().down('#page_turn_drag_threshold');
				
				if (newValue == 1) {
					pageTurnDragThreshold.enable();
				} else {
					pageTurnDragThreshold.disable();
				}
			 }
			}
		},
		{
			xtype: 'spinnerfield',
			label: this.txtDragThreshold,
			labelWidth: '60%',
			name: 'page_turn_drag_threshold',
			itemId: 'page_turn_drag_threshold',
			minValue: 20,
			maxValue: 200,
			stepValue: 5,
			cycle: true
		},
		{
			xtype: 'togglefield',
			name: 'use_page_change_area',
			label: this.txtChange,
			labelWidth: '60%',
			listeners: 
			{
			 change:function(selectbox,newValue,oldvalue){
				 var pageChangeAreaWidth = this.getParent().down('#page_change_area_width');
				 
				 if (newValue == 1) {
					 pageChangeAreaWidth.enable();
				 } else {
					 pageChangeAreaWidth.disable();
				 }
			 }
			}
		},
		{
			xtype: 'spinnerfield',
			label: this.txtChangeWidth,
			labelWidth: '60%',
			name: 'page_change_area_width',
			itemId: 'page_change_area_width',
			minValue: 20,
			maxValue: 200,
			stepValue: 5,
			cycle: true
		}			
			
			
		]
	 }
	 	]
		);
		this.callParent(arguments);
	},
	onInit: function() {
		console.log("comicsSettings init");
		var me = this;
			pageTurnDragThreshold = me.down('#page_turn_drag_threshold'),
			pageChangeAreaWidth = me.down('#page_change_area_width');
		//console.log("threshold" + myreadings.settings.page_turn_drag_threshold);
		me.setValues({
			open_current_comic_at_launch: myreadings.settings.open_current_comic_at_launch,
			//open_next_comic: myreadings.settings.open_next_comic,
			zoom_on_tap: myreadings.settings.zoom_on_tap,
			page_fit_mode: myreadings.settings.page_fit_mode,
			toggle_paging_bar: myreadings.settings.toggle_paging_bar,
			use_page_turn_drag: (myreadings.settings.page_turn_drag_threshold < 1000),
			page_turn_drag_threshold: (myreadings.settings.page_turn_drag_threshold < 1000) ? myreadings.settings.page_turn_drag_threshold : 50,
			use_page_change_area: (myreadings.settings.page_change_area_width > 0),
			page_change_area_width: (myreadings.settings.page_change_area_width > 0) ? myreadings.settings.page_change_area_width : 75
		});
		if (myreadings.settings.page_change_area_width > 0) {
			pageChangeAreaWidth.enable();
		} else {
			pageChangeAreaWidth.disable();
		}
		
		if (myreadings.settings.page_turn_drag_threshold < 1000) {
			pageTurnDragThreshold.enable();
		} else {
			pageTurnDragThreshold.disable();
		}
	},
	onSave: function() {
		var me = this,
		values = me.getValues();
		
		myreadings.settings.open_current_comic_at_launch = values.open_current_comic_at_launch;
		//myreadings.settings.open_next_comic = values.open_next_comic;
		myreadings.settings.zoom_on_tap = values.zoom_on_tap;
		myreadings.settings.page_fit_mode = values.page_fit_mode;
		myreadings.settings.toggle_paging_bar = values.toggle_paging_bar;
		myreadings.settings.page_turn_drag_threshold = values.use_page_turn_drag ? values.page_turn_drag_threshold : 1000;
		myreadings.settings.page_change_area_width = values.use_page_change_area ? values.page_change_area_width : 0;
		
		myreadings.app.getController('articlesControl').saveuser();
	}
});