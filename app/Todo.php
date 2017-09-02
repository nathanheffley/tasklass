<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Todo extends Model
{
    protected $fillable = ['name', 'completed', 'weight'];

    protected $casts = ['completed' => 'boolean'];

    public function scopeOrdered($query)
    {
        return $query->orderBy('weight', 'asc')->get();
    }

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
