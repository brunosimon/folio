function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}


var conf =
    {
        width     : 100,
        height    : 100,
        frequency : 1/100,
        random    : false
    };

/*
 * CREATE PERLIN NOISE
 */
var perlin = {};

function create_perlin_noise()
{
    // Canvas
    perlin.canvas        = document.createElement('canvas');
    perlin.canvas.width  = conf.width;
    perlin.canvas.height = conf.height;

    document.body.appendChild(perlin.canvas);

    // Context
    perlin.context = perlin.canvas.getContext('2d');

    // Image data
    perlin.image = perlin.context.createImageData(conf.width,conf.height);

    // Noise
    var value = null,
        pixel = 0,
        x     = 0,
        y     = 0,
        z     = conf.random ? Math.round(Math.random() * 1000) : 0;

    for(x = 0; x < conf.width; x++)
    {
        for(y = 0; y < conf.height; y++)
        {
            value = noise(x * conf.frequency,y * conf.frequency,z);

            perlin.image.data[pixel++] = Math.round(value * 255);
            perlin.image.data[pixel++] = Math.round(value * 255);
            perlin.image.data[pixel++] = Math.round(value * 255);
            perlin.image.data[pixel++] = 255;
        }
    }

    // Draw
    perlin.context.putImageData(perlin.image,0,0);
};

create_perlin_noise();

/**
 * CREATE EDGES DETECTION
 */
var edges = {};

function create_edges_detection()
{
    // Canvas
    edges.canvas        = document.createElement('canvas');
    edges.canvas.width  = conf.width;
    edges.canvas.height = conf.height;

    document.body.appendChild(edges.canvas);

    // Context
    edges.context = edges.canvas.getContext('2d');

    // Image data
    edges.image = edges.context.createImageData(conf.width,conf.height);

    // Pixels
    edges.pixels = [];

    var value_1 = 0,
        value_2 = 0,
        value_3 = 0,
        step    = 0.1,
        x       = null,
        y       = null,
        i       = null;

    for(x = 0; x < conf.width; x++)
    {
        for(y = 0; y < conf.height; y++)
        {
            i = (conf.width * y + x) * 4;

            // Test if in range
            if(
                (i + 4) % (conf.width * 4) !== 0 &&
                perlin.image.data[i + conf.width * 4] < conf.width * conf.height * 4
            )
            {
                value_1 = perlin.image.data[i    ] / 255;
                value_2 = perlin.image.data[i + 4] / 255;
                value_3 = perlin.image.data[i + conf.width * 4] / 255;

                // Compare to right and bottom pixels
                if(
                    value_1 >  step && value_2 <= step ||
                    value_1 <= step && value_2 >  step ||
                    value_1 >  step && value_3 <= step ||
                    value_1 <= step && value_3 >  step
                )
                {
                    edges.pixels.push(x + '-' + y);
                    edges.image.data[i    ] = 255;
                    edges.image.data[i + 1] = 255;
                    edges.image.data[i + 2] = 255;
                    edges.image.data[i + 3] = 255;
                }
                else
                {
                    edges.image.data[i    ] = 0;
                    edges.image.data[i + 1] = 0;
                    edges.image.data[i + 2] = 0;
                    edges.image.data[i + 3] = 255;
                }
            }
        }
    }

    // Draw
    edges.context.putImageData(edges.image,0,0);

    // Get lines
    edges.lines = [];
    edges.context.fillStyle = 'rgb(255,0,0)';

    var value    = null,
        line_end = null,
        line     = null,
        index    = null;

    while(edges.pixels.length)
    {
        value    = edges.pixels[0].split('-');
        value[0] = ~~value[0];
        value[1] = ~~value[1];
        line_end = false;
        edges.pixels.splice(0,1);

        line = [];
        line.push(value);

        while(!line_end)
        {
            // Top
            index = edges.pixels.indexOf((value[0]) + '-' + (value[1] - 1));
            if(index === -1)
            {
                // Top Right
                index = edges.pixels.indexOf((value[0] + 1) + '-' + (value[1] + 1));
                if(index === -1)
                {
                    // Right
                    index = edges.pixels.indexOf((value[0] + 1) + '-' + (value[1]));
                    if(index === -1)
                    {
                        // Right Bottom
                        index = edges.pixels.indexOf((value[0] + 1) + '-' + (value[1] + 1));
                        if(index === -1)
                        {
                            // Bottom
                            index = edges.pixels.indexOf((value[0]) + '-' + (value[1] + 1));
                            if(index === -1)
                            {
                                // Bottom Left
                                index = edges.pixels.indexOf((value[0] - 1) + '-' + (value[1] + 1));
                                if(index === -1)
                                {
                                    // Left
                                    index = edges.pixels.indexOf((value[0] - 1) + '-' + (value[1]));
                                    if(index === -1)
                                    {
                                        index = edges.pixels.indexOf((value[0] - 1) + '-' + (value[1] - 1));
                                    }
                                }
                            }
                        }
                    }
                }
            }

            if(index !== -1)
            {
                value    = edges.pixels[index].split('-');
                value[0] = ~~value[0];
                value[1] = ~~value[1];

                line.push(value);
                edges.pixels.splice(index,1);
                edges.context.fillRect(value[0],value[1],1,1);
            }
            else
            {
                line_end = true;
            }
        }

        edges.lines.push(line);
    }
};

create_edges_detection();
