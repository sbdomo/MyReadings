Ext.define('myreadings.model.listmodel', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
            'id',
            'name',
            'count'
        ],
        idProperty: 'id'
    }
});
