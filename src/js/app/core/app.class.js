(function()
{
    'use strict';

    APP.CORE.App = APP.CORE.Abstract.extend(
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

            this.world   = new APP.WORLD.World();
            this.browser = new APP.TOOLS.Browser();
            this.retina  = new APP.TOOLS.Retina();

            this.retina.add();

            this.init_events();
            this.init_favicon();
        },

        /**
         * START
         */
        start: function()
        {
            this.browser.start();
            this.world.start();
        },

        /**
         * INIT EVENTS
         */
        init_events: function()
        {
            var that = this;

            this.browser.on('resize',function()
            {
                that.world.update_on_resize(that.browser);
            });
        },

        /**
         * INIT FAVICON
         */
        init_favicon: function()
        {
            var that  = this,
                $link = $('head link[rel="shortcut icon"]'),
                urls  = {};

            urls.open   = 'src/img/icons/open/favicon.ico';
            urls.closed = 'src/img/icons/closed/favicon.ico';

            var blink = function()
            {
                $link.attr('href',urls.closed);
                window.setTimeout(function()
                {
                    $link.attr('href',urls.open);
                },200);

                window.setTimeout(blink,300 + Math.floor(Math.random() * 6000));
            };

            window.setTimeout(blink,1000 + Math.floor(Math.random() * 6000));
        },

        /**
         * UPDATE
         */
        update: function()
        {
            APP.CONF.rS('raf').tick();
            APP.CONF.rS('fps').frame();

            this.browser.update();

            if(this.browser.width > 768)
                this.world.update();

            APP.CONF.rS().update();
        }
    });
})(window);

