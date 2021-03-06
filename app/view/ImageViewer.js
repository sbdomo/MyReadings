/*
  This file was part of Badaap Comic Reader and from Ext.ux.ImageViewer
*/  
  
Ext.define('myreadings.view.ImageViewer',{
        
    extend: 'Ext.Container',
    requires: ['Ext.Img'],
    config: {
            zoomOnDoubleTap: false,
            zoomOnSingleTap: true,
            zoomOnTapScale: 2, // zoom multiplier
            
            minScale: 1, 
            maxScale: 4,
            
            loadingMask: false,
	    loadingevent: true,
            previewSrc: false,
            resizeOnLoad:true,
            autoFitWidth: true,
            autoFitHeight: false,
            imageSrc: false,
            initOnActivate: false,
            cls: 'imageBox',
            errorImage: false,
	    emptyImage: 'resources/images/empty.png',
            scrollable: { 
              direction:'both', 
              directionLock: true,
              indicators: false
            },  
            loadingMessage:'',
            html: '<figure><img/></figure>'
    },
    xtype: 'imageviewer',
    duringDestroy: false,
    
    initialize: function() {
        if(this.initOnActivate)
	{
            this.addListener('activate', this.initViewer, this, {delay: 10, single: true});
        }
	else
	{
            this.addListener('painted', this.initViewer, this, {delay: 10, single: true});        
	}
    },
    
    initViewer: function() {
        var me = this,
            scroller = me.getScrollable().getScroller(),
            element = me.element;
            
        //disable scroller
        scroller.setDisabled(true);
        
        // mask image viewer
        if(me.getLoadingMask())
	{
            me.setMasked({
                   xtype: 'loadmask',
                   message: me.getLoadingMessage()
            });
	}

        me.scaledFromBaseScale = false;
        
        // retrieve DOM els
        me.figEl = element.down('figure');
        me.imgEl = me.figEl.down('img');

        // apply required styles
        me.figEl.setStyle({
            overflow: 'hidden',
            display: 'block',
            margin: 0
        });
	
        me.imgEl.setStyle({
            '-webkit-user-drag': 'none',
            '-webkit-transform-origin': '0 0',
            'user-drag': 'none',
            'transform-origin': '0 0',
            'visibility': 'hidden'
        });
	
	// show preview
        if(me.getPreviewSrc())
        {
            element.setStyle({
                backgroundImage: 'url('+me.getPreviewSrc()+')',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                //webkitBackgroundSize: 'contain',
                backgroundSize: 'contain'
            });
        }

        //subscribe to orientation change on viewport
        Ext.Viewport.on('orientationchange', me.resize, me);
        
        // attach event listeners
        me.on('load', me.onImageLoad, me);
        me.on('error', me.onImageError, me);
        me.on('zoomByTap', me.onZoomByTap, me);
/*
        me.figEl.addListener({
            scope: me,
            singletap: me.onSingleTapContainer,
            doubletap: me.onDoubleTapContainer,
            dragstart: me.onDragStartContainer,
            drag: me.onDragContainer,
            dragend: me.onDragEndContainer,
            taphold: me.onTapHoldContainer,
        });  
*/        
        me.imgEl.addListener({
            scope: me,
            singletap: me.onSingleTap,
            doubletap: me.onDoubleTap,
            pinchstart: me.onImagePinchStart,
            pinch: me.onImagePinch,
            pinchend: me.onImagePinchEnd,
            //dragstart: me.onDragStart,
            //drag: me.onDrag,
            //dragend: me.onDragEnd,
            taphold: me.onTapHold
        });
        
        me.fireEvent('initDone', me);
        
        // load image
        if(me.getImageSrc())
	{
            me.loadImage(me.getImageSrc());
	} else if(me.getEmptyImage()) {
            me.loadImage(me.getEmptyImage());
	}
    },

    loadImage: function(src) {
        var me = this;
	
	// mask image viewer
        /*if(me.getLoadingMask()) {
            //me.setMasked(true);
	    me.setMasked({
                   xtype: 'loadmask',
                   message:me.getLoadingMessage()
            });
	}*/
	if(me.getLoadingevent()) me.fireEvent('imageLoading', me);
	
	me.setImageSrc(src);
        if (me.imgEl)
        {
            // hide image during loading
            me.imgEl.setStyle({ visibility: 'hidden' });
	    
            me.imgEl.dom.src = src;
            me.imgEl.dom.onload = Ext.Function.bind(me.onLoad, me, me.imgEl, 0);
            me.imgEl.dom.onerror = Ext.Function.bind(me.onError, me, me.imgEl, 0);
        }
        else
	{
            //me.setImageSrc(src);
	}
    },
    
    unloadImage: function() {  
        var me = this;
    
        // mask image viewer
        if (me.getLoadingMask()) {
            me.setMasked({
                xtype: 'loadmask',
                message:me.getLoadingMessage()
            });
        }
	
	me.setImageSrc('');
	
        if (me.imgEl) {
            if (me.getEmptyImage()) {
                  me.imgEl.dom.src = me.getEmptyImage();
            } else {
		    //Génère un erreur (onError et onImageError car il n'y a pas d'image à charger
		    me.imgEl.dom.src = '';
	    }
            me.imgEl.setStyle({ visibility: 'hidden' });
        } else {
            //me.setImageSrc('');
            //me.imgEl.setStyle({ visibility: 'hidden' });
        }
    },
    
    //nouvelle version Non utilisé ??
    replaceImage: function(oldImg, newImg) {
        oldImg.dom.parentNode.insertBefore(newImg.dom, oldImg.dom);
        
        delete Ext.cache[oldImg.id];
        Ext.removeNode(oldImg.dom);
        oldImg.id = Ext.id(oldImg.dom = newImg.dom);
        Ext.dom.Element.addToCache(oldImg.isFlyweight ? new Ext.dom.Element(oldImg.dom) : oldImg);
        newImg.dom = null;
        
        return oldImg;
    },
    
    // replace the imgEl with another img DOM element.
    // untested.... Non utilisé ?
    setImage: function(el) {
      var me = this;
      if (me.imgEl)
      {
        //me.imgEl.replaceWith(el);
        el.replace(me.imgEl);
        me.imgEl.dom = el.dom;
        el.dom = null;
        //me.replaceImage(me.imgEl, el);

        me.imgEl.dom.onload = Ext.Function.bind(me.onLoad, me, me.imgEl, 0);
        me.imgEl.dom.onerror = function(e) {
                me.fireEvent('error', me, el, e);
                
                if (me.getErrorImage())
                {
                  this.src = me.getErrorImage();
                }
            };
        
        me.fireEvent('load', me, me.imgEl, 0);
      }
      else
      {
        me.setImageSrc(el.dom.src);
      }
    },

    //Non utilisé??
    onDragStart: function( /*Ext.event.Event*/ event, /*HTMLElement*/ node, /*Object*/ options, /*Object*/ eOpts ) 
    { 
      var me = this;
      console.log('onDragStart'); 
      me.fireEvent('dragstart', me); 
    },
    //Non utilisé??
    onDrag: function() { console.log('onDrag'); this.fireEvent('drag', this); },
    //Non utilisé??
    onDragEnd: function() { console.log('onDragEnd'); this.fireEvent('dragend', this); },
    
    onTapHold: function() { console.log('onTapHold'); this.fireEvent('taphold', this); },
    
    onLoad: function(el, e) {
        var me = this;
        me.fireEvent('load', me, el, e);
    },
    
    onError: function(el, e) {
        var me = this;
	console.log("ImageViewer: Error");
        me.fireEvent('error', me, el, e);
        if (me.getErrorImage())
	{
          el.src = me.getErrorImage();
	}
    },

    onImageError: function() {
      var me = this;
      
      me.setImageSrc('');
      
      if (me.getLoadingMask())
      {
        me.setMasked(false);
      }
        console.log("ImageViewer: Image error");
        me.fireEvent('imageError', me);
    },
    
    onImageLoad: function() {
        var me = this,
            parentElement = me.parent.element;
        
        me.resize();

        // show image and remove mask
        me.imgEl.setStyle({ visibility: 'visible' });

        // remove preview
        if(me.getPreviewSrc())
        {
            me.element.setStyle({
                backgroundImage: 'none'
            });
        }
	
        if(me.getLoadingMask())
	{
            me.setMasked(false);
	}
	//console.log("ImageViewer load:"+me.getItemId()+me.imgEl.dom.src);
        me.fireEvent('imageLoaded', me);
    },
    
    onImagePinchStart: function(ev) {
        var me = this,
            scroller = me.getScrollable().getScroller(),
            scrollPosition = scroller.position,
            touches = ev.touches,
            element = me.element,
            scale = me.scale;

        // disable scrolling during pinch
        scroller.stopAnimation();
        scroller.setDisabled(true);
        
        // store beginning scale
        me.startScale = scale;
        
        // calculate touch midpoint relative to image viewport
        me.originViewportX = (touches[0].pageX + touches[1].pageX) / 2 - element.getX();
        me.originViewportY = (touches[0].pageY + touches[1].pageY) / 2 - element.getY();
        
        // translate viewport origin to position on scaled image
        me.originScaledImgX = me.originViewportX + scrollPosition.x - me.translateX;
        me.originScaledImgY = me.originViewportY + scrollPosition.y - me.translateY;
        
        // unscale to find origin on full size image
        me.originFullImgX = me.originScaledImgX / scale;
        me.originFullImgY = me.originScaledImgY / scale;
        
        // calculate translation needed to counteract new origin and keep image in same position on screen
        me.translateX += (-1 * ((me.imgWidth*(1-scale)) * (me.originFullImgX/me.imgWidth)));
        me.translateY += (-1 * ((me.imgHeight*(1-scale)) * (me.originFullImgY/me.imgHeight)));
    
        // apply new origin
        me.setOrigin(me.originFullImgX, me.originFullImgY);
    
        // apply translate and scale CSS
        me.applyTransform();
    },
    
    onImagePinch: function(ev) {
        var me = this;
        // prevent scaling to smaller than screen size
        me.scale = Ext.Number.constrain(ev.scale * me.startScale, me.baseScale, me.getMaxScale());
        me.applyTransform();
    },
    
    onImagePinchEnd: function(ev) {
        var me = this,
            scale_threshold = 0;
	    
        // Snap to minimum scale
        /*
        if (me.baseScale < 1)
        {
          var scale_threshold = me.baseScale + (1 - me.baseScale) / 2;
          if (me.scale <= scale_threshold)
            me.scale = me.baseScale;
        }
        */
        
        if (me.scale < me.fitScale) 
        {
          // 0.8 so scaling will favor fitScale above baseScale for a more natural feel on the ipad.
          scale_threshold = 0.8*(me.baseScale + me.fitScale) / 2;
          if (me.scale >= scale_threshold)
	  {
            me.scale = me.fitScale;
	  }
          else
	  {
            me.scale = me.baseScale;
	  }
        }
        
        // set new translation
        if(me.scale == me.baseScale)
        {
          // move to center
          me.setTranslation(me.translateBaseX, me.translateBaseY);
        }
        else
        if (me.scale == me.fitScale)
        {
          // move to center
          me.setTranslation(0, Math.min(0, me.translateY));
        }
        else
        {    
            //Resize to init size like ios
            if(me.scale < me.baseScale && me.getResizeOnLoad())
	    {
                me.resetZoom();
                return;
            }
            // calculate rescaled origin
            me.originReScaledImgX = me.originScaledImgX * (me.scale / me.startScale);
            me.originReScaledImgY = me.originScaledImgY * (me.scale / me.startScale);
            
            // maintain zoom position
            me.setTranslation(me.originViewportX - me.originReScaledImgX, me.originViewportY - me.originReScaledImgY);            
        }
        // reset origin and update transform with new translation
        me.setOrigin(0, 0);
        me.applyTransform();

        // adjust scroll container
        me.adjustScroller();
    },

    onZoomIn: function(){
        var me = this,
            ev = {pageX : 0, pageY: 0},
            myScale = me.scale;
        if (myScale < me.getMaxScale())
	{
              myScale = me.scale + 0.05;
	}
        if (myScale >= me.getMaxScale())
	{
              myScale = me.getMaxScale();
	}
              
        ev.pageX = me.viewportWidth / 2;
        ev.pageY = me.viewportHeight / 2;
        me.zoomImage(ev,myScale);
    },
    
    onZoomOut: function(){
        var me = this,
            ev = {pageX : 0, pageY: 0},
            myScale = me.scale;
        if (myScale > me.baseScale)
	{
                myScale = me.scale - 0.05;
	}
        if (myScale <= me.baseScale)
	{
                myScale = me.baseScale;
	}

        ev.pageX = me.viewportWidth / 2;
        ev.pageY = me.viewportHeight / 2;
        me.zoomImage(ev,myScale);
    },
    
    zoomImage: function (ev, scale, scope) {
        var me = this,
            scroller = me.getScrollable().getScroller(),
            scrollPosition = scroller.position,
            element = me.element,
        // zoom in toward tap position
            oldScale = me.scale,
            newScale = scale,
            originViewportX = ev ? (ev.pageX - element.getX()) : 0,
            originViewportY = ev ? (ev.pageY - element.getY()) : 0,
            originScaledImgX = originViewportX + scrollPosition.x - me.translateX,
            originScaledImgY = originViewportY + scrollPosition.y - me.translateY,
            originReScaledImgX = originScaledImgX * (newScale / oldScale),
            originReScaledImgY = originScaledImgY * (newScale / oldScale);
        
        me.scale = newScale;
        setTimeout(function(){
            me.setTranslation(originViewportX - originReScaledImgX, originViewportY - originReScaledImgY);

            // reset origin and update transform with new translation
            me.applyTransform();

            // adjust scroll container
            me.adjustScroller();
            
            // force repaint to solve occasional iOS rendering delay
            Ext.repaint();
        },50);
    },
    
    onSingleTap: function(ev, t) {
      var me = this;
      if (!me.fireEvent('singletap', ev ,t) && me.getZoomOnSingleTap())
      {
        me.fireEvent('zoomByTap', ev, t);
      }
    },
    
    onDoubleTap: function(ev, t) {
      var me = this;
      if (!me.fireEvent('doubletap', ev ,t) && me.getZoomOnDoubleTap())
      {
        me.fireEvent('zoomByTap', ev, t);
      }
    },
    
    onZoomByTap: function(ev, t) {
        var me = this,
            scroller = me.getScrollable().getScroller(),
            scrollPosition = scroller.position,
            element = me.element;

        if (!me.getZoomOnTapScale())
	{
            return false;
	}
        
        // set scale and translation
        
        if (me.scale > me.fitScale)
        {
            // zoom out to fitScale
            if (me.scaledFromBaseScale)
            {
              me.scale = me.baseScale;
              me.setTranslation(me.translateBaseX, me.translateBaseY);
            }
            else
            {
              me.scale = me.fitScale;
              me.setTranslation(me.translateFitX, me.translateFitY);
            }
              
            me.scaledFromBaseScale = false;
            
            
            // reset origin and update transform with new translation
            me.applyTransform();

            // adjust scroll container
            me.adjustScroller();
            
            // force repaint to solve occasional iOS rendering delay
            Ext.repaint();
        }
        else
        if (me.scale < me.fitScale && me.scale > me.baseScale)
        {
            // zoom out to base view
            me.scale = me.baseScale;
            me.setTranslation(me.translateBaseX, me.translateBaseY);
            // reset origin and update transform with new translation
            me.applyTransform();

            // adjust scroll container
            me.adjustScroller();
            
            // force repaint to solve occasional iOS rendering delay
            Ext.repaint();
        }
        else // me.scale == me.baseScale || me.scale == me.fitScale
        {
            me.scaledFromBaseScale = (me.scale == me.baseScale); 
          
            // zoom in toward tap position
            var oldScale = me.scale,
                newScale = me.fitScale*2,
                originViewportX = ev ? (ev.pageX - element.getX()) : 0,
                originViewportY = ev ? (ev.pageY - element.getY()) : 0,
                originScaledImgX = originViewportX + scrollPosition.x - me.translateX,
                originScaledImgY = originViewportY + scrollPosition.y - me.translateY,
                originReScaledImgX = originScaledImgX * (newScale / oldScale),
                originReScaledImgY = originScaledImgY * (newScale / oldScale);
            
            me.scale = newScale;
            
            //smoothes the transition
            setTimeout(function(){
                me.setTranslation(originViewportX - originReScaledImgX, originViewportY - originReScaledImgY);
                // reset origin and update transform with new translation
                me.applyTransform();

                // adjust scroll container
                me.adjustScroller();
                
                // force repaint to solve occasional iOS rendering delay
                Ext.repaint();
            },50);
            
        }
    },
    
    setOrigin: function(x, y) {
      if (Ext.browser.is.WebKit)
      {
        this.imgEl.dom.style.webkitTransformOrigin = x + 'px ' + y + 'px';
      }
      else
      {
        this.imgEl.dom.style.transformOrigin = x + 'px ' + y + 'px';
      }
    },
    
    setTranslation:  function(translateX, translateY) {
        var me = this;
        me.translateX = translateX;
        me.translateY = translateY;
            
        // transfer negative translations to scroll offset
        me.scrollX = me.scrollY = 0;
        
        if(me.translateX < 0)
        {
            me.scrollX = me.translateX;
            me.translateX = 0;
        }
        if(me.translateY < 0)
        {
            me.scrollY = me.translateY;
            me.translateY = 0;
        }
    },
    
    resetZoom:function(){
        var me = this;
        
        if (me.duringDestroy) {
            return;
        }

        //Resize to init size like ios
        me.scale = me.baseScale;
        
        me.setTranslation(me.translateBaseX, me.translateBaseY);
        
        // reset origin and update transform with new translation
        me.setOrigin(0, 0);
        me.applyTransform();


        // adjust scroll container
        me.adjustScroller();
        
    },
    resize:function(){
        var me = this;
        // get viewport size
        me.viewportWidth = me.parent.element.getWidth() ||me.viewportWidth || me.getWidth();
        me.viewportHeight = me.parent.element.getHeight() || me.viewportHeight || me.getHeight();
        
        me.scaledFromBaseScale = false;

        // grab image size
        if(me.imgEl !== undefined){
            me.imgWidth = me.imgEl.dom.width;
            me.imgHeight = me.imgEl.dom.height;
        }else{
            return;
        }       
        // calculate and apply initial scale to fit image to screen
        if (me.getResizeOnLoad())
        {
          // totalFitScale is the scale at which the entire image is visible.
          me.totalFitScale = Math.min(me.viewportWidth/me.imgWidth, me.viewportHeight/me.imgHeight);
          me.baseScale = me.totalFitScale;
          if (me.getAutoFitWidth() && !me.getAutoFitHeight())
          {
            me.fitScale = me.viewportWidth/me.imgWidth; 
            me.scale = me.fitScale;
          }
          else
          if (!me.getAutoFitWidth() && me.getAutoFitHeight())
          {
            me.fitScale = me.viewportHeight/me.imgHeight;
            me.scale = me.fitScale;
          }
          else
          if (me.getAutoFitWidth() && me.getAutoFitHeight())
          {
            me.scale = me.fitScale = me.baseScale;
          }
          else
          {
            me.scale = me.fitScale = me.baseScale = 1;
          }
          
          me.setMaxScale(me.scale*4);
        }
        else
        {
          me.scale = me.totalFitScale = me.fitScale = me.baseScale = 1;
        }
        
        // set initial translation to center
        me.translateBaseX = (me.viewportWidth - me.baseScale * me.imgWidth) / 2;
        me.translateBaseY = (me.viewportHeight - me.baseScale * me.imgHeight) / 2;
        me.translateFitX = (me.viewportWidth - me.fitScale * me.imgWidth) / 2;
        me.translateFitY = (me.viewportHeight - me.fitScale * me.imgHeight) / 2;
        me.translateX = 0;//me.translateFitX;//(me.viewportWidth - me.scale * me.imgWidth) / 2;
        me.translateY = 0;//me.translateFitY;//(me.viewportHeight - me.scale * me.imgHeight) / 2;
        
        if(me.scale == me.baseScale)
        {
          // move to center
          me.setTranslation(me.translateBaseX, me.translateBaseY);
        }
        // reset origin and update transform with new translation
        me.setOrigin(0, 0);
        // apply initial scale and translation
        me.applyTransform();
        
        me.scrollX = 0;
        me.scrollY = 0;
        
        // initialize scroller configuration
        me.adjustScroller();
        
        Ext.repaint();
    },

    applyTransform: function() {
        var me = this,
            fixedX = Ext.Number.toFixed(me.translateX,5),
            fixedY = Ext.Number.toFixed(me.translateY,5),
            fixedScale = Ext.Number.toFixed(me.scale, 8);
        
        if(Ext.os.is.Android)
        {
            me.imgEl.dom.style.webkitTransform = 
                //'translate('+fixedX+'px, '+fixedY+'px)'
                //+' scale('+fixedScale+','+fixedScale+')';
                'matrix('+fixedScale+',0,0,'+fixedScale+','+fixedX+','+fixedY+')';
        }
        else
        {
          if (Ext.browser.is.WebKit)
          {
            me.imgEl.dom.style.webkitTransform =
                'translate3d(' + fixedX + 'px, ' + fixedY + 'px, 0)'
                + ' scale3d(' + fixedScale + ',' + fixedScale + ',1)';
          }
          else
          {
            me.imgEl.dom.style.transform =
                'translate3d(' + fixedX + 'px, ' + fixedY + 'px, 0)'
                + ' scale3d(' + fixedScale + ',' + fixedScale + ',1)';
          }
          
        }
    },

    adjustScroller: function() {
        var me = this,
            scroller = me.getScrollable().getScroller(),
            scale = me.scale;  
        
        // disable scrolling if zoomed out completely, else enable it
        //if(scale == me.baseScale)
        //    scroller.setDisabled(true);
        //else
            scroller.setDisabled(false);
        
        // size container to final image size
        var boundWidth = Math.max(me.imgWidth * scale, me.viewportWidth);
        var boundHeight = Math.max(me.imgHeight * scale, me.viewportHeight);

        me.figEl.setStyle({
            width: boundWidth + 'px',
            height: boundHeight + 'px'
        });
        
        // update scroller to new content size
        scroller.refresh();

        // apply scroll
        var x = 0;
        if(me.scrollX){
            x = me.scrollX;
        }
        var y = 0;
        if(me.scrollY){
            y = me.scrollY;
        }
        scroller.scrollTo(x*-1,y*-1);
    },
    
    destroy: function() {
        var me = this;
        
        me.duringDestroy = true;
        
        me.un('activate', me.initViewer, me);
        me.un('painted', me.initViewer, me);
        
        Ext.destroy(me.getScrollable(), me.imgEl);
        
        me.callParent();
    },
    
    hideImage: function() {
    	    if (this.imgEl) this.imgEl.setStyle({ visibility: 'hidden' });
    },
    showImage: function() {
    	    if (this.imgEl) this.imgEl.setStyle({ visibility: 'visible' });
    }
    
    });