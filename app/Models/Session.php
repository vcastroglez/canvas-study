<?php

namespace app\Models;

use src\Model;

class Session extends Model{

	public function getUser()
	{
		return User::findOne($this->id_user);
	}
}