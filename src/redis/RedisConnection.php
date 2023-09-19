<?php

namespace src\redis;

use Predis\Client;

class RedisConnection{

    private string $host = 'localhost';
    private int $port = 6379;
    private string $pass = "1234";

    public Client $redis;

    /**
     */
    private function connect(): void{
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
    private function __construct(){
        $this->connect();
    }

    private static self $instance;

    public static function i(): RedisConnection{
        return self::$instance ??= new static();
    }

    public function get(string $key){
        return json_decode($this->redis->get($key), true);
    }

    public function push(string $key, $element): void{
        $original = $this->get($key) ?? [];
        $index = $element->id ?? null;
        if($index)
            $original[$index] = $element; else $original[] = $element;
        $this->set($key, $original);
    }

    public function set(string $key, array $data): void{
        $this->redis->set($key, json_encode($data));
    }

    public function hset(string $key, string $field, string $value){
        $this->redis->hset($key, $field, $value);
    }

    public function hget(string $key, string $field){
        return $this->redis->hget($key, $field);
    }

    public function hdel($key,$fields){
        $this->redis->hdel($key,$fields);
    }
}