var APP = APP ? APP : {};

(function(window,APP)
{
    'use strict';

    APP.App = Abstract.extend(
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

            this.page = null;

            this.browser = new APP.Browser();
            this.leap    = new APP.Leap();
            this.speech  = new APP.Speech();
            this.grid    = new APP.Grid();

            this.init_events();
        },

        /**
         * INIT EVENTS
         */
        init_events: function()
        {
            var that = this;

            this.browser.on('resize',function()
            {
                that.leap.options.screen_ratio = that.browser.width / that.browser.height;
            });

            var targeted_block = null,
                full_block     = null,
                old_style      = null;

            this.leap.on('screen_ratio_changed',function(coordinates)
            {
                var block = that.grid.get_ratio_to_block(coordinates);

                if(block)
                {
                    if(targeted_block)
                        targeted_block.classList.remove('targeted');

                    block.classList.add('targeted');

                    targeted_block = block;
                }
            });

            this.leap.on('left_hand_close',function(coordinates)
            {
                if(full_block)
                {
                    full_block.classList.remove('full');
                    console.log(old_style.width);
                    full_block.style.width  = old_style.width;
                    full_block.style.height = old_style.height;
                    full_block.style.top    = old_style.top;
                    full_block.style.left   = old_style.left;
                    full_block              = null;
                }
            });

            this.leap.on('left_hand_open',function(coordinates)
            {
                if(targeted_block)
                {
                    targeted_block.classList.add('full');
                    full_block = targeted_block;
                    old_style  = _.clone(targeted_block.style);
                    full_block.style.width = window.innerWidth + 'px';
                    full_block.style.height = window.innerHeight + 'px';
                    full_block.style.top = 0;
                    full_block.style.left = 0;
                }
            });
        },

        /**
         * START
         */
        start: function()
        {
            this.browser.start();
            this.leap.start();
            // this.speech.start();
            this.grid.start();
        }
    });
})(window,APP);

