var Sparks = Abstract.extend({

    /**
     * Init
     * @param  object options
     */
    init: function(options)
    {
        this.options   = options;
        this.period    = options.period;
        this.context   = options.context;
        this.width     = options.width;
        this.height    = options.height;
        this.count     = options.count;
        this.frequency = options.frequency;
        this.blur      = 0;
        this.iteration = 0;
        this.init_emmiter();
    },

    iterate: function()
    {
        this.iteration++;

        var particule = null;
        for(var i = 0; i < this.emmiter.particules.length; i++)
        {
            particule      = this.emmiter.particules[i];
            particule.blur = this.blur;
            particule.iterate();
            if(
                // particule.x + particule.radius / 2 < 0            ||
                particule.x - 50 > this.width   ||
                particule.y + 50 < 0            ||
                particule.y - 50 > this.height)
            {
                particule.restart();
            }
        }

        if(this.iteration % this.frequency === 0 && this.emmiter.particules.length < this.count)
        {
            this.emmiter.particules.push(new Spark({
                context    : this.context,
                speed      : Math.random() * 2,
                radius     : 3 + Math.random() * 5,
                blur_coeff : 5,
                x          : this.emmiter.x + (this.emmiter.width  > 0 ? this.emmiter.width  * Math.random() : 0),
                y          : this.emmiter.y + (this.emmiter.height > 0 ? this.emmiter.height * Math.random() : 0),
                durations  : {
                    life     : Math.round(Math.random() * 320) + 300,
                    fade_in  : 1,
                    fade_out : 20
                },
                wind : {
                    x : 1,
                    y : -0.5
                }
            }));
        }
    },

    draw: function()
    {
        for(var i = 0, len = this.emmiter.particules.length; i < len; i++)
        {
            this.emmiter.particules[i].draw();
        }
    },

    init_emmiter: function()
    {
        this.emmiter            = {};
        this.emmiter.x          = this.options.emmiter.x;
        this.emmiter.y          = this.options.emmiter.y;
        this.emmiter.particules = Array();
        this.emmiter.type       = this.options.type;

        if(this.emmiter.type === 'area')
        {
            this.emmiter.width  = this.options.emmiter.width;
            this.emmiter.height = this.options.emmiter.height;
        }
        else
        {
            this.emmiter.width  = 0;
            this.emmiter.height = 0;
        }
    }
});