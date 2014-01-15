Ext.define('myreadings.model.myreadingsUser', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'name', type: 'string'},
			{name: 'pass', type: 'string'}
		],

		proxy: {
			type: 'localstorage',
			id: 'login-myreadings'
		}
	}
});
