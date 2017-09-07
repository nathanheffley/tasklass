import React, { Component } from 'react';

export default class Todo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            details: this.props.details,
            checkboxId: `todo-${this.props.details.id}`,
            editing: false,
            oldName: this.props.details.name,
            loadingDelete: false,
        }

        this.complete = this.complete.bind(this);
        this.delete = this.delete.bind(this);
        this.toggleCompleted = this.toggleCompleted.bind(this);
        this.toggleLoadingDelete = this.toggleLoadingDelete.bind(this);
        this.startEditing = this.startEditing.bind(this);
        this.cancelEditing = this.cancelEditing.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleNameSave = this.handleNameSave.bind(this);
    }

    complete() {
        // Update completed state before sending request (perceived speed)
        this.toggleCompleted();

        window.axios.put(`/todos/${this.state.details.id}`, {'completed': this.state.details.completed})
        .then(function (result) {
            this.props.updateTodo(this.state.details.id, null, this.state.details.completed);
        }.bind(this))
        .catch(function (error) {
            // If there was a problem, set the state back to original value
            this.toggleCompleted();
        }.bind(this));
    }

    delete() {
        this.toggleLoadingDelete();

        window.axios.delete(`/todos/${this.state.details.id}`)
        .then(function (result) {
            this.props.removeTodo(this.props.id);
        }.bind(this))
        .catch(function (error) {
            this.toggleLoadingDelete();
            console.log('Failed to delete todo:', error);
        }.bind(this));
    }

    toggleCompleted() {
        let details = this.state.details;
        details.completed = !details.completed;
        this.setState({details: details});
    }

    toggleLoadingDelete() {
        let loadingDelete = this.state.loadingDelete;
        loadingDelete = !loadingDelete;
        this.setState({loadingDelete: loadingDelete});
    }

    startEditing() {
        this.setState({editing: true});
    }

    cancelEditing() {
        let details = this.state.details;
        details.name = this.state.oldName;
        this.setState({details: details});

        this.setState({editing: false});
    }

    handleNameChange(event) {
        let details = this.state.details;
        details.name = event.target.value;
        this.setState({details: details});
    }

    handleNameSave() {
        this.setState({editing: false});

        if (this.state.details.name == this.state.oldName) { return; }

        window.axios.put(`/todos/${this.state.details.id}`, {'name': this.state.details.name})
        .then(function (response) {
            this.setState({oldName: this.state.details.name});
            this.props.updateTodo(this.state.details.id, this.state.details.name);
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
        let editButton;
        let deleteButtonClasses = "button is-danger is-outlined";

        if (this.state.details.completed) {
            todoClasses += " completed";
            checkboxLabel = <span className="icon"><i className="fa fa-check-square-o checkbox"></i></span>;
        } else {
            checkboxLabel = <span className="icon"><i className="fa fa-square-o checkbox"></i></span>;
        }

        if (this.state.editing) {
            nameElement = (
                <div className="todo__name-edit field has-addons">
                    <div className="control todo__name-edit-textfield">
                        <input className="input" type="text" name="name"
                            value={this.state.details.name}
                            onChange={this.handleNameChange}>
                        </input>
                    </div>
                    <div className="control">
                        <button className="button is-warning" onClick={this.cancelEditing}>Cancel</button>
                    </div>
                </div>
            );
        } else {
            nameElement = <span className="todo__name" onDoubleClick={this.startEditing}>{this.state.details.name}</span>;
        }

        if (this.state.loadingDelete) {
            deleteButtonClasses += " is-loading";
        }

        if (this.state.editing) {
            editButton = (
                <button className="todo__edit-button button is-primary is-outlined" onClick={this.handleNameSave} aria-label="Edit">
                    <span className="icon"><i className="fa fa-save"></i></span>
                </button>
            );
        } else {
            editButton = (
                <button className="todo__edit-button button is-primary is-outlined" onClick={this.startEditing} aria-label="Edit">
                    <span className="icon"><i className="fa fa-pencil"></i></span>
                </button>
            );
        }

        return (
            <li className={todoClasses}>
                <input id={this.state.checkboxId}
                    className="todo__checkbox"
                    aria-label="Todo" type="checkbox"
                    checked={this.state.details.completed}
                    onChange={this.complete} />

                <label htmlFor={this.state.checkboxId}>
                    {checkboxLabel}
                </label>

                {nameElement}

                <p className="todo__actions field">
                    {editButton}
                    <button className={deleteButtonClasses} onClick={this.delete} aria-label="Delete">
                        <span className="icon"><i className="fa fa-trash"></i></span>
                    </button>
                </p>
            </li>
        );
    }
}
