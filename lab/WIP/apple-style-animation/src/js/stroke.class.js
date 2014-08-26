var Stroke = Shape.extend(
{
    defaults:{
        context : null,
        point_1 : null,
        point_2 : null,
        visible : true,
        width   : 1
    },

    init: function(parent,options)
    {
        this._super(parent,options);
        
        this.draw_type = 'stroke';
        this.context   = this.options.context;
        this.visible   = this.options.visible;
        this.point_1   = this.options.point_1;
        this.point_2   = this.options.point_2;
        this.width     = this.options.width;
    },

    draw: function()
    {
        if(this.visible)
        {
            this.set_context();
            this.context.beginPath();
            this.context.moveTo(this.point_1.get_x(),this.point_1.get_y());
            this.context.lineTo(this.point_2.get_x(),this.point_2.get_y());
            this.draw_context();
            this.restore_context();
        }
    }
});