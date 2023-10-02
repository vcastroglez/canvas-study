<?php

use app\Router;

require_once APP_DIR.'/Router.php';

Router::route('/', function(){
	echo file_get_contents(PUBLIC_DIR.'/app.html');
	die;
});

Router::resolve($_REQUEST);