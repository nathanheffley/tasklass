import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export class Todo extends Component {
    render() {
        return (
            <li>{this.props.details.name}</li>
        );
    }
}

export class AddTodo extends Component {
    constructor() {
        super();
        this.state = {name: ''};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({name: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        window.axios.post('/todos', {'name': this.state.name})
        .then(function (response) {
            this.props.addTodo(response.data.todo);
            this.setState({name: ''});
        }.bind(this))
        .catch(function (error) {
            console.log(error);
        });
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input type="hidden" name="_token" value={window.Todo.token} />
                <input name="name" value={this.state.name} onChange={this.handleChange} placeholder="todo" />
                <button type="submit">Add Todo</button>
            </form>
        );
    }
}

export default class TodoList extends Component {
    constructor() {
        super();
        this.state = {
            todos: window.Todo.todos,
        }

        this.addTodo = this.addTodo.bind(this);
    }

    addTodo(data) {
        const todos = this.state.todos;
        todos.push(data);
        this.setState({ todos });
    }

    render() {
        return (
            <ul>
                {
                    Object
                        .keys(this.state.todos)
                        .map(key => <Todo key={key} details={this.state.todos[key]} />)
                }
                <AddTodo addTodo={this.addTodo} />
            </ul>
        );
    }
}

if (document.getElementById('todo-list')) {
    ReactDOM.render(<TodoList />, document.getElementById('todo-list'));
}
