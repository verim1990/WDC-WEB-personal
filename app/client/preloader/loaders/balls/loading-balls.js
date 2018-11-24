(function ($) {

    $.loadingpage = $.loadingpage || {};
    $.loadingpage.graphics = $.loadingpage.graphics || {};
    
    $.loadingpage.graphics['balls'] = {
        created: false,
        attr   : {},
        create : function(options){
            
            options.backgroundColor = options.backgroundColor || "#000000";
            options.foregroundColor = options.foregroundColor || "#FFFFFF";
            options.backgroundOpacity	= options.backgroundOpacity || 1;
			
            this.attr['foreground'] = options.foregroundColor;
            
            var css_o = {
                width: "100%",
                height: "100%",
                backgroundColor: options.backgroundColor,
				opacity: options.backgroundOpacity,
                position: "fixed",
                zIndex: 666999,
                top: 0,
                left: 0
            };
            
            if( options[ 'backgroundImage' ] ){
                css_o['backgroundImage']  = 'url('+options[ 'backgroundImage' ]+')';
                css_o['background-repeat'] = options[ 'backgroundRepeat' ] == 0 ? "no-repeat" : "";
                css_o['background-position'] = 'center center';
                
                if( 
                    css_o['background-repeat'].toLowerCase() == 'no-repeat' && 
                    typeof options['fullscreen'] !== 'undefined' &&
                    options['fullscreen']*1 == 1 
                )
                {
                    css_o[ "background-attachment" ] = "fixed";
                    css_o[ "-webkit-background-size" ] = "cover";
                    css_o[ "-moz-background-size" ] = "cover";
                    css_o[ "-o-background-size" ] = "cover";
                    css_o[ "background-size" ] = "cover";
                }
            }
            
            this.attr['overlay'] = $("<div></div>").css(css_o).appendTo("body");
            
            if (options.text) {
                this.attr['text'] = $("<div></div>").text("0%").css({
                    lineHeight: "40px",
                    height: "40px",
                    width: "100px",
                    position: "absolute",
                    fontSize: "30px",
                    top: this.attr['overlay'].height()/2-100,
                    left: this.attr['overlay'].width()/2-50,
                    textAlign: "center",
                    color: options.foregroundColor
                }).appendTo(this.attr['overlay']);
            }
            
            $("<div><canvas></canvas></div>").css({
                position: "absolute",
                top: this.attr['overlay'].height()/2-50,
                left:this.attr['overlay'].width()/2-150,
            }).appendTo(this.attr['overlay']);
            
            this.attr['canvas']  = this.attr['overlay'].find('canvas')[0];
            
            this.attr['canvas'].height = 100;
            this.attr['canvas'].width = 300;
            
            this.attr['ctx'] = this.attr['canvas'].getContext("2d");
            
            // Ball positions
            this.attr['balls'] = [{x:100, y:0, d:5, r:8}, {x:150, y:0, d:5, r:8}, {x:200, y:0, d:5, r:8}];
            this.attr['count'] = 0;
            
            var me = this;
            this.attr['interval'] = setInterval( function(){
                me.attr['count']++;
                me._draw();
            }, 45 );
            this.set(0);
            this.created = true;
        },
        
        
        _draw: function() {
            var canvas  = this.attr['canvas'],
                ctx     = this.attr['ctx'];

            // clear the canvas for this loop's animation
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = this.attr['foreground'];
            
            
            for( var i = 0, h=this.attr['balls'].length; i < h; i++){
                if(this.attr['count'] > i*2){
                    // change y coord
                    if( this.attr['balls'][i]['d'] > 0){
                        if ( this.attr['balls'][i]['y'] + this.attr['balls'][i]['d'] >  canvas.height - 2*this.attr['balls'][i]['r'] ){
                            this.attr['balls'][i]['d'] = -1*this.attr['balls'][i]['d'];
                            
                        }
                    }else{
                        if ( this.attr['balls'][i]['y'] + this.attr['balls'][i]['d'] <  0 ){
                            this.attr['balls'][i]['d'] = -1*this.attr['balls'][i]['d'];
                        }
                    }
                    
                    this.attr['balls'][i]['y'] += this.attr['balls'][i]['d'];
                    
                    // draw ball
                    ctx.beginPath();
                    ctx.arc(this.attr['balls'][i]['x'], Math.max(this.attr['balls'][i]['y'], this.attr['balls'][i]['r']), this.attr['balls'][i]['r'], 0, Math.PI * 2, false);
                    ctx.fill();
                }
            }
            
            ctx.save();
        },
        
        set : function(percentage){
            if (this.attr['text']) {
                this.attr['text'].text(Math.ceil(percentage) + "%");
            }
        },
        
        complete : function(callback){
            if (this.attr['text']) {
                this.attr['text'].text("100%");
            }
            
            clearInterval( this.attr['interval'] );
            callback();
            var me = this;
            this.attr['overlay'].fadeOut(500, function () {
                me.attr['overlay'].remove();
            });
        }
    };
})(jQuery);