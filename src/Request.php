<?php

namespace src;

use app\Models\Session;
use app\Models\User;

class Request implements \ArrayAccess{

	protected string $route = "";
	protected array $cookies = [];

	public function __construct(protected $parameters = [])
	{
		$this->route = $this->parameters['route'] ?? $this->parameters['action'] ?: '/';
		if($this->route[0] != '/') {
			$this->route = "/$this->route";
		}
		unset($this->parameters['route']);
		unset($this->parameters['action']);
		$this->cookies = $_COOKIE;
	}

	public function __get(string $param_name)
	{
		return $this->parameters[$param_name];
	}

	public function __set(string $param_name, $value): void
	{
		$this->parameters[$param_name] = $value;
	}

	public function offsetExists(mixed $offset): bool
	{
		return isset($this->parameters[$offset]);
	}

	public function offsetGet(mixed $offset): mixed
	{
		return $this->get($offset);
	}

	public function offsetSet(mixed $offset, mixed $value): void
	{
		$this->parameters[$offset] = $value;
	}

	public function offsetUnset(mixed $offset): void
	{
		unset($this->parameters[$offset]);
	}

	public function get($key)
	{
		return $this->parameters[$key] ?? null;
	}

	public function getRoute()
	{
		return $this->route;
	}

	public function user(): array|null|User
	{
		if(empty($this->getSessionUuid())) {
			return null;
		}

		$session = Session::findOne(['uuid' => $this->getSessionUuid()]);
		if(empty($session)) {
			return null;
		}

		return $session->getUser();
	}

	private function getSessionUuid()
	{
		return $this->cookies['session_uuid'] ?? null;
	}

	public function getAll()
	{
		return $this->parameters;
	}
}