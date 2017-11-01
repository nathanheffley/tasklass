<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="theme-color" content="#00d1b2">
        <title>@yield('title', 'Task Lass')</title>

        <script>
            window.Todo = {
                token: "{{ csrf_token() }}",
            };
        </script>
        <link rel="stylesheet" href="{{ elixir('css/app.css') }}">
        <link rel="manifest" href="/manifest.json">
    </head>
    <body>
        @include('layouts.navbar')

        @yield('body')

        @stack('beforeScripts')
        <script src="{{ elixir('js/app.js') }}"></script>
        @stack('afterScripts')
    </body>
</html>
