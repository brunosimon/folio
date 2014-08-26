(function()
{
    'use strict';

    APP.CORE.Abstract = Class.extend(
    {
        options: {},

        /**
         * INIT
         */
        init: function(options)
        {
            if(_.isUndefined(options))
                options = {};

            this.options = _.defaults(options,this.options);
            this.started = false;
        },

        /**
         * START
         */
        start: function()
        {
            this.started = true;
        },

        /**
         * DESTROY
         */
        destroy: function()
        {

        }
    });
})();
