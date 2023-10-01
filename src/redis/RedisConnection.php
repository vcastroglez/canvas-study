<?php

namespace src\redis;

use Carbon\Carbon;
use Predis\Client;

class RedisConnection{

	private string $host = 'localhost';
	private int $port = 6379;
	private string $pass = "1234";

	public Client $redis;

	private int $last_check = 0;

	/**
	 */
	private function connect(): void
	{
		$this->redis = new Client([
			'scheme' => 'tcp',
			'host'   => $this->host,
			'port'   => $this->port,
		], [
			'parameters' => [
				'password' => $this->pass,
				'database' => 0,
			]
		]);
	}

	/**
	 */
	private function __construct()
	{
		$this->connect();
	}

	private static self $instance;

	public static function i(): RedisConnection
	{
		return self::$instance ??= new static();
	}

	public function get(string $key)
	{
		return json_decode($this->redis->get($key), true);
	}

	public function push(string $key, $element): void
	{
		$original = $this->get($key) ?? [];
		$index = $element->id ?? null;
		if($index)
			$original[$index] = $element; else $original[] = $element;
		$this->set($key, $original);
	}

	public function set(string $key, array $data): void
	{
		$this->redis->set($key, json_encode($data));
	}

	public function hset(string $key, string $field, string $value)
	{
		$this->redis->hset($key, $field, $value);
	}

	public function hget(string $key, string $field)
	{
		return $this->redis->hget($key, $field);
	}

	public function hdel($key, $fields)
	{
		$this->redis->hdel($key, $fields);
	}

	public function cleanOldUsers(bool $delete_all = false): void
	{
		if($delete_all){
			$this->redis->flushall();
			return;
		}

		$now = Carbon::now()->timestamp;
		$elapsed = $now - $this->last_check;
		if($elapsed < 5) {
			return;
		}

		$all_users = $this->redis->hgetall('users');
		echo count($all_users).' users connected'.PHP_EOL;

		foreach($all_users as $key => $value) {
			$last_activity = $now - $value;
			if($last_activity < 30)
				continue;

			$this->hdel('users', [$key]);
			$this->hdel($key, ['position']);
		}

        $this->last_check = $now;
    }
}