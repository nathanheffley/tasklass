<?php

use App\Todo;
use App\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $user = factory(User::class)->create([
            'email' => 'nathan@example.com',
            'password' => bcrypt('secret'),
        ]);

        factory(Todo::class)->create([
            'user_id' => $user->id,
            'name' => 'First Todo',
        ]);
        factory(Todo::class)->create([
            'user_id' => $user->id,
            'name' => 'Second Todo',
            'completed' => true,
            'weight' => 2,
        ]);
        factory(Todo::class)->create([
            'user_id' => $user->id,
            'name' => 'Third Todo',
            'weight' => 1,
        ]);
    }
}
