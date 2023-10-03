<?php

namespace app;

use src\redis\RedisConnection;
use src\ws\WebSocketServer;

class CentralServer extends WebSocketServer{

	protected RedisConnection $redis;

	public function __construct($addr, $port, $bufferLength = 2048)
	{
		parent::__construct($addr, $port, $bufferLength);
		$this->redis = RedisConnection::i();
	}

	protected function process($user, $message)
	{
		$msg = json_decode($message, true);
		$msg['user'] = $user;
		if(!$msg)
			return;
		Router::resolve($msg, $this, true);
	}

	protected function connected($user)
	{
		Router::resolve([
			'route' => 'connected',
			'user'  => $user
		], $this, true);
	}


	protected function closed($user)
	{
		$this->redis->hdel($user->id, [
			'position',
			'mouse'
		]);
		$this->redis->hdel('users', [$user->id]);
	}
}