var B = require( '../../libs/burno-0.3.js' ),
    $ = require( 'jquery' )

module.exports = B.Core.Event_Emitter.extend( {

    options : {},

    construct : function( options )
    {
        this._super( options )

        // Set up
        this.$.container = this.options.target
        this.$.slides    = this.$.container.find( '.content .items .item' )
        this.index       = 0
        this.count       = this.$.slides.length

        // Init
        this.init_pagination()
    },

    /**
     * INIT EVENTS
     */
    init_pagination : function()
    {
        var that = this

        // Set up
        this.pagination             = { $ : {} };
        this.pagination.$.container = this.$.container.find( '.pagination' );
        this.pagination.$.items     = this.pagination.$.container.find( '.item' );

        // Pagination item click event
        this.pagination.$.items.on( 'click', function()
        {
            // Set up
            var $this = $( this ),
                index = $this.index()

            // Go to
            that.go_to( index );

            // Prevent default
            return false
        } )
    },

    /**
     * GO TO
     */
    go_to : function( index )
    {
        // Same
        if( index === this.index )
            return

        // Set up
        var direction = index < this.index ? 'left-to-right' : 'right-to-left',
            $current  = this.$.slides.eq( this.index ),
            $target   = this.$.slides.eq( index )

        console.log($current);

        console.log(direction);
    }
} )
