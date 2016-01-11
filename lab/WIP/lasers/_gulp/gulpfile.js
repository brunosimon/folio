// Requires
var gulp                = require( 'gulp' ),
    gulp_util           = require( 'gulp-util' ),
    gulp_plumber        = require( 'gulp-plumber' ),
    source              = require( 'vinyl-source-stream' ),
    browserify          = require( 'browserify' ),
    babelify            = require( 'babelify' ),
    babel_preset_es2015 = require( 'babel-preset-es2015' );

/**
 * JS
 */
gulp.task( 'js', function()
{
    browserify( {
        entries   : '../src/js/test/index.js',
        debug     : true,
    } )
    .transform(
        babelify,
        {
            presets :
            [
                babel_preset_es2015
            ]
        }
    )
    .bundle()
    .pipe( gulp_plumber() )
    .pipe( source( 'script.js') )
    .pipe( gulp.dest( '../src/js/build' ) );
} );
