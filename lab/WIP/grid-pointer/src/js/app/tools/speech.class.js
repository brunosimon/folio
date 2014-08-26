var APP = APP ? APP : {};

(function(window,APP)
{
    "use strict";

    APP.Speech = Abstract.extend(
    {
        options :
        {
            debug : true
        },

        /**
         * INIT
         */
        init: function(options)
        {
            this._super(options);

            this.recognition                = new window.webkitSpeechRecognition();
            this.recognition.lang           = 'fr-FR';
            this.recognition.continuous     = true;
            this.recognition.interimResults = true;

            this.init_events();
        },

        /**
         * INIT EVENTS
         */
        init_events: function()
        {
            var that = this;
        
            this.recognition.onstart = function()
            {
                that.trigger('start');
            };

            this.recognition.onresult = function(e)
            {
                console.log('- event ------------');
                var text     = '',
                    is_final = false;
                for(var i = e.resultIndex, len = e.results.length; i < len; i++)
                {
                    var result     = e.results[i],
                        transcript = result[0].transcript;
                    
                    if(result.isFinal)
                    {
                        text = transcript;
                        is_final = true;
                    }
                    else
                    {
                        text += transcript;
                    }
                }

                if(is_final)
                {
                    console.log('final : ' + text);
                }
                else
                {
                    console.log('inter : ' + text);
                }
            };
        },

        /**
         * START
         */
        start: function()
        {
            this.recognition.start();
        },

        /**
         * STOP
         */
        stop: function()
        {
            this.recognition.stop();
        }
    });
}(window,APP));