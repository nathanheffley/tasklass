<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Exceptions\InvalidWeightException;
use Illuminate\Database\Eloquent\SoftDeletes;

class Todo extends Model
{
    use SoftDeletes;

    protected $fillable = ['name', 'completed', 'weight'];

    protected $casts = ['completed' => 'boolean'];

    public function scopeOrdered($query)
    {
        return $query->orderBy('weight', 'asc')->get();
    }

    public function scopeArchived($query)
    {
        return $query->withTrashed()->get();
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

    public function setWeight($weight)
    {
        if (! is_numeric($weight)) {
            throw new InvalidWeightException;
        }

        $this->update(['weight' => $weight]);
    }

    public function archive()
    {
        $this->delete();
    }
}
