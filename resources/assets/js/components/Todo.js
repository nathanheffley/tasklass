import React, { Component } from 'react';

export default class Todo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            details: this.props.details,
            checkboxId: `todo-${this.props.details.id}`,
            editing: false,
            oldName: this.props.details.name,
        }

        this.complete = this.complete.bind(this);
        this.startEditing = this.startEditing.bind(this);
        this.stopEditing = this.stopEditing.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleNameSave = this.handleNameSave.bind(this);
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

    startEditing() {
        this.setState({editing: true});
    }

    stopEditing() {
        this.setState({editing: false});
    }

    handleNameChange(event) {
        let details = this.state.details;
        details.name = event.target.value;
        this.setState({details: details});
    }

    handleNameSave() {
        this.stopEditing();

        window.axios.put(`/todos/${this.state.details.id}`, {'name': this.state.details.name})
        .then(function (response) {
            this.setState({oldName: this.state.details.name});
        }.bind(this))
        .catch(function (error) {
            let details = this.state.details;
            details.name = this.state.oldName;
            this.setState({details: details});
            console.log(error);
        }.bind(this));
    }

    render() {
        let todoClasses = "todo";
        let checkboxLabel;
        let nameElement;

        if (this.state.details.completed) {
            todoClasses += " completed";
            checkboxLabel = <span className="icon"><i className="fa fa-check-square-o"></i></span>;
        } else {
            checkboxLabel = <span className="icon"><i className="fa fa-square-o"></i></span>;
        }

        if (this.state.editing) {
            nameElement = (
                <div className="field has-addons">
                    <div className="control">
                        <input className="input" type="text" name="name"
                            value={this.state.details.name}
                            onChange={this.handleNameChange}>
                        </input>
                    </div>
                    <div className="control">
                        <button className="button is-primary" onClick={this.handleNameSave}>Save</button>
                    </div>
                </div>
            );
        } else {
            nameElement = <span className="todo--name" onDoubleClick={this.startEditing}>{this.state.details.name}</span>;
        }

        return (
            <li className={todoClasses}>
                <input id={this.state.checkboxId} className="todo--checkbox" type="checkbox"
                    checked={this.state.details.completed}
                    onChange={this.complete} />
                <label htmlFor={this.state.checkboxId}>
                    {checkboxLabel}
                </label>
                {nameElement}
            </li>
        );
    }
}
