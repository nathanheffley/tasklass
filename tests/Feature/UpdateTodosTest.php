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
            'name' => 'Sample Todo',
            'completed' => false,
        ]);

        $response = $this->actingAs($user)->put("/todos/{$todo->id}", [
            'completed' => true,
        ]);

        $response->assertStatus(200);

        // Assert that the server responds with success data
        $this->assertEquals('Sample Todo', $response->original['todo']->name);
        $this->assertTrue($response->original['todo']->completed, 'Failed asserting that the todo is completed.');

        // Assert that the todo was updated in the database
        tap(Todo::first(), function ($todo) use ($user) {
            $this->assertTrue($todo->user->is($user));
            $this->assertEquals('Sample Todo', $todo->name);
            $this->assertTrue($todo->completed, 'Failed asserting that the todo is complete.');
        });
    }
}
