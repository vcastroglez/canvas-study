<?php

use app\Controllers\AdminController;

require_once 'bootstrap.php';

$action = $argv[1];

echo (new AdminController)->$action().PHP_EOL;
