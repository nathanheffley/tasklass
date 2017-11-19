<?php

namespace Tests\Feature;

use App\Todo;
use App\User;
use Tests\TestCase;
use PHPUnit\Framework\Assert;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Testing\TestResponse;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ViewTodosTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp()
    {
        parent::setUp();

        TestResponse::macro('data', function ($key) {
            return $this->original->getData()[$key];
        });

        Collection::macro('assertContains', function ($value) {
            Assert::assertTrue($this->contains($value), 'Failed asserting that the collection contains the specified value.');
        });

        Collection::macro('assertNotContains', function ($value) {
            Assert::assertFalse($this->contains($value), 'Failed asserting that the collection does not contain the specified value.');
        });
    }

    /** @test */
    public function userCanOnlyViewTheirOwnTodos()
    {
        $user = factory(User::class)->states(['confirmed'])->create();
        $otherUser = factory(User::class)->states(['confirmed'])->create();
        $todoA = factory(Todo::class)->create(['user_id' => $user->id]);
        $todoB = factory(Todo::class)->create(['user_id' => $otherUser->id]);
        $todoC = factory(Todo::class)->create(['user_id' => $user->id]);
        $todoD = factory(Todo::class)->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->get('/todos');

        $response->assertStatus(200);
        $response->data('todos')->assertContains($todoA);
        $response->data('todos')->assertNotContains($todoB);
        $response->data('todos')->assertContains($todoC);
        $response->data('todos')->assertContains($todoD);
    }

    /** @test */
    public function guestsCannotViewTodos()
    {
        $response = $this->get('/todos');

        $response->assertRedirect('/login');
    }

    /** @test */
    public function todosCanBeRetrievedAsJson()
    {
        $this->withoutExceptionHandling();
        $user = factory(User::class)->states(['confirmed'])->create();
        $todoA = factory(Todo::class)->create(['user_id' => $user->id]);
        $todoB = factory(Todo::class)->create(['user_id' => $user->id]);
        $todoC = factory(Todo::class)->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->get('/todos.json');

        $response->assertStatus(200);
        $responseTodos = $response->getData()->todos;
        $this->assertEquals($todoA->id, $responseTodos[0]->id);
        $this->assertEquals($todoB->id, $responseTodos[1]->id);
        $this->assertEquals($todoC->id, $responseTodos[2]->id);
    }
}
