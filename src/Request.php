<?php

namespace src;

use app\Models\Session;
use app\Models\User;

class Request implements \ArrayAccess{

	protected string $route = "";
	protected array $cookies = [];

	public Session $session;

	/**
	 * @throws \Exception
	 */
	public function __construct(protected $parameters = [], bool $with_session = true)
	{
		$this->route = $this->parameters['route'] ?? $this->parameters['action'] ?: '/';
		if($this->route[0] != '/') {
			$this->route = "/$this->route";
		}
		unset($this->parameters['route']);
		unset($this->parameters['action']);

		if($with_session) {
			$this->cookies = &$_COOKIE;
			$uuid = $this->cookies['PHPSESSID'] ?? uniqidReal();
			$existing = Session::findOne(['uuid' => $uuid]);
			if(empty($existing)) {
				$this->session = new Session();
			} else {
				$this->session = $existing;
			}
			$this->session->uuid = $uuid;

			if(session_status() != PHP_SESSION_ACTIVE) {
				session_id($uuid);
				if(session_status() == PHP_SESSION_NONE) {
					session_start();
				}
			}
		}
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

	public function user(): null|User
	{
		return $this->session->getUser();
	}

	private function getSessionUuid()
	{
		return session_id() ?? $this->cookies['PHPSESSID'] ?? null;
	}

	public function getAll()
	{
		return $this->parameters;
	}

	public function logIn(User $user): void
	{
		$this->session->id_user = $user->id;
		$this->session->save();
	}
}