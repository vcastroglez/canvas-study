<?php

namespace app\Controllers;

use src\redis\RedisConnection;

class AuthController{
	protected RedisConnection $redis;

	public function __construct()
	{
		$this->redis = RedisConnection::i();
	}

	public function checkIdentity($payload)
	{
		$name = md5($payload['name']);
		$input_pass = md5($payload['pass']);
		$pass = $this->redis->hget($name, 'pass') ?? null;
		if(!$pass) {
			$this->redis->hset($name, 'pass', $input_pass);
			return json_encode([
				'success' => true,
			]);
		}

		if($pass == $input_pass) {
			return json_encode([
				'success' => true,
			]);
		}

		return json_encode([
			'success' => false,
			'all'     => $this->redis->redis->hgetall($name)
		]);
	}
}