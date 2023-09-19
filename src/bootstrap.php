<?php

function exception_handler(Throwable $exception): void{
    echo "Uncaught exception: " , $exception->getMessage(), "\n", $exception->getFile(),$exception->getLine(),"\n";
}

set_exception_handler('exception_handler');
define('ROOT_DIR', dirname(__DIR__));
const APP_DIR = ROOT_DIR.DIRECTORY_SEPARATOR.'app';
const PUBLIC_DIR = ROOT_DIR.DIRECTORY_SEPARATOR.'public';
const SRC_DIR = ROOT_DIR.DIRECTORY_SEPARATOR.'src';
const LOG_DIR = ROOT_DIR.DIRECTORY_SEPARATOR.'log';
require_once ROOT_DIR.'/vendor/autoload.php';