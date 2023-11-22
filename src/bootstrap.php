<?php
define('ROOT_DIR', dirname(__DIR__));
require_once ROOT_DIR.'/vendor/autoload.php';

function exception_handler(Throwable $exception): void
{
	echo "Uncaught exception: ", $exception->getMessage(), "\n", $exception->getFile(), ':', $exception->getLine(), "\n", $exception->getTraceAsString(), "\n";
}

set_exception_handler('exception_handler');
const APP_DIR = ROOT_DIR.DIRECTORY_SEPARATOR.'app';
const PUBLIC_DIR = ROOT_DIR.DIRECTORY_SEPARATOR.'public';
const SRC_DIR = ROOT_DIR.DIRECTORY_SEPARATOR.'src';
const LOG_DIR = ROOT_DIR.DIRECTORY_SEPARATOR.'log';
const CACHE_DIR = ROOT_DIR.DIRECTORY_SEPARATOR.'cache';
const VIEW_DIR = ROOT_DIR.DIRECTORY_SEPARATOR.'cache'.DIRECTORY_SEPARATOR.'views';

$dotenv = Dotenv\Dotenv::createImmutable(ROOT_DIR);
$dotenv->load();
require_once SRC_DIR.'/helpers.php';