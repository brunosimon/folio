/**
 * Set up
 */
var scene      = new THREE.Scene(),
    camera     = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 0.1, 100000 ),
    renderer   = new THREE.WebGLRenderer( { canvas : document.getElementById( 'canvas' ), alpha : true } ),
    mouse      = { x : 0, y : 0 },
    start_time = + new Date();

camera.position.z = 3;
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
 * Texture
 */
var texture = THREE.ImageUtils.loadTextureCube( [
    'src/img/1/px.jpg',
    'src/img/1/nx.jpg',
    'src/img/1/py.jpg',
    'src/img/1/ny.jpg',
    'src/img/1/pz.jpg',
    'src/img/1/nz.jpg'
]/*, undefined, function( texture )
{
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearFilter;
}*/ );

/**
 * Shader
 */
var vertex_shader   = document.getElementById( 'shader-vertex-1' ).textContent,
    fragment_shader = document.getElementById( 'shader-fragment-1' ).textContent,
    uniforms        = {
        time :
        {
            type  : 'f',
            value : 0
        },
        texCube :
        {
            type  : 't',
            value : texture
        }
    },
    attributes = {
        new_color :
        {
            type  : 'c',
            value : []
        }
    };

/**
 * Frame function
 */
var frame = function()
{
    window.requestAnimationFrame( frame );

    // Update uniforms
    uniforms.time.value = + new Date() - start_time;

    // Update camera
    camera.position.x = (mouse.x / window.innerWidth - 0.5) * 10;
    camera.position.y = - (mouse.y / window.innerHeight - 0.5) * 10;
    camera.lookAt( new THREE.Vector3() );

    // Render
    renderer.render( scene, camera );
};
frame();

/**
 * Create scene function
 */
// var object_geometry = new THREE.BoxGeometry( 1, 1, 1, 48, 48, 48 ),
var object_geometry = new THREE.SphereGeometry( 1, 100, 100 ),
    object_material = new THREE.ShaderMaterial( {
        wireframe      : false,
        vertexShader   : vertex_shader,
        fragmentShader : fragment_shader,
        transparent    : true,
        uniforms       : uniforms,
        attributes     : attributes,
        // shading        : THREE.FlatShading
    } ),
    object = new THREE.Mesh( object_geometry, object_material );

scene.add( object );

/**
 * Update shaders
 */
for( var i = 0; i < object_geometry.vertices.length; i++ )
{
    var color = new THREE.Color();
    color.r = Math.random();
    color.g = Math.random();
    color.b = Math.random();

    attributes.new_color.value.push( color );
}




