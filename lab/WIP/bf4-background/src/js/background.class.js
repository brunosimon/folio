var Background = Abstract.extend({

    /**
     * Init
     * @param  object options
     * @return Background
     */
    init: function(options)
    {
        this.options = options;
        this.context = options.context;
        this.width   = options.width;
        this.height  = options.height;
        this.image   = options.image;

        var images       = new Images();
        this.proportions = images.get_proportions(this.image.width,this.image.height,this.width,this.height,'fill');

        this.draw();
        this.init_blur(0,100,12);

        if(this.options.animated)
            this.start_blur_animation();

        return this;
    },

    /**
     * Update blur
     */
    iterate: function()
    {
        var rand      = 0,
            direction = null;

        //Blur
        if(this.blur_animated)
        {
            rand = Math.floor(Math.random() * this.blur_chances);
            if(rand === 1)
            {
                rand                 = Math.floor(Math.random() * 2);
                this.blur_direction  = rand === 1 ? 'gretter' : 'lesser';
                this.blur_iterations = this.blur_iterations_min + Math.floor(Math.random() * this.blur_iterations_amplitude);
            }

            //Direction set
            if(this.blur_direction !== null)
            {
                //Iterations left
                if(this.blur_iterations >= 0)
                {
                    //Increment
                    if(this.blur_direction === 'gretter')
                        this.blur += 100 / this.blurs.length;
                    else if(this.blur_direction === 'lesser')
                        this.blur -= 100 / this.blurs.length;

                    //Min
                    if(this.blur <= 0)
                    {
                        this.blur = 0;
                        this.blur_direction = null;
                    }

                    //Max
                    if(this.blur >= this.blur_max)
                    {
                        this.blur = this.blur_max;
                        this.blur_direction = null;
                    }

                    //Iteration
                    this.blur_iterations--;
                }
                else
                {
                    this.blur_direction = null;
                }
            }
        }
    },

    /**
     * Draw background in context
     */
    draw: function()
    {
        this.context.save();
        this.context.drawImage(this.image,this.proportions.x,this.proportions.y,this.proportions.width,this.proportions.height);
        this.context.restore();

        if(typeof this.blurs !== 'undefined')
            this.blur_to(this.blur);
    },

    /**
     * Create some blur image data instead of recalculating each time
     * @param  int max_blur
     * @param  int blur_steps
     */
    init_blur: function(min_blur,max_blur,blur_steps)
    {
        this.blurs = Array();
        for(var i = 0; i < blur_steps; i++)
        {
            if(i === 0 && min_blur === 0)
            {
                this.blurs.push(this.context.getImageData(0,0,this.width,this.height));
            }
            else
            {
                this.blurs.push(stackBlurCanvasRGB(this.context,0,0,this.width,this.height,Math.floor(min_blur + (max_blur - min_blur) * i / blur_steps)));
            }

        }
    },

    /**
     * Start blur animation
     */
    start_blur_animation: function()
    {
        this.blur_animated             = true;
        this.blur                      = 75;
        this.blur_max                  = 100;
        this.blur_chances              = 20;
        this.blur_direction            = null;
        this.blur_iterations           = 0;
        this.blur_iterations_min       = 4;
        this.blur_iterations_amplitude = 12;
    },

    /**
     * Stop blur animation
     */
    stop_blur_animation: function()
    {
        this.blur_animated = false;
    },

    /**
     * Set blur
     * @param  int level beetween 0 and 100
     */
    blur_to: function(level)
    {
        if(level < 0)
            level = 0;
        if(level > 100)
            level = 100;

        level = Math.round((this.blurs.length - 1) / 100 * level);
        this.context.putImageData(this.blurs[level],0,0);
    }
});