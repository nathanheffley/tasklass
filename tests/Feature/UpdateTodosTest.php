<?php

namespace Tests\Feature;

use App\Todo;
use App\User;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UpdateTodosTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function completingATodo()
    {
        $this->withoutExceptionHandling();
        $user = factory(User::class)->create();
        $todo = factory(Todo::class)->create([
            'user_id' => $user->id,
            'completed' => false,
        ]);

        $response = $this->actingAs($user)->put("/todos/{$todo->id}", [
            'completed' => true,
        ]);

        $response->assertStatus(200);

        // Assert that the server responds with success data
        $this->assertTrue($response->original['todo']->completed, 'Failed asserting that the todo is completed.');

        // Assert that the todo was updated in the database
        tap(Todo::first(), function ($todo) use ($user) {
            $this->assertTrue($todo->user->is($user));
            $this->assertTrue($todo->completed, 'Failed asserting that the todo is completed.');
        });
    }

    /** @test */
    public function markingATodoIncomplete()
    {
        $this->withoutExceptionHandling();
        $user = factory(User::class)->create();
        $todo = factory(Todo::class)->create([
            'user_id' => $user->id,
            'completed' => true,
        ]);

        $response = $this->actingAs($user)->put("/todos/{$todo->id}", [
            'completed' => false,
        ]);

        $response->assertStatus(200);

        // Assert that the server responds with success data
        $this->assertFalse($response->original['todo']->completed, 'Failed asserting that the todo is incomplete.');

        // Assert that the todo was updated in the database
        tap(Todo::first(), function ($todo) use ($user) {
            $this->assertTrue($todo->user->is($user));
            $this->assertFalse($todo->completed, 'Failed asserting that the todo is incomplete.');
        });
    }
}
