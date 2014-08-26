var APP = APP ? APP : {};

(function(window,APP)
{
    "use strict";

    APP.Grid = Abstract.extend(
    {
        options :
        {
            block :
            {
                width  : 160,
                height : 90
            },
            youtube_ids :
            [
                '1ahqPlv4fWM',
                't5tp00y2-jA',
                '5s5B-7zWNRw',
                'LK-WqT1J9A0',
                'AGSYg3QZcp8',
                'EIv7_wF6Ikk',
                'WFpRnawMhJ0'
            ]
        },

        /**
         * INIT
         */
        init: function(options)
        {
            var that = this;

            this._super(options);

            this.blocks = [];
        },

        /**
         * CREATE GRID
         */
        create_grid: function()
        {
            // Container
            this.grid = document.createElement('div');
            this.grid.classList.add('grid');
            this.grid.style.position = 'absolute';
            this.grid.style.top      = 0;
            this.grid.style.left     = 0;

            document.body.appendChild(this.grid);

            // Blocks
            this.columns = Math.ceil(window.innerWidth / this.options.block.width);
            this.lines   = Math.ceil(window.innerHeight / this.options.block.height);
        
            for(var i = 0; i < this.lines; i++)
            {
                for(var j = 0; j < this.columns; j++)
                {
                    var block = this.create_block({line:i,column:j,youtube_id:'1ahqPlv4fWM'});

                    this.grid.appendChild(block);
                    this.blocks.push(block);
                }
            }
        },

        /**
         * CREATE BLOCK
         */
        create_block: function(params)
        {
            var block  = document.createElement('div'),
                iframe = document.createElement('iframe');

            // Block
            block.style.left     = this.options.block.width * params.column + 'px';
            block.style.top      = this.options.block.height * params.line + 'px';
            block.style.width    = this.options.block.width + 'px';
            block.style.height   = this.options.block.height + 'px';

            block.classList.add('block');

            // iFrame
            iframe.id          = 'player-' + params.line + '-' + params.column;
            iframe.type        = 'text/html';
            iframe.width       = this.options.block.width;
            iframe.height      = this.options.block.height;
            iframe.src         = 'http://www.youtube.com/embed/M7lc1UVf-VE?autoplay=1&origin=http://example.com';
            iframe.frameborder = 0;

            // block.appendChild(iframe);

            return block;
        },

        /*
         * GET RATIO TO BLOCK
         */
        get_ratio_to_block: function(ratio)
        {
            if(typeof ratio.top === 'undefined' || typeof ratio.left === 'undefined')
                return false;

            if(ratio.left === 1)
                ratio.left = 0.99999;

            if(ratio.top === 1)
                ratio.top = 0.99999;

            var column = Math.floor(window.innerWidth * ratio.left / this.options.block.width),
                line   = Math.floor(window.innerHeight * ratio.top / this.options.block.height),
                block  = null;

            block = this.blocks[line * this.columns + column];

            return block;
        },

        /**
         * START
         */
        start: function()
        {
            this._super();

            this.create_grid();
        }
    });
})(window,APP);
