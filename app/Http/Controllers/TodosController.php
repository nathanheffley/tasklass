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

        $todos = Auth::user()->todos;

        return view('todos.index', compact('todos'));
    }

    public function store()
    {
        if (Auth::guest()) {
            return response()->json(['errors' => new MessageBag([
                'authorization' => 'Only authenticated users can create todos.',
            ])], 401);
        }

        $data = request()->only(['name']);

        $validator = Validator::make($data, [
            'name' => ['required'],
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $todo = Auth::user()->todos()->create([
            'name' => $data['name'],
            'completed' => false,
        ]);

        return response()->json(['todo' => $todo], 200);
    }

    public function update($id)
    {
        $todo = Todo::find($id);

        $todo->update([
            'name' => request('name') ? request('name') : $todo->name,
            'completed' => request('completed') ? request('completed') : $todo->completed,
        ]);

        return response()->json(['todo' => $todo], 200);
    }
}
