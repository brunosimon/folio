var Disk = Shape.extend(
{
    defaults:{
        context     : null,
        visible     : true,
        x           : 0,
        y           : 0,
        radius      : 50,
        angle_start : 0,
        angle_end   : Math.PI * 2
    },

    init: function(parent,options)
    {
        this._super(parent,options);
        
        this.draw_type   = 'fill';
        this.context     = this.options.context;
        this.visible     = this.options.visible;
        this.x           = this.options.x;
        this.y           = this.options.y;
        this.radius      = this.options.radius;
        this.angle_start = this.options.angle_start;
        this.angle_end   = this.options.angle_end;
    },

    draw: function()
    {
        if(this.visible)
        {
            this.set_context();
            this.context.beginPath();
            this.context.moveTo(this.x,this.y);
            this.context.arc(this.x,this.y,this.radius,this.angle_start,this.angle_end);
            this.draw_context();
            this.restore_context();
        }
    }
});