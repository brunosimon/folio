(function(window)
{
    "use strict";

    APP.TOOLS.Retina = APP.CORE.Abstract.extend(
    {
        options:
        {
            pixel_ratio          : 'auto',
            retina_class         : 'retina',
            retina_applied_class : 'retined', //inspiration where are you ?
            suffix               : '@2x'
        },

        /**
         * INIT
         */
        init: function(options)
        {
            this._super(options);

            if(this.options.pixel_ratio === 'auto')
                this.active = (window.devicePixelRatio > 1 || (window.matchMedia && window.matchMedia("(-webkit-min-device-pixel-ratio: 1.5),(-moz-min-device-pixel-ratio: 1.5),(min-device-pixel-ratio: 1.5)").matches));
            else
                this.active = parseFloat(this.options.pixel_ratio) >= 1.5;
        },

        /**
         * ADD
         * @param $ container_target if empty become $('body')
         */
        add: function(container_target)
        {
            var that = this;

            if(!this.active)
                return false;

            if(_.isUndefined(container_target))
                container_target = $('body');

            if(!container_target.length)
                return false;

            //Find targets with retina class and not "retina applied" class (see in options)
            var targets = container_target.find('.'+this.options.retina_class+':not(.'+this.options.retina_applied_class+')'),
                src     = null;

            targets.each(function()
            {
                var _this = $(this);

                // IMG src
                if(_this.is('img'))
                {
                    src = that.add_retina_to_src(_this.attr('src'));

                    if(src)
                    {
                        _this.attr('src',src);
                        _this.addClass(that.options.retina_applied_class);
                    }
                }

                // Element background image
                else
                {
                    src = _this.css('background-image').replace(/url\((.*)\)/,'$1');

                    if(src)
                    {
                        src = that.add_retina_to_src(src);
                        _this.css({
                            backgroundImage : 'url('+src+')'
                        });
                    }
                }
            });
        },

        /**
         * ADD RETINA TO SRC STRING
         * Test if string is right and don't already have suffix
         */
        add_retina_to_src: function(src,suffix)
        {
            // Test src
            if(_.isUndefined(src) || src === '')
                return false;

            // Set suffix
            if(_.isUndefined(suffix))
                suffix = this.options.suffix;

            // Test if suffix already in src
            if(src.indexOf(suffix) !== -1)
                return src;

            var parts = src.split('.');

            // Test if src contain at least one "."
            if(parts.length < 2)
                return src;

            parts[parts.length - 2] += suffix;

            src = parts.join('.');

            return src;
        }
    });
}(window));
