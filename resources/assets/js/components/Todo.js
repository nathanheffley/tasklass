import React, { Component } from 'react';

export default class Todo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            details: this.props.details,
            checkboxId: `todo-${this.props.details.id}`,
        }

        this.complete = this.complete.bind(this);
    }

    complete() {
        // Update completed state before sending request (perceived speed)
        this.toggleCompleted();

        window.axios.put(`/todos/${this.state.details.id}`, {'completed': this.state.details.completed})
        .catch(function (error) {
            // If there was a problem, set the state back to original value
            this.toggleCompleted();
        }.bind(this));
    }

    toggleCompleted() {
        let details = this.state.details;
        details.completed = !details.completed;
        this.setState({details: details});
    }

    render() {
        let todoClasses = "todo";
        let checkboxLabel;

        if (this.state.details.completed) {
            todoClasses += " completed";
            checkboxLabel = <span className="icon"><i className="fa fa-check-square-o"></i></span>;
        } else {
            checkboxLabel = <span className="icon"><i className="fa fa-square-o"></i></span>;
        }

        return (
            <li className={todoClasses}>
                <input id={this.state.checkboxId} className="todo--checkbox" type="checkbox"
                    checked={this.state.details.completed}
                    onChange={this.complete} />
                <label htmlFor={this.state.checkboxId}>
                    {checkboxLabel}
                    <span className="todo--name">{this.state.details.name}</span>
                </label>
            </li>
        );
    }
}
