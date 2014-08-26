var APP = APP ? APP : {};

(function(window,APP)
{
    "use strict";

    APP.Images = Abstract.extend(
    {
        /**
         * INIT
         * @param  object options
         * @return Images
         */
        init: function(parent,options)
        {
            this._super(parent,options);
            this.urls    = [];
            this.images  = [];
            this.length  = 0;
            this.loaded  = 0;
        },

        /**
         * LOAD URLS THEN CALL CALLBACK FUNCTION
         * @param  {[type]}   urls     [description]
         * @param  {Function} callback [description]
         * @return {[type]}            [description]
         */
        load: function(urls,callback)
        {
            var that  = this;

            if(typeof urls === 'string')
                this.urls.push(urls);
            else if(urls instanceof Array)
                this.urls = urls;

            this.images = [];
            this.length = this.urls.length;
            this.loaded = 0;

            for(var i = 0; i < this.length; i++)
            {
                (function()
                {
                    var image    = new Image();
                    that.images.push(image);
                    image.onload = function()
                    {
                        that.loaded++;
                        if(that.loaded === that.length)
                            callback.call(that,that.images);
                    };
                    image.src = that.urls[i];
                })();
            }
        },

        /**
         * ADD IMAGE URL TO LOAD
         */
        add: function(urls)
        {
            if(typeof urls === 'string')
                this.urls.push(urls);
            else if(urls instanceof Array)
                this.urls = urls;
        },

        /**
         * GET COORDINATES AND SIZES
         * @param  int    image_width
         * @param  int    image_height
         * @param  int    container_width
         * @param  int    container_height
         * @param  string fit_type
         * @param  string rounding
         * @param  string coordinates
         * @return object
         */
        get_proportions: function(image_width,image_height,container_width,container_height,fit_type,alignment_x,alignment_y,rounding,coordinates)
        {
            var proportions  = {},
                image_ratio  = image_width / image_height,
                canvas_ratio = container_width / container_height,
                width        = 0,
                height       = 0,
                x            = 0,
                y            = 0;

            //Alignment
            if(typeof alignment_x === undefined || (alignment_x !== 'left' && alignment_x !== 'center' && alignment_x !== 'right'))
                alignment_x = 'center';
            if(typeof alignment_y === undefined || (alignment_y !== 'top' && alignment_y !== 'middle' && alignment_y !== 'bottom'))
                alignment_y = 'middle';

            //Image must fill the container
            if(typeof fit_type === 'undefined' || fit_type === 'fill' || fit_type === 'full')
            {
                if(image_ratio < canvas_ratio)
                {
                    width  = container_width;
                    height = (container_width / image_width) * image_height;
                    x      = 0;

                    switch(alignment_y)
                    {
                        case 'top':
                            y = 0;
                            break;
                        case 'middle':
                            y = (container_height - height) / 2;
                            break;
                        case 'bottom':
                            y = container_height - height;
                            break;
                    }
                }
                else
                {
                    height = container_height;
                    width  = (container_height / image_height) * image_width;
                    y      = 0;

                    switch(alignment_x)
                    {
                        case 'left':
                            x = 0;
                            break;
                        case 'center':
                            x = (container_width - width) / 2;
                            break;
                        case 'right':
                            x = container_width - width;
                            break;
                    }
                }
            }
            // TODO : fit
            else if(fit_type === 'fit')
            {
                console.log('fit');
            }

            //Rounding
            if(rounding === 'ceil' || rounding === 'round' || rounding === 'floor')
            {
                height = this.apply_rounding(height,rounding);
                width  = this.apply_rounding(width,rounding);
                x      = this.apply_rounding(x,rounding);
                y      = this.apply_rounding(y,rounding);
            }

            //Coordinates
            if(coordinates === 'cartesian')
            {
                proportions.width  = width;
                proportions.height = height;
                proportions.x      = x;
                proportions.y      = y;
            }
            else
            {
                proportions.width  = width;
                proportions.height = height;
                proportions.left   = x;
                proportions.top    = y;
            }

            return proportions;
        },

        /*
         * APPLY ROUNDING
         * default Math.round()
         */
        apply_rounding: function(value,rounding)
        {
            if(typeof value === 'undefined' || typeof rounding === 'undefined')
                return value;

            switch(rounding)
            {
                case 'ceil':
                    return Math.ceil(value);
                case 'floor':
                    return Math.floor(value);
                // case 'round':
                default:
                    return Math.round(value);
            }
        }
    });
})(window,APP);
