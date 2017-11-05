import React, { Component } from 'react';

export default class AddTodo extends Component {
    constructor() {
        super();
        this.state = {name: ''};

        this.clearName = this.clearName.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    clearName() {
        this.setState({name: ''});
    }

    handleChange(event) {
        this.setState({name: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        window.axios.post('/todos', {'name': this.state.name})
        .then(function (response) {
            this.props.addTodo(response.data.todo);
            this.clearName();
        }.bind(this))
        .catch(function (error) {
            console.log(error);
        });
    }

    render() {
        return (
            <form className="add-todo" onSubmit={this.handleSubmit}>
                <input type="hidden" name="_token" value={window.Todo.token} />

                <div className="field">
                    <div className="control">
                        <input className="input"
                            type="text" name="name"
                            aria-label="Todo"
                            onChange={this.handleChange}
                            value={this.state.name}
                            placeholder="todo" />
                    </div>
                </div>

                <div className="field is-grouped">
                    <div className="control">
                        <button className="button is-primary" type="submit">Add Todo</button>
                    </div>
                    <div className="control">
                        <button className="button is-link" type="button" onClick={this.clearName}>Cancel</button>
                    </div>
                </div>
            </form>
        );
    }
}
