/**
 * rStats
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

/**
 * Set up
 */
var scene      = new THREE.Scene(),
    camera     = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 0.1, 100000 ),
    renderer   = new THREE.WebGLRenderer( { canvas : document.getElementById( 'canvas' ), alpha : true } ),
    mouse      = { x : 0, y : 0 },
    start_time = + new Date();

camera.position.z = 2;
renderer.setClearColor( 0x000000, 1 );

/**
 * Resize function
 */
var resize = function()
{
    // Resize renderer
    renderer.setSize( window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio );

    // Update camera
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
};

window.onresize = resize;
resize();

/**
 * Mouse function
 */
var mouse_move = function( e )
{
    mouse.x = e.clientX;
    mouse.y = e.clientY;
};
document.onmousemove = mouse_move;

/**
 * Star
 */
var star_object = new THREE.Object3D();
scene.add(star_object);

// Colors
var colors =
{
    current : [],
    red :
    [
        '#440000',
        '#ff6600',
        '#ffd236',
        '#ffe68f',
    ],
    blue :
    [
        '#001159',
        '#0072ff',
        '#00c7ff',
        '#90f6ff',
    ],
    green :
    [
        '#00361f',
        '#47ca00',
        '#78ff00',
        '#c7ff67',
    ]
};
colors.current = Object.create(colors.red);

// Uniforms (for sphere and halo)
var star_uniforms = {
    sphere_radius :
    {
        type  : 'f',
        value : 1
    },
    sphere_position :
    {
        type  : 'v3',
        value : new THREE.Vector3(0,0,0)
    },
    time :
    {
        type  : 'f',
        value : 0
    },
    time_multiplier :
    {
        type  : 'f',
        value : 0.0005
    },
    color_step_1 :
    {
        type  : 'c',
        value : new THREE.Color(colors.current[0])
    },
    color_step_2 :
    {
        type  : 'c',
        value : new THREE.Color(colors.current[1])
    },
    color_step_3 :
    {
        type  : 'c',
        value : new THREE.Color(colors.current[2])
    },
    color_step_4 :
    {
        type  : 'c',
        value : new THREE.Color(colors.current[3])
    },
    ratio_step_1 :
    {
        type  : 'f',
        value : 0.4
    },
    ratio_step_2 :
    {
        type  : 'f',
        value : 0.9
    },
    displacement :
    {
        type  : 'f',
        value : 0.03
    }
};

/**
 * Sphere
 */
var sphere_vertex_shader   = document.getElementById( 'shader-vertex-star-sphere' ).textContent,
    sphere_fragment_shader = document.getElementById( 'shader-fragment-star-sphere' ).textContent,
    sphere_geometry = new THREE.SphereGeometry( 1, 100, 100 ),
    sphere_material = new THREE.ShaderMaterial( {
        wireframe      : false,
        vertexShader   : sphere_vertex_shader,
        fragmentShader : sphere_fragment_shader,
        uniforms       : star_uniforms,
        transparent    : true
    } ),
    sphere_object = new THREE.Mesh( sphere_geometry, sphere_material );
// sphere_object.position.x += 0.2;

star_object.add( sphere_object );

/**
 * Halo
 */
var halo_vertex_shader   = document.getElementById( 'shader-vertex-star-halo' ).textContent,
    halo_fragment_shader = document.getElementById( 'shader-fragment-star-halo' ).textContent,
    halo_uniforms        = star_uniforms,
    halo_geometry = new THREE.PlaneBufferGeometry( 4, 4, 40, 40 ),
    halo_material = new THREE.ShaderMaterial( {
        vertexShader   : halo_vertex_shader,
        fragmentShader : halo_fragment_shader,
        uniforms       : star_uniforms,
        transparent    : true
    } ),
    // halo_material = new THREE.MeshBasicMaterial( { color : 0xff0000 } ),
    halo_object = new THREE.Mesh( halo_geometry, halo_material );

scene.add( halo_object );

/**
 * Presets
 */
function go_preset_red()
{
    colors.current = Object.create(colors.red);
    update_colors();
}

function go_preset_blue()
{
    colors.current = Object.create(colors.blue);
    update_colors();
}

function go_preset_green()
{
    colors.current = Object.create(colors.green);
    update_colors();
}

function update_colors()
{
    star_uniforms.color_step_1.value = new THREE.Color(colors.current[0]);
    star_uniforms.color_step_2.value = new THREE.Color(colors.current[1]);
    star_uniforms.color_step_3.value = new THREE.Color(colors.current[2]);
    star_uniforms.color_step_4.value = new THREE.Color(colors.current[3]);

    gui_manual_update = true;
    color_1.setValue(colors.current[0]);
    color_2.setValue(colors.current[1]);
    color_3.setValue(colors.current[2]);
    color_4.setValue(colors.current[3]);
    gui_manual_update = false;
}

/**
 * Dat GUI
 */
var gui         = new dat.GUI(),
    gui_params  = gui.addFolder('Params'),
    gui_presets = gui.addFolder('Presets'),
    gui_manual_update = false;

gui_params.open();
var color_1 = gui_params.addColor(colors.current,'0').name('color 1'),
    color_2 = gui_params.addColor(colors.current,'1').name('color 2'),
    color_3 = gui_params.addColor(colors.current,'2').name('color 3'),
    color_4 = gui_params.addColor(colors.current,'3').name('color 4');
gui_params.add(star_uniforms.ratio_step_1,'value').min(0).max(1).step(0.01).name('step 1');
gui_params.add(star_uniforms.ratio_step_2,'value').min(0).max(1).step(0.01).name('step 2');
gui_params.add(star_uniforms.displacement,'value').min(0).max(1).step(0.0001).name('displacement');
gui_params.add(star_uniforms.time_multiplier,'value').min(0).max(0.01).step(0.00001).name('time multiplier');

color_1.onChange(function(value)
{
    if(gui_manual_update)
        return;
    colors.current[0] = value;
    update_colors();
});

color_2.onChange(function(value)
{
    if(gui_manual_update)
        return;
    colors.current[1] = value;
    update_colors();
});

color_3.onChange(function(value)
{
    if(gui_manual_update)
        return;
    colors.current[2] = value;
    update_colors();
});

color_4.onChange(function(value)
{
    if(gui_manual_update)
        return;
    colors.current[3] = value;
    update_colors();
});

gui_presets.open();
gui_presets.add(window,'go_preset_red').name('red');
gui_presets.add(window,'go_preset_blue').name('blue');
gui_presets.add(window,'go_preset_green').name('green');

/**
 * Frame function
 */
var frame = function()
{
    window.requestAnimationFrame( frame );

    // Stats
    rS('raf').tick();
    rS('fps').frame();
    rS().update();

    // Update camera
    camera.position.x = (mouse.x / window.innerWidth - 0.5) * 10;
    camera.position.y = - (mouse.y / window.innerHeight - 0.5) * 10;
    camera.lookAt( new THREE.Vector3() );

    // Update sphere
    star_uniforms.time.value = + new Date() - start_time;

    // Update halo
    halo_object.lookAt(camera.position);

    // Render
    renderer.render( scene, camera );
};
frame();


