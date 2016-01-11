// Requires
var gulp                = require( 'gulp' ),
    gulp_util           = require( 'gulp-util' ),
    gulp_plumber        = require( 'gulp-plumber' ),
    source              = require( 'vinyl-source-stream' ),
    browserify          = require( 'browserify' ),
    babelify            = require( 'babelify' ),
    babel_preset_es2015 = require( 'babel-preset-es2015' ),
    gulp_data           = require( 'gulp-data' ),
    gulp_jade           = require( 'gulp-jade' ),
    gulp_notify         = require( 'gulp-notify' ),
    gulp_sass           = require( 'gulp-sass' ),
    gulp_rename         = require( 'gulp-rename' ),
    gulp_autoprefixer   = require( 'gulp-autoprefixer' );

/**
 * FUNCTIONS
 */
function requireUncached( $module ) {
    delete require.cache[require.resolve( $module )];
    return require( $module );
}

/**
 * OPTIONS
 */
var options               = {};
options.paths             = {};
options.paths.build       = '../build/';
options.paths.templates   = '../templates/';
options.paths.data        = '../data/';
options.paths.sass        = '../src/sass/';
options.paths.fonts       = '../src/fonts/';
options.paths.images      = '../src/img/';
options.paths.medias      = '../src/medias/';
options.jade              = {};
options.jade.pretty       = true;
options.sass              = {};
options.sass.output_style = 'compressed'; // nested | expanded | compact | compressed

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

/**
 * HTML
 */
gulp.task( 'html', function()
{
    return gulp.src( options.paths.templates + '*.jade' )

        // Plumber
        .pipe( gulp_plumber( {
            errorHandler : gulp_notify.onError('<%= error.message %>')
        } ) )

        // Add data
        .pipe( gulp_data( function( file )
        {
            var data = requireUncached( options.paths.data + 'all.json' );
            data.fs = require( 'fs' )
            return data;
        } ) )

        // Compile jade
        .pipe( gulp_jade( {
            pretty : options.jade.pretty
        } ) )

        // Send to build
        .pipe( gulp.dest(
            options.paths.build
        ) )

        // Notify
        .pipe( gulp_notify( 'html' ) );
} );

/**
 * CSS
 */
gulp.task( 'css', function()
{
    return gulp.src( options.paths.sass + 'main.scss' )

        // Plumber
        .pipe( gulp_plumber( {
            errorHandler : gulp_notify.onError('<%= error.message %>')
        } ) )

        // SASS
        .pipe( gulp_sass( {
            outputStyle : options.sass.output_style
        } ) )

        // Auto prefixer
        .pipe( gulp_autoprefixer( {
            browsers : 'last 50 versions'
        } ) )

        // Rename
        .pipe( gulp_rename( 'style.css' ) )

        // Send to build
        .pipe( gulp.dest(
            options.paths.build + 'src/css/'
        ) )

        // Notify
        .pipe( gulp_notify( 'css' ) );
} );

/**
 * COPY
 */
gulp.task( 'copy', function()
{
    return gulp.src(
            [
                options.paths.fonts  + '**/**',
                options.paths.images + '**/**',
                options.paths.medias + '**/**',
            ],
            {
                base : './',
                buffer : false
            }
        )

        // Send to build
        .pipe( gulp.dest(
            options.paths.build + 'src/'
        ) )

        // Notify
        .pipe( gulp_notify( {
            message : 'copy',
            onLast  : true
        } ) );
} );

/**
 * WATCH
 */
gulp.task( 'watch', function()
{
    // TEMPLATE
    gulp.watch( options.paths.templates + '**/*.jade', [ 'html' ] );

    // DATA
    gulp.watch( options.paths.data + '**/*.json', [ 'html' ] );

    // SASS
    gulp.watch( options.paths.sass + '**/*.scss', [ 'css' ] );

    // COPY
    gulp.watch(
        [
            options.paths.fonts  + '**',
            options.paths.images + '**',
            options.paths.medias + '**',
        ],
        [ 'copy' ]
    );
} );

/**
 * START
 */
gulp.task( 'start', [ 'default', 'watch' ] );

/**
 * DEFAULT
 */
gulp.task( 'default', [ 'html', 'css', 'copy' ] );
