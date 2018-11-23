(function ($) {

    $.loadingpage = $.loadingpage || {};
    $.loadingpage.graphics = $.loadingpage.graphics || {};

    $.loadingpage.graphics['centered_bar'] = {
        created: false,
        attr   : {},
        create : function(options){
            options.backgroundColor 	= options.backgroundColor || "#000000";
            options.height          	= options.height || 1;
            options.foregroundColor 	= options.foregroundColor || "#FFFFFF";
            options.backgroundOpacity	= options.backgroundOpacity || 1;

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
            
            this.attr['overlay'] = $("<div id='loading_page_overlay'></div>").css(css_o).appendTo("body");
            
            options.foregroundColorB = ColorLuminance( options.foregroundColor, -0.4 );
            $(
                "<style> \
                #loading_page_overlay progress { \
                    background-color: #999999;   \
                    border: 0;                   \
                    width: 80%;                  \
                    height: 10px;                \
                    border-radius: 9px;          \
                }                                \
                #loading_page_overlay progress::-webkit-progress-bar {   \
                    background-color: #999999;                           \
                    border-radius: 9px;                                  \
                }                                                        \
                #loading_page_overlay progress::-webkit-progress-value { \
                    background: "+options.foregroundColor+";                                 \
                    background: -moz-linear-gradient(top,  "+options.foregroundColor+" 0%, "+options.foregroundColorB+" 100%); \
                    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,"+options.foregroundColor+"), color-stop(100%,"+options.foregroundColorB+")); \
                    background: -webkit-linear-gradient(top,  "+options.foregroundColor+" 0%,"+options.foregroundColorB+" 100%); \
                    background: -o-linear-gradient(top,  "+options.foregroundColor+" 0%,"+options.foregroundColorB+" 100%); \
                    background: -ms-linear-gradient(top,  "+options.foregroundColor+" 0%,"+options.foregroundColorB+" 100%); \
                    background: linear-gradient(to bottom,  "+options.foregroundColor+" 0%,"+options.foregroundColorB+" 100%); \
                    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='"+options.foregroundColor+"', endColorstr='"+options.foregroundColorB+"',GradientType=0 ); \
                    border-radius: 9px; \
                } \
                #loading_page_overlay progress::-moz-progress-bar { \
                    background: "+options.foregroundColor+";                                 \
                    background: -moz-linear-gradient(top,  "+options.foregroundColor+" 0%, "+options.foregroundColorB+" 100%); \
                    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,"+options.foregroundColor+"), color-stop(100%,"+options.foregroundColorB+")); \
                    background: -webkit-linear-gradient(top,  "+options.foregroundColor+" 0%,"+options.foregroundColorB+" 100%); \
                    background: -o-linear-gradient(top,  "+options.foregroundColor+" 0%,"+options.foregroundColorB+" 100%); \
                    background: -ms-linear-gradient(top,  "+options.foregroundColor+" 0%,"+options.foregroundColorB+" 100%); \
                    background: linear-gradient(to bottom,  "+options.foregroundColor+" 0%,"+options.foregroundColorB+" 100%); \
                    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='"+options.foregroundColor+"', endColorstr='"+options.foregroundColorB+"',GradientType=0 ); \
                    border-radius: 9px; \
                } \
                </style>"
            ).appendTo( 'body' );
            
            this.attr['bar'] = $('<progress value="0" max="100"></progress>').css({
                marginTop: "-" + (options.height / 2) + "px",
                width: "50%",
                marginLeft: "25%",
                position: "absolute",
                top: "50%"
            }).appendTo(this.attr['overlay']);
            
            if (options.text) {
                this.attr['text'] = $("<div></div>").text("0%").css({
                    height: "40px",
                    width: "100px",
                    position: "absolute",
                    fontSize: "3em",
                    top: "50%",
                    left: "50%",
                    marginTop: "-" + (59 + options.height) + "px",
                    textAlign: "center",
                    marginLeft: "-50px",
                    color: options.foregroundColor
                }).appendTo(this.attr['overlay']);
            }
            this.created = true;
        },
        
        set : function(percentage){
            this.attr['bar'].val(percentage);
            
            if (this.attr['text']) {
                this.attr['text'].text(Math.ceil(percentage) + "%");
            }
        },
        
        complete : function(callback){
            callback();
            var me = this;
            this.attr['overlay'].fadeOut(500, function () {
                me.attr['overlay'].remove();
            });
        }
    };
    
    function ColorLuminance(hex, lum) {
        // validate hex string
        hex = String(hex).replace(/[^0-9a-f]/gi, '');
        if (hex.length < 6) {
            hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
        }
        lum = lum || 0;
        // convert to decimal and change luminosity
        var rgb = "#", c, i;
        for (i = 0; i < 3; i++) {
            c = parseInt(hex.substr(i*2,2), 16);
            c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
            rgb += ("00"+c).substr(c.length);
        }
        return rgb;
    }

})(jQuery);