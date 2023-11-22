<?php

namespace src;

use PDO;

class Model extends \stdClass{

	const MODE_GET_ALL = 1;
	const MODE_GET_ONE = 2;
	protected string $table_name;

	protected string $primary_key = 'id';

	public static function find(mixed $params): \Traversable
	{
		if(is_array($params)) {
			dd("culo");//tovla
			return self::getByCondition($params);
		}
		dd("not implemented");//tovlaMODE_GENERATOR
	}

	public static function findOne(array|int $params)
	{
		return self::getByCondition($params, self::MODE_GET_ONE);
	}


	private static function getByCondition(array|int $params, int $mode = self::MODE_GET_ALL)
	{
		$instance = new static();

		if(is_int($params)) {
			$params = [$instance->primary_key => $params];
		}
		$conn = DB::get();
		$connection = $conn->getConnection();

		$table_name = $instance->getTableName();
		$wheres = self::buildConditions($params);
		$statement = $connection->prepare("SELECT * FROM $table_name WHERE {$wheres}");
		$statement->execute();
		$result = $statement->setFetchMode(PDO::FETCH_ASSOC);
		if(!$result) {
			return null;
		}

		//yield
		if($mode == self::MODE_GET_ALL) {
			$to_return = [];
			foreach($statement->fetchAll(PDO::FETCH_ASSOC) as $row) {
				$to_return[] = static::make($row);
			}
		} else if($mode == self::MODE_GET_ONE) {
			$one = $statement->fetch(PDO::FETCH_ASSOC);
			if($one == false) {
				$to_return = null;
			} else {
				$to_return = static::make($one);
			}
		} else {
			dd("not implemented");//tovla
		}

		$statement->closeCursor();

		return $to_return;
	}

	private function getTableName(): string
	{
		if(isset($this->table_name)) {
			return $this->table_name;
		}
		$class = get_called_class();
		$class = explode('\\', $class);
		end($class);
		$last = key($class);
		$class = $class[$last];
		return strtolower($class).'s';
	}

	private static function buildConditions(array $params)
	{
		$parts = [];
		foreach($params as $column => $value) {
			$parts[] = "$column = '$value'";
		}

		return implode("AND", $parts);
	}

	protected function setProperties(mixed $row): void
	{
		foreach($row as $property => $value) {
			$this->$property = $value;
		}
	}

	protected static function make(array $properties): static
	{
		$fresh_instance = new static();
		$fresh_instance->setProperties($properties);
		return $fresh_instance;
	}

	public static function create(array $properties)
	{
		$instance = new static();
		$conn = DB::get();
		$connection = $conn->getConnection();

		$table_name = $instance->getTableName();
		$properties_names = implode(',', array_keys($properties));
		$question_marks = implode(',', array_fill(0, count($properties), '?'));
		$properties_values = array_values($properties);
		$connection->beginTransaction();
		$statement = $connection->prepare("INSERT INTO $table_name ($properties_names) SET ($question_marks)")->execute($properties_values);
		$id = $connection->lastInsertId();
		$connection->commit();
		dd($id);//tovla
	}

}