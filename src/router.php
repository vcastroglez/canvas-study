<?php

use app\Router;

require_once APP_DIR.'/Router.php';

Router::route('/', function(){
	render(PUBLIC_DIR.'/app.blade.php');
	die;
});

Router::resolve($_REQUEST);