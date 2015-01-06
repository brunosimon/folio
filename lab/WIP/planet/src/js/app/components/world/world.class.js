(function()
{
    'use strict';

    APP.COMPONENTS.WORLD.World = APP.CORE.Event_Emitter.extend(
    {
        options :
        {

        },

        /**
         * SINGLETON
         */
        staticInstantiate:function()
        {
            if( APP.COMPONENTS.WORLD.World.prototype.instance === null )
                return null;
            else
                return APP.COMPONENTS.WORLD.World.prototype.instance;
        },

        /**
         * INIT
         */
        init: function( options )
        {
            this._super( options );

            this.ticker       = new APP.TOOLS.Ticker();
            this.three_helper = new APP.TOOLS.THREE_Helper();
            this.browser      = new APP.TOOLS.Browser();
            this.mouse        = new APP.TOOLS.Mouse();
            this.canvas       = document.getElementById( 'three-canvas' );

            APP.COMPONENTS.WORLD.World.prototype.instance = this;
        },

        /**
         * INIT EVENTS
         */
        init_events: function()
        {
            var that = this;
        },

        /**
         * START
         */
        start: function()
        {
            var that = this;

            // Scene
            this.scene  = new THREE.Scene();

            // Camera
            this.camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 0.1, 100000 );
            this.center = new THREE.Vector3( 0, 0, 0 );
            this.camera.position.set( 0, 0, 300 );
            this.distance = 300;

            this.mouse.on('wheel',function()
            {
                that.distance -= that.mouse.wheel.delta / 2;
                if( that.distance < 150 )
                    that.distance = 150;
            });

            // Sun
            this.sun_light = new THREE.PointLight( new THREE.Color( 0xffffff ), 1.0 );
            // this.sun_light.position.set( - 400, 20, 400 );
            this.sun_light.position.set( 200, 0, 0 );
            this.scene.add( this.sun_light );

            /* DUMMY */
            var material = new THREE.MeshNormalMaterial(),
                geometry = new THREE.BoxGeometry(50,50,50),
                mesh     = new THREE.Mesh(geometry,material);

            // mesh.position.set( - 400, 20, 400 );
            mesh.position.set( 200, 0, 0 );
            this.scene.add(mesh);

            // Axis helper
            var axis_helper = new THREE.AxisHelper();
            axis_helper.scale.set(5,5,5);
            // this.scene.add(axis_helper);

            // Renderer
            this.renderer = new APP.COMPONENTS.WORLD.Renderer( { canvas : this.canvas } );
            this.renderer.start( this.scene, this.camera );

            // Planet
            this.planet = new APP.COMPONENTS.WORLD.PLANET.Planet({
                scene     : this.scene,
                sun_light : this.sun_light,
                renderer  : this.renderer.instance,
                camera    : this.camera
            });

            // Ticker
            this.ticker.on( 'tick' ,function()
            {
                that.frame();
            } );

            // Browser resize
            this.browser.on( 'resize', function( width, height )
            {
                that.camera.aspect = width / height,
                that.camera.updateProjectionMatrix();
            } );
        },

        /**
         * FRAME
         */
        frame: function()
        {
            this.camera.position.x = Math.sin( this.mouse.ratio.x * Math.PI * 2 ) * this.distance;
            this.camera.position.z = Math.cos( this.mouse.ratio.x * Math.PI * 2 ) * this.distance;
            this.camera.position.y = - ( this.mouse.ratio.y - 0.5 ) * 4 * this.distance;

            this.camera.lookAt( this.center );

            this.planet.frame();
            this.renderer.frame();
        }
    });
})();




