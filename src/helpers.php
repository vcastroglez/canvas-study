<?php

use JetBrains\PhpStorm\NoReturn;

function logger(...$msg): void
{
	$log_path = LOG_DIR.DIRECTORY_SEPARATOR.'log.log';
	foreach($msg as $value) {
		if(is_array($value))
			$value = json_encode($value);
		if(!is_writable($log_path)) {
			dd("no se puede escribir en el fichero log");//tovla
		}
		file_put_contents($log_path, $value, FILE_APPEND);
	}
}

function env(string $name): ?string
{
	$value = $_ENV[$name] ?? null;
	return smart_parse($value);
}

function smart_parse(mixed $value): mixed
{
	if(is_numeric($value) && !str_contains($value, '.')) {
		return (int)$value;
	} elseif(is_numeric($value) && str_contains($value, '.')) {
		return (float)$value;
	}

	return $value;
}

#[NoReturn] function render(string $file_path): void
{
	if(!file_exists(CACHE_DIR)) {
		mkdir(CACHE_DIR, 0754);
	}
	if(!file_exists(VIEW_DIR)) {
		mkdir(VIEW_DIR, 0754);
	}
	$dev_mode = env('APP_ENV') == 'dev';

	$parts = explode('/', $file_path);
	$filename = str_replace([
		'.blade',
		'.php'
	], '', $parts[count($parts) - 1]);

	$cache_name = $filename.'.'.md5($file_path).'.php';
	$cached_path = VIEW_DIR."/$cache_name";
	$cached_exists = file_exists($cached_path);

	if(!$dev_mode && $cached_exists) {
		require_once $cached_path;
		die;
	}

	$content = file_get_contents($file_path);
	if(empty($content)) {
		throw new Exception('File not found: '.$file_path);
	}
	if(!$cached_exists) {
		$rendered_content = str_replace([
			'{{',
			'}}'
		], [
			'<?php echo',
			'; ?>'
		], $content);
		touch($cached_path);
		if(!is_writable(VIEW_DIR)) {
			throw new Exception("Can't write views cache directory: ".$cached_path);
		}
		file_put_contents($cached_path, $rendered_content);
	}
	require_once $cached_path;
	die;
}