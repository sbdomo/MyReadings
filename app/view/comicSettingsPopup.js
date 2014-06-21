Ext.define('myreadings.view.comicSettingsPopup', {
  extend: 'Ext.form.Panel',
  xtype: 'comicSettingsPopup',

  requires:['Ext.field.Spinner'],
  txtTitle: "Comic Viewer Settings",
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
	  //centered: true,
	  //hideOnMaskTap: true,
	  //modal: true,
	  //width: '80%',
	  //height: '80%',
	  listeners:{
		  show: function() {
			  this.onInit();
		  }//,
		  //hide: function() {
			  //this.onSave();
			  //myreadings.app.getController('comic').UpdateSettings();
		  //}
	  }
  },
  initialize: function() {
	this.setItems(
	[
	{
	  xtype:'titlebar',
	  docked: 'top',
	  title: this.txtTitle,
	  //docked: 'bottom',
	  items: [
	  {
		  ui: 'decline',
		  name: 'bthide',
		  align: 'left',
		  iconCls: 'delete',
		  iconMask: true,
		  handler: function(){
			  var form = this.getParent().getParent().getParent();
			  form.onSave();
			  myreadings.app.getController('comic').UpdateSettings();
			  form.hide();
		  }
	  }]
	},
	{
	  xtype: 'fieldset',
	  //title: this.txtTitle,
		items: [
		/*{
			xtype: 'togglefield',
			label: this.txtcomic_at_launch,
			labelWidth: '60%',
			name: 'open_current_comic_at_launch'
		},*/
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
			labelWrap: true,
			labelWidth: '55%',
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
			labelWrap: true,
			labelWidth: '55%',
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
			labelWrap: true,
			labelWidth: '55%',
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
			labelWrap: true,
			labelWidth: '55%',
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
			labelWidth: '48%',
			labelWrap: true,
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
			labelWrap: true,
			labelWidth: '55%',
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
			labelWidth: '48%',
			labelWrap: true,
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
		var me = this;
			pageTurnDragThreshold = me.down('#page_turn_drag_threshold'),
			pageChangeAreaWidth = me.down('#page_change_area_width');
		//console.log("threshold" + myreadings.user.get('page_turn_drag_threshold'));
		me.setValues({
			//open_current_comic_at_launch: myreadings.user.get('open_current_comic_at_launch'),
			//open_next_comic: myreadings.user.get('settings.open_next_comic'),
			zoom_on_tap: myreadings.user.get('zoom_on_tap'),
			page_fit_mode: myreadings.user.get('page_fit_mode'),
			toggle_paging_bar: myreadings.user.get('toggle_paging_bar'),
			use_page_turn_drag: (myreadings.user.get('page_turn_drag_threshold') < 1000),
			page_turn_drag_threshold: (myreadings.user.get('page_turn_drag_threshold') < 1000) ? myreadings.user.get('page_turn_drag_threshold') : 50,
			use_page_change_area: (myreadings.user.get('page_change_area_width') > 0),
			page_change_area_width: (myreadings.user.get('page_change_area_width') > 0) ? myreadings.user.get('page_change_area_width') : 75
		});
		if (myreadings.user.get('page_change_area_width') > 0) {
			pageChangeAreaWidth.enable();
		} else {
			pageChangeAreaWidth.disable();
		}
		
		if (myreadings.user.get('page_turn_drag_threshold') < 1000) {
			pageTurnDragThreshold.enable();
		} else {
			pageTurnDragThreshold.disable();
		}
  },
  onSave: function() {
		var me = this,
		values = me.getValues();
		
		myreadings.user.set('zoom_on_tap', values.zoom_on_tap);
		myreadings.user.set('page_fit_mode', values.page_fit_mode);
		myreadings.user.set('toggle_paging_bar', values.toggle_paging_bar);
		myreadings.user.set('page_turn_drag_threshold', values.use_page_turn_drag ? values.page_turn_drag_threshold : 1000);
		myreadings.user.set('page_change_area_width', values.use_page_change_area ? values.page_change_area_width : 0);
		
		myreadings.user.save();
  }
});