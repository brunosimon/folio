var $        = require( 'jquery' ),
    B        = require( '../libs/burno-0.3.js' ),
    Carousel = require( './components/carousel.js' )

module.exports = B.Core.Abstract.extend( {

    construct : function( options )
    {
        console.log(this);
        this._super( options )

        // Init
        this.init_carousels()
    },

    init_carousels : function()
    {
        var $carousels = $( '.carousel' )

        $carousels.each( function()
        {
            var $carousel = $( this ),
                carousel  = new Carousel( { target : $carousel } )
        } )
    }
} )
