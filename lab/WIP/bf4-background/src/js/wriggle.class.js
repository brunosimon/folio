var Wriggle = Abstract.extend({

    /**
     * Init wriggle with targets
     * @param  object options
     * @return Wriggle
     */
    init: function(options)
    {
        this.options   = options;
        this.iteration = 0;
        this.amplitude = typeof options.amplitude !== 'undefined' ? options.amplitude : 4;
        this.frequency = typeof options.frequency !== 'undefined' ? options.frequency : 2;
        this.targets   = typeof options.targets   !== 'undefined' ? options.targets   : ['x','y'];
        this.values    = {};
        this.rands     = {};

        var i = this.targets.length;
        while(i--)
        {
            this.values[this.targets[i]] = 0;
            this.rands[this.targets[i]] = [parseInt(Math.random() * 100,10),parseInt(Math.random() * 100,10)];
        }

        return this;
    },

    /**
     * Update values
     */
    iterate: function()
    {
        this.iteration++;

        var i = this.targets.length;
        while(i--)
            this.values[this.targets[i]] = (Math.cos(this.iteration * this.frequency / this.rands[this.targets[i]][0]) + Math.cos(this.iteration * this.frequency / this.rands[this.targets[i]][1])) * this.amplitude;
    }
});