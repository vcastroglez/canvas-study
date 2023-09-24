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
        } else if($msg['action'] == 'mouse'){
            $this->redis->hset($user->id, 'mouse', json_encode($msg['data']));
            $this->redis->hset('users', $user->id, Carbon::now()->timestamp);
        } else if($msg['action'] == 'update-enemy') {
            $enemy_position = RedisConnection::i()->hget($msg['id'], 'position');
            $enemy_mouse = RedisConnection::i()->hget($msg['id'], 'mouse');
            if(!$enemy_position) {
                $enemy = $this->getRandomEnemy($user);
                if(!$enemy) {
                    $this->send($user, [
                        'action' => 'no-enemy',
                        'data'   => "nobody connected"
                    ]);
                    return;
                }
                $id = $enemy['player'];
                $position = $enemy['position'];
                $mouse = $enemy['mouse'];
            } else {
                $id = $msg['id'];
                $position = json_decode($enemy_position, true);
                $mouse = json_decode($enemy_mouse ?? "[]",true);
            }
            $this->send($user, [
                'action' => 'update-enemy',
                'data'   => [
                    'player'   => $id,
                    'position' => $position,
                    'mouse' => $mouse,
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

    protected function sendEnemy($user): void{
        $enemy = $this->getRandomEnemy($user);
        if(!empty($enemy)) {
            $this->send($user, [
                'action' => 'enemy',
                'data'   => $enemy
            ]);
        } else {
            $this->send($user, [
                'action' => 'no-enemy',
                'data'   => "nobody connected"
            ]);
        }
    }

    protected function getRandomEnemy($user): ?array{
        $this->redis->cleanOldUsers();
        $connected_users = $this->redis->redis->hgetall('users');
        unset($connected_users[$user->id]);
        if(!empty($connected_users)) {
            $random = array_rand($connected_users);
            return [
                'player'   => $random,
                'position' => json_decode($this->redis->hget($random, 'position'), true),
                'mouse' => json_decode($this->redis->hget($random, 'mouse'), true),
            ];
        } else {
            return null;
        }
    }

    protected function closed($user){
        $this->redis->hdel($user->id, ['position','mouse']);
        $this->redis->hdel('users', [$user->id]);
    }
}