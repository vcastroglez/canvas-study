<?php

use app\Router;

require_once APP_DIR.'/Router.php';

Router::route('/', function(){
	render(PUBLIC_DIR.'/app.blade.php');
	die;
});

Router::route('reset-ws',function(){
	$output=null;
	exec('systemctl restart piu-socket',$output);
	dd($output);//tovla
});

Router::resolve($_REQUEST);