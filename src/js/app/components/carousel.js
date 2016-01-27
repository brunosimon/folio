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
        this.z_index     = 0
        this.count       = this.$.slides.length
        this.ticker      = new B.Tools.Ticker()
        this.viewport    = new B.Tools.Viewport()

        // Init
        this.init_pagination()
        this.init_slides()
        this.init_keyboard()
    },

    /**
     * INIT KEYBOARD
     */
    init_keyboard : function()
    {
        var that = this;

        // Set up
        this.keyboard = new B.Tools.Keyboard()

        this.keyboard.on( 'down', function( key_code, key_name )
        {
            // Left or right
            if( key_name === 'right' || key_name === 'left' )
            {
                // Set up
                var rect   = that.$.container[ 0 ].getBoundingClientRect(),
                    middle = rect.top + rect.height / 2

                // Carousel in center
                if( rect.top < that.viewport.height / 2 && rect.top + rect.height > that.viewport.height / 2 )
                {
                    if( key_name === 'left' )
                        that.go_to( that.index - 1, true, 'left-to-right' )
                    else
                        that.go_to( that.index + 1, true, 'right-to-left' )
                }
            }
        } )
    },

    /**
     * INIT SLIDES
     */
    init_slides : function()
    {
        var $target = this.$.slides.eq( this.index )
        $target.css( { zIndex : ++this.z_index } )
        $target.addClass( 'active' );
    },

    /**
     * INIT EVENTS
     */
    init_pagination : function()
    {
        var that = this

        // Set up
        this.pagination             = { $ : {} }
        this.pagination.$.container = this.$.container.find( '.pagination' )
        this.pagination.$.items     = this.pagination.$.container.find( '.page' )
        this.pagination.$.next      = this.pagination.$.container.find( '.next' )
        this.pagination.$.prev      = this.pagination.$.container.find( '.prev' )

        // Pagination item click event
        this.pagination.$.items.on( 'click', function()
        {
            // Set up
            var $this = $( this ),
                index = that.pagination.$.items.index($this)

            // Go to
            that.go_to( index )

            // Prevent default
            return false
        } )

        // Prev click event
        this.pagination.$.prev.on( 'click', function()
        {
            that.go_to( that.index - 1, true, 'left-to-right' )

            return false
        } )

        // Next click event
        this.pagination.$.next.on( 'click', function()
        {
            that.go_to( that.index + 1, true, 'right-to-left' )

            return false
        } )

        this.update_pagination()
    },

    /**
     * UPDATE PAGINATION
     */
    update_pagination : function()
    {
        // Update classes
        this.pagination.$.items.removeClass( 'active' )
        this.pagination.$.items.eq( this.index ).addClass( 'active' )
    },

    /**
     * GO TO
     */
    go_to : function( index, animated = true, direction = 'auto' )
    {
        // Same
        if( index === this.index )
            return

        // Limits
        if( index > this.count - 1 )
            index = 0
        else if( index < 0 )
            index = this.count - 1

        // Direction
        if( direction === 'auto' )
            direction = index < this.index ? 'left-to-right' : 'right-to-left'

        // Set up
        var $current  = this.$.slides.eq( this.index ),
            $target   = this.$.slides.eq( index )

        // Target
        $target.css( { zIndex : ++this.z_index } )

        // Animated
        if( animated )
        {
            // Position
            if( direction === 'right-to-left' )
                $target.addClass( 'right' )
            if( direction === 'left-to-right' )
                $target.addClass( 'left' )

            // Wait
            this.ticker.wait( 2, function()
            {
                // Add transition
                $target.addClass( 'animated' )
            } )

            // Wait
            this.ticker.wait( 4, function()
            {
                // Position
                $target.removeClass( 'right left' )
            } )
        }

        // Wait animation end
        window.setTimeout( function()
        {
            // Remove animation
            $target.removeClass( 'animated' )
        }, 1050 )

        // Update classes
        this.$.slides.removeClass( 'active' )
        $target.addClass( 'active' )

        // Update index
        this.index = index

        // Update pagination
        this.update_pagination()
    }
} )
