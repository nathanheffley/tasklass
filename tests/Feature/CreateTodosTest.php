<?php

namespace Tests\Feature;

use App\Todo;
use App\User;
use Tests\TestCase;
use PHPUnit\Framework\Assert;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CreateTodosTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function addingAValidTodo()
    {
        $user = factory(User::class)->create();

        $response = $this->actingAs($user)->post('/todos', [
            'name' => 'Sample Todo',
        ]);

        $response->assertStatus(200);

        // Assert that the server responds with the new todo data
        $this->assertEquals('Sample Todo', $response->original['todo']->name);
        $this->assertFalse($response->original['todo']->completed, 'Failed asserting that the todo is incomplete.');

        // Assert that the new todo was saved to the database
        tap(Todo::first(), function ($todo) use ($user) {
            $this->assertTrue($todo->user->is($user));
            $this->assertEquals('Sample Todo', $todo->name);
            $this->assertFalse($todo->completed, 'Failed asserting that the todo is incomplete.');
        });
    }

    /** @test */
    public function guestsCannotAddNewTodos()
    {
        $response = $this->post('/todos', [
            'name' => 'Sample Todo',
        ]);

        $response->assertStatus(401);
        $this->assertTrue($response->original['errors']->has('authorization'));
        $this->assertEquals(0, Todo::count(), 'Failed asserting that the todo was not created.');
    }

    /** @test */
    public function nameIsRequired()
    {
        $user = factory(User::class)->create();

        $response = $this->actingAs($user)->post('/todos', [
            'name' => '',
        ]);

        $response->assertStatus(422);
        $this->assertTrue($response->original['errors']->has('name'));
        $this->assertEquals(0, Todo::count(), 'Failed asserting that the todo was not created.');
    }
}
