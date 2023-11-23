<?php

namespace src;

use PDO;

class Model extends \stdClass implements \ArrayAccess, \JsonSerializable{

	const MODE_GET_ALL = 1;
	const MODE_GET_ONE = 2;
	protected string $table_name;
	protected string $primary_key = 'id';

	protected array $attributes = [];

	/**
	 * @param array $properties
	 * @return bool|int|null
	 */
	public static function insert(string $table_name, array $properties): ?int
	{
		$conn = DB::get();
		$connection = $conn->getConnection();

		$properties_names = implode(',', array_keys($properties));
		$question_marks = implode(',', array_fill(0, count($properties), '?'));
		$properties_values = array_values($properties);
		$connection->beginTransaction();
		$connection->prepare("INSERT INTO $table_name ($properties_names) VALUES ($question_marks)")->execute($properties_values);
		$id = $connection->lastInsertId();
		$connection->commit();

		if(!$id) {
			return null;
		}
		return is_numeric($id) ? (int)$id : $id;
	}

	private static function update(string $table_name, array $properties)
	{
		$conn = DB::get();
		$connection = $conn->getConnection();

		foreach($properties as $key => $value) {
			dd($properties, 0);//tovla
		}
		$properties_values = array_values($properties);
		$connection->beginTransaction();
		$connection->prepare("UPDATE $table_name SET ($properties_names) VALUES ($question_marks)")->execute($properties_values);
		$id = $connection->lastInsertId();
		$connection->commit();
	}

	public function __set(string $name, $value): void
	{
		$this->attributes[$name] = $value;
		$this->$name = $value;
	}

	public function __get(string $name)
	{
		return $this->attributes[$name];
	}

	public static function find(mixed $params): array|Model
	{
		if(is_array($params)) {
			return self::getByCondition($params);
		}
		dd("not implemented");//tovla MODE_GENERATOR
	}

	public static function findOne(array|int $params): static|null
	{
		return self::getByCondition($params, self::MODE_GET_ONE);
	}


	private static function getByCondition(array|int $params, int $mode = self::MODE_GET_ALL, bool $instantiate = true): null|static|array
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
				if($instantiate) {
					$to_return[] = static::make($row);
				} else {
					$to_return[] = $row;
				}
			}
		} else if($mode == self::MODE_GET_ONE) {
			$one = $statement->fetch(PDO::FETCH_ASSOC);
			if($one === false) {
				$to_return = null;
			} else {
				if($instantiate) {
					$to_return = static::make($one);
				} else {
					$to_return = $one;
				}
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

		return implode("AND ", $parts);
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

	public static function create(array $properties): static
	{
		$instance = new static();
		$table_name = $instance->getTableName();
		$id = self::insert($table_name, $properties);
		$pk = $instance->primary_key;
		$instance->$pk = $id;
		$instance->fill();

		return $instance;
	}

	private function fill(): void
	{
		$pk = $this->{$this->primary_key};
		$row = $this::getByCondition([$this->primary_key => $pk], self::MODE_GET_ONE, false);
		unset($row[$this->primary_key]);
		foreach($row as $property => $value) {
			$this->$property = $value;
		}
	}

	public function save()
	{
		$attributes = $this->attributes;
		if(!isset($this->{$this->primary_key})) {
			$id = self::insert($this->getTableName(), $attributes);
			$this->{$this->primary_key} = $id;
		} else {//update
			self::update($this->getTableName(), $attributes);
		}
	}

	public function offsetExists(mixed $offset): bool
	{
		return isset($this->attributes[$offset]);
	}

	public function offsetGet(mixed $offset): mixed
	{
		return $this->attributes[$offset];
	}

	public function offsetSet(mixed $offset, mixed $value): void
	{
		$this->attributes[$offset] = $value;
	}

	public function offsetUnset(mixed $offset): void
	{
		unset($this->attributes[$offset]);
	}

	public function jsonSerialize(): mixed
	{
		return $this->attributes;
	}
}