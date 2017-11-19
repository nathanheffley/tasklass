<?php

namespace Tests\Feature;

use App\User;
use Tests\TestCase;
use App\Mail\ConfirmationEmail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Auth\Events\Registered;
use Illuminate\Foundation\Testing\RefreshDatabase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function AConfirmationEmailIsSentUponRegistration()
    {
        Mail::fake();

        event(new Registered(factory('App\User')->create()));

        Mail::assertSent(ConfirmationEmail::class);
    }

    /** @test */
    public function UsersCanFullyConfirmTheirEmailAddresses()
    {
        Mail::fake();

        $this->post('/register', [
            'email' => 'john@example.com',
            'password' => 'secret',
            'password_confirmation' => 'secret'
        ]);

        $user = User::whereEmail('john@example.com')->first();

        $this->assertFalse($user->confirmed);
        $this->assertNotNull($user->confirmation_token);

        $response = $this->get('/register/confirm?token=' . $user->confirmation_token);

        $this->assertTrue($user->fresh()->confirmed);

        $response->assertRedirect('/todos');
    }
}
