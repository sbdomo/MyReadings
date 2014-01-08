Ext.define('myreadings.model.CurrentUser', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'name', type: 'string'},
			{name: 'pass', type: 'string'},
		],

		proxy: {
			type: 'localstorage',
			id: 'login-data'
		}
	}
});
