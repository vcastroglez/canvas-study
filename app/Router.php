<?php

namespace app;

use src\Request;

class Router{
	private static array $routes = [];

	public static function route(string $route, mixed $handler)
	{
		$callable = $handler;
		self::$routes[$route] = $callable;
	}

	/**
	 * @throws \Exception
	 */
	public static function resolve(array $request, mixed $extra = null, bool $return = false)
	{
		$request = new Request($request, !$return);
		$handler = self::$routes[$request->getRoute()];
		if(is_array($handler)) {
			$class = $handler[0];
			$function = $handler[1];
			$instance = new $class();
			$handler = $instance->$function(...);
		}

		if($return) {
			return $handler($request, $extra);
		} else {
			echo $handler($request, $extra);
			die;
		}
	}
}