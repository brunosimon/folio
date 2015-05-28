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

/**
 * Sphere
 */
var sphere_vertex_shader   = document.getElementById( 'shader-vertex-star-sphere' ).textContent,
    sphere_fragment_shader = document.getElementById( 'shader-fragment-star-sphere' ).textContent,
    sphere_uniforms        = {
        time :
        {
            type  : 'f',
            value : 0
        },
        global_speed :
        {
            type  : 'f',
            value : 0.0003
        },
        color_step_1 :
        {
            type  : 'c',
            value : new THREE.Color( 0x440000 )
            // value : new THREE.Color( 0x001159 )
        },
        color_step_2 :
        {
            type  : 'c',
            value : new THREE.Color( 0xff6600 )
            // value : new THREE.Color( 0x0072ff )
        },
        color_step_3 :
        {
            type  : 'c',
            value : new THREE.Color( 0xffd236 )
            // value : new THREE.Color( 0x00c7ff )
        },
        color_step_4 :
        {
            type  : 'c',
            value : new THREE.Color( 0xffe68f )
            // value : new THREE.Color( 0x90f6ff )
        },
        ratio_step_1 :
        {
            type  : 'f',
            value : 0.4
        },
        ratio_step_2 :
        {
            type  : 'f',
            value : 0.999
        },
        displacement :
        {
            type  : 'f',
            value : 0.03
        }
    },
    sphere_geometry = new THREE.SphereGeometry( 1, 100, 100 ),
    sphere_material = new THREE.ShaderMaterial( {
        wireframe      : false,
        vertexShader   : sphere_vertex_shader,
        fragmentShader : sphere_fragment_shader,
        uniforms       : sphere_uniforms,
        transparent    : true
    } ),
    sphere_object = new THREE.Mesh( sphere_geometry, sphere_material );

star_object.add( sphere_object );

// /**
//  * Halo
//  */
// var halo_vertex_shader   = document.getElementById( 'shader-vertex-star-halo' ).textContent,
//     halo_fragment_shader = document.getElementById( 'shader-fragment-star-halo' ).textContent,
//     halo_uniforms        = {
//         time :
//         {
//             type  : 'f',
//             value : 0
//         }
//     },
//     halo_geometry = new THREE.PlaneBufferGeometry( 3, 3, 1, 1 ),
//     halo_material = new THREE.ShaderMaterial( {
//         vertexShader   : halo_vertex_shader,
//         fragmentShader : halo_fragment_shader,
//         uniforms       : sphere_uniforms,
//         transparent    : true
//     } ),
//     // halo_material = new THREE.MeshBasicMaterial( { color : 0xff0000 } ),
//     halo_object = new THREE.Mesh( halo_geometry, halo_material );

// scene.add( halo_object );





/**
 * Frame function
 */
var frame = function()
{
    window.requestAnimationFrame( frame );

    // Update camera
    camera.position.x = (mouse.x / window.innerWidth - 0.5) * 10;
    camera.position.y = - (mouse.y / window.innerHeight - 0.5) * 10;
    camera.lookAt( new THREE.Vector3() );

    // Update sphere
    sphere_uniforms.time.value = + new Date() - start_time;

    // // Update halo
    // halo_object.lookAt(camera.position);

    // Render
    renderer.render( scene, camera );
};
frame();


