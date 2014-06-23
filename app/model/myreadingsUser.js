Ext.define('myreadings.model.myreadingsUser', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			//login compte
			{name: 'id', type: 'string'}, //="1"
			{name: 'username', type: 'string'},
			{name: 'password', type: 'string'},
			//******************Sauvegarde*****************
			//Menu order
			{name: 'order', type: 'string', defaultValue:"recent"}, //ordre de tri ex: pubdate
			{name: 'gpseries', type: 'int', defaultValue: 0}, //pour indiquer s'il faut groupé les livres par série
			{name: 'showifread', type: 'string', defaultValue:"all"}, //pour indiquer s'il faut montré tout les livres, les lus ou non lus
			//Menu configuration
			{name: 'currentuser', type: 'string', defaultValue:""}, //utilisateur en cours (pour les bookmarks des livres)
			{name: 'open_current_comic_at_launch', type: 'int', defaultValue: 1}, //Open comic at launch
			{name: 'showresize', type: 'int', defaultValue: 0}, //show message if comic page is resized
			{name: 'hidemenu', type: 'int', defaultValue: 0}, //hide menu when comic is open
			//settings comic viewer
			{name: 'zoom_on_tap', type: 'int', defaultValue: 1}, //Zoom: 1:SingleTap, 2:DoubleTap
			{name: 'toggle_paging_bar', type: 'int', defaultValue: 2}, //Cache barre d'outils: 1:SingleTap, 2:DoubleTap
			{name: 'page_turn_drag_threshold', type: 'int', defaultValue: 75}, //taille déplacement pour swipe
			{name: 'page_fit_mode', type: 'int', defaultValue: 1}, // 1: Fit width, 2: Full page
			{name: 'page_change_area_width', type: 'int', defaultValue: 50}, //Largeur bande pour changement de page
			//setting epub viewer
			{name: 'epub_mode', type: 'string', defaultValue: 'jour'},
			{name: 'epub_font', type: 'string', defaultValue: 'arial'},
			{name: 'epub_fontsize', type: 'string', defaultValue: '1.45'},
			//******************Non sauvegardé*****************
			//Menu recherche
			{name: 'pathbase', type: 'string'}, //chemin de la base de données
				//filtre
			{name: 'namelistfilter', type: 'string', defaultValue:""}, //nom de la liste
			{name: 'listfilter', type: 'string', defaultValue:""}, //code de la liste
			{name: 'idfilter', type: 'int', defaultValue: 0}, //id du filtre
			{name: 'namefilter', type: 'string', defaultValue:""}, //nom du filtre
				//recherche
			{name: 'find', type: 'string', defaultValue:""}, //texte à rechercher
			{name: 'type', type: 'string', defaultValue:""}, //type d'interrogation, ex: all: tout, authorname par auteur, author dans la liste d'auteur avec idlist
			{name: 'start', type: 'string', defaultValue:"0"}, //recherche le texte de find au début si start!=0
			{name: 'idlist', type: 'string', defaultValue:""}, //pour une recherche, par exemple id de l'auteur
			//livre en cours
			{name: 'book_reading', type: 'boolean', defaultValue: false},
			{name: 'book_id', type: 'int'},
			{name: 'book_path', type: 'string'},
			{name: 'book_title', type: 'string'},
			{name: 'book_currentpage', type: 'int'},
			{name: 'book_pages', type: 'int'},
			{name: 'book_type', type: 'string'}
		],
		idProperty: 'id',
		proxy: {
			type: 'localstorage',
			id: 'login-myreadings'
		}
	}
});
