var Spark = Abstract.extend({

    /**
     * Init
     * @param  Sparks sparks
     * @param  object options
     */
    init: function(options)
    {
        this.options   = options;
        this.context   = options.context;

        this.iteration          = 0;
        this.blur               = 0;
        this.blur_coeff         = typeof this.options.blur_coeff         !== 'undefined' ? this.options.blur_coeff         : 10;
        this.x                  = typeof this.options.x                  !== 'undefined' ? this.options.x                  : Math.ceil(Math.random() * 100);
        this.y                  = typeof this.options.y                  !== 'undefined' ? this.options.y                  : Math.ceil(Math.random() * 100);
        this.speed              = typeof this.options.speed              !== 'undefined' ? this.options.speed              : Math.ceil(Math.random() * 4);
        this.radius             = typeof this.options.radius             !== 'undefined' ? this.options.radius             : Math.ceil(Math.random() * 8);
        this.opacity            = 0;
        this.durations          = typeof this.options.durations          !== 'undefined' ? this.options.durations          : {};
        this.durations.life     = typeof this.options.durations.life     !== 'undefined' ? this.options.durations.life     : Math.ceil(Math.random() * 150) + 150;
        this.durations.fade_in  = typeof this.options.durations.fade_in  !== 'undefined' ? this.options.durations.fade_in  : Math.ceil(Math.random() * 10)  + 10;
        this.durations.fade_out = typeof this.options.durations.fade_out !== 'undefined' ? this.options.durations.fade_out : Math.ceil(Math.random() * 25)  + 25;
        this.wind               = typeof this.options.wind               !== 'undefined' ? this.options.wind        : {};
        this.wind.x             = typeof this.options.wind.x             !== 'undefined' ? this.options.wind.x      : 0;
        this.wind.y             = typeof this.options.wind.y             !== 'undefined' ? this.options.wind.y      : 0;
        this.tail_length        = typeof this.options.tail_length        !== 'undefined' ? this.options.tail_length : 6;

        var rand     = Math.random() * Math.PI * 2;
        this.speed_x = Math.cos(rand) * this.speed;
        this.speed_y = Math.sin(rand) * this.speed;

        this.tail = Array();
        this.tail.unshift({
            x : this.x,
            y : this.y
        });
    },

    iterate: function()
    {
        this.iteration++;
        if(this.iteration <= this.durations.fade_in)
            this.opacity = this.iteration / this.durations.fade_in;
        else if(this.iteration >= this.durations.life)
            this.restart();
        else if(this.iteration >= this.durations.life - this.durations.fade_out)
            this.opacity = (this.durations.life - this.iteration) / this.durations.fade_out;

        this.x += this.speed_x + this.wind.x;
        this.y += this.speed_y + this.wind.y;

        this.tail.unshift({
            x : this.x,
            y : this.y
        });

        if(this.tail.length > this.tail_length)
            this.tail.splice(this.tail_length,1);
    },

    restart: function()
    {
        this.iteration = 0;
        this.opacity   = 0;
        this.x         = typeof this.options.x !== 'undefined' ? this.options.x : Math.ceil(Math.random() * 100);
        this.y         = typeof this.options.y !== 'undefined' ? this.options.y : Math.ceil(Math.random() * 100);

        this.tail = Array();
        this.tail.unshift({
            x : this.x,
            y : this.y
        });

        var rand       = Math.random() * Math.PI * 2;
        this.speed_x   = Math.cos(rand) * this.speed;
        this.speed_y   = Math.sin(rand) * this.speed;
    },

    draw: function()
    {
        this.context.save();
        this.context.beginPath();

        var radius = this.radius + (this.blur === 0 ? 0 : (this.radius * this.blur / 100 * this.blur_coeff));


        // this.context.beginPath();
        // this.context.moveTo(this.tail[0].x,this.tail[0].y);
        // this.context.strokeStyle   = 'rgba(255,245,220,' + 1 * this.opacity + ')';
        // this.context.lineCap       = 'round';
        // this.context.lineWidth     = 4;
        // this.context.shadowOffsetX = 0;
        // this.context.shadowOffsetY = 0;
        // this.context.shadowBlur    = 6;
        // this.context.shadowColor   = 'rgba(255,42,0,1)';
        // for(var i = 1, len = this.tail.length; i < len; i++)
        //     this.context.lineTo(this.tail[i].x,this.tail[i].y);
        // this.context.stroke();
        // this.context.closePath();


        this.gradient = this.context.createRadialGradient(this.x,this.y,0,this.x,this.y,radius);

        this.gradient.addColorStop(0.2,'rgba(255,240,170,'+1 * this.opacity+')');
        this.gradient.addColorStop(0.3,'rgba(255,157,84,'+1 * this.opacity+')');
        this.gradient.addColorStop(0.31,'rgba(255,42,0,'+0.12 * this.opacity+')');
        this.gradient.addColorStop(1  ,'rgba(255,42,0,0)');

        this.context.globalCompositeOperation = 'lighter';
        this.context.fillStyle = this.gradient;
        this.context.arc(this.x,this.y,radius,0,2*Math.PI,false);
        this.context.fill();


        this.context.restore();
    }
});