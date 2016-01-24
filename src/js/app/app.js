var $        = require( 'jquery' ),
    B        = require( '../libs/burno-0.3.js' ),
    Carousel = require( './components/carousel.js' ),
    Unveiler = require( './tools/unveiler.js' ),
    Header   = require( './components/header.js' )

module.exports = B.Core.Abstract.extend( {

    construct : function( options )
    {
        this._super( options )

        // Init
        this.init_carousels()
        this.init_unveiler()
        this.init_header()
    },

    init_carousels : function()
    {
        var $carousels = $( '.carousel' )

        $carousels.each( function()
        {
            var $carousel = $( this ),
                carousel  = new Carousel( { target : $carousel } )
        } )
    },

    init_unveiler : function()
    {
        this.unveiler = new Unveiler( {
            safe_duration : 0
        } )
    },

    init_header : function()
    {
        this.header = new Header()
    }
} )
