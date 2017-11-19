<?php

namespace Tests\Feature;

use App\User;
use Tests\TestCase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UserRegisterTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function registeringWithValidCredentialsCreatesAccountAndLogsThemIn()
    {
        $this->withoutExceptionHandling();

        $response = $this->post('/register', [
            'email' => 'john@example.com',
            'password' => 'secret',
            'password_confirmation' => 'secret',
        ]);

        $response->assertRedirect('/register/confirm');
        $this->assertTrue(Auth::check(), 'Failed asserting that the user was successfully logged in after registration.');
    }

    /** @test */
    public function registrationFailsIfPasswordConfirmationDoesNotMatch()
    {
        $this->withoutExceptionHandling();

        $this->expectException(\Illuminate\Validation\ValidationException::class);

        $response = $this->post('/register', [
            'email' => 'john@example.com',
            'password' => 'secret',
            'password_confirmation' => 'wrongpassword',
        ]);
    }
}
