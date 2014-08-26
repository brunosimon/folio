var Point = Shape.extend(
{
    defaults:{
        context           : null,
        visible           : true,
        radius            : 10,
        x                 : 10,
        y                 : 10,
        rotation          : 0,
        rotation_distance : 0
    },

    init: function(parent,options)
    {
        this._super(parent,options);
        
        this.draw_type         = 'fill';
        this.context           = this.options.context;
        this.visible           = this.options.visible;
        this.radius            = this.options.radius;
        this.x                 = this.options.x;
        this.y                 = this.options.y;
        this.rotation          = this.options.rotation;
        this.rotation_distance = this.options.rotation_distance;
    },

    get_x: function()
    {
        return this.x + Math.cos(this.rotation) * this.rotation_distance;
    },

    get_y: function()
    {
        return this.y + Math.sin(this.rotation) * this.rotation_distance;
    },

    draw: function()
    {
        if(this.visible)
        {
            this.set_context();
            this.context.beginPath();
            this.context.arc(this.get_x(),this.get_y(),this.radius,0,Math.PI*2);
            this.draw_context();
            this.restore_context();
        }
    }
});