<?php
require_once 'bootstrap.php';
require_once SRC_DIR.'/router-socket.php';

$ws_server = new \app\CentralServer('81.28.6.236', 8080);
\src\redis\RedisConnection::i()->cleanOldUsers(true);
$ws_server->run();