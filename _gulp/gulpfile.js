var gulp       = require('gulp'),
    concat     = require('gulp-concat'),
    uglify     = require('gulp-uglify'),
    watch      = require('gulp-watch'),
    minify_css = require('gulp-minify-css');

var path    = '../src/',
    project = 'bruno-simon';

/**
 * JS
 */
gulp.task('scripts', function()
{
    gulp.src([
      path + 'js/libs/polyfills/raf.js',
      path + 'js/libs/underscore.js',
      path + 'js/libs/zepto.min.js',
      path + 'js/libs/tweenlite/TweenLite.min.js',
      path + 'js/libs/class.js',
      path + 'js/libs/rStats.js',
      path + 'js/libs/rStats.extras.js',
      path + 'js/libs/three/three.min.js',
      path + 'js/libs/three/postprocessing/EffectComposer.js',
      path + 'js/libs/three/postprocessing/RenderPass.js',
      path + 'js/libs/three/postprocessing/ShaderPass.js',
      path + 'js/libs/three/postprocessing/MaskPass.js',
      path + 'js/libs/three/shaders/FXAAShader.js',
      path + 'js/libs/three/shaders/DotsShader.js',
      path + 'js/libs/three/shaders/LinesShader.js',
      path + 'js/libs/three/shaders/CopyShader.js',
      path + 'js/app/app.js',
      path + 'js/app/core/abstract.class.js',
      path + 'js/app/core/event-emmiter.class.js',
      path + 'js/app/core/app.class.js',
      path + 'js/app/tools/browser.class.js',
      path + 'js/app/tools/retina.class.js',
      path + 'js/app/world/world.class.js',
      path + 'js/app/world/camera.class.js',
      path + 'js/app/world/renderer.class.js',
        ])
        .pipe(concat(project + '.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(path + 'js/'));
});

/**
 * CSS
 */
gulp.task('css', function()
{
    gulp.src([
            path + 'css/reset.css',
            path + 'css/style.css'
        ])
        .pipe(concat(project + '.min.css'))
        .pipe(minify_css())
        .pipe(gulp.dest(path + 'css/'));
});

/**
 * WATCH
 */
gulp.task('watch',function()
{
    // gulp.watch([path + 'js/app/*.js'],['scripts']);

    gulp.src([
            path + 'js/**.css',
        ])
        .pipe(watch(function(files)
        {
            return gulp.run('default');
        }));
});


gulp.task('default',['scripts','css']);
