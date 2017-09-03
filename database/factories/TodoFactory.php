<?php

use Faker\Generator as Faker;

$factory->define(App\Todo::class, function (Faker $faker) {
    return [
        'user_id' => function () {
            return factory(App\User::class)->create()->id;
        },
        'name' => $faker->realText(12),
        'completed' => false,
        'weight' => 0,
    ];
});

$factory->state(App\Todo::class, 'archived', function (Faker $faker) {
    return [
        'deleted_at' => new DateTime(),
    ];
});
