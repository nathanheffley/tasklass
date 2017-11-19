<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'confirmation_token',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'confirmed' => 'boolean',
    ];

    public function confirm()
    {
        $this->confirmed = true;

        $this->save();
    }

    public function todos()
    {
        return $this->hasMany(Todo::class);
    }

    public function orderedTodos()
    {
        return $this->todos()->ordered();
    }
}
