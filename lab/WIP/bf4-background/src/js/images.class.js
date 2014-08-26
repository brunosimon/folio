var Images = Abstract.extend({

    /**
     * Init
     * @param  object options
     * @return Images
     */
    init: function(options)
    {
        this.options = options;
        this.urls    = [];
        this.images = [];
        this.length  = 0;
        this.loaded  = 0;
    },

    /**
     * Load urls then call callback function
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
                        callback.call(that);
                };
                image.src = that.urls[i];
            })();
        }
    },

    /**
     * Add image url to load
     */
    add: function(urls)
    {
        if(typeof urls === 'string')
            this.urls.push(urls);
        else if(urls instanceof Array)
            this.urls = urls;
    },

    /**
     * Get coordinates and sizes
     * @param  int image_width
     * @param  int image_height
     * @param  int container_width
     * @param  int container_height
     * @return object
     */
    get_proportions: function(image_width,image_height,container_width,container_height,fit_type)
    {
        var proportions  = {},
            image_ratio  = image_width / image_height,
            canvas_ratio = container_width / container_height;
        
        //Image must fill the container
        if(typeof fit_type === 'undefined' || fit_type === 'fill' || fit_type === 'full')
        {
            if(image_ratio < canvas_ratio)
            {
                proportions.width  = container_width;
                proportions.height = (container_width / image_width) * image_height;
                proportions.x      = 0;
                proportions.y      = (container_height - proportions.height) / 2;
            }
            else
            {
                proportions.height = container_height;
                proportions.width  = (container_height / image_height) * image_width;
                proportions.x      = (container_width - proportions.width) / 2;
                proportions.y      = 0;
            }
        }

        return proportions;
    }
});