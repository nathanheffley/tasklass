<?php

namespace Tests\Unit;

use App\Todo;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class TodoTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function todoCanBeCompleted()
    {
        $todo = factory(Todo::class)->create(['completed' => false]);

        $todo->complete();

        $this->assertTrue($todo->fresh()->completed, 'Failed asserting that the todo is completed.');
    }

    /** @test */
    public function todoCanBeMarkedIncomplete()
    {
        $todo = factory(Todo::class)->create(['completed' => true]);

        $todo->markIncomplete();

        $this->assertFalse($todo->fresh()->completed, 'Failed asserting that the todo is not completed.');
    }

    /** @test */
    public function todoReturnsCompletedAsBoolean()
    {
        $todo = factory(Todo::class)->create(['completed' => true]);

        $this->assertTrue($todo->fresh()->completed);
    }
}
