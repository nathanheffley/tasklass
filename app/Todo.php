<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Todo extends Model
{
    protected $fillable = ['name', 'completed'];

    protected $casts = ['completed' => 'boolean'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function complete()
    {
        $this->update(['completed' => true]);
    }

    public function markIncomplete()
    {
        $this->update(['completed' => false]);
    }
}
