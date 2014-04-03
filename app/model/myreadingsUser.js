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
			{name: 'idlist', type: 'string', defaultValue:""}, //pour une recherche, par exemple id de l'auteur
			{name: 'currentuser', type: 'string', defaultValue:""}, //utilisateur en cours (pour les bookmarks des livres)
			
			//settings comic viewer
			{name: 'zoom_on_tap', type: 'int', defaultValue: 1},
			{name: 'toggle_paging_bar', type: 'int', defaultValue: 2},
			{name: 'page_turn_drag_threshold', type: 'int', defaultValue: 75},
			{name: 'page_fit_mode', type: 'int', defaultValue: 1},
			{name: 'page_change_area_width', type: 'int', defaultValue: 50},
			{name: 'open_current_comic_at_launch', type: 'int', defaultValue: 1},
			
			//setting epub viewer
			{name: 'epub_mode', type: 'string', defaultValue: 'jour'},
			{name: 'epub_font', type: 'string', defaultValue: 'arial'},
			{name: 'epub_fontsize', type: 'string', defaultValue: '1.45'},
			
			//livre en cours
			{name: 'book_reading', type: 'boolean', defaultValue: false},
			{name: 'book_id', type: 'int'},
			//{name: 'book_idbase', type: 'string'},
			{name: 'book_path', type: 'string'},
			{name: 'book_title', type: 'string'},
			{name: 'book_currentpage', type: 'int'},
			{name: 'book_pages', type: 'int'},
			{name: 'book_type', type: 'string'}
		],

		proxy: {
			type: 'localstorage',
			id: 'login-myreadings'
		}
	}
});
