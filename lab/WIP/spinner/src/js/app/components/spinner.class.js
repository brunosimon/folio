B.Components.Spinner = B.Core.Abstract.extend(
{
    options :
    {
        canvas : false
    },

    construct : function( options )
    {
        this._super( options );

        // Set up
        this.viewport           = new B.Tools.Viewport();
        this.registry           = new B.Tools.Registry();
        this.canvas             = this.registry.set( 'canvas', {} );
        this.canvas.element     = this.options.canvas;
        this.canvas.context     = this.canvas.element.getContext( '2d' );
        this.canvas.sizes       = {};
        this.canvas.pixel_ratio = window.devicePixelRatio || 1;
        this.background         = new B.Components.Background();
        this.light              = new B.Components.Light();
        this.tail               = new B.Components.Tail();
        this.particles          = new B.Components.Particles();

        // Init
        this.init_ticker();
        this.init_resize();
    },

    /**
     * INIT TICKER
     */
    init_ticker : function()
    {
        var that = this;

        // Set up
        this.ticker = new B.Tools.Ticker();

        // Ticker tick event
        this.ticker.on( 'tick', function( infos )
        {
            that.update();
            that.draw();
        } );
    },

    /**
     * INIT RESIZE
     */
    init_resize : function()
    {
        var that = this;

        // Viewport resize event
        this.viewport.on( 'resize', function( width, height )
        {
            that.canvas.pixel_ratio       = window.devicePixelRatio || 1;
            that.canvas.element.width     = width * that.canvas.pixel_ratio;
            that.canvas.element.height    = height * that.canvas.pixel_ratio;
            that.canvas.sizes.width       = that.canvas.element.width;
            that.canvas.sizes.height      = that.canvas.element.height;
            that.canvas.sizes.half        = {};
            that.canvas.sizes.half.width  = that.canvas.element.width / 2;
            that.canvas.sizes.half.height = that.canvas.element.height / 2;

            that.canvas.element.style.width  = '100%';
            that.canvas.element.style.height = '100%';

            that.background.update();
        } );
    },

    /**
     * UPDATE
     */
    update : function()
    {
        var delta = this.ticker.time.delta;
        if( delta > 100 )
            delta = 100;

        this.light.update( this.ticker.time.elapsed );
        this.tail.update( this.light.x, this.light.y, this.ticker.time.elapsed, delta );
        this.particles.update( this.light.x, this.light.y, this.ticker.time.elapsed, delta );
    },

    /**
     * DRAW
     */
    draw : function()
    {
        this.background.draw();
        this.light.draw();
        this.tail.draw();
        this.particles.draw();
    }
} );
