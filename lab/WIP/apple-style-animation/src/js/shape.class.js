var Shape = Abstract.extend(
{
    defaults:{},

    init: function(parent,options)
    {
        this._super(parent,options);

        this.context        = _.isUndefined(options.context) ? null : options.context;
        this.visible        = true,
        this.draw_type      = 'fill',
        this.alpha          = 1,
        this.color          = '#1F191E',
        this.glow_color     = '#1F191E',
        this.glow_offset_x  = 0,
        this.glow_offset_y  = 0,
        this.glow_radius    = 0;
    },

    update: function()
    {
        
    },

    set_context: function()
    {
        this.context.save();

        this.context.globalAlpha   = this.alpha;
        this.context.fillStyle     = this.color;
        this.context.strokeStyle   = this.color;
        this.context.shadowColor   = this.glow_color;
        this.context.shadowOffsetX = this.glow_offset_x;
        this.context.shadowOffsetY = this.glow_offset_y;
        this.context.shadowBlur    = this.glow_radius;
    },

    restore_context: function()
    {
        this.context.restore();
    },

    draw_context: function()
    {
        if(this.visible)
        {
            if(this.draw_type === 'stroke')
                this.context.stroke();
            else
                this.context.fill();
        }
    }
});