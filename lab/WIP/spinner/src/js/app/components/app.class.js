B.Components.App = B.Core.Abstract.extend(
{
    options : {},
    construct : function( options )
    {
        this._super( options );

        // Set up
        this.ticker   = new B.Tools.Ticker( { pause_on_blur : true } );
        this.registry = new B.Tools.Registry();
        this.audio    = new B.Tools.Audio();
        this.spinners = new B.Components.Spinners( {
            canvas : document.querySelector( 'canvas.experiment' )
        } );

        this.registry.set( 'mode', 'music' );

        // Init
        this.init_stats();
        this.init_tweaks();
    },

    /**
     * INIT STATS
     */
    init_stats : function()
    {
        var that = this;

        // Set up
        this.stats = rS = new rStats( {
            CSSPath : 'src/css/'
        } );

        // Ticker tick event
        this.ticker.on( 'tick', function()
        {
            that.stats( 'frame' ).tick();
            rS( 'FPS' ).frame();
            that.stats().update();
        } );
    },

    /**
     * INIT TWEAKS
     */
    init_tweaks : function()
    {
        var that = this;

        // Set up
        this.tweaker = new B.Tools.Tweaker();

        // Create folder
        var folder = this.tweaker.gui.addFolder( 'Global' );
        folder.open();

        // Dummy
        var dummy = {};
        dummy.mode = this.registry.get( 'mode' );

        // Add tweaks
        var mode_tweak = folder.add( dummy, 'mode', [ 'music', 'circular', 'mouse' ] );

        mode_tweak.onChange( function( value )
        {
            that.registry.set( 'mode', value );
        } );
    }
} );
