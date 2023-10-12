<?php
require_once 'bootstrap.php';
require_once SRC_DIR.'/router-socket.php';

$ws_server = new \app\CentralServer(env('WS_DNS'), 8080);
\src\redis\RedisConnection::i()->cleanOldUsers(true);
$ws_server->run();