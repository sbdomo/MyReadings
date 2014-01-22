Ext.define('myreadings.model.myreadingsUser', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'name', type: 'string'},
			{name: 'pass', type: 'string'},
			{name: 'pathbase', type: 'string'}, //chemin de la base de données
			{name: 'type', type: 'string', defaultValue:""}, //type d'interrogation, ex: all: tout, authorname par auteur
			{name: 'find', type: 'string', defaultValue:""}, //texte à rechercher
			{name: 'start', type: 'string', defaultValue:"0"}, //recherche le texte de find au début si start!=0
			{name: 'order', type: 'string', defaultValue:"recent"}, //ordre de tri ex: pubdate
			{name: 'idlist', type: 'string', defaultValue:""}//, //pour une recherche, par exemple id de l'auteur
			//{name: 'list', type: 'string', defaultValue:"author"}, //type de liste
			//{name: 'search', type: 'string', defaultValue:""}, //texte à chercher dans une liste
		],

		proxy: {
			type: 'localstorage',
			id: 'login-myreadings'
		}
	}
});
