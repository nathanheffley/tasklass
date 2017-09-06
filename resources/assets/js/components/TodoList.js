import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Todo from './Todo';
import AddTodo from './AddTodo';

export default class TodoList extends Component {
    constructor() {
        super();

        this.state = {
            todos: null
        };
        this.loadTodos().then(todos => {
            this.setState({todos: todos});
        });

        this.addTodo = this.addTodo.bind(this);
        this.removeTodo = this.removeTodo.bind(this);
    }

    loadTodos() {
        return new Promise(resolve => {
            resolve(window.Todo.todos);
        });
    }

    addTodo(data) {
        const todos = this.state.todos;
        todos.push(data);
        this.setState({ todos });
    }

    removeTodo(key) {
        const todos = this.state.todos;
        delete todos[key];
        this.setState({ todos });
    }

    render() {
        if (this.state.todos == null) {
            return (
                <div>
                    <section className="section">
                        <div className="container">
                            <h2>No Todos!</h2>
                        </div>
                    </section>
                    <AddTodo addTodo={this.addTodo} />
                </div>
            );
        }
        return (
            <div>
                <section className="section">
                    <div className="container">
                        <ul >
                            {
                                Object
                                    .keys(this.state.todos)
                                    .map(key => <Todo key={key} id={key} details={this.state.todos[key]} removeTodo={this.removeTodo} />)
                            }
                        </ul>
                    </div>
                </section>
                <AddTodo addTodo={this.addTodo} />
            </div>
        );
    }
}

if (document.getElementById('todo-list')) {
    ReactDOM.render(<TodoList />, document.getElementById('todo-list'));
}
