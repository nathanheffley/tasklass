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

    /** @test */
    public function todoWeightCanBeSet()
    {
        $todo = factory(Todo::class)->create(['weight' => 0]);

        $todo->setWeight(3);

        $this->assertEquals(3, $todo->fresh()->weight, 'Failed asserting that the todo weight was changed.');
    }

    /**
     * @test
     * @expectedException App\Exceptions\InvalidWeightException
     */
    public function settingTodoWeightToNonNumericValueThrowsInvalidWeightException()
    {
        $todo = factory(Todo::class)->create();

        $todo->setWeight('not a number');
    }

    /** @test */
    public function todosCanBeFetchedInWeightedOrder()
    {
        $todoA = factory(Todo::class)->create(['weight' => 0]);
        $todoB = factory(Todo::class)->create(['weight' => 1]);
        $todoC = factory(Todo::class)->create(['weight' => -1]);
        $todoD = factory(Todo::class)->create(['weight' => 2]);

        $todos = Todo::ordered();

        $this->assertEquals($todos[0]->id, $todoC->id);
        $this->assertEquals($todos[1]->id, $todoA->id);
        $this->assertEquals($todos[2]->id, $todoB->id);
        $this->assertEquals($todos[3]->id, $todoD->id);
    }
}
