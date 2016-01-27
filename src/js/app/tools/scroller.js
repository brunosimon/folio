var B = require( '../../libs/burno-0.3.js' )

module.exports = B.Core.Abstract.extend(
{
    static  : 'scroller',
    options :
    {

    },

    /**
     * CONSTRUCT
     */
    construct : function( options )
    {
        this._super( options )

        this.init_ticker()
    },

    /**
     * INIT TICKER
     */
    init_ticker : function()
    {
        var that = this;

        // Set up
        this.ticker = new B.Tools.Ticker()

        // Ticker tick event
        this.ticker.on( 'tick', function()
        {
            if( that.currentTime < that.duration )
            {
                that.currentTime += that.increment;

                var val = Math.easeInOutQuad(that.currentTime, that.start, that.change, that.duration);

                that.move_to(val);
            }
        } )
    },

    /**
     * MOVE TO
     */
    move_to : function( amount )
    {
        document.documentElement.scrollTop = amount;
        document.body.parentNode.scrollTop = amount;
        document.body.scrollTop = amount;
    },

    /**
     * GET SCROLL POSITION
     */
    get_scroll_position : function( amount )
    {
        return document.documentElement.scrollTop || document.body.parentNode.scrollTop || document.body.scrollTop;
    },

    animate_to : function( to, duration, callback )
    {
        Math.easeInOutQuad = function (t, b, c, d) {
            t /= d/2;
            if (t < 1)
                return c/2*t*t + b
            t--;
            return -c/2 * (t*(t-2) - 1) + b;
        };

        Math.easeInCubic = function(t, b, c, d) {
            var tc = (t/=d)*t*t;
            return b+c*(tc);
        };

        Math.inOutQuintic = function(t, b, c, d) {
            var ts = (t/=d)*t,
            tc = ts*t;
            return b+c*(6*tc*ts + -15*ts*ts + 10*tc);
        };

        this.start       = this.get_scroll_position(),
        this.change      = to - this.start,
        this.currentTime = 0,
        this.increment   = 20;

        this.duration = typeof duration === 'undefined' ? 500 : duration;
    }
} )
