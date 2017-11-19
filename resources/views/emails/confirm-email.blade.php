@component('mail::message')
# You're Just One Step Away

Sorry, but I just need you to confirm your email. Don't worry, you'll be using Task Lass in no time!

@component('mail::button', [
    'url' => url('/register/confirm?token=' . $user->confirmation_token)
])
Confirm Email
@endcomponent

Thanks,<br>
Nathan at {{ config('app.name') }}
@endcomponent
