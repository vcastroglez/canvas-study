<!DOCTYPE html>
<html style="padding: 0;margin: 0;border: 0" lang="en">
<head>
    <meta charset="UTF-8">
    <meta id="WS_URL" content="{{ env('WS_URL') }}">
    <meta name="viewport" content="width=device-width, initial-scale=0.8, user-scalable=0">
    <title>Piu piu</title>
    <style>
        canvas {
            border: 5px solid #f30808;
        }

        *, #wrapper {
            overflow: hidden !important;
        }

        #wrapper {
            width: 100vw;
            height: 100vh;
        }

        .canvas-layer {
            position: absolute;
            left: 0;
            top: 0;
            z-index: 0;
        }

        .canvas-layer.fixed {
            position: fixed;
        }

        #miniCanvas {
            left: 20px;
            bottom: 20px;
            top: auto;
        }
    </style>
</head>
<body id="body" style="padding: 0;margin: 0;border: 0;overflow: hidden">
<div id="wrapper">
    <canvas id="mainCanvas" class="canvas-layer" width="5000" height="5000"></canvas>
    <canvas id="levelCanvas" class="canvas-layer fixed" width="5000" height="5000"></canvas>
    <canvas id="miniCanvas" class="canvas-layer fixed" width="300" height="300"></canvas>
</div>
<script type="module" src="js/app.js" defer></script>
</body>
</html>