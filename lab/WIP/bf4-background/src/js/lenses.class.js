var Lenses = Abstract.extend({

    /**
     * Init
     * @param  object options
     * @return Lenses
     */
    init: function(options)
    {
        this.options = options;
        this.context = options.context;
        this.width   = options.width;
        this.height  = options.height;

        this.list = [
            new Lens(this,{
                index   : 0,
                context : this.context,
                width   : this.width,
                height  : this.height,
                start   : {x:0,y:this.height * 0.6},
                end     : {x:0,y:this.height * 0.6,radius:this.width * 0.6}
            }),
            new Lens(this,{
                index     : 0,
                context   : this.context,
                width     : this.width,
                height    : this.height,
                end       : {radius:this.width * 3},
                color     : {r:200,g:255,b:255},
                animation : {duration:6,opacity:0.4}
            }),
            new Lens(this,{
                index     : 0,
                context   : this.context,
                width     : this.width,
                height    : this.height,
                start     : {x:this.width,y:this.height * 0.6},
                end       : {x:this.width,y:this.height * 0.4,radius:this.width * 0.8},
                animation : {duration:20,opacity:0.2}
            }),
            new Lens(this,{
                index     : 0,
                context   : this.context,
                width     : this.width,
                height    : this.height,
                color     : {r:255,g:150,b:150},
                start     : {x:this.width*0.8,y:0},
                end       : {x:this.width*0.8,y:this.height * 0.3,radius:this.width*0.6},
                animation : {duration:17,opacity:0.3}
            }),
            new Lens(this,{
                index     : 0,
                context   : this.context,
                width     : this.width,
                height    : this.height,
                color     : {r:255,g:150,b:150},
                start     : {x:this.width*0.2,y:this.height},
                end       : {x:this.width*0.2,y:this.height * 0.7,radius:this.width*0.6},
                animation : {duration:17,opacity:0.3}
            })
        ];

        return this;
    },

    /**
     * Start lens randomly
     */
    iterate: function()
    {
        var rand = Math.floor(Math.random() * 20);
        if(rand === 1)
        {
            rand = Math.floor(Math.random() * this.list.length);
            this.list[rand].start_animation();
        }

        for(var i = 0; i < this.list.length; i++)
            this.list[i].iterate();
    },

    /**
     * Draw each lens
     */
    draw: function()
    {
        for(var i = 0; i < this.list.length; i++)
            this.list[i].draw();
    }
});