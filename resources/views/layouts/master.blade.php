<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title>@yield('title', 'Todo')</title>

        <script>
            window.Todo = {
                token: "{{ csrf_token() }}",
            };
        </script>
        <link rel="stylesheet" href="{{ elixir('css/app.css') }}">
    </head>
    <body class="bg-dark">
        <div id="app">
            <nav>
                @if (Auth::check())
                    <form action="/logout" method="POST">
                        {{ csrf_field() }}
                        <button type="submit">Log out</button>
                    </form>
                @endif
            </nav>

            @yield('body')
        </div>

        @stack('beforeScripts')
        <script src="{{ elixir('js/app.js') }}"></script>
        @stack('afterScripts')
    </body>
</html>
