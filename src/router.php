<?php
$route = $_REQUEST['route'] ?: '/';
$params = $_REQUEST;
unset($params['route']);
$routes = [
  '/' => function(){
    echo file_get_contents(PUBLIC_DIR.'/app.html');
    die;
  }
];
$routes[$route]() or die($route);//tovla;