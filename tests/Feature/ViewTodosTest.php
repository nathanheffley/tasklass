<?php

namespace Tests\Feature;

use App\User;
use App\Todo;
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
            Assert::assertTrue($this->contains($value), "Failed asserting that the collection contains the specified value.");
        });

        Collection::macro('assertNotContains', function ($value) {
            Assert::assertFalse($this->contains($value), "Failed asserting that the collection does not contain the specified value.");
        });
    }

    /** @test */
    public function userCanOnlyViewTheirOwnTodos()
    {
        $this->withoutExceptionHandling();
        $user = factory(User::class)->create();
        $otherUser = factory(User::class)->create();
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
}
