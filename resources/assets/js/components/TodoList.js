import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Todo from './Todo';
import AddTodo from './AddTodo';

export default class TodoList extends Component {
    constructor() {
        super();

        this.state = {
            todos: null,
            todosCount: 0
        };
        this.loadTodos().then(todos => {
            this.setState({todos: todos});
            this.setState({todosCount: todos.length});
            this.storeTodoCount();
        });

        this.adjustTodoCount = this.adjustTodoCount.bind(this);
        this.storeTodoCount = this.storeTodoCount.bind(this);
        this.addTodo = this.addTodo.bind(this);
        this.removeTodo = this.removeTodo.bind(this);
    }

    loadTodos() {
        return new Promise(resolve => {
            window.axios.get('/todos.json')
                .then(response => {
                    resolve(response.data.todos);
                })
                .catch(err => {
                    reject(Error(err));
                });
        });
    }

    adjustTodoCount(change) {
        const todosCount = this.state.todosCount;
        this.setState({todosCount: todosCount + change});
        this.storeTodoCount();
    }

    storeTodoCount() {
        if ('localStorage' in window) {
            localStorage.setItem('todoCount', this.state.todosCount);
        }
    }

    getTodoCount() {
        if ('localStorage' in window) {
            return localStorage.getItem('todoCount');
        } else {
            return 0;
        }
    }

    addTodo(data) {
        const todos = this.state.todos;
        todos.push(data);
        this.setState({ todos });

        this.adjustTodoCount(1);
    }

    removeTodo(key) {
        const todos = this.state.todos;
        delete todos[key];
        this.setState({ todos });

        this.adjustTodoCount(-1);
    }

    render() {
        if (this.state.todos == null) {

            let todoList = null;
            let skeletonTodos = this.getTodoCount();

            if (skeletonTodos > 0) {
                todoList = [];
                for (var i = 0; i < skeletonTodos; i++) {
                    todoList.push(<li key={`skeleton-${i}`} className="todo todo--skeleton"></li>);
                }
            }

            return (
                <div>
                    <section className="section">
                        <div className="container">
                            <ul>
                                {todoList}
                            </ul>
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
                        <ul>
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
