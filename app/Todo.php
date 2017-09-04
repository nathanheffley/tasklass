<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Exceptions\NotArchivedException;
use App\Exceptions\InvalidWeightException;
use App\Exceptions\AlreadyArchivedException;
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
        return $query->onlyTrashed()->get();
    }

    public function getArchivedAttribute()
    {
        return !! $this->deleted_at;
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
        if ($this->archived) {
            throw new AlreadyArchivedException;
        }

        $this->delete();
    }

    public function unarchive()
    {
        if (! $this->archived) {
            throw new NotArchivedException;
        }

        $this->restore();
    }
}
