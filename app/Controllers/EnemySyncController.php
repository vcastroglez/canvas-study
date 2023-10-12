<?php

namespace app\Controllers;

use app\CentralServer;
use Carbon\Carbon;
use src\redis\RedisConnection;

class EnemySyncController{

	protected RedisConnection $redis;

	public function __construct()
	{
		$this->redis = RedisConnection::i();
	}

	public function sendEnemy($user, CentralServer $ws_server): void
	{
		if(is_array($user)) {
			$user = $user['user'] or throw new \Exception('Wrong payload in sendEnemy');
		}

		$enemies = $this->redis->redis->hgetall('users');
		$enemies = array_diff_key($enemies, [$user->id => 1]);
		$to_send = [];
		foreach($enemies as $key => $enemy) {
			$to_send[] = [
				'id'        => $key,
				'ts'        => $enemy,
				'mouse'     => $this->redis->hget($key, 'mouse'),
				'proj'      => $this->redis->hget($key, 'proj'),
				'prosition' => $this->redis->hget($key, 'position'),
				'info'      => $this->redis->hget($key, 'info'),
			];
		}

		$ws_server->send($user, [
			'action' => 'enemies',
			'data'   => $to_send
		]);
	}

	public function connected($payload, CentralServer $ws_server): void
	{
		$user = $payload['user'];
		$this->redis->hset('users', $user->id, Carbon::now()->timestamp);
		$ws_server->send($user, [
			'action' => 'you',
			'data'   => $user->id
		]);
		$this->sendEnemy($user, $ws_server);
	}

	public function updateEnemies($payload, CentralServer $ws_server): void
	{
		$redis = $this->redis;
		$user = $payload['user'];

		$ws_server->send($user, [
			'action' => 'update-enemy',
			'data'   => [
				'player'   => $id,
				'position' => $position,
				'mouse'    => $mouse,
				'info'     => $info,
			]
		]);
	}
}