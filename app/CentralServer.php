<?php

namespace app;

use src\redis\RedisConnection;
use src\ws\WebSocketServer;
use src\ws\WebSocketUser;

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

	protected function connected(WebSocketUser $user)
	{
		$this->stdout($user->headers['get']);
		$new_identity = md5(str_replace('/', '', $user->headers['get']));
		$temporal_identity = $user->id;
		$user->id = $new_identity;

		$this->sockets[$new_identity] = $user->socket;
		$this->users[$new_identity] = $user;

		unset($this->sockets[$temporal_identity]);
		unset($this->users[$temporal_identity]);
		$this->stdout("User moved to his session: $new_identity");

		Router::resolve([
			'route' => 'connected',
			'user'  => $user
		], $this, true);
	}


	protected function closed($user){}
}