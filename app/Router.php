<?php

namespace app;

class Router{
	private static array $routes = [];

	public static function route(string $route, mixed $handler)
	{
		$callable = $handler;
		self::$routes[$route] = $callable;
	}

	public static function resolve(array $request, mixed $extra = null, bool $return = false)
	{
		$route = $request['route'] ?? $request['action'] ?: '/';
		$params = $request;
		unset($params['route']);
		$handler = self::$routes[$route] ?? self::$routes["/$route"];
		if(is_array($handler)) {
			$class = $handler[0];
			$function = $handler[1];
			$instance = new $class();
			$handler = $instance->$function(...);
		}
		if($return) {
			return $handler($params, $extra);
		} else {
			echo $handler($params, $extra);
			die;
		}
	}
}