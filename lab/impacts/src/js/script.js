
/* OPTIONS */
var options = {
    model         : 'bricks',
    camera_fov    : 85,
    dirt_pass     : false,
    dirt_opacity  : 1,
    bloom_pass    : true,
    bloom_amount  : 10,
    bloom_opacity : 1
};

var hash = window.location.hash;
if(window.location.hash !== '')
{
    hash = hash.substr(1,hash.length);
    hash = JSON.parse(hash);
    var hash_keys = Object.keys(hash);

    for(var i = 0; i < hash_keys.length; i++)
    {
        var key = hash_keys[i];

        if(typeof options[key] !== 'undefined')
            options[key] = hash[key];
    }

    if(hash.model)
        options.model = hash.model;
}

/* GUI */
var gui         = new dat.GUI(),
    controllers = {},
    misc        = gui.addFolder('Misc'),
    shaders     = gui.addFolder('Shaders');

misc.open();
controllers.model      = misc.add(options,'model',{sphere:'sphere',bricks:'bricks',fence:'fence',floor:'floor'});
controllers.camera_fov = misc.add(options,'camera_fov',20,180).step(1).name('camera fov');


shaders.open();
controllers.dirt_pass     = shaders.add(options,'dirt_pass').name('dirt pass');
controllers.dirt_opacity  = shaders.add(options,'dirt_opacity',0,1).step(0.01).name('dirt opacity');
controllers.bloom_pass    = shaders.add(options,'bloom_pass').name('bloom pass');
controllers.bloom_amount  = shaders.add(options,'bloom_amount',0,100).step(1).name('bloom amount');
controllers.bloom_opacity = shaders.add(options,'bloom_opacity',0,1).step(0.01).name('bloom opacity');

// Hash
var folders_keys   = Object.keys(gui.__folders),
    gui_any_change = function()
    {
        window.location.hash = JSON.stringify(options);
    };

for(var i = 0; i < folders_keys.length; i++)
{
    var folder = gui.__folders[folders_keys[i]];
    for(var j = 0; j < folder.__controllers.length; j++)
    {
        var controller = folder.__controllers[j];
        controller.onChange(gui_any_change);
    }
}

// Events
controllers.model.onChange(function(value)
{
    load();
    gui_any_change();
});

controllers.camera_fov.onChange(function(value)
{
    camera.fov = value;
    camera.updateProjectionMatrix();
    gui_any_change();
});

controllers.bloom_amount.onChange(function(value)
{
    bloom_pass.params.blurAmount = value;
    gui_any_change();
});

controllers.bloom_opacity.onChange(function(value)
{
    bloom_pass.blendPass.params.opacity = value;
    gui_any_change();
});

/**
 * STATS
 */
var rS = new rStats({
    CSSPath : 'src/css/',
    values  :
    {
        raf :
        {
            caption : 'RAF (ms)',
            over    : 25,
            average : true
        },
        fps :
        {
            caption : 'Framerate (FPS)',
            below   : 50,
            average : true
        }
    }
});

/* SCENE */
var scene  = new THREE.Scene(),
    camera = new THREE.PerspectiveCamera(options.camera_fov,window.innerWidth/window.innerHeight,0.0001,1000),
    center = new THREE.Vector3(0,0.4,0);

camera.position.y = 0.2;
camera.position.z = 0.5;

/* WAGNER */
WAGNER.vertexShadersPath   = 'src/js/libs/Wagner/vertex-shaders';
WAGNER.fragmentShadersPath = 'src/js/libs/Wagner/fragment-shaders';
WAGNER.assetsPath          = 'src/js/libs/Wagner/assets/';

/* RENDER */
var canvas     = document.getElementById('three-canvas'),
    renderer   = new THREE.WebGLRenderer({canvas:canvas,alpha:true}),
    composer   = new WAGNER.Composer( renderer, { useRGBA: false } ),
    bloom_pass = new WAGNER.MultiPassBloomPass(),
    dirt_pass  = new WAGNER.DirtPass();

bloom_pass.blendPass.params.opacity = options.bloom_opacity;
bloom_pass.params.blurAmount        = options.bloom_amount;

// dirt_pass.dirtTexture = THREE.ImageUtils.loadTexture(WAGNER.assetsPath + '/textures/lensdirt2.jpg');

composer.setSize(window.innerWidth,window.innerHeight);

renderer.setClearColor(0x000000,0);
renderer.setSize(window.innerWidth,window.innerHeight);

/* DEMO */
var manager    = new THREE.LoadingManager(),
    loader     = new THREE.OBJLoader(manager),
    elements   = ['floor','wall','object'],
    containers = new THREE.Object3D();

manager.onProgress = function(e)
{
    loaded++;

    if(loaded === to_load)
    {
        scene.add(containers);
        start();
    }
};

function load()
{
    loaded  = 0;
    to_load = elements.length;

    // Center
    switch(options.model)
    {
        case 'sphere':
            center.y = 0.4;
            break;
        case 'bricks':
            center.y = 1;
            break;
        case 'fence':
            center.y = 0.4;
            break;
        case 'floor':
            center.y = 0.4;
            break;
    }

    // Camera
    camera.position.x = 0;
    camera.position.y = 0.2;

    // Empty current container
    while(containers.children.length)
        containers.remove(containers.children[0]);
    scene.remove(containers);

    // Each model
    for(i = 0; i < to_load; i++)
    {
        // Scope
        (function(element)
        {
            var container = new THREE.Object3D(),
                material  = new THREE.MeshLambertMaterial({
                    map : THREE.ImageUtils.loadTexture('src/exports/' + options.model + '/' + element + '.jpg')
                });

            material.emissive = new THREE.Color(0xffffff);

            // Rotate container
            container.rotation.y = - Math.PI / 2;

            loader.load('src/exports/' + options.model + '/' + element + '.obj',function(object)
            {
                object.traverse(function(child)
                {
                    if(child instanceof THREE.Mesh)
                    {
                        child.scale.set(0.02,0.02,0.02);
                        child.material = material;
                        child.geometry.needsUpdate = true;
                        container.add(child);
                    }
                });
            });

            containers.add(container);
        })(elements[i]);
    }
}
load();

/* START */
var starting   = true,
    start_time = + (new Date()),
    progress   = 0,
    duration   = 6000;

function start()
{
    starting   = true;
    start_time = + (new Date());
    progress   = 0;
    duration   = 6000;
}

/* RESIZE */
var win = {width:window.innerWidth,height:window.innerHeight};
window.onresize = function()
{
    win.width  = window.innerWidth;
    win.height = window.innerHeight;

    canvas.width  = win.width;
    canvas.height = win.height;
    camera.aspect = win.width / win.height;
    camera.updateProjectionMatrix();
    renderer.setSize(win.width,win.height);
};

/* MOUSE MOVE */
var mouse = {x:0,y:0,ratio:{x:0,y:0}};
window.onmousemove = function(e)
{
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    mouse.ratio.x = mouse.x / win.width;
    mouse.ratio.y = mouse.y / win.height;
};

/* MOUSE WHEEL */
var distance = 1.4;
var mouse_wheel_handler = function(e)
{
    e.preventDefault();

    var delta = e.wheelDeltaY || e.wheelDelta || - e.detail;

    distance += - delta / 200;

    if(distance < 0.6)
        distance = 0.6;
    else if(distance > 4)
        distance = 4;

    return false;
};
document.addEventListener('mousewheel',mouse_wheel_handler,false);
document.addEventListener('DOMMouseScroll',mouse_wheel_handler,false);

/* FRAMES */
function loop()
{
    window.requestAnimationFrame(loop);

    // Stats
    rS('raf').tick();
    rS('fps').frame();
    rS().update();

    // Start animation
    if(starting)
    {
        var time    = + (new Date()) - start_time,
            elapsed = duration - time,
            ease    = Easie.quintInOut(elapsed,0,1,duration);

        options.camera_fov = 100 + (ease * 80);
        camera.position.z  = 1.4 + ease * 3;
        camera.fov         = options.camera_fov;
        camera.updateProjectionMatrix();

        controllers.camera_fov.updateDisplay();

        if(elapsed <= 0)
        {
            options.camera_fov = Math.round(options.camera_fov);
            starting = false;
        }
    }

    // Camera
    if(!starting)
    {
        camera.position.x += (Math.sin(mouse.ratio.x * 4.6 - 2.3) * distance - camera.position.x) / 10;
        camera.position.z += (Math.cos(mouse.ratio.x * 4.6 - 2.3) * distance - camera.position.z) / 10;
        camera.position.y += (center.y / 2 - (mouse.ratio.y - 1) * distance - camera.position.y) / 10;
    }
    camera.lookAt(center);

    // Render
    // renderer.render(scene,camera);

    composer.reset();
    composer.render(scene,camera);

    if(options.bloom_pass)
        composer.pass(bloom_pass);

    if(options.dirt_pass)
        composer.pass(dirt_pass);

    composer.toScreen();
}

loop();
