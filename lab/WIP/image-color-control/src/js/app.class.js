var App = Abstract.extend(
{
    defaults:{
        image      : 'image-4.jpg',
        darkness   : 0,
        hue        : 0,
        saturation : 36,
        lightness  : 90,
        intensity  : 0.5
    },

    init: function(parent,options)
    {
        this._super(parent,options);

        var that = this;

        this.canvas  = this.options.canvas;
        this.context = this.canvas.getContext('2d');

        this.load_image(function()
        {
            that.set_image();
            window.requestAnimationFrame(that.update.bind(this));
        });
    },

    set_image: function()
    {
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.context.drawImage(this.image,0,0,this.canvas.width,this.canvas.height);
        this.image_data = this.context.getImageData(0,0,this.canvas.width,this.canvas.height);

        var average  = null,
            darkness = this.options.darkness;

        if(darkness === 0)
            darkness = 1;
        else if(darkness > 0)
            darkness = darkness / 10 + 1;
        else if(darkness < 0)
            darkness = 1 - darkness / -50;

        for(var i = 0; i < this.image_data.data.length; i += 4)
        {
            average = parseInt(((this.image_data.data[i] + this.image_data.data[i+1] + this.image_data.data[i+2]) / 3) / (darkness),10);
            this.image_data.data[i]   = average;
            this.image_data.data[i+1] = average;
            this.image_data.data[i+2] = average;
            // this.image_data.data[i+3] = 255;
        }

        this.context.putImageData(this.image_data,0,0);

        this.context.save();
        this.context.globalCompositeOperation = "lighter";
        this.context.globalAlpha              = this.options.intensity;
        this.context.fillStyle                = 'hsl('+this.options.hue+','+this.options.lightness+'%,'+this.options.saturation+'%)';
        this.context.fillRect(0,0,canvas.width,canvas.height);
        this.context.restore();
    },

    load_image: function(callback)
    {
        var image = new Image();
        image.onload = function()
        {
            this.image = image;

            if(!_.isUndefined(callback))
                callback.call(this);

        }.bind(this);
        image.src = 'src/images/'+this.options.image;
    },

    update: function()
    {
        stats.end();
        stats.begin();
        window.requestAnimationFrame(this.update.bind(this));
    }
});