(function()
{
    'use strict';

    APP.COMPONENTS.WORLD.Planet = APP.CORE.Event_Emitter.extend(
    {
        options :
        {
            atmosphere :
            {
                Kr            : 0.0003,
                Km            : 0.001,
                ESun          : 30.0,
                g             : - 0.950,
                innerRadius   : 100,
                outerRadius   : 103,
                scaleDepth    : 0.41,
                wavelength    :
                {
                    r : 0.95,
                    g : 0.54,
                    b : 0.36
                }
            }
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

            // Uniforms (used in multiple materials)
            this.uniforms = [];

            // Geometry
            this.geometry = this.generate_geometry();

            // Material
            this.material = this.generate_material();

            // Mesh
            this.mesh = new THREE.Mesh( this.geometry, this.material );
            this.scene.add( this.mesh );

            // Sky
            this.generate_sky();

            // Debug
            this.init_debug();
        },

        /**
         * GENERATE SKY
         */
        generate_sky: function()
        {
            this.sky = {};

            this.sky.geometry = new THREE.SphereGeometry( 110, 200, 200 );
            this.sky.material = new THREE.ShaderMaterial( {
                uniforms       : this.generate_uniforms(),
                vertexShader   : document.getElementById( 'sky-vertex-shader' ).innerText,
                fragmentShader : document.getElementById( 'sky-fragment-shader' ).innerText,
                // wireframe : true
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
                geometry.vertices[ i ].normalize().multiplyScalar( 100 );

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
            for( var i = 0; i < 6; i++ )
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
                uniforms       = this.generate_uniforms( texture_map );

            // uniforms.tDiffuse.value = texture_map;
            // console.log(uniforms.tDiffuse);

                // {
                //     tDiffuse :
                //     {
                //         type  : 't',
                //         value : texture_map
                //     },
                //     tDiffuseNight :
                //     {
                //         type  : 't',
                //         value : diffuseNight
                //     }
                // }

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

            for(var i = 0; i < this.uniforms.length; i++)
            {
                var uniforms = this.uniforms[i];
                uniforms.v3LightPosition.value = new THREE.Vector3().copy( this.sun_light.position ).normalize();
                uniforms.fCameraHeight.value   = camera_length;
                uniforms.fCameraHeight2.value  = camera_length * camera_length;
            }

            this.mesh.rotation.y += 0.001;
        },

        /**
         * GENERATE UNIFORMS
         */
        generate_uniforms: function( tDiffuse )
        {
            var uniforms =
            {
                v3LightPosition :
                {
                    type: 'v3',
                    // value: new THREE.Vector3(1e8, 0, 1e8).normalize()
                    value: new THREE.Vector3().copy( this.sun_light.position ).normalize()
                },
                v3InvWavelength :
                {
                    type: 'v3',
                    value: new THREE.Vector3( 1 / Math.pow( this.options.atmosphere.wavelength.r, 4 ), 1 / Math.pow( this.options.atmosphere.wavelength.g, 4 ), 1 / Math.pow( this.options.atmosphere.wavelength.b, 4 ) )
                },
                fCameraHeight :
                {
                    type: 'f',
                    value: 0
                },
                fCameraHeight2 :
                {
                    type: 'f',
                    value: 0
                },
                fInnerRadius :
                {
                    type: 'f',
                    value: this.options.atmosphere.innerRadius
                },
                fInnerRadius2 :
                {
                    type: 'f',
                    value: this.options.atmosphere.innerRadius * this.options.atmosphere.innerRadius
                },
                fOuterRadius :
                {
                    type: 'f',
                    value: this.options.atmosphere.outerRadius
                },
                fOuterRadius2 :
                {
                    type: 'f',
                    value: this.options.atmosphere.outerRadius * this.options.atmosphere.outerRadius
                },
                fKrESun :
                {
                    type: 'f',
                    value: this.options.atmosphere.Kr * this.options.atmosphere.ESun
                },
                fKmESun :
                {
                    type: 'f',
                    value: this.options.atmosphere.Km * this.options.atmosphere.ESun
                },
                fKr4PI :
                {
                    type: 'f',
                    value: this.options.atmosphere.Kr * 4.0 * Math.PI
                },
                fKm4PI :
                {
                    type: 'f',
                    value: this.options.atmosphere.Km * 4.0 * Math.PI
                },
                fScale :
                {
                    type: 'f',
                    value: 1 / (this.options.atmosphere.outerRadius - this.options.atmosphere.innerRadius)
                },
                fScaleDepth :
                {
                    type: 'f',
                    value: this.options.atmosphere.scaleDepth
                },
                fScaleOverScaleDepth :
                {
                    type: 'f',
                    value: 1 / ( this.options.atmosphere.outerRadius - this.options.atmosphere.innerRadius ) / this.options.atmosphere.scaleDepth
                },
                g :
                {
                    type: 'f',
                    value: this.options.atmosphere.g
                },
                g2 :
                {
                    type: 'f',
                    value: this.options.atmosphere.g * this.options.atmosphere.g
                },
                nSamples :
                {
                    type: 'i',
                    value: 3
                },
                fSamples :
                {
                    type: 'f',
                    value: 3.0
                },
                tDiffuse: {
                  type: 't',
                  value: tDiffuse
                },
                // tDiffuseNight :
                // {
                //     type: 't',
                //     value: diffuseNight
                // },
                // tDisplacement :
                // {
                //     type: 't',
                //     value: 0
                // },
                // tSkyboxDiffuse :
                // {
                //     type: 't',
                //     value: 0
                // },
                fNightScale :
                {
                    type: 'f',
                    value: 1
                },
                time :
                {
                    type: "f",
                    value: 0.0
                }
            };

            this.uniforms.push( uniforms );

            return uniforms;
        },

        /**
         * INIT DEBUG
         */
        init_debug: function()
        {
            var that = this;

            this.debug = {};
            this.debug.instance = new APP.COMPONENTS.Debug();
            this.debug.instance.gui.planet = this.debug.instance.gui.instance.addFolder( 'Planet' );
            this.debug.instance.gui.planet.open();

            this.debug.Kr            = this.debug.instance.gui.planet.add( this.options.atmosphere, 'Kr', 0, 0.01 ).step( 0.0001 ).name( 'Kr' );
            this.debug.Km            = this.debug.instance.gui.planet.add( this.options.atmosphere, 'Km', 0, 0.01 ).step( 0.0001 ).name( 'Km' );
            this.debug.ESun          = this.debug.instance.gui.planet.add( this.options.atmosphere, 'ESun', 1, 200 ).step( 1 ).name( 'ESun' );
            this.debug.g             = this.debug.instance.gui.planet.add( this.options.atmosphere, 'g', -1, 0 ).step( 0.001 ).name( 'g' );
            // this.debug.innerRadius   = this.debug.instance.gui.planet.add( this.options.atmosphere, 'innerRadius', 1, 200 ).step( 0.01 ).name( 'innerRadius' );
            // this.debug.outerRadius   = this.debug.instance.gui.planet.add( this.options.atmosphere, 'outerRadius', 1, 200 ).step( 0.01 ).name( 'outerRadius' );
            this.debug.wavelength_r  = this.debug.instance.gui.planet.add( this.options.atmosphere.wavelength, 'r', 0, 1 ).step( 0.001 ).name( 'wavelength r' );
            this.debug.wavelength_g  = this.debug.instance.gui.planet.add( this.options.atmosphere.wavelength, 'g', 0, 1 ).step( 0.001 ).name( 'wavelength g' );
            this.debug.wavelength_b  = this.debug.instance.gui.planet.add( this.options.atmosphere.wavelength, 'b', 0, 1 ).step( 0.001 ).name( 'wavelength b' );
            this.debug.scaleDepth    = this.debug.instance.gui.planet.add( this.options.atmosphere, 'scaleDepth', 0, 1 ).step( 0.001 ).name( 'scaleDepth' );

            var update = function()
            {
                for(var i = 0; i < that.uniforms.length; i++)
                {
                    var uniforms = that.uniforms[i];
                    uniforms.v3InvWavelength.value = new THREE.Vector3( 1 / Math.pow( that.options.atmosphere.wavelength.r, 4 ), 1 / Math.pow( that.options.atmosphere.wavelength.g, 4 ), 1 / Math.pow( that.options.atmosphere.wavelength.b, 4 ) );
                    uniforms.fKrESun.value         = that.options.atmosphere.Kr * that.options.atmosphere.ESun;
                    uniforms.fKr4PI.value          = that.options.atmosphere.Kr * 4.0 * Math.PI;
                    uniforms.fKmESun.value         = that.options.atmosphere.Km * that.options.atmosphere.ESun;
                    uniforms.fKm4PI.value          = that.options.atmosphere.Km * 4.0 * Math.PI;
                    uniforms.fKrESun.value         = that.options.atmosphere.Kr * that.options.atmosphere.ESun;
                    uniforms.fKmESun.value         = that.options.atmosphere.Km * that.options.atmosphere.ESun;
                    uniforms.g.value               = that.options.atmosphere.g;
                    uniforms.g2.value              = that.options.atmosphere.g * that.options.atmosphere.g;
                    uniforms.fScaleDepth.value     = that.options.atmosphere.scaleDepth;
                }

                that.sky.material.needsUpdate = true;
            };

            this.debug.Kr.onChange( update );
            this.debug.Km.onChange( update );
            this.debug.ESun.onChange( update );
            this.debug.g.onChange( update );
            // this.debug.innerRadius.onChange( update );
            // this.debug.outerRadius.onChange( update );
            this.debug.wavelength_r.onChange( update );
            this.debug.wavelength_g.onChange( update );
            this.debug.wavelength_b.onChange( update );
            this.debug.scaleDepth.onChange( update );
        }
    });
})();


