<!DOCTYPE html>
<html style="padding: 0;margin: 0;border: 0" lang="en">
<head>
    <meta charset="UTF-8">
    <meta id="WS_URL" content="{{ env('WS_URL') }}">
    <meta name="viewport" content="width=device-width, initial-scale=0.8, user-scalable=0">
    <title>Piu piu</title>
    <style>
        canvas {
            margin-left: auto;
            margin-right: auto;
            border: 5px solid #f30808;
        }

        *, #wrapper {
            overflow: hidden !important;
        }
    </style>
</head>
<body id="body" style="padding: 0;margin: 0;border: 0;overflow: hidden">
<div id="wrapper">
<canvas id="mainCanvas" width="5000" height="5000" style="background-image: url('{{ PUBLIC_DIR.'/bgImg.jpg'}}');background-repeat: repeat-x;"></canvas>
</div>
<script type="module" src="js/app.js" defer></script>
</body>
</html>