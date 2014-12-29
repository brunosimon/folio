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
        init : function( options )
        {
            var that = this;

            this._super( options );

            this.scene     = this.options.scene;
            this.sun_light = this.options.sun_light;
            this.renderer  = this.options.renderer;
            this.camera    = this.options.camera;
            this.ticker    = new APP.TOOLS.Ticker();

            // Geometry
            this.geometry = this.generate_geometry();

            // Material
            this.material = this.generate_material();

            // Mesh
            this.mesh = new THREE.Mesh( this.geometry, this.material );
            this.scene.add( this.mesh );

            // Sky
            this.generate_sky();

            this.ticker.on( 'tick', function()
            {
                that.frame();
            } );
        },

        /**
         * GENERATE SKY
         */
        generate_sky: function()
        {
            this.sky = {};

            var atmosphere =
            {
                Kr   : 0.0025,
                Km   : 0.0010,
                ESun : 20.0,
                g    : - 0.950,
                innerRadius   : 2.07,
                outerRadius   : 3.09,
                wavelength    : [ 0.550, 0.600, 0.500 ],
                // wavelength    : [ 0.350, 0.500, 0.500 ],
                scaleDepth    : 0.15,
                // mieScaleDepth : 0.1
            };

            console.log(1 / Math.pow( atmosphere.wavelength[ 0 ], 4 ));
            console.log(1 / Math.pow( atmosphere.wavelength[ 1 ], 4 ));
            console.log(1 / Math.pow( atmosphere.wavelength[ 2 ], 4 ));

            var camera_length = this.camera.position.length() * 2;

            this.sky.uniforms =
            {
              v3LightPosition: {
                type: 'v3',
                // value: new THREE.Vector3(1e8, 0, 1e8).normalize()
                value: new THREE.Vector3().copy( this.sun_light.position ).normalize()
              },
              v3InvWavelength: {
                type: 'v3',
                value: new THREE.Vector3( 1 / Math.pow( atmosphere.wavelength[ 0 ], 4 ), 1 / Math.pow( atmosphere.wavelength[ 1 ], 4 ), 1 / Math.pow( atmosphere.wavelength[ 2 ], 4 ) )
              },
              fCameraHeight: {
                type: 'f',
                value: camera_length
              },
              fCameraHeight2: {
                type: 'f',
                value: camera_length * camera_length
              },
              fInnerRadius: {
                type: 'f',
                value: atmosphere.innerRadius
              },
              fInnerRadius2: {
                type: 'f',
                value: atmosphere.innerRadius * atmosphere.innerRadius
              },
              fOuterRadius: {
                type: 'f',
                value: atmosphere.outerRadius
              },
              fOuterRadius2: {
                type: 'f',
                value: atmosphere.outerRadius * atmosphere.outerRadius
              },
              fKrESun: {
                type: 'f',
                value: atmosphere.Kr * atmosphere.ESun
              },
              fKmESun: {
                type: 'f',
                value: atmosphere.Km * atmosphere.ESun
              },
              fKr4PI: {
                type: 'f',
                value: atmosphere.Kr * 4.0 * Math.PI
              },
              fKm4PI: {
                type: 'f',
                value: atmosphere.Km * 4.0 * Math.PI
              },
              fScale: {
                type: 'f',
                value: 1 / (atmosphere.outerRadius - atmosphere.innerRadius)
              },
              fScaleDepth: {
                type: 'f',
                value: atmosphere.scaleDepth
              },
              fScaleOverScaleDepth: {
                type: 'f',
                value: 1 / ( atmosphere.outerRadius - atmosphere.innerRadius ) / atmosphere.scaleDepth
              },
              g: {
                type: 'f',
                value: atmosphere.g
              },
              g2: {
                type: 'f',
                value: atmosphere.g * atmosphere.g
              },
              nSamples: {
                type: 'i',
                value: 3
              },
              fSamples: {
                type: 'f',
                value: 3.0
              },
              // tDiffuse: {
              //   type: 't',
              //   value: diffuse
              // },
              // tDiffuseNight: {
              //   type: 't',
              //   value: diffuseNight
              // },
              tDisplacement: {
                type: 't',
                value: 0
              },
              tSkyboxDiffuse: {
                type: 't',
                value: 0
              },
              fNightScale: {
                type: 'f',
                value: 1
              }
            };

            this.sky.geometry = new THREE.SphereGeometry( atmosphere.innerRadius, 256, 256 );
            this.sky.material = new THREE.ShaderMaterial( {
                uniforms       : this.sky.uniforms,
                vertexShader   : document.getElementById( 'sky-vertex-shader' ).innerText,
                fragmentShader : document.getElementById( 'sky-fragment-shader' ).innerText
            } );

            this.sky.mesh = new THREE.Mesh( this.sky.geometry, this.sky.material );

            this.sky.material.side        = THREE.BackSide;
            this.sky.material.transparent = true;
            this.sky.material.blending    = THREE.AdditiveBlending;

            this.scene.add( this.sky.mesh );
        },

        /**
         * GENERATE GEOMETRY
         */
        generate_geometry: function()
        {
            var geometry = new THREE.BoxGeometry( 1, 1, 1, 64, 64, 64 ),
                i        = 0,
                len      = 0;

            // Normalize vertices (get sphetic geometry)
            for( i = 0, len = geometry.vertices.length; i < len; i++ )
                geometry.vertices[ i ].normalize().multiplyScalar( 2 );

            // Compute geometry
            geometry.computeVertexNormals();
            geometry.computeFaceNormals();
            geometry.computeMorphNormals();
            geometry.computeBoundingSphere();
            geometry.computeBoundingBox();
            geometry.computeLineDistances();

            geometry.verticesNeedUpdate      = true;
            geometry.elementsNeedUpdate      = true;
            geometry.uvsNeedUpdate           = true;
            geometry.normalsNeedUpdate       = true;
            geometry.tangentsNeedUpdate      = true;
            geometry.colorsNeedUpdate        = true;
            geometry.lineDistancesNeedUpdate = true;
            geometry.buffersNeedUpdate       = true;
            geometry.groupsNeedUpdate        = true;

            // Compute vertex normals
            for( i = 0, len = geometry.faces.length; i < len; i++ )
            {
                var face = geometry.faces[i];
                face.vertexNormals[0] = geometry.vertices[face.a].clone().normalize();
                face.vertexNormals[1] = geometry.vertices[face.b].clone().normalize();
                face.vertexNormals[2] = geometry.vertices[face.c].clone().normalize();
            }

            return geometry;
        },

        /**
         * GENERATE MATERIAL
         */
        generate_material: function()
        {
            // Maps
            var maps = this.generate_maps();

            // Materials
            var materials = [];
            for(var i = 0; i < 6; i++)
                materials.push( this.get_shader_material( maps.textures[ i ], maps.bumps[ i ] ) );

            return new THREE.MeshFaceMaterial( materials );
        },

        /**
         * GENERATE MAPS
         */
        generate_maps : function()
        {
            var textures   = [],
                bumps      = [],
                resolution = 1024;

            // Each face
            for(var i = 0; i < 6; i++)
            {
                // Set
                var texture        = new THREE.WebGLRenderTarget( resolution, resolution, { minFilter : THREE.LinearFilter, magFilter : THREE.LinearFilter, format : THREE.RGBFormat } ),
                    texture_camera = new THREE.OrthographicCamera( - resolution / 2, resolution / 2, resolution / 2, - resolution / 2, -100, 100 ),
                    texture_scene  = new THREE.Scene(),
                    plane          = new THREE.Mesh(
                        new THREE.PlaneBufferGeometry( resolution, resolution ),
                        new this.get_texture_generator_material( i )
                    );

                texture_camera.position.z = 10;
                plane.position.z          = - 10;

                texture_scene.add(plane);

                // Render
                this.renderer.render( texture_scene, texture_camera, texture, true );

                // Retrieve buffer
                var buffer = new Uint8Array( resolution * resolution * 4 ),
                    gl     = this.renderer.getContext();

                gl.readPixels( 0, 0, resolution, resolution, gl.RGBA, gl.UNSIGNED_BYTE, buffer );

                // Feed arrays
                textures.push( texture );
                bumps.push( {
                    image :
                    {
                        data   : buffer,
                        height : resolution,
                        width  : resolution
                    }
                } );
            }

            // Return
            return {
                textures : textures,
                bumps    : bumps
            };
        },

        /**
         * GET SHADER MATERIAL
         */
        get_shader_material : function( texture_map, bump_map )
        {
            var vertexShader   = document.getElementById( 'planet-vertex-shader' ).innerText,
                fragmentShader = document.getElementById( 'planet-fragment-shader' ).innerText,
                uniforms       = {
                    pointLightPosition :
                    {
                        type  : 'v3',
                        value : this.sun_light.position
                    },
                    map :
                    {
                        type  : 't',
                        value : texture_map
                    }//,
                    // normalMap :
                    // {
                    //     type  : 't',
                    //     value : this.height_to_normal_map( bump_map, 4 )
                    // }
                };

            return new THREE.ShaderMaterial({
                uniforms       : uniforms,
                vertexShader   : vertexShader,
                fragmentShader : fragmentShader,
                transparent    : true
            });
        },

        /**
         * GET TEXTURE GENERATOR MATERIAL
         */
        get_texture_generator_material : function( index )
        {
            var vertexShader   = document.getElementById( 'planet-texture-vertex-shader' ).innerText,
                fragmentShader = document.getElementById( 'planet-texture-fragment-shader' ).innerText,
                uniforms       =
                {
                    index : {
                        type  : 'i',
                        value : index
                    }
                };

            return new THREE.ShaderMaterial( {
                uniforms       : uniforms,
                vertexShader   : vertexShader,
                fragmentShader : fragmentShader,
                transparent    : true,
                depthWrite     : false
            } );
        },

        /**
         * HEIGHT TO NORMAL MAP
         */
        height_to_normal_map : function( map, intensity )
        {
            var width  = map.image.width,
                height = map.image.height,
                len    = width * height;

            if( typeof intensity === 'undefined' )
                intensity = 1.0;

            var getHeight = function( x, y )
            {
                x = Math.min( x, width - 1 );
                y = Math.min( y, height - 1 );

                return - (
                    map.image.data[ ( y * width + x ) * 4     ] / 255 +
                    map.image.data[ ( y * width + x ) * 4 + 1 ] / 255 +
                    map.image.data[ ( y * width + x ) * 4 + 2 ] / 255
                ) / 3 * intensity;
            };

            var normal_map = THREE.ImageUtils.generateDataTexture( width, height, new THREE.Color( 0x000000 ) );

            for( var i = 0; i < len; i++ )
            {
                var x = i % width,
                    y = height - Math.floor( i / width );

                var pixel00 = new THREE.Vector3( 0, 0, getHeight( x, y ) ),
                    pixel01 = new THREE.Vector3( 0, 1, getHeight( x, y + 1 ) ),
                    pixel10 = new THREE.Vector3( 1, 0, getHeight( x + 1, y ) ),
                    orto    = pixel10.sub( pixel00 ).cross( pixel01.sub( pixel00 ) ).normalize();

                normal_map.image.data[ i * 3     ] = ( orto.x / 2 + 0.5 ) * 255;
                normal_map.image.data[ i * 3 + 1 ] = ( orto.y / 2 + 0.5 ) * 255;
                normal_map.image.data[ i * 3 + 2 ] = ( orto.z / 2 + 0.5 ) * 255;
            }

            return normal_map;
        },

        /**
         * FRAME
         */
        frame : function()
        {
            var camera_length = this.camera.position.length();

            // this.sky.uniforms.fCameraHeight  = camera_length;
            // this.sky.uniforms.fCameraHeight2 = camera_length * camera_length;
        }
    });
})();


