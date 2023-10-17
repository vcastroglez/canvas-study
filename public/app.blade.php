<!DOCTYPE html>
<html style="padding: 0;margin: 0;border: 0" lang="en">
<head>
    <meta charset="UTF-8">
    <meta id="WS_URL" content="{{ env('WS_URL') }}">
    <title>Piu piu</title>
    <style>
        canvas {
            margin-left: auto;
            margin-right: auto;
        }

        body {
            overflow: hidden;
        }
    </style>
</head>
<body id="body" style="padding: 0;margin: 0;border: 0;overflow: hidden">
<canvas id="mainCanvas" width="5000" height="5000"></canvas>
<script type="module" src="js/app.js" defer></script>
</body>
</html>