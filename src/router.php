<?php

use app\Controllers\AuthController;
use app\Router;

require_once APP_DIR.'/Router.php';

Router::route('/', [AuthController::class,'index']);
Router::route('/log-in', [AuthController::class,'logIn']);

Router::route('/check-identity',[AuthController::class, 'checkIdentity']);

Router::route('reset-ws',function(){
	dd("why are you running");
	$output=null;
	exec('systemctl restart piu-socket',$output);
	dd($output);//tovla
});

Router::resolve($_REQUEST);
