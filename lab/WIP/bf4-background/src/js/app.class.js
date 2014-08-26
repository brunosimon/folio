var App = Abstract.extend({

    /**
     * Init
     * @param  object options
     * @return App
     */
    init: function(options)
    {
        var that = this;

        this.canvas     = options.canvas;
        this.context    = this.canvas.getContext('2d');
        this.width      = this.canvas.width;
        this.height     = this.canvas.height;

        this.canvas.style.position = 'relative';
        this.canvas.style.top      = 0;
        this.canvas.style.left     = 0;

        //Load images
        this.images = new Images();
        this.images.load(['src/images/background.jpg','src/images/camera-lens-dirt-6.jpg'],function(images)
        {
            //Background image
            that.background = new Background({
                context  : that.context,
                width    : that.width,
                height   : that.height,
                image    : this.images[0],
                animated : true
            });

            //Camera dirt
            that.camera_dirt = new CameraDirt({
                context : that.context,
                width   : that.width,
                height  : that.height,
                image   : this.images[1]
            });
                
            //Wriggle effect
            that.wriggle = new Wriggle({
                targets:['top','left']
            });

            //Random lenses
            that.lenses = new Lenses({
                context : that.context,
                width   : that.width,
                height  : that.height
            });

            //Sparks
            that.sparks = new Sparks({
                context   : that.context,
                width     : that.width,
                height    : that.height,
                type      : 'area',
                count     : 100,
                frequency : 15,
                emmiter   : {
                    x      : -100,
                    y      : that.height * 0.7,
                    width  : 0,
                    height : that.height * 0.2
                }
            });

            window.requestAnimFrame(app.loop);
            //Update that shit
            // window.setInterval(function()
            // {
                
            // },30);
        });

        return this;
    },

    loop: function()
    {
        requestAnimFrame(app.loop);
        app.context.clearRect(0,0,app.width,app.height);
        app.background.iterate();
        app.background.draw();
        app.lenses.iterate();
        app.lenses.draw();
        app.camera_dirt.iterate();

        app.sparks.blur = app.background.blur;
        app.sparks.iterate();
        app.sparks.draw();
        app.camera_dirt.draw();
        app.wriggle.iterate();

        app.canvas.style.top  = app.wriggle.values.top + 'px';
        app.canvas.style.left = app.wriggle.values.left + 'px';
    },

    draw: function()
    {

    }
});