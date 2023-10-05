<?php

use app\Router;
use Carbon\Carbon;
use src\redis\RedisConnection;

require_once APP_DIR.'/Router.php';

Router::route('position', function($payload){
	$redis = RedisConnection::i();

	$user = $payload['user'];
	$redis->hset($user->id, 'position', json_encode($payload['data']));
	$redis->hset($user->id, 'info', json_encode($payload['info']));
	$redis->hset('users', $user->id, Carbon::now()->timestamp);
});

Router::route('mouse', function($payload){
	$redis = RedisConnection::i();

	$user = $payload['user'];
	$redis->hset($user->id, 'mouse', json_encode($payload['data']));
	$redis->hset('users', $user->id, Carbon::now()->timestamp);
});

Router::route('connected', [\app\Controllers\EnemySyncController::class, 'connected']);
Router::route('update-enemy', [\app\Controllers\EnemySyncController::class, 'updateEnemy']);
Router::route('get-enemy', [\app\Controllers\EnemySyncController::class, 'sendEnemy']);
