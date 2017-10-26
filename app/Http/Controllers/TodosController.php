<?php

namespace App\Http\Controllers;

use App\Todo;
use Validator;
use Illuminate\Http\Request;
use Illuminate\Support\MessageBag;
use Illuminate\Support\Facades\Auth;

class TodosController extends Controller
{
    public function index()
    {
        if (Auth::guest()) {
            return redirect('/login');
        }

        $todos = Auth::user()->orderedTodos();

        return view('todos.index', compact('todos'));
    }

    public function indexJson()
    {
        if (Auth::guest()) {
            return response()->json(['errors' => new MessageBag([
                'authorization' => 'Only authenticated users can create todos.',
            ])], 401);
        }

        $todos = Auth::user()->orderedTodos();

        return response()->json(['todos' => $todos], 200);
    }

    public function store()
    {
        if (Auth::guest()) {
            return response()->json(['errors' => new MessageBag([
                'authorization' => 'Only authenticated users can create todos.',
            ])], 401);
        }

        $data = request()->only(['name', 'due', 'weight']);

        $validator = Validator::make($data, [
            'name' => ['required'],
            'due' => ['nullable'],
            'weight' => ['numeric', 'nullable'],
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if (! array_key_exists('due', $data)) {
            $data['due'] = null;
        }

        if (array_key_exists('weight', $data)) {
            if ($data['weight'] == null) {
                $data['weight'] = 0;
            }
        } else {
            $data['weight'] = 0;
        }

        $todo = Auth::user()->todos()->create([
            'name' => $data['name'],
            'completed' => false,
            'due' => $data['due'],
            'weight' => (int) $data['weight'],
        ]);

        return response()->json(['todo' => $todo], 200);
    }

    public function update($id)
    {
        $todo = Todo::find($id);

        if (request('completed') !== null) {
            if (request('completed')) {
                $todo->complete();
            } else {
                $todo->markIncomplete();
            }
        }

        if (request('name') !== null) {
            $todo->name = request('name');
        }

        if (request('due') === false) {
            $todo->due = null;
        } elseif (request('due') !== null) {
            $todo->due = request('due');
        }

        $todo->save();

        return response()->json(['todo' => $todo], 200);
    }

    public function archive($id)
    {
        $todo = Todo::withTrashed()->findOrFail($id);

        $todo->archive();
    }
}
