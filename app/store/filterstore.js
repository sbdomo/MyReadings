Ext.define("myreadings.store.filterstore", {
    extend: "Ext.data.Store",
    requires: ["myreadings.model.filtermodel"],
    config: {
        model: "myreadings.model.filtermodel",
	proxy: {
            type: 'jsonp',
            //url: 'http://api.shopstyle.com/action/apiSearch',
            url:'./listjson.php',
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
                rootProperty: 'list',
		totalProperty: 'total',
		successProperty: 'success'
            },
	    listeners: {
		    exception: function(proxy, response, operation) {
			    Ext.Msg.alert("Error",response.message);
		    }
	    }
        },
	pageSize: 50,
	autoLoad: false
    }
});