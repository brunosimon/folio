(function()
{
    'use strict';

    APP.COMPONENTS.WORLD.PLANET.Ground = APP.CORE.Event_Emitter.extend(
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

            this.scene             = this.options.scene;
            this.renderer          = this.options.renderer;
            this.camera            = this.options.camera;
            this.sun_light         = this.options.sun_light;
            this.generate_uniforms = this.options.generate_uniforms;

            // Init textures
            this.init_textures();

            // Geometry
            this.geometry = this.generate_geometry();

            // Material
            this.material = this.generate_material();

            // Mesh
            this.mesh = new THREE.Mesh( this.geometry, this.material );
            this.scene.add( this.mesh );
        },

        /**
         * INIT TEXTURES
         */
        init_textures: function()
        {
            this.textures        = {};
            this.textures.water = new APP.COMPONENTS.WORLD.PLANET.Gradient_Texture( {
                items :
                {
                    item_0 : { pos : 0.00, color : '#2d0000' },
                    item_1 : { pos : 0.20, color : '#2d0000' },
                    item_2 : { pos : 0.99, color : '#660000' },
                },
                debug :
                {
                    name : 'Planet - water texture'
                }
            } );
            this.textures.ground = new APP.COMPONENTS.WORLD.PLANET.Gradient_Texture( {
                items :
                {
                    item_0 : { pos : 0.00, color : '#aa0000' },
                    item_1 : { pos : 0.50, color : '#cd1010' },
                    item_2 : { pos : 1.00, color : '#ff0000' },
                },
                debug :
                {
                    name : 'Planet - ground texture'
                },
                style :
                {
                    top : 86
                }
            } );
            this.textures.ice = new APP.COMPONENTS.WORLD.PLANET.Gradient_Texture( {
                items :
                {
                    item_0 : { pos : 0.00, color : '#ff9bbe' },
                    item_1 : { pos : 0.43, color : '#ffebf2' },
                    item_2 : { pos : 0.44, color : '#ffffff' }
                },
                debug :
                {
                    name : 'Planet - ice texture'
                },
                style :
                {
                    top : 126
                }
            } );
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

            // Each face
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
                materials  = [],
                resolution = 1024;

            // Each face
            for(var i = 0; i < 6; i++)
            {
                // Set
                var texture        = new THREE.WebGLRenderTarget( resolution, resolution, { minFilter : THREE.LinearFilter, magFilter : THREE.LinearFilter, format : THREE.RGBFormat } ),
                    texture_camera = new THREE.OrthographicCamera( - resolution / 2, resolution / 2, resolution / 2, - resolution / 2, -100, 100 ),
                    texture_scene  = new THREE.Scene(),
                    geometry       = new THREE.PlaneBufferGeometry( resolution, resolution ),
                    material       = new this.get_texture_shader_material( i, this.textures.ground.texture ),
                    plane          = new THREE.Mesh(
                        geometry,
                        material
                    );

                materials.push( material );

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
                textures  : textures,
                bumps     : bumps,
                materials : materials,
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

            uniforms.tWaterGradient =
            {
                type  : 't',
                value : this.textures.water.texture
            };

            uniforms.tGroundGradient =
            {
                type  : 't',
                value : this.textures.ground.texture
            };

            uniforms.tIceGradient =
            {
                type  : 't',
                value : this.textures.ice.texture
            };

            return new THREE.ShaderMaterial( {
                uniforms       : uniforms,
                vertexShader   : vertexShader,
                fragmentShader : fragmentShader,
                transparent    : true
            } );
        },

        /**
         * GET TEXTURE GENERATOR MATERIAL
         */
        get_texture_shader_material : function( index, texture )
        {
            var vertexShader   = document.getElementById( 'planet-texture-vertex-shader' ).innerText,
                fragmentShader = document.getElementById( 'planet-texture-fragment-shader' ).innerText,
                uniforms       =
                {
                    index :
                    {
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

    });
})();
