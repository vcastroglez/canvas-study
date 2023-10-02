<?php

namespace app;

class Router{
	private static array $routes = [];

	public static function route(string $route, mixed $handler)
	{
		$callable = $handler;
		self::$routes[$route] = $callable;
	}

	public static function resolve(array $request, mixed $extra = null)
	{
		$route = $request['route'] ?? $request['action'] ?: '/';
		$params = $request;
		unset($params['route']);
		$handler = self::$routes[$route];
		if(is_array($handler)) {
			$class = $handler[0];
			$function = $handler[1];
//			if(str_contains($class, 'app\\')) {
//				$class = str_replace('app\\', '', $class);
//			}
			$instance = new $class();
			$handler = $instance->$function(...);
		}
		echo $handler($params, $extra);
		die;
	}
}