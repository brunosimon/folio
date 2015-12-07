B.Components.Particles = B.Core.Abstract.extend(
{
    options : {},

    construct : function( options )
    {
        this._super( options );

        // Set up
        this.registry        = new B.Tools.Registry();
        this.audio           = new B.Tools.Audio();
        this.canvas          = this.registry.get( 'canvas' );
        this.new_per_seconds = 200;
        this.all             = [];

        // Particle set up
        this.life_time  = 8000;
        this.radius     = 1;
        this.velocity   = 0.5;
        this.turbulence = 20;

        // Init
        this.init_tweaks();
    },

    /**
     * UPDATE
     */
    update : function( x, y, elapsed_time, delta_time )
    {
        // Each particle
        for( var i = 0, len = this.all.length; i < len; i++ )
        {
            // Set up
            var particle = this.all[ i ];
            particle.update( elapsed_time, delta_time );

            // Point is dead
            if( particle.life < 0 )
            {
                // Delete
                this.all.splice( i, 1 );
                i--;
                len--;
            }
        }

        // Create particles
        var count = Math.ceil( delta_time / 1000 * this.new_per_seconds );
        for( var j = 0; j < count; j++ )
        {
            var new_particle = new B.Components.Particle( {
                x          : x,
                y          : y,
                life_time  : Math.random() * this.life_time,
                radius     : Math.random() * this.radius * this.canvas.pixel_ratio,
                velocity   : this.registry.items.mode === 'music' ? Math.random() * this.audio.volume * 2 : Math.random() * this.velocity,
                turbulence : this.registry.items.mode === 'music' ? this.audio.volume * 5 : this.turbulence
            } );
            this.all.push( new_particle );
        }
    },

    /**
     * DRAW
     */
    draw : function()
    {
        // Each point
        for( var i = 1, len = this.all.length; i < len; i++ )
        {
            // Set up
            var particle = this.all[ i ];
            particle.draw();
        }
    },

    /**
     * INIT TWEAKS
     */
    init_tweaks : function()
    {
        // Set up
        this.tweaker = new B.Tools.Tweaker();

        // Create folder
        var folder = this.tweaker.gui.addFolder( 'Particles' );
        folder.open();

        // Add tweaks
        folder.add( this, 'new_per_seconds' ).min( 0 ).max( 1000 ).step( 1 ).name( 'per second' );
        folder.add( this, 'life_time' ).min( 0 ).max( 20000 ).step( 1 ).name( 'life time' );
        folder.add( this, 'radius' ).min( 0 ).max( 20 ).step( 1 ).name( 'radius' );
        folder.add( this, 'velocity' ).min( 0 ).max( 20 ).step( 0.01 ).name( 'velocity' );
        folder.add( this, 'turbulence' ).min( 0 ).max( 200 ).step( 1 ).name( 'turbulence' );
    }
} );
