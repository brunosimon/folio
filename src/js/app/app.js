var $         = require( 'jquery' ),
    B         = require( '../libs/burno-0.3.js' ),
    Carousel  = require( './components/carousel.js' ),
    Unveiler  = require( './tools/unveiler.js' ),
    Header    = require( './components/header.js' ),
    Scroller  = require( './tools/scroller.js' ),
    fastclick = require( 'fastclick' )

module.exports = B.Core.Abstract.extend( {

    /**
     * CONSTRUCT
     */
    construct : function( options )
    {
        this._super( options )

        // Set up
        this.viewport = new B.Tools.Viewport()

        // Init
        this.init_carousels()
        this.init_unveiler()
        this.init_header()
        this.init_fastclick()
        this.init_scroll_top()
    },

    /**
     * INIT CAROUSELS
     */
    init_carousels : function()
    {
        var $carousels = $( '.carousel' )

        $carousels.each( function()
        {
            var $carousel = $( this ),
                carousel  = new Carousel( { target : $carousel } )
        } )
    },

    /**
     * INIT UNVEILER
     */
    init_unveiler : function()
    {
        this.unveiler = new Unveiler( {
            safe_duration : 0
        } )
    },

    /**
     * INIT HEADER
     */
    init_header : function()
    {
        this.header = new Header()
    },

    /**
     * INIT FASTCLICK
     */
    init_fastclick : function()
    {
        fastclick( document.body )
    },

    /**
     * INIT SCROLL TOP
     */
    init_scroll_top : function()
    {
        var that = this

        // Set up
        this.scroller = new Scroller()
        this.scroll_top           = { $ : {} }
        this.scroll_top.$.trigger = $( 'a.scroll-top' )

        // Scroll top click event
        this.scroll_top.$.trigger.on( 'click', function()
        {
            // Scroll to top
            that.scroller.animate_to( 0, 900 )

            // Prevent default
            return false
        } )

        // Viewport scroll event
        this.viewport.on( 'scroll', function()
        {
            if( that.viewport.top > that.viewport.height * 0.5 )
            {
                that.scroll_top.$.trigger.addClass( 'visible' )
            }
            else
            {
                that.scroll_top.$.trigger.removeClass( 'visible' )
            }
        } )
    }
} )
