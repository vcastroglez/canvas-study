<?php

namespace app;

use Carbon\Carbon;
use src\redis\RedisConnection;
use src\ws\WebSocketServer;

class CentralServer extends WebSocketServer{

    protected RedisConnection $redis;

    public function __construct($addr, $port, $bufferLength = 2048){
        parent::__construct($addr, $port, $bufferLength);
        $this->redis = RedisConnection::i();
    }

    protected function process($user, $message){
        $msg = json_decode($message, true);
        if(!$msg)
            return;
        if($msg['action'] == 'position') {
            $this->redis->hset($user->id, 'position', json_encode($msg['data']));
            $this->redis->hset('users', $user->id, Carbon::now()->timestamp);
        } else if($msg['action'] == 'update-enemy') {
            $this->send($user, [
                'action' => 'update-enemy',
                'data'   => [
                    'player'   => $msg['id'],
                    'position' => json_decode(RedisConnection::i()->hget($msg['id'], 'position'), true)
                ]
            ]);
        } else if($msg['action'] == 'get-enemy') {
            $this->sendEnemy($user);
        }
    }

    protected function connected($user){
        $this->redis->hset('users', $user->id, Carbon::now()->timestamp);
        $this->send($user, [
            'action' => 'you',
            'data'   => $user->id
        ]);
        $this->sendEnemy($user);
    }

    protected function sendEnemy($user){
        $this->redis->cleanOldUsers();
        $connected_users = $this->redis->redis->hgetall('users');
        unset($connected_users[$user->id]);
        if(!empty($connected_users)) {
            $random = array_rand($connected_users);
            $this->send($user, [
                'action' => 'enemy',
                'data'   => [
                    'player'   => $random,
                    'position' => json_decode($this->redis->hget($random, 'position'), true)
                ]
            ]);
        } else {
            $this->send($user, [
                'action' => 'no-enemy',
                'data'   => "nobody connected"
            ]);
        }
    }

    protected function closed($user){
        $this->redis->hdel($user->id, ['position']);
        $this->redis->hdel('users', [$user->id]);
    }
}