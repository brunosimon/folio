var B = require( '../../libs/burno-0.3.js' ),
    $ = require( 'jquery' )

module.exports = B.Core.Abstract.extend(
{
    static  : 'unveiler',
    options :
    {
        parse         : true,
        safe_duration : 1000,
        classes       :
        {
            to_set : 'b-unveil',
            set    : 'b-unveil-set',
        }
    },

    /**
     * CONSTRUCT
     */
    construct : function( options )
    {
        this._super( options )

        // Set up
        this.viewport   = new B.Tools.Viewport()
        this.items      = []
        this.pending    = null
        this.start_time = + new Date()

        // Parse
        if( this.options.parse )
            this.parse()

        // Init
        this.init_events()
    },

    /**
     * INIT EVENTS
     */
    init_events : function()
    {
        // Set up
        var that = this,
            i    = 0,
            len  = 0,
            item = null

        // Viewport resize event
        this.viewport.on( 'resize', function()
        {
            // Update items
            that.update_items()

            // Test items
            that.test_items()
        } )

        // Viewport scroll event
        this.viewport.on( 'scroll', function()
        {
            // Test items
            that.test_items()
        } )
    },

    /**
     * UPDATE ITEMS
     */
    update_items : function()
    {
        // Each item
        for( var i = 0, len = this.items.length; i < len; i++ )
        {
            // Set up
            var item = this.items[ i ]

            // Update values
            item.top    = item.$.offset().top
            item.height = item.$.outerHeight()
        }
    },

    /**
     * TEST ITEMS
     */
    test_items : function()
    {
        // Test each item
        for( var i = 0, len = this.items.length; i < len; i++ )
            this.test_item( this.items[ i ] )
    },

    /**
     * TEST ITEM
     */
    test_item : function( item )
    {
        var that  = this,
            regex = new RegExp( "/^(\d+)\-(\d+)$/" )

        // Each step to test
        for( var _key in item.steps )
        {
            // Set up
            var step          = item.steps[ _key ],
                screen_ratio  = step.screen / 100,
                content_ratio = step.element / 100

            // Should activate
            if( this.viewport.top + this.viewport.height * screen_ratio > item.top + item.height * content_ratio )
            {
                // Isn't active
                if( !step.active )
                {
                    var time =  + new Date()

                    if( time - this.start_time < this.options.safe_duration )
                    {
                        window.setTimeout( function()
                        {
                            item.$.addClass( 'b-unveil-' + step.key )
                        }, that.options.safe_duration * Math.random() )
                    }

                    else
                    {
                        item.$.addClass( 'b-unveil-' + step.key )
                    }

                    // Activate
                    step.active = true
                }
            }

            // Should deactivate
            else
            {
                // Mode
                if( step.mode !== 'once' )
                {
                    // Is active
                    if( step.active )
                    {
                        // Dectivate
                        item.$.removeClass( 'b-unveil-' + step.key )
                        step.active = false
                    }
                }
            }
        }
    },

    /**
     * PARSE
     */
    parse : function( $target )
    {
        var that = this

        // Default container target
        if( typeof $target === 'undefined' || !$target.length )
            $target = $( 'body' )

        // Find targets
        var $targets = $target.find( '.' + this.options.classes.to_set ).not( '.' + this.options.classes.set )

        // Each target to load
        $targets.each(function()
        {
            that.set( $( this ) )
        })
    },

    /**
     * SET
     */
    set : function( $target )
    {
        // Set up
        var item = {
                $      : $target,
                top    : $target.offset().top,
                height : $target.outerHeight(),
                steps  : []
            }

        var data_steps = item.$.data( 'unveiler-steps' )

        // Default steps to test
        if( !data_steps )
        {
            // Add default steps
            item.steps.push( {
                key     : '100-0',
                screen  : 100,
                element : 0,
                active  : false,
                mode    : 'once',
            } )
            item.steps.push( {
                key     : '100-50',
                screen  : 100,
                element : 50,
                active  : false,
                mode    : 'once',
            } )
            item.steps.push( {
                key     : '100-100',
                screen  : 100,
                element : 100,
                active  : false,
                mode    : 'once',
            } )
        }

        // Steps in data
        else
        {
            // Set up
            var temp_steps = data_steps.split( ',' )

            // Each step
            for( var j = 0; j < temp_steps.length; j++ )
            {
                // Set up
                var step   = temp_steps[ j ],
                    values = step.split( '-' )

                // Add step
                item.steps.push( {
                    key     : values[ 0 ] + '-' + values[ 1 ],
                    screen  : values[ 0 ],
                    element : values[ 1 ],
                    active  : false,
                    mode    : values[ 2 ] || 'once',
                } )
            }
        }

        // Add to items
        this.items.push( item )
    }
} )
