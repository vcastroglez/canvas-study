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
		if(is_array($user)){
			$user = $user['user'] or throw new \Exception('Wrong payload in sendEnemy');
		}
		$enemy = $this->getRandomEnemy($user);
		if(!empty($enemy)) {
			$ws_server->send($user, [
				'action' => 'enemy',
				'data'   => $enemy
			]);
		} else {
			$ws_server->send($user, [
				'action' => 'no-enemy',
				'data'   => "nobody connected"
			]);
		}
	}


	public function getRandomEnemy($user): ?array
	{
		$this->redis->cleanOldUsers();
		$connected_users = $this->redis->redis->hgetall('users');
		unset($connected_users[$user->id]);
		if(!empty($connected_users)) {
			$random = array_rand($connected_users);
			return [
				'player'   => $random,
				'position' => json_decode($this->redis->hget($random, 'position'), true),
				'mouse'    => json_decode($this->redis->hget($random, 'mouse'), true),
				'info'     => json_decode($this->redis->hget($random, 'info'), true),
			];
		} else {
			return null;
		}
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

	public function updateEnemy($payload, CentralServer $ws_server): void
	{
		$redis = $this->redis;
		$user = $payload['user'];

		$enemy_position = $redis->hget($payload['id'], 'position');
		$enemy_mouse = $redis->hget($payload['id'], 'mouse');
		$enemy_info = $redis->hget($payload['id'], 'info');
		if(!$enemy_position) {
			$enemy = $this->getRandomEnemy($user);
			if(!$enemy) {
				$ws_server->send($user, [
					'action' => 'no-enemy',
					'data'   => "nobody connected"
				]);
				return;
			}
			$id = $enemy['player'];
			$position = $enemy['position'];
			$mouse = $enemy['mouse'];
			$info = $enemy['info'];
		} else {
			$id = $payload['id'];
			$position = json_decode($enemy_position, true);
			$mouse = json_decode($enemy_mouse ?? "[]", true);
			$info = json_decode($enemy_info ?? "[]", true);
		}
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