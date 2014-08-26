var CameraDirt = Abstract.extend({

    /**
     * Init
     * @param  object options
     * @return CameraDirt
     */
    init: function(options)
    {
        this.options           = options;
        this.context           = options.context;
        this.image             = options.image;
        this.width             = options.width;
        this.height            = options.height;
        this.x                 = this.width * 0.5;
        this.y                 = this.height * 0.5;
        this.inner_radius      = this.width*0.2;
        this.outer_radius      = this.width*1;
        this.amplitude         = 600;
        this.inner_alpha       = 1;
        this.outer_alpha       = 0.1;
        this.iteration         = 0;
        this.wriggle           = {};
        this.wriggle.frequency = 2;
        this.wriggle.x         = 0;
        this.wriggle.y         = 0;


        var images       = new Images();
        this.proportions = images.get_proportions(this.image.width,this.image.height,this.width,this.height,'fill');

        this.init_buffer();
        this.draw();

        return this;
    },

    /**
     * Create buffer with canvas and context to create gradient mask
     */
    init_buffer: function()
    {
        this.buffer          = {};
        this.buffer.canvas   = null;
        this.buffer.context  = null;

        //Canvas and context
        this.buffer.canvas        = document.createElement('canvas');
        this.buffer.canvas.width  = this.width;
        this.buffer.canvas.height = this.height;
        this.buffer.context       = this.buffer.canvas.getContext("2d");
    },

    /**
     * Iterate
     */
    iterate: function()
    {
        this.iteration++;
        this.wriggle.x = Math.cos(this.iteration * this.wriggle.frequency / 100) +  Math.cos(this.iteration * this.wriggle.frequency / 31);
        this.wriggle.y = Math.cos(this.iteration * this.wriggle.frequency / 21)  +  Math.cos(this.iteration * this.wriggle.frequency / 120);
    },

    /**
     * Draw in canvas
     */
    draw: function()
    {
        //Clear buffer
        this.buffer.context.clearRect(0,0,this.width,this.height);

        //Gradient
        // this.gradient = this.buffer.context.createLinearGradient(0,0,this.width,0);
        this.gradient = this.context.createRadialGradient(this.x + this.wriggle.x * this.amplitude,this.y + this.wriggle.y * this.amplitude,this.inner_radius,this.x + this.wriggle.x * this.amplitude,this.y + this.wriggle.y * this.amplitude,this.outer_radius);
        this.gradient.addColorStop(0,'rgba(255,255,255,'+this.inner_alpha+')');
        this.gradient.addColorStop(1,'rgba(255,255,255,'+this.outer_alpha+')');
        this.buffer.context.fillStyle = this.gradient;
        this.buffer.context.fillRect(0,0,this.width,this.height);

        //Draw image in buffer
        this.buffer.context.save();
        this.buffer.context.globalCompositeOperation = "source-in";
        this.buffer.context.drawImage(this.image,this.proportions.x,this.proportions.y,this.proportions.width,this.proportions.height);
        this.buffer.context.restore();

        //Draw buffer in context
        this.context.save();
        this.context.globalCompositeOperation = 'lighter';
        this.context.drawImage(this.buffer.canvas,0,0);
        this.context.restore();
    }
});