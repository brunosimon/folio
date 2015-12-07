B.Components.Light = B.Core.Abstract.extend(
{
    options :
    {
        position_mode : 'circular'
    },

    construct : function( options )
    {
        this._super( options );

        // Set up
        this.mouse            = new B.Tools.Mouse();
        this.registry         = new B.Tools.Registry();
        this.audio            = new B.Tools.Audio();
        this.canvas           = this.registry.get( 'canvas' );
        this.animation        = {};
        this.animation.radius = 0.15;
        this.animation.speed  = 0.1; // t / s
        this.disc_1           = {};
        this.disc_1.radius    = 2 * this.canvas.pixel_ratio;
        this.disc_1.opacity   = 1;
        this.disc_2           = {};
        this.disc_2.radius    = 6 * this.canvas.pixel_ratio;
        this.disc_2.opacity   = 0.5;
        this.disc_3           = {};
        this.disc_3.radius    = 30 * this.canvas.pixel_ratio;
        this.disc_3.opacity   = 0.6;
        this.x                = 100;
        this.y                = 100;
        this.position_mode    = this.options.position_mode;

        // Init
        this.init_tweaks();
    },

    /**
     * UPDATE
     */
    update : function( time )
    {
        if( this.registry.items.mode === 'music' )
        {
            this.x = this.canvas.sizes.half.width  + Math.cos( ( time / 1000 ) * this.animation.speed * Math.PI * 2 ) * this.canvas.sizes.width * ( this.audio.volume * 0.1 );
            this.y = this.canvas.sizes.half.height + Math.sin( ( time / 1000 ) * this.animation.speed * Math.PI * 2 ) * this.canvas.sizes.width * ( this.audio.volume * 0.1 );
        }
        else if( this.registry.items.mode === 'circular' )
        {
            this.x = this.canvas.sizes.half.width  + Math.cos( ( time / 1000 ) * this.animation.speed * Math.PI * 2 ) * this.canvas.sizes.width * this.animation.radius;
            this.y = this.canvas.sizes.half.height + Math.sin( ( time / 1000 ) * this.animation.speed * Math.PI * 2 ) * this.canvas.sizes.width * this.animation.radius;
        }
        else if( this.registry.items.mode === 'mouse' )
        {
            this.x = this.mouse.position.x * this.canvas.pixel_ratio;
            this.y = this.mouse.position.y * this.canvas.pixel_ratio;
        }
    },

    /**
     * DRAW
     */
    draw : function()
    {

        // Draw dics 3
        var gradient_3 = this.canvas.context.createRadialGradient( this.x, this.y, 0, this.x, this.y, this.disc_3.radius );
        gradient_3.addColorStop( 0, 'rgba(255,0,59,' + ( this.disc_3.opacity - ( Math.random() * 0.05 ) ) + ')' );
        gradient_3.addColorStop( 1, 'rgba(255,0,120,0)' );

        this.canvas.context.globalCompositeOperation = 'lighter';
        this.canvas.context.fillStyle = gradient_3;
        this.canvas.context.beginPath();
        this.canvas.context.arc( this.x, this.y, this.disc_3.radius, 0, Math.PI * 2 );
        this.canvas.context.fill();

        // Draw dics 2
        var gradient_2 = this.canvas.context.createRadialGradient( this.x, this.y, 0, this.x, this.y, this.disc_2.radius );
        gradient_2.addColorStop( 0, 'rgba(255,255,255,' + ( this.disc_2.opacity - ( Math.random() * 0.05 ) ) + ')' );
        gradient_2.addColorStop( 1, 'rgba(255,255,255,0)' );

        this.canvas.context.globalCompositeOperation = 'lighter';
        this.canvas.context.fillStyle = gradient_2;
        this.canvas.context.beginPath();
        this.canvas.context.arc( this.x, this.y, this.disc_2.radius, 0, Math.PI * 2 );
        this.canvas.context.fill();

        // Draw disc 1
        var gradient_1 = this.canvas.context.createRadialGradient( this.x, this.y, 0, this.x, this.y, this.disc_1.radius );
        gradient_1.addColorStop( 0, 'rgba(255,255,255,' + this.disc_1.opacity + ')' );
        gradient_1.addColorStop( 1, 'rgba(255,255,255,0)' );

        this.canvas.context.globalCompositeOperation = 'lighter';
        this.canvas.context.fillStyle = gradient_1;
        this.canvas.context.beginPath();
        this.canvas.context.arc( this.x, this.y, this.disc_1.radius, 0, Math.PI * 2 );
        this.canvas.context.fill();
    },

    /**
     * INIT TWEAKS
     */
    init_tweaks : function()
    {
        // Set up
        this.tweaker = new B.Tools.Tweaker();

        // Create folder
        var folder = this.tweaker.gui.addFolder( 'Light' );
        folder.open();

        // Add tweaks
        folder.add( this, 'position_mode', [ 'circular', 'mouse' ] ).name( 'position mode' );
        folder.add( this.animation, 'radius' ).min( 0 ).max( 1 ).step( 0.01 ).name( 'radius' );
        folder.add( this.animation, 'speed' ).min( 0 ).max( 2 ).step( 0.01 ).name( 'speed' );
        folder.add( this.disc_1, 'radius' ).min( 0 ).max( 100 ).step( 1 ).name( 'disc 1 radius' );
        folder.add( this.disc_2, 'radius' ).min( 0 ).max( 100 ).step( 1 ).name( 'disc 2 radius' );
        folder.add( this.disc_3, 'radius' ).min( 0 ).max( 100 ).step( 1 ).name( 'disc 3 radius' );
        folder.add( this.disc_1, 'opacity' ).min( 0 ).max( 1 ).step( 0.01 ).name( 'disc 1 opacity' );
        folder.add( this.disc_2, 'opacity' ).min( 0 ).max( 1 ).step( 0.01 ).name( 'disc 2 opacity' );
        folder.add( this.disc_3, 'opacity' ).min( 0 ).max( 1 ).step( 0.01 ).name( 'disc 3 opacity' );
    }
} );
