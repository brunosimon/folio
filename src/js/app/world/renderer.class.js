(function(window,APP)
{
    "use strict";

    APP.WORLD.Renderer = APP.CORE.Abstract.extend(
    {
        options :
        {
            shaders : true,
            testouille : 1
        },

        /**
         * INIT
         */
        init: function(options)
        {
            this._super(options);

            this.canvas   = APP.CONF.canvas;
            this.camera   = this.options.camera;
            this.scene    = this.options.scene;
            this.instance = new THREE.WebGLRenderer({canvas:this.canvas});
            this.retina   = false;

            this.instance.setClearColor(0xeeeeee);
            this.instance.setSize(window.innerWidth,window.innerHeight);

            this.init_shaders();
        },

        /**
         * INIT SHADERS
         */
        init_shaders: function()
        {
            this.composer = new THREE.EffectComposer(this.instance);

            this.render_pass = new THREE.RenderPass(this.scene,this.camera);
            // this.render_pass.renderToScreen = true;
            this.composer.addPass(this.render_pass);

            this.fxaa_pass = new THREE.ShaderPass(THREE.FXAAShader);
            this.fxaa_pass.uniforms.resolution.value = new THREE.Vector2((1 / APP.CONF.pixel_ratio) / window.innerWidth,(1 / APP.CONF.pixel_ratio) / window.innerHeight);
            this.fxaa_pass.renderToScreen = true;
            this.composer.addPass(this.fxaa_pass);
        },

        /**
         * RENDER
         */
        render: function()
        {
            APP.CONF.rS('render').start();
            if(this.options.shaders)
                this.composer.render();
            else
                this.instance.render(this.scene,this.camera);
            APP.CONF.rS('render').end();
        },

        /**
         * UPDATE ON RESIZE
         */
        update_on_resize: function(width,height)
        {
            this.canvas.width  = width;
            this.canvas.height = height;

            this.fxaa_pass.uniforms.resolution.value = new THREE.Vector2(1 / (width * APP.CONF.pixel_ratio),1 / (height * APP.CONF.pixel_ratio));
            this.composer.setSize(width * APP.CONF.pixel_ratio, height * APP.CONF.pixel_ratio);

            this.instance.setSize(width,height);
        }
    });
}(window,APP));
