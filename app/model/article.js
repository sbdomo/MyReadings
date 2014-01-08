Ext.define('myreadings.model.article', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
            'id',
            'title',
            'hasCover',
            'relativePath',
            'authorsName',
	    "pubDate",
	    "tagsName",
	    "seriesName",
            'seriesIndex'
        ],
	//'comment', 'extension', 'filename', "languagesName",
	
	
        idProperty: 'id',

        proxy: {
            type: 'jsonp',
            //url: 'http://api.shopstyle.com/action/apiSearch',
            url:'./recordsjson.php',
            limitParam: 'count',
            startParam: 'min',
            pageParam: false,
            //extraParams: {
		    //page: '3',
		    //complete: '1',
		    //id: '4'
                //pid: 'uid6241-1493671-53',
                //format: 'jsonp',
                //cat: 'boots',
                //count:'100'
            //},
            reader: {
                type: 'json',
                rootProperty: 'books'
            }
        }
    }
});
