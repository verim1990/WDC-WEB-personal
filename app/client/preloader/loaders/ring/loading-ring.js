(function ($) {

    $.loadingpage = $.loadingpage || {};
    $.loadingpage.graphics = $.loadingpage.graphics || {};
    
    $.loadingpage.graphics['ring'] = {
        created: false,
        attr   : {},
        create : function(options){
            
            options.backgroundColor 	= options.backgroundColor || "#000000";
            options.foregroundColor 	= options.foregroundColor || "#FFFFFF";
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
                    top: this.attr['overlay'].height()/2-20,
                    left: this.attr['overlay'].width()/2-50,
                    textAlign: "center",
                    color: options.foregroundColor
                }).appendTo(this.attr['overlay']);
            }
            
            $("<div><canvas></canvas></div>").css({
                position: "absolute",
                top: this.attr['overlay'].height()/2-150,
                left:this.attr['overlay'].width()/2-150,
            }).appendTo(this.attr['overlay']);
            
            this.attr['canvas']  = this.attr['overlay'].find('canvas')[0];
            
            this.attr['canvas'].height = 300;
            this.attr['canvas'].width = 300;
            
            this.attr['ctx'] = this.attr['canvas'].getContext("2d");
            this.attr['previous'] = 0;
            this.set(0);
            this.created = true;
        },
        
        set : function(percentage){
            this.attr[ 'next' ] = Math.floor(percentage*3.6);
            
            for( $i = this.attr['previous']; $i <= this.attr[ 'next' ]; $i++ ){
                this._draw();
            }
            
            if (this.attr['text']) {
                this.attr['text'].text(Math.ceil(percentage) + "%");
            }
        },
        
        _draw : function(){
            if( this.attr[ 'previous' ] > this.attr[ 'next' ]){ 
                return
            };
            
            var ctx  = this.attr['ctx'],
                e, s;
            
            s = this.attr['previous'];
            e = this.attr['previous']+1;
            this.attr['previous'] += 1;
            
            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = this.attr['foreground'];
            ctx.lineWidth = 40;
            ctx.arc(150, 150, 80, (Math.PI/180)*s, (Math.PI/180)*e, false);
            ctx.stroke();
        },
        
        complete : function(callback){
            if (this.attr['text']) {
                this.attr['text'].text("100%");
            }
            
            if(this.attr['previous'] < 360){
                this.attr['next'] = 360;
                for( $i = this.attr['previous']; $i <= 360; $i++ ){
                    this._draw();
                }
            }
            callback();
            var me = this;
            this.attr['overlay'].fadeOut(500, function () {
                me.attr['overlay'].remove();
            });
        }
    };
})(jQuery);