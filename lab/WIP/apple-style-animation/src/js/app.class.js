var App = Abstract.extend(
{
    defaults:{},

    init: function(parent,options)
    {
        this._super(parent,options);
        this.canvas  = this.options.canvas;
        this.context = this.canvas.getContext('2d');

        this.elements     = [];
        this.timelines    = [];
        this.time_scale   = 1;
        this.progress     = 0.01;
        this.max_duration = 0;

        this.start_animation_1(0);
        this.start_animation_2(8);
        this.start_animation_3(13);

        this.rasterize_timelines();
        this.set_time_scale();

        window.requestAnimationFrame(this.update.bind(this));
    },

    rasterize_timelines: function()
    {
        var i           = this.timelines.length,
            timeline    = null,
            misc_object = {};

        while(i--)
        {
            timeline = this.timelines[i];
            if(timeline.duration() > this.max_duration)
                this.max_duration = timeline.duration();
        }

        i = this.timelines.length;
        while(i--)
        {
            timeline = this.timelines[i];
            timeline.to(misc_object,this.max_duration - timeline.duration(),{});
        }
    },

    start_animation_1: function(time)
    {
        this.start_polygone(time + 0  ,4,Math.PI/4,-Math.PI/4,200,6);    //square normal
        this.start_polygone(time + 1.2,8,Math.PI/8,Math.PI/8*3,220,6);   //octo
        this.start_polygone(time + 2.4,4,0,-Math.PI/2,200,6);            //square rotate
        this.start_polygone(time + 3.7,6,Math.PI/6,-Math.PI/6,232,6);    //hexa
        this.start_circle(time   + 4.8,0,231,6);                         //circle
        this.start_polygone(time + 5.4,4,0,Math.PI/2*3,200,6);           //square rotate
        this.start_polygone(time + 5.8,4,Math.PI/4,-Math.PI/4,260,6);    //square normal
        this.start_polygone(time + 6.2  ,4,Math.PI/4,Math.PI/4*3,200,6); //square normal
        this.start_polygone(time + 6.8,6,Math.PI/6,Math.PI/6*3,220,6);   //hexa
        this.start_circle(time   + 7.2,0,260,6);                         //circle
    },

    start_polygone: function(time,edges,rotation_start,rotation_end,distance,duration)
    {
        var i = 0;

        for(i=0; i < edges; i++)
        {
            var point_1    = new Point(this,{context:this.context,x:this.canvas.width / 2 + Math.cos(Math.PI * i * 2 / edges + rotation_start) * distance,y:this.canvas.height / 2 + Math.sin(Math.PI * i * 2 / edges + rotation_start) * distance,radius:0}),
                point_2    = new Point(this,{context:this.context,x:this.canvas.width / 2 + Math.cos(Math.PI * i * 2 / edges + rotation_start) * distance,y:this.canvas.height / 2 + Math.sin(Math.PI * i * 2 / edges + rotation_start) * distance,radius:0}),
                stroke_1   = new Stroke(this,{context:this.context,point_1:point_1,point_2:point_2}),
                t_1        = new TimelineLite(),
                t_2        = new TimelineLite(),
                t_3        = new TimelineLite();

            t_1.to(point_1,time,{});
            t_1.to(point_1,0.1,{radius:4});
            t_1.to(point_1,duration/3-0.1,{radius:0,x:this.canvas.width / 2 + Math.cos(Math.PI * i * 2 / edges + rotation_end)   * distance,y:this.canvas.height / 2     + Math.sin(Math.PI * i * 2 / edges + rotation_end) * distance});
            t_1.to(point_1,duration*2/3,  {radius:0,x:this.canvas.width / 2 + Math.cos(Math.PI * i * 2 / edges + rotation_end)   * distance * 2,y:this.canvas.height / 2 + Math.sin(Math.PI * i * 2 / edges + rotation_end) * distance * 2});
            t_2.to(point_2,time + duration/3,  {});
            t_2.to(point_2,duration*2/3,  {radius:0,x:this.canvas.width / 2 + Math.cos(Math.PI * i * 2 / edges + rotation_start) * distance * 2,y:this.canvas.height / 2 + Math.sin(Math.PI * i * 2 / edges + rotation_start) * distance * 2});
            t_3.to(stroke_1,time + duration/3, {});
            t_3.to(stroke_1,duration*2/3, {alpha:0});

            this.elements.push(point_1);
            this.elements.push(stroke_1);
            this.timelines.push(t_1);
            this.timelines.push(t_2);
            this.timelines.push(t_3);
        }
    },

    start_circle: function(time,angle_start,radius,duration)
    {
        var circle_1 = new Circle(this,{context:this.context,x:this.canvas.width / 2,y:this.canvas.height / 2,radius:radius,angle_start:angle_start,angle_end:angle_start}),
            point_1  = new Point(this,{context:this.context,x:this.canvas.width / 2,y:this.canvas.height / 2,radius:0,rotation_distance:radius,rotation:0}),
            t_1      = new TimelineLite({}),
            t_2      = new TimelineLite({});

        t_1.to(point_1,time,{});
        t_1.to(point_1,0.1,{radius:4});
        t_1.to(circle_1,duration/3,{angle_end:angle_start+Math.PI*2});
        t_1.to(circle_1,duration*2/3,{alpha:0,radius:radius*2});
        t_2.to(point_1,time+0.1,{});
        t_2.to(point_1,duration/3,{rotation:angle_start+Math.PI*2,radius:0});

        this.elements.push(circle_1);
        this.elements.push(point_1);
        this.timelines.push(t_1);
        this.timelines.push(t_2);
    },

    start_animation_2: function(time)
    {
        var i              = 0,
            distance_start = 200,
            distance_end   = 160,
            destinations   = [
                {x:this.canvas.width / 2 + distance_end,y:this.canvas.height / 2},
                {x:this.canvas.width / 2 + distance_end/2,y:this.canvas.height / 2 + distance_end/4},
                {x:this.canvas.width / 2,y:this.canvas.height / 2 + distance_end/2},
                {x:this.canvas.width / 2 - distance_end/2,y:this.canvas.height / 2 + distance_end/4},
                {x:this.canvas.width / 2 - distance_end,y:this.canvas.height / 2},
                {x:this.canvas.width / 2 - distance_end/2,y:this.canvas.height / 2 - distance_end/4},
                {x:this.canvas.width / 2,y:this.canvas.height / 2 - distance_end/2},
                {x:this.canvas.width / 2 + distance_end/2,y:this.canvas.height / 2 - distance_end/4}
            ];

        for(i=0; i < 8; i++)
        {
            var point_1     = new Point(this,{context:this.context,x:this.canvas.width / 2 + Math.cos(Math.PI * i * 2 / 8) * distance_start,y:this.canvas.height / 2 + Math.sin(Math.PI * i * 2 / 8) * distance_start,radius:0,rotation:Math.PI * 2 * i / 8}),
                t_1         = new TimelineLite(),
                t_2         = new TimelineLite(),
                destination = destinations[i];

            destination.rotation = Math.PI * 3;

            t_1.to(point_1,time,{});
            t_1.to(point_1,1,{radius:4});
            t_1.to(point_1,4,destination);
            t_1.to(point_1,0.5,{x:this.canvas.width/2,y:this.canvas.height/2,ease:Cubic.easeIn,radius:0});

            t_2.to(point_1,time + 1,{});
            t_2.to(point_1,2,{rotation_distance:160});
            t_2.to(point_1,2,{rotation_distance:0});

            this.elements.push(point_1);
            this.timelines.push(t_1);
            this.timelines.push(t_2);
        }
    },

    start_animation_3: function(time)
    {
        var i = 20;

        //Main point
        var main_point = new Point(this,{context:this.context,x:this.canvas.width / 2,y:this.canvas.height / 2 + 50}),
            main_t     = new TimelineLite();

        main_t.to(main_point,time);
        main_t.to(main_point,Math.random() / 2);
        main_t.from(main_point,2,{radius:main_point.radius * 3,x:main_point.x - this.canvas.width - 30});
        main_t.to(main_point,3);
        main_t.to(main_point,1,{y:this.canvas.height / 2,ease:Cubic.easeInOut});
        main_t.to(main_point,0,{alpha:0});

        this.elements.push(main_point);
        this.timelines.push(main_t);

        while(i--)
        {
            //Points
            var point = new Point(this,{context:this.context,x:Math.random() * this.canvas.width,y:Math.random() * this.canvas.height / 2 + this.canvas.height / 4}),
                tp    = new TimelineLite(),
                rand  = Math.random(),
                gray  = Math.ceil(rand * 200);

            point.color       = 'rgba('+gray+','+gray+','+gray+',1)';
            point.glow_color  = 'rgba('+gray+','+gray+','+gray+',1)';
            point.glow_radius = rand * 10;
            point.radius      = rand * 15 + 5;

            tp.from(point,time + Math.random() / 2,{});
            tp.from(point,2,{radius:point.radius * 3,x:point.x - this.canvas.width - 60});
            tp.to(point,1);
            tp.to(point,2,{y:point.y - this.canvas.height,ease:Cubic.easeInOut});
            this.elements.push(point);
            this.timelines.push(tp);

            //Strokes
            var stroke = new Stroke(this,{context:this.context,point_1:main_point,point_2:point}),
                ts     = new TimelineLite();

            stroke.color = 'rgba('+gray+','+gray+','+gray+',1)';
            stroke.alpha = 0;

            ts.to(stroke,time + 2.5,{});
            ts.to(stroke,0.5,{alpha:Math.random() * 0.5 + 0.2});
            ts.to(stroke,Math.random()/2 + 1.5);
            ts.to(stroke,0,{alpha:0});

            this.elements.push(stroke);
            this.timelines.push(ts);
        }

        //Point 1
        var point_1 = new Point(this,{context:this.context,x:this.canvas.width / 2,y:this.canvas.height / 2,rotation_distance:0,rotation:-Math.PI / 2}),
            t_1     = new TimelineLite();

        point_1.alpha = 0;
        t_1.to(point_1,main_t.duration() - 0.1,{});
        t_1.to(point_1,0.1,{alpha:1});
        t_1.to(point_1,1,{rotation_distance:100,ease:Cubic.easeInOut,radius:0});
        t_1.to(point_1,0.2);
        t_1.to(point_1,1.2,{rotation:Math.PI / 2,ease:Cubic.easeIn});

        //Point 2
        var point_2 = new Point(this,{context:this.context,x:this.canvas.width / 2,y:this.canvas.height / 2,rotation_distance:0,rotation:Math.PI / 2}),
            t_2     = new TimelineLite();

        point_2.alpha = 0;
        t_2.to(point_2,main_t.duration() - 0.1,{});
        t_2.to(point_2,0.1,{alpha:1});
        t_2.to(point_2,1,{rotation_distance:100,ease:Cubic.easeInOut,radius:0});
        t_2.to(point_2,0.2);
        t_2.to(point_2,1.2,{rotation:Math.PI * 1.5,ease:Cubic.easeIn});

        //Stroke
        var join_stroke = new Stroke(this,{context:this.context,point_1:point_1,point_2:point_2});

        //Disk
        var disk_1 = new Disk(this,{context:this.context,x:this.canvas.width / 2,y:this.canvas.height / 2,radius:100,angle_start:- Math.PI / 2,angle_end:- Math.PI / 2}),
            t_3    = new TimelineLite();
        t_3.to(disk_1,t_2.duration(),{});
        t_3.to(disk_1,1,{angle_end:Math.PI / 2,ease:Cubic.easeOut});

        //Disk
        var disk_2 = new Disk(this,{context:this.context,x:this.canvas.width / 2,y:this.canvas.height / 2,radius:100,angle_start:Math.PI / 2,angle_end:Math.PI / 2}),
            t_4    = new TimelineLite();
        t_4.to(disk_2,t_2.duration(),{});
        t_4.to(disk_2,1,{angle_end:Math.PI * 1.5,ease:Cubic.easeOut});
        t_4.to(disk_2,0,{angle_end:Math.PI * 3.5});
        t_4.to(disk_2,1.2,{radius:500,ease:Cubic.easeInOut});

        //Disk
        var disk_3 = new Disk(this,{context:this.context,x:this.canvas.width / 2,y:this.canvas.height / 2,radius:0}),
            t_5    = new TimelineLite();

        disk_3.color = '#D7D1D6';
        t_5.to(disk_3,t_4.duration(),{});
        t_5.to(disk_3,1.2,{radius:500,ease:Cubic.easeInOut});

        this.elements.push(disk_3);
        this.elements.push(point_1);
        this.elements.push(point_2);
        this.elements.push(join_stroke);
        this.elements.push(disk_1);
        this.elements.push(disk_2);
        this.timelines.push(t_1);
        this.timelines.push(t_2);
        this.timelines.push(t_3);
        this.timelines.push(t_4);
        this.timelines.push(t_5);
    },

    clear: function()
    {
        this.context.save();
        this.context.fillStyle = '#D7D1D6';
        this.context.fillRect(0,0,this.canvas.width,this.canvas.height);
        this.context.restore();
    },

    set_time_scale: function(time_scale)
    {
        if(this.type(time_scale) === 'undefined')
            time_scale = this.time_scale;
        var i = this.timelines.length;
        while(i--)
            this.timelines[i].timeScale(time_scale);
    },

    show_inspiration: function()
    {
        var win = window.open('http://www.youtube.com/watch?v=VpZmIiIXuZ0','_blank');
        win.focus();
    },

    update: function()
    {
        stats.end();
        stats.begin();

        window.requestAnimationFrame(this.update.bind(this));

        this.progress = (this.timelines[0].time() / this.max_duration).toFixed(2);

        if(this.progress === 1 || this.progress === '1.00')
            this.seek(0);

        this.clear();

        var i = this.elements.length;
        while(i--)
            this.elements[i].draw();
    },

    pause: function()
    {
        var i = this.timelines.length;
        while(i--)
            this.timelines[i].pause();
    },

    play: function()
    {
        var i = this.timelines.length;
        while(i--)
        {
            if(this.timelines[i].reversed())
                this.timelines[i].play();
            else
                this.timelines[i].resume();
        }
    },

    restart: function()
    {
        var i = this.timelines.length;
        while(i--)
            this.timelines[i].restart();
    },

    reverse: function()
    {
        var i = this.timelines.length;
        while(i--)
            this.timelines[i].reverse();
    },

    seek: function(time)
    {
        var i = this.timelines.length;
        while(i--)
            this.timelines[i].seek(time);
    }
});