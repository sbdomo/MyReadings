Ext.define('myreadings.model.listmodel', {
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
