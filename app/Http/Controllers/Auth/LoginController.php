<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    public function show()
    {
        return view('auth.show');
    }

    public function login()
    {
        if (! Auth::attempt(request(['email', 'password']))) {
            return redirect('/login')->withInput(request(['email']))->withErrors([
                'email' => ['These credentials do not match our records.'],
            ]);
        }

        return redirect('/todos');
    }

    public function logout()
    {
        Auth::logout();

        return redirect('/login');
    }
}
