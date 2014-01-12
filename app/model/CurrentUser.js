Ext.define('myreadings.model.CurrentUser', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'name', type: 'string'},
			{name: 'pass', type: 'string'},
			{name: 'profil', type: 'profil'}
		],

		proxy: {
			type: 'localstorage',
			id: 'login-data'
		}
	}
});
