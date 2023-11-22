<?php

use app\Controllers\EnemySyncController;
use app\Controllers\PlayerStatusController;
use app\Router;

require_once APP_DIR.'/Router.php';

Router::route('/self-status',[PlayerStatusController::class, 'updateStatus']);
Router::route('/connected', [EnemySyncController::class, 'connected']);
Router::route('/get-enemy', [EnemySyncController::class, 'sendEnemy']);
