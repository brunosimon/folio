var Lens = Abstract.extend({

    /**
     * Init
     * @param  Lenses sparks
     * @param  object options
     * @return Lens
     */
    init: function(sparks,options)
    {
        if(typeof options.start === 'undefined')
            options.start = {};
        if(typeof options.end === 'undefined')
            options.end = {};
        if(typeof options.animation === 'undefined')
            options.animation = {};
        if(typeof options.color === 'undefined')
            options.color = {};

        this.sparks              = sparks;
        this.options             = options;
        this.index               = this.options.index;
        this.context             = options.context;
        this.width               = options.width;
        this.height              = options.height;
        this.opacity             = 0;
        this.start               = {};
        this.start.x             = typeof options.start.x      !== 'undefined' ? options.start.x      : 0;
        this.start.y             = typeof options.start.y      !== 'undefined' ? options.start.y      : 0;
        this.start.radius        = typeof options.start.radius !== 'undefined' ? options.start.radius : 0;
        this.end                 = {};
        this.end.x               = typeof options.end.x      !== 'undefined' ? options.end.x      : 0;
        this.end.y               = typeof options.end.y      !== 'undefined' ? options.end.y      : this.width;
        this.end.radius          = typeof options.end.radius !== 'undefined' ? options.end.radius : this.width * 1.2;
        this.color               = {};
        this.color.r             = typeof options.color.r !== 'undefined' ? options.color.r : 255;
        this.color.g             = typeof options.color.g !== 'undefined' ? options.color.g : 218;
        this.color.b             = typeof options.color.b !== 'undefined' ? options.color.b : 198;
        this.gradient            = null;
        this.animation           = {};
        this.animation.running   = false;
        this.animation.iteration = 0;
        this.animation.duration  = typeof options.animation.duration !== 'undefined' ? options.animation.duration : 12;
        this.animation.opacity   = typeof options.animation.opacity  !== 'undefined' ? options.animation.opacity  : 0.4;

        return this;
    },

    /**
     * Update lens and stop if got through
     */
    iterate: function()
    {
        if(this.animation.running)
        {
            this.animation.iteration++;
            this.opacity = this.curve(this.animation.iteration / this.animation.duration) * this.animation.opacity;
            if(this.animation.iteration >= this.animation.duration)
                this.animation.running = false;
        }
    },

    /**
     * Start animation
     */
    start_animation: function()
    {
        this.animation.running   = true;
        this.animation.iteration = 0;
    },

    /**
     * Draw lens in context with 'lighter' as composite operation
     */
    draw: function()
    {
        this.context.save();
        this.gradient = this.context.createRadialGradient(this.start.x,this.start.y,this.start.radius,this.end.x,this.end.y,this.end.radius);
        this.gradient.addColorStop(0,'rgba('+this.color.r+','+this.color.g+','+this.color.b+','+this.opacity+')');
        this.gradient.addColorStop(1,'rgba('+this.color.r+','+this.color.g+','+this.color.b+',0)');
        this.context.globalCompositeOperation = 'lighter';
        this.context.fillStyle = this.gradient;
        this.context.fillRect(0,0,this.width,this.height);
        this.context.restore();
    },

    /**
     * Calculate curve with cos
     * @param  number x
     */
    curve: function(x)
    {
        //(cos((x*2 + 1)*pi) + 1)
        return (Math.cos((x * 2 + 1)*Math.PI) + 1) / 2;
    }
});