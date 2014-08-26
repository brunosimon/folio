var APP = APP ? APP : {};

(function(window,APP)
{
    "use strict";

    APP.Leap = Abstract.extend(
    {
        options :
        {
            debug          : true,
            virtual_screen :
            {
                ratio    : 16 / 9,
                distance : 0.7,
                angle    :
                {
                    y : 0,
                    x : 0
                },
                x :
                {
                    min : -180,
                    max : 180
                },
                y :
                {
                    min : 150,
                    max : 0    // will be override
                }
            }
        },

        /**
         * INIT
         */
        init: function(options)
        {
            var that = this;

            this._super(options);

            this.screen_ratio    = {};
            this.detecting       = false;
            this.hands           = {};
            this.hands.left      = null;
            this.hands.right     = null;
            this.hands.left_open = false;
            this.controller      = new Leap.Controller({
                enableGestures : false
            });

            // Debug
            if(this.options.debug)
            {
                this.debug = true;
                this.init_debug();
            }
            else
            {
                this.debug = false;
            }

            // Events
            this.init_events();
        },

        /**
         * INIT EVENTS
         */
        init_events: function()
        {
            var that = this;

            this.controller.on('frame',function(frame)
            {
                // Detecting hands
                if(frame.hands.length)
                {
                    if(frame.hands.length === 1)
                    {
                        that.hands.right = frame.hands[0];
                        that.hands.left  = null;
                    }
                    else
                    {
                        that.hands.left  = frame.hands[0].palmPosition[0] < frame.hands[1].palmPosition[0] ? frame.hands[0] : frame.hands[1];
                        that.hands.right = frame.hands[0].palmPosition[0] < frame.hands[1].palmPosition[0] ? frame.hands[1] : frame.hands[0];
                    }

                    // Left hand
                    var open = false;
                    if(that.hands.left === null || that.hands.left.fingers.length < 3)
                    {
                        if(that.hands.left_open)
                            that.trigger('left_hand_close');

                        that.hands.left_open = false;
                    }
                    else
                    {
                        if(!that.hands.left_open)
                            that.trigger('left_hand_open');

                        that.hands.left_open = true;
                    }

                    // Get pointer from right hand
                    var pointer = that.get_pointer_from_hand(that.hands.right);

                    // Detecting fingers
                    if(pointer)
                    {
                        that.detecting = true;

                        // Get position with most distant pointer of first hand
                        that.screen_ratio = that.get_pointer_to_screen_ratio(pointer);

                        if(that.debug)
                        {
                            that.pointer.style.top  = that.screen_ratio.top * 100 + '%';
                            that.pointer.style.left = that.screen_ratio.left * 100 + '%';
                        }

                        // Trigger
                        that.trigger('screen_ratio_changed',[that.screen_ratio]);
                    }
                }

                // No fingers detected
                else
                {
                    that.detecting = false;
                }
            });
        },

        /**
         * GET POINTER FROM HAND
         */
        get_pointer_from_hand: function(hand)
        {
            // Errors
            if(typeof hand === 'undefined' || !hand.fingers.length)
                return false;

            // Use first finger as reference
            var finger           = hand.fingers[0],
                biggest_distance = 0,
                distance         = 0;

            // Loop through fingers
            for(var i = 0, len = hand.fingers.length; i < len; i++)
            {
                distance = Math.sqrt(
                    Math.pow(hand.palmPosition[0] - hand.fingers[i].tipPosition[0] , 2) +
                    Math.pow(hand.palmPosition[1] - hand.fingers[i].tipPosition[1] , 2) +
                    Math.pow(hand.palmPosition[2] - hand.fingers[i].tipPosition[2] , 2)
                );

                if(distance > biggest_distance)
                {
                    biggest_distance = distance;
                    finger = hand.fingers[i];
                }
            }

            return finger;
        },

        /**
         * GET POINTER TO TO SCREEN POSITION
         */
        get_pointer_to_screen_ratio: function(pointer)
        {
            var position = pointer.tipPosition;

            if(!position instanceof Array || position.length !== 3)
                return false;

            // Virtual screen
            var virtual_screen   = this.options.virtual_screen;
            virtual_screen.y.max = virtual_screen.y.min + (virtual_screen.x.max - virtual_screen.x.min) / this.options.screen_ratio;

            var x = 0,
                y = 0;

            // Position
            x = (position[0] - virtual_screen.x.min) / (virtual_screen.x.max - virtual_screen.x.min);
            y = (position[1] - virtual_screen.y.min) / (virtual_screen.y.max - virtual_screen.y.min);

            // Angle
            x += virtual_screen.distance * Math.tan(pointer.direction[0] + virtual_screen.angle.y);
            y += virtual_screen.distance * Math.tan(pointer.direction[1] + virtual_screen.angle.x);

            // Limits
            x = x > 1 ? 1 : x < 0 ? 0 : x;
            y = y > 1 ? 1 : y < 0 ? 0 : y;

            // console.log(y);

            return {
                x      : x,
                y      : y,
                top    : 1 - y,
                right  : 1 - x,
                bottom : y,
                left   : x
            };
        },

        init_debug: function()
        {
            this.pointer                  = document.createElement('div');
            this.pointer.style.position   = 'absolute';
            this.pointer.style.top        = 0;
            this.pointer.style.left       = 0;
            this.pointer.style.width      = '10px';
            this.pointer.style.height     = '10px';
            this.pointer.style.background = 'blue';
            this.pointer.style.zIndex     = 10;

            this.pointer.classList.add('leap-debug-pointer');
            document.body.appendChild(this.pointer);
        },

        /**
         * START
         */
        start: function()
        {
            this._super();
            this.controller.connect();
        }
    });
})(window,APP);
