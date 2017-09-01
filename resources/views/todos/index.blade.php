@extends('layouts.master')

@section('body')
    <section class="section">
        <div id="todo-list" class="container"></div>
    </section>
@endsection

@push('beforeScripts')
<script>
    window.Todo.todos = {!! $todos !!};
</script>
@endpush
