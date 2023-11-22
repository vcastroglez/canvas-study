<?php

namespace app\Controllers;

use app\Models\User;
use JetBrains\PhpStorm\NoReturn;
use src\redis\RedisConnection;
use src\Request;

class AuthController{
	protected RedisConnection $redis;

	public function __construct()
	{
		$this->redis = RedisConnection::i();
	}

	/**
	 * @throws \Exception
	 */
	#[NoReturn] public function index(Request $request): void
	{
		$user = $request->user();
		if(empty($user)) {
			render('login.blade.php');
		}

		render('app.blade.php', ['user' => $user]);
	}

	public function logIn(Request $request)
	{
		$username = $request->get('username');
		$password = $request->get('password');

		$user = User::findOne(['username' => $username]);
		if(empty($user)) {
			$user = User::create([
				'username' => $username,
				'password' => sha1($password)
			]);
		}

		$request->logIn($user);
		render('app.blade.php', ['user' => $user]);
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