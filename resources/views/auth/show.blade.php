@extends('layouts.master')

@section('body')
    <section class="section">
        <div class="container">
            <form action="/login" method="POST">
                {{ csrf_field() }}

                <div class="field">
                    <label class="label">Email</label>
                    <div class="control has-icons-left{{ $errors->has('email') ? ' has-icons-right' : '' }}">
                        <input class="input{{ $errors->has('email') ? ' is-danger' : '' }}"
                            type="email" name="email" placeholder="you@example.com" value="{{ old('email') }}" required>
                        <span class="icon is-small is-left"><i class="fa fa-envelope"></i></span>
                        @if ($errors->has('email'))
                            <span class="icon is-small is-right"><i class="fa fa-warning"></i></span>
                            <p class="help is-danger">{{ $errors->first('email') }}</p>
                        @endif
                    </div>
                </div>

                <div class="field">
                    <label class="label">Password</label>
                    <div class="control">
                        <input class="input" type="password" name="password" placeholder="password" required>
                    </div>
                </div>

                <div class="field is-grouped">
                    <div class="control">
                        <button class="button is-primary" type="submit">Log in</button>
                    </div>
                    <div class="control">
                        <a class="button is-link" href="/register">Need an Account?</a>
                    </div>
                </div>
            </form>
        </container>
    </section>
@endsection