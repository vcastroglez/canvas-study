<?php
require_once 'bootstrap.php';
require_once APP_DIR.'/CentralServer.php';

$ws_server = new \app\CentralServer('piupiu.alpec.cu',8080);
$ws_server->run();