<?php

namespace app\Controllers;

use app\CentralServer;
use Carbon\Carbon;
use src\redis\RedisConnection;

class PlayerStatusController{
	protected RedisConnection $redis;

	public function __construct()
	{
		$this->redis = RedisConnection::i();
		$this->enemy_sync = new EnemySyncController();
	}

	public function updateStatus($payload, CentralServer $ws_server)
	{
		$data = $payload['data'];
		$user = $payload['user'];
		$this->redis->hset($user->id, 'position', json_encode([
			'x' => (int)$data['position']['x'],
			'y' => (int)$data['position']['y']
		]));
		$this->redis->hset($user->id, 'info', json_encode($data['stats']));
		$this->redis->hset($user->id, 'mouse', json_encode($data['mouse']));
		$this->redis->hset($user->id, 'proj', json_encode($data['proj']));
		$this->redis->hset('users', $user->id, Carbon::now()->timestamp);
		$this->enemy_sync->sendEnemy($user, $ws_server);
	}
}