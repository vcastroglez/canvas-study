<?php

namespace src;

use PDO;
use PDOException;

class DB{

	protected PDO $connection;

	protected function __construct()
	{

		$servername = env('DB_HOST', 'localhost');
		$username = env('DB_USER');
		$password = env('DB_PASS');
		$database = env('DB_DATABASE', 'piupiu');

		try {
			$conn = new PDO("mysql:host=$servername;dbname=$database", $username, $password);
			// set the PDO error mode to exception
			$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$this->connection = $conn;
		} catch(PDOException $e) {
			die("Connection failed: ".$e->getMessage());
		}
	}

	public static function get(): self
	{
		return new self();
	}

	public function getConnection(): PDO
	{
		return $this->connection;
	}
}