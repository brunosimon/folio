B.Tools.Audio = B.Core.Abstract.extend(
{
    static  : 'audio',
    options : {},

    construct : function( options )
    {
        this._super( options );

        // Set up
        this.volume         = 0;
        this.context        = new AudioContext();
        this.analyser       = this.context.createAnalyser();
        this.element        = document.querySelector( 'audio' );
        this.source_node    = this.context.createMediaElementSource( this.element );
        this.gain_node      = this.context.createGain();
        this.frequency_data = new Uint8Array( this.analyser.frequencyBinCount  );

        // Connect nodes
        this.source_node.connect( this.gain_node );
        this.gain_node.connect( this.analyser );
        this.analyser.connect( this.context.destination );

        this.element.loop     = true;
        this.analyser.fftSize = 32;

        // Init
        this.init_tweaks();
        this.init_ticker();

        // Play
        this.element.play();
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
        this.ticker.on( 'tick', function()
        {
            // Set up
            var volume = 0;

            that.analyser.getByteFrequencyData( that.frequency_data );

            for( var i = 0, len = that.frequency_data.length; i < len; i++ )
                volume += that.frequency_data[ i ];

            volume /= len;
            that.volume = volume;

            // // Tweaks
            that.tweaker.gui.__folders.Audio.__controllers[ 3 ].updateDisplay();
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
        var folder = this.tweaker.gui.addFolder( 'Audio' );
        folder.open();

        // Functions
        var callbacks = {
            play : function()
            {
                that.element.play();
            },
            pause : function()
            {
                that.element.pause();
            }
        };

        // Add tweaks
        folder.add( this.gain_node.gain, 'value' ).min( 0 ).max( 1 ).step( 0.01 ).name( 'volume' );
        folder.add( this.element, 'currentTime' ).min( 0 ).max( this.element.duration ).name( 'progress' );
        folder.add( callbacks, 'play' ).name( 'play' );
        folder.add( callbacks, 'pause' ).name( 'pause' );
    }
} );
