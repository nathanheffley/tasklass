<?php

namespace Tests\Unit;

use App\User;
use App\Todo;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function usersTodosCanBeReturnedInWeightedOrder()
    {
        $user = factory(User::class)->create();
        $todoA = factory(Todo::class)->create(['weight' => 0, 'user_id' => $user->id]);
        $todoB = factory(Todo::class)->create(['weight' => 1, 'user_id' => $user->id]);
        $todoC = factory(Todo::class)->create(['weight' => -1, 'user_id' => $user->id]);
        $todoD = factory(Todo::class)->create(['weight' => 2, 'user_id' => $user->id]);

        $todos = $user->orderedTodos();

        $this->assertEquals($todos[0]->id, $todoC->id);
        $this->assertEquals($todos[1]->id, $todoA->id);
        $this->assertEquals($todos[2]->id, $todoB->id);
        $this->assertEquals($todos[3]->id, $todoD->id);
    }
}
