Ext.define('myreadings.model.filtermodel', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
            'id',
            'name',
            'count',
	    'read'
        ],
        idProperty: 'id'
    }
});
