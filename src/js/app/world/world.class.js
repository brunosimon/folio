(function(window)
{
    'use strict';

    APP.WORLD.World = APP.CORE.Abstract.extend(
    {
        options:
        {
        },

        /**
         * INIT
         */
        init: function(options)
        {
            this._super(options);

            this.need_update = false;
            this.offset_y    = 0;

            this.scene    = new THREE.Scene();
            this.camera   = new APP.WORLD.Camera({ratio:APP.CONF.canvas.width/APP.CONF.canvas.height});
            this.renderer = new APP.WORLD.Renderer({camera:this.camera.instance,scene:this.scene});
            this.browser  = new APP.TOOLS.Browser();

            // Light
            var ambient = new THREE.AmbientLight(0xffffff);
            this.scene.add(ambient);

            this.add_monster();
            this.init_events();
        },

        /**
         * ADD MONSTER
         */
        add_monster: function()
        {
            var that     = this,
                elements = [
                    {
                        mesh : null,
                        url  : 'monster-1-monster',
                    },
                    {
                        mesh : null,
                        url  : 'monster-1-tooth-1',
                    },
                    {
                        mesh : null,
                        url  : 'monster-1-tooth-2',
                    },
                    {
                        mesh : null,
                        url  : 'monster-1-floor',
                    },
                    {
                        mesh : null,
                        url  : 'monster-1-board',
                    },
                    {
                        mesh : null,
                        url  : 'monster-1-board-text',
                    }
                ],
                element  = null,
                i        = 0,
                len      = elements.length,
                to_load  = len;

            // End
            var end = function()
            {
                _.forEach(elements,function(element)
                {
                    that.scene.add(element.mesh);
                });
            };

            // Loader
            this.loader = new THREE.JSONLoader();

            // Each element
            _.forEach(elements,function(element)
            {
                // Load geometry
                that.loader.load('src/models/'+element.url+'.js',function(geometry)
                {
                    geometry.computeTangents();

                    // Load texture
                    var texture = new THREE.ImageUtils.loadTexture('src/models/'+element.url+'.jpg',{},function()
                    {
                        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

                        var material = new THREE.MeshLambertMaterial({map:texture,side:THREE.FrontSide}),
                            mesh     = new THREE.Mesh(geometry,material);

                        mesh.position.x = 1;
                        mesh.scale.set(0.08,0.08,0.08);
                        mesh.rotateY(Math.PI * 1.5);

                        element.mesh = mesh;
                        to_load--;

                        if(to_load === 0)
                            end();

                    });
                });
            });

        },

        /**
         * START
         */
        start: function()
        {
            var that = this;

            this.camera.start();
            this.renderer.start();
        },

        /**
         * START
         */
        init_events: function()
        {
            var that = this;

            this.browser.on('mousemove',function()
            {
                that.need_update = true;
            });

            this.browser.on('scroll',function()
            {
                that.offset_y    = that.browser.top / 500;

                if(that.offset_y < 0)
                    that.offset_y = 0;

                that.need_update = true;
            });
        },

        /**
         * UPDATE ON RESIZE
         */
        update_on_resize: function(browser)
        {
            this.camera.update_on_resize(window.innerWidth/window.innerHeight);
            this.renderer.update_on_resize(window.innerWidth,window.innerHeight);
        },

        /**
         * UPDATE
         */
        update: function()
        {
            APP.CONF.rS('raf').tick();
            APP.CONF.rS('fps').frame();

            if(this.need_update)
            {
                var x   = (this.browser.mouse.ratio.x - 0.8) * 6,
                    y   = - (this.browser.mouse.ratio.y - 1) * 4 - this.offset_y,
                    yaw = (this.browser.mouse.ratio.x - 0.3);

                if(y < 0.4)
                    y = 0.4;

                TweenLite.to(this.camera.instance.position,0.15,{x:x,y:y,ease:'Quad.easeOut'});
                TweenLite.to(this.camera.instance.rotation,0.15,{y:yaw,ease:'Quad.easeOut'});
            }

            this.camera.update();
            this.renderer.render();
        }
    });
})(window);

