Ext.define('myreadings.model.myreadingsConf', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'string'},
			{name: 'chg_nbbook', type: 'int', defaultValue: 0},//personalisation du nombre de livre dans le carrousel 0: non, 1:oui
			{name: 'landline', type: 'int', defaultValue: 1}, //nombre de lignes en mode paysage
			{name: 'landbyline', type: 'int', defaultValue: 1}, //nombre de livres par ligne en paysage
			{name: 'portline', type: 'int', defaultValue: 1}, //nombre de lignes en mode portrait
			{name: 'portbyline', type: 'int', defaultValue: 1}, //nombre de livre par ligne en portrait
			{name: 'showcust', type: 'int', defaultValue: 0} //Affiche le texte du premier "custom column" sous le livre

		],
		idProperty: 'id',
		proxy: {
			type: 'localstorage',
			id: 'conf-myreadings'
		}
	}
});