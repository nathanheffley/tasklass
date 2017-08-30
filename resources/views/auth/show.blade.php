@extends('layouts.master')

@section('body')
    <form action="/login" method="POST">
        {{ csrf_field() }}
        <input type="email" name="email" placeholder="you@example.com">
        <input type="password" name="password" placeholder="password">
        <button type="submit">Log In</button>
    </form>
@endsection