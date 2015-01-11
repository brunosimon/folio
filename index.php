<?php
    $env = $_SERVER['HTTP_HOST'] === 'bruno-simon.dev' ? 'local' : 'prod';
?><!--

THIS WEBSITE IS A WORK IN PROGRESS
HERE IS A COOL DINOSAUR TO WAIT

        /-/--\
      (@~@)   )/\
  ___/--      \  |
 (oo)__ _      )_/
  ^^___/       \
        \       |/-\
         (      )   |
         |       \_/

-->
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Bruno Simon</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" >

    <!-- ICONS -->
    <link rel="shortcut icon" href="src/img/icons/open/favicon.ico">
    <link rel="apple-touch-icon" sizes="57x57" href="src/img/icons/open/apple-touch-icon-57x57.png">
    <link rel="apple-touch-icon" sizes="114x114" href="src/img/icons/open/apple-touch-icon-114x114.png">
    <link rel="apple-touch-icon" sizes="72x72" href="src/img/icons/open/apple-touch-icon-72x72.png">
    <link rel="apple-touch-icon" sizes="144x144" href="src/img/icons/open/apple-touch-icon-144x144.png">
    <link rel="apple-touch-icon" sizes="60x60" href="src/img/icons/open/apple-touch-icon-60x60.png">
    <link rel="apple-touch-icon" sizes="120x120" href="src/img/icons/open/apple-touch-icon-120x120.png">
    <link rel="apple-touch-icon" sizes="76x76" href="src/img/icons/open/apple-touch-icon-76x76.png">
    <link rel="apple-touch-icon" sizes="152x152" href="src/img/icons/open/apple-touch-icon-152x152.png">
    <link rel="icon" type="image/png" href="src/img/icons/open/favicon-196x196.png" sizes="196x196">
    <link rel="icon" type="image/png" href="src/img/icons/open/favicon-160x160.png" sizes="160x160">
    <link rel="icon" type="image/png" href="src/img/icons/open/favicon-96x96.png" sizes="96x96">
    <link rel="icon" type="image/png" href="src/img/icons/open/favicon-16x16.png" sizes="16x16">
    <link rel="icon" type="image/png" href="src/img/icons/open/favicon-32x32.png" sizes="32x32">
    <meta name="msapplication-TileColor" content="#da532c">
    <meta name="msapplication-TileImage" content="src/img/icons/open/mstile-144x144.png">
    <meta name="msapplication-config" content="src/img/icons/open/browserconfig.xml">

    <!-- OPEN GRAPH -->
    <meta property="og:title" content="Bruno SIMON" />
    <meta property="og:description" content="Front end developer" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="http://bruno-simon.com" />
    <meta property="og:image" content="http://bruno-simon.com/src/img/icons/open/open-graph.jpg" />

    <!-- TWITTER CARD -->
    <meta name="twitter:card" content="summary">
    <meta name="twitter:url" content="http://bruno-simon.com">
    <meta name="twitter:title" content="Bruno SIMON">
    <meta name="twitter:description" content="Front end developer">
    <meta name="twitter:image" content="http://bruno-simon.com/src/img/icons/open/open-graph.jpg">
    <meta name="twitter:site" content="@bruno_simon">
    <meta name="twitter:domain" content="bruno-simon.com">
    <meta name="twitter:creator" content="@bruno_simon">

    <!-- CSS -->
    <link href="//fonts.googleapis.com/css?family=Abel&amp;subset=latin" rel="stylesheet" type="text/css">

    <?php if($env === 'local'): ?>
        <link rel="stylesheet" href="src/css/reset.css">
        <link rel="stylesheet" href="src/css/style.css">
    <?php else: ?>
        <link rel="stylesheet" href="src/css/bruno-simon.min.css">
    <?php endif; ?>
</head>
<body>
    <canvas id="canvas"></canvas>
    <div class="gradient"></div>
    <div class="content">
        <h1>Bruno SIMON</h1>
        <p>
            Coder most of the time, human otherwise. Currently working at <a target="_blank" href="http://www.uzik.com">Uzik</a> as web developer, also teaching classes at <a target="_blank" href="http://hetic.net">HETIC</a> and doing freelance work.<br />Feel free to contact me at <a target="_blank" href="mailto:contact@bruno-simon.com">contact@bruno-simon.com</a> or on twitter <a target="_blank" href="https://twitter.com/bruno_simon">@bruno_simon</a>
        </p>

        <h2>Some projects I worked on</h2>

        <ul>
            <li>
                 <a target="_blank" href="http://valeriemartinez.com"><img class="retina" width="250" height="100" src="src/img/projects/valerie-martinez.jpg" alt="Valérie Martinez"></a>
            </li>
            <li>
                 <a target="_blank" href="http://jr-associee.com"><img class="retina" width="250" height="100" src="src/img/projects/jr-associee.jpg" alt="JR &amp; Associée"></a>
            </li>
            <li>
                 <a target="_blank" href="http://randheli.chevalblanc.com"><img class="retina" width="250" height="100" src="src/img/projects/cheval-blanc-randheli.jpg" alt="Cheval Blanc - Randheli"></a>
            </li>
            <li>
                 <a target="_blank" href="http://www.myprovence.fr/snapshots2013/"><img class="retina" width="250" height="100" src="src/img/projects/snapshots-of-provence-2013.jpg" alt="Myprovence - Snapshots 2013"></a>
            </li>
        </ul>

        <h2>My lab</h2>
        <ul>
            <li>
                <a href="lab/procedural-planet/"><img class="retina" width="250" height="100" src="src/img/lab/procedural-planet.jpg" alt=""></a>
            </li>
            <li>
                <a href="lab/snow-shader/"><img class="retina" width="250" height="100" src="src/img/lab/snow-shader.jpg" alt=""></a>
            </li>
            <li>
                <a href="http://christmasexperiments.com/experiments/5"><img class="retina" width="250" height="100" src="src/img/lab/christmas-experiment.jpg" alt=""></a>
            </li>
            <li>
                <a href="lab/impacts/"><img class="retina" width="250" height="100" src="src/img/lab/impacts.jpg" alt=""></a>
            </li>
            <li>
                <a href="lab/morphing-cloud/"><img class="retina" width="250" height="100" src="src/img/lab/morphing-cloud.jpg" alt=""></a>
            </li>
            <li>
                <a href="lab/shaders-terrain/"><img class="retina" width="250" height="100" src="src/img/lab/shaders-terrain.jpg" alt=""></a>
            </li>
            <li>
                <a href="lab/sticks/"><img class="retina" width="250" height="100" src="src/img/lab/sticks.jpg" alt=""></a>
            </li>
            <li>
                <a href="lab/css3-boxes/"><img class="retina" width="250" height="100" src="src/img/lab/css3-boxes.jpg" alt=""></a>
            </li>
            <li>
                <a href="lab/draw-particles/"><img class="retina" width="250" height="100" src="src/img/lab/draw-particles.jpg" alt=""></a>
            </li>
            <li>
                <a href="lab/wind-particles/"><img class="retina" width="250" height="100" src="src/img/lab/wind-particles.jpg" alt=""></a>
            </li>
        </ul>
    </div>

    <?php echo ($env !== 'local') ? '<!--' : ''; ?>

        <script src="src/js/libs/polyfills/raf.js"></script>
        <script src="src/js/libs/underscore.js"></script>
        <script src="src/js/libs/zepto.min.js"></script>
        <script src="src/js/libs/tweenlite/TweenLite.min.js"></script>
        <script src="src/js/libs/class.js"></script>
        <script src="src/js/libs/rStats.js"></script>
        <script src="src/js/libs/rStats.extras.js"></script>

        <script src="src/js/libs/three/three.min.js"></script>
        <script src="src/js/libs/three/postprocessing/EffectComposer.js"></script>
        <script src="src/js/libs/three/postprocessing/RenderPass.js"></script>
        <script src="src/js/libs/three/postprocessing/ShaderPass.js"></script>
        <script src="src/js/libs/three/postprocessing/MaskPass.js"></script>
        <script src="src/js/libs/three/shaders/FXAAShader.js"></script>
        <script src="src/js/libs/three/shaders/DotsShader.js"></script>
        <script src="src/js/libs/three/shaders/LinesShader.js"></script>
        <script src="src/js/libs/three/shaders/CopyShader.js"></script>

        <script src="src/js/app/app.js"></script>
        <script src="src/js/app/core/abstract.class.js"></script>
        <script src="src/js/app/core/event-emmiter.class.js"></script>
        <script src="src/js/app/core/app.class.js"></script>
        <script src="src/js/app/tools/browser.class.js"></script>
        <script src="src/js/app/tools/retina.class.js"></script>
        <script src="src/js/app/world/world.class.js"></script>
        <script src="src/js/app/world/camera.class.js"></script>
        <script src="src/js/app/world/renderer.class.js"></script>

    <?php echo ($env !== 'local') ? '--!>' : ''; ?>

    <?php echo ($env === 'local') ? '<!--' : ''; ?>
        <script src="src/js/bruno-simon.min.js"></script>
    <?php echo ($env === 'local') ? '--!>' : ''; ?>

    <script>
        var app = new APP.CORE.App();
        app.start();
        var loop = function()
        {
            window.requestAnimationFrame(loop);
            app.update();
        }
        loop();

        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

        ga('create', 'UA-3966601-5', 'auto');
        ga('send', 'pageview');
    </script>
</body>
</html>
