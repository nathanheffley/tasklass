import React, { Component } from 'react';

export default class AddTodo extends Component {
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
