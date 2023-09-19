<?php

namespace app;

use Spatie\Async\Pool;
use src\redis\RedisConnection;
use src\ws\WebSocketServer;

class CentralServer extends WebSocketServer{

    public function __construct($addr, $port, $bufferLength = 2048){
        parent::__construct($addr, $port, $bufferLength);
    }

    protected function process($user, $message){
        $msg = json_decode($message, true);
        if(!$msg)
            return;
        if($msg['action'] == 'position') {
            RedisConnection::i()->hset($user->id, 'position', json_encode($msg['data']));
        }else if($msg['action'] == 'update-enemy'){
            $this->send($user, ['action'=>'update-enemy','data'=>['player'=>$msg['id'],'position'=>json_decode(RedisConnection::i()->hget($msg['id'],'position'),true)]]);
        }
    }

    protected function connected($user){
        RedisConnection::i()->hset('users', $user->id, 1);
        $this->send($user, ['action'=>'you','data'=>$user->id]);
        $connected_users = RedisConnection::i()->redis->hgetall('users');
        unset($connected_users[$user->id]);
        if(!empty($connected_users)) {
            $random = array_rand($connected_users);
            $this->send($user, ['action'=>'enemy','data'=>['player'=>$random,'position'=>json_decode(RedisConnection::i()->hget($random,'position'),true)]]);
        }
    }

    protected function closed($user){
        RedisConnection::i()->hdel($user->id, ['position']);
        RedisConnection::i()->hdel('users', [$user->id]);
    }
}