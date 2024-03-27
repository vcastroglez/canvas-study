<?php

namespace app\Controllers;

use ReflectionClass;
use ReflectionMethod;
use src\redis\RedisConnection;

/**
 * This gets used in control.php, each function is a command.
 */
class AdminController
{
	/**
	 * Prints this help.
	 *
	 * @return void
	 */
	public function help(): void
	{
		$class = new ReflectionClass(static::class);
		$methods = $class->getMethods(ReflectionMethod::IS_PUBLIC);

		$to_print = [
			[
				'Command',
				'Description'
			]
		];
		foreach ($methods as $method) {
			$name = $method->getName();
			$docblock = preg_replace([
				'/[\/\*]/',
				'/@(\w)/',
				"/\s+/"
			], [
				'',
				'$1',
				' '
			], $method->getDocComment());
			$to_print[] = [
				$name,
				$docblock
			];
		}

		echo $this->printTable($to_print);
	}

	/**
	 * Flush the whole redis database, this will remove all players and data.
	 *
	 * @return bool
	 */
	public function flush(): bool
	{
		RedisConnection::i()->redis->flushall();
		return true;
	}

	private function printTable($data)
	{
		$columns = [];
		foreach ($data as $row_key => $row) {
			foreach ($row as $cell_key => $cell) {
				$length = strlen($cell);
				if (empty($columns[$cell_key]) || $columns[$cell_key] < $length) {
					$columns[$cell_key] = $length;
				}
			}
		}

		$table = '';
		foreach ($data as $row_key => $row) {
			foreach ($row as $cell_key => $cell)
				$table .= str_pad($cell, $columns[$cell_key]) . '   ';
			$table .= PHP_EOL;
		}
		return $table;
	}
}
