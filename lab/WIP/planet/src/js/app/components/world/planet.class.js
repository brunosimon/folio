/**
 * UTILS
 */
var maxDetail = 512; // 512
var planet_scalar_field = function(x, y, z) {
    var resolution1 = 4;
    var resolution2 = 16;
    var resolution3 = 64;
    var resolutionMax = maxDetail;

    var coordFloat = new THREE.Vector3();

    var random_scalar_field = function(x, y, z) {
        return random4( x, y, z );
    }

    var helper = function(x, y, z, scalar_field, resolution, interpolationMethod)
    {
        // Because the sphere sample function gives normalized coordinates:
        x = (x+1)/2*resolution;
        y = (y+1)/2*resolution;
        z = (z+1)/2*resolution;

        coordFloat.set(x, y, z);
        var interpolated = interpolationMethod(coordFloat, scalar_field);
        return interpolated*2 - 1; // Gives values (-1, 1)
    }

    var level1 = helper(x, y, z, random_scalar_field, resolution1, tricosineInterpolation);
    var level2 = helper(x, y, z, random_scalar_field, resolution2, tricosineInterpolation);
    var level3 = helper(x, y, z, random_scalar_field, resolution3, tricosineInterpolation);
    var levelMax = helper(x, y, z, random_scalar_field, resolutionMax, nearestNeighbour);

    var c = 0.5;
    c *= 1 + level1*0.75;
    c *= 1 + level2*0.25;
    c *= 1 + level3*0.075;
    c *= 1 + levelMax*(1/25);

    if (c < 0.5) c *= 0.9;

    c = Math.max(Math.min(c, 1), 0);

    return new THREE.Color().setRGB(c, c, c);
};

var nearestNeighbour = function(coordFloat, scalar_field) {
    return scalar_field(Math.floor(coordFloat.x), Math.floor(coordFloat.y), Math.floor(coordFloat.z));
}

var tricosineInterpolation = function(coordFloat, scalar_field) {
    var interpolation = function(a, b, x) {
        var ft = x * 3.1415927;
        var f = (1 - Math.cos(ft)) * 0.5;
        return  a*(1-f) + b*f
    }

    return trilinearInterpolation(coordFloat, scalar_field, interpolation);
}

var trilinearInterpolation = function(coordFloat, scalar_field, interpolation) {
    interpolation = interpolation || function(a, b, x) {
        return  a*(1-x) + b*x;
    }

    var coord0 = {x: Math.floor(coordFloat.x), y: Math.floor(coordFloat.y), z: Math.floor(coordFloat.z)};
    var coord1 = {x: coord0.x+1, y: coord0.y+1, z: coord0.z+1};
    var xd = (coordFloat.x - coord0.x)/Math.max(1, (coord1.x-coord0.x));
    var yd = (coordFloat.y - coord0.y)/Math.max(1, (coord1.y-coord0.y));
    var zd = (coordFloat.z - coord0.z)/Math.max(1, (coord1.z-coord0.z));
    var c00 = interpolation(scalar_field(coord0.x, coord0.y, coord0.z), scalar_field(coord1.x, coord0.y, coord0.z), xd);
    var c10 = interpolation(scalar_field(coord0.x, coord1.y, coord0.z), scalar_field(coord1.x, coord1.y, coord0.z), xd);
    var c01 = interpolation(scalar_field(coord0.x, coord0.y, coord1.z), scalar_field(coord1.x, coord0.y, coord1.z), xd);
    var c11 = interpolation(scalar_field(coord0.x, coord1.y, coord1.z), scalar_field(coord1.x, coord1.y, coord1.z), xd);
    var c0 = interpolation(c00, c10, yd);
    var c1 = interpolation(c01, c11, yd);
    var c = interpolation(c0, c1, zd);

    return c;
}

var makeSpecifiedArray1D = function(size, value, array) {
    var valueFloat = value;
    for (var x = 0; x < size; x++) {
        if (typeof(value) == "function") valueFloat = value(x);
        array[x] = valueFloat;
    }
    return array;
};

/**
 * RANDOM
 */
var randomInt = function( from, to, seed )
{
    return Math.floor( randomFloat( from, to + 1, seed ) );
};

var randomFloat = function( from, to, seed )
{
    return random( seed ) * ( to - from ) + from;
};

var random = function( seed )
{
    var scope = arguments.callee;

    scope.MAX = scope.MAX || Math.pow( 2, 32 );
    scope.a   = 1664525;
    scope.c   = 1013904223;

    scope.seeds = scope.seeds || {};

    seed = seed || 0;

    var key = seed;

    if( typeof seed === 'string' )
    {
        if( typeof scope.seeds[seed] === 'undefined' )
        {
            var numeric = numberFromString( seed );
            scope.seeds[ seed ] = numeric; // Memoization
            seed = numeric;
        }
        else
        {
            seed = scope.seeds[ seed ];
        }
    }
    scope.series = scope.series || {};
    scope.series[ key ] = scope.series[ key ] || seed;

    var lastRandom = scope.series[ key ],
        newRandom  = ( scope.a * lastRandom + scope.c ) % scope.MAX;

    scope.series[ key ] = newRandom;

    return newRandom/scope.MAX;
};

var random4 = function( i, j, k )
{
    return G[ ( i + P[ ( j + P[ k % N ] ) % N ] ) % N ];
};

// console.log(randomInt(0,10,'test'));


/**
 * Sphere Map
 */
var create_map = function( index, scalar_field, resolution )
{
    var map = THREE.ImageUtils.generateDataTexture( resolution, resolution, new THREE.Color( 0x000000 ));
    add_scalar_field( map, index, scalar_field );
    map.needsUpdate = true;

    return map;
}

var add_scalar_field = function( map, index, scalar_field )
{
    var width         = map.image.width,
        height        = map.image.height,
        pixels_length = width * height;

    for( var i = 0; i < pixels_length; i++ )
    {
        var x      = i % width,
            y      = Math.floor( i / width ),
            coords = get_spherical_coords( index, x, y, width );

        var color = scalar_field( coords.x, coords.y, coords.z );

        map.image.data[ i * 3 ]     = color.r * 255;
        map.image.data[ i * 3 + 1 ] = color.g * 255;
        map.image.data[ i * 3 + 2 ] = color.b * 255;
    }
}

var get_spherical_coords = function( index, x, y, width )
{
    width *= 0.5;
    x     -= width;
    y     -= width;

    var coord = new THREE.Vector3();

    switch( index )
    {
        case 0 :
            coord.x = width;
            coord.y = - y;
            coord.z = - x;
            break;

        case 1 :
            coord.x = - width;
            coord.y = - y;
            coord.z = x;
            break;

        case 2 :
            coord.x = x;
            coord.y = width;
            coord.z = y;
            break;

        case 3 :
            coord.x = x;
            coord.y = - width;
            coord.z = - y;
            break;

        case 4 :
            coord.x = x;
            coord.y = - y;
            coord.z = width;
            break;

        case 5 :
            coord.x = - x;
            coord.y = - y;
            coord.z = - width;
            break;
    }

    coord.normalize();

    return coord;
}


window.N = 256 * 256;
window.G = makeSpecifiedArray1D( N, Math.random, new Float32Array( N ) );
window.P = makeSpecifiedArray1D( N, function() { return randomInt( 0, N - 1 ) }, new Uint32Array( N ));

(function()
{
    'use strict';

    APP.COMPONENTS.WORLD.Planet = APP.CORE.Event_Emitter.extend(
    {
        options :
        {

        },

        /**
         * INIT
         */
        init: function( options )
        {
            this._super( options );

            this.scene = this.options.scene;

            // Geometry
            var geometry = new THREE.BoxGeometry( 1, 1, 1, 20, 20, 20 );

            // Normalize vertices (get sphetic geometry)
            for( var i = 0, len = geometry.vertices.length; i < len; i++ )
                geometry.vertices[ i ].normalize().multiplyScalar( 2 );

            // Material
            var material_array = [];
            for( var j = 0; j < 6; j++ )
            {
                var face_material = new THREE.MeshPhongMaterial();
                face_material.map = create_map( j , planet_scalar_field, 128 );
                material_array.push( face_material );
            }

            var sphere_material = new THREE.MeshFaceMaterial( material_array );
            // var sphere_material = new THREE.MeshNormalMaterial();


            // Mesh
            var mesh     = new THREE.Mesh( geometry, sphere_material );
            this.scene.add( mesh );
        }
    });
})();


