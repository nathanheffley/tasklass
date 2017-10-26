import React, { Component } from 'react';

export default class Todo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            details: this.props.details,
            due: this.props.details.due ? this.props.details.due : '',
            checkboxId: `todo-${this.props.details.id}`,
            editingName: false,
            editingDue: false,
            oldName: this.props.details.name,
            oldDue: this.props.details.due ? this.props.details.due : '',
            loadingDelete: false,
        }

        this.complete = this.complete.bind(this);
        this.delete = this.delete.bind(this);
        this.toggleCompleted = this.toggleCompleted.bind(this);
        this.toggleLoadingDelete = this.toggleLoadingDelete.bind(this);

        this.startEditingName = this.startEditingName.bind(this);
        this.cancelEditingName = this.cancelEditingName.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleNameSave = this.handleNameSave.bind(this);

        this.startEditingDue = this.startEditingDue.bind(this);
        this.cancelEditingDue = this.cancelEditingDue.bind(this);
        this.deleteDue = this.deleteDue.bind(this);
        this.handleDueChange = this.handleDueChange.bind(this);
        this.handleDueSave = this.handleDueSave.bind(this);

        this.formatDate = this.formatDate.bind(this);
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

    startEditingName() {
        this.setState({editingName: true});
    }

    cancelEditingName() {
        let details = this.state.details;
        details.name = this.state.oldName;
        this.setState({details: details});

        this.setState({editingName: false});
    }

    handleNameChange(event) {
        let details = this.state.details;
        details.name = event.target.value;
        this.setState({details: details});
    }

    handleNameSave() {
        this.setState({editingName: false});

        if (this.state.details.name == this.state.oldName) { return; }

        window.axios.put(`/todos/${this.state.details.id}`, {'name': this.state.details.name, 'due': null})
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

    startEditingDue() {
        this.setState({editingDue: true});
    }

    cancelEditingDue() {
        let due = this.state.due;
        due = this.state.oldDue;
        this.setState({due: due});

        this.setState({editingDue: false});
    }

    deleteDue() {
        this.setState({editingDue: false, due: ''});

        window.axios.put(`/todos/${this.state.details.id}`, {'due': false})
        .then(function (response) {
            this.setState({oldDue: ''});
            // this.props.updateTodo(this.state.details.id, '');
        }.bind(this))
        .catch(function (error) {
            let due = this.state.due;
            due = this.state.oldDue;
            this.setState({due: due});
            console.log(error);
        }.bind(this));
    }

    handleDueChange(event) {
        let due = this.state.due;
        due = event.target.value;
        this.setState({due: due});
    }

    handleDueSave() {
        this.setState({editingDue: false});

        if (this.state.due == this.state.oldDue) { return; }

        window.axios.put(`/todos/${this.state.details.id}`, {'due': this.state.due})
        .then(function (response) {
            this.setState({oldDue: this.state.due});
            this.props.updateTodo(this.state.details.id, this.state.due);
        }.bind(this))
        .catch(function (error) {
            let details = this.state.details;
            due = this.state.oldDue;
            this.setState({details: details});
            console.log(error);
        }.bind(this));
    }

    formatDate() {
        return window.moment(this.state.due).format('MMM Do YYYY');
    }

    render() {
        let todoClasses = "todo";
        let checkboxLabel;
        let nameElement;
        let dueElement;
        let editButton;
        let deleteButtonClasses = "button is-danger is-outlined";

        if (this.state.details.completed) {
            todoClasses += " completed";
            checkboxLabel = <span className="icon"><i className="fa fa-check-square-o checkbox"></i></span>;
        } else {
            checkboxLabel = <span className="icon"><i className="fa fa-square-o checkbox"></i></span>;
        }

        if (this.state.editingName) {
            nameElement = (
                <div className="todo__name-edit field has-addons">
                    <div className="control todo__name-edit-textfield">
                        <input className="input" type="text" name="name"
                            value={this.state.details.name}
                            onChange={this.handleNameChange}>
                        </input>
                    </div>
                    <div className="control">
                        <button className="button is-warning" onClick={this.cancelEditingName}>Cancel</button>
                    </div>
                </div>
            );
        } else {
            nameElement = <span className="todo__name" onDoubleClick={this.startEditingName}>{this.state.details.name}</span>;
        }

        if (this.state.editingDue) {
            dueElement = (
                <span className="todo__due">
                    <span className="icon remove" onClick={this.deleteDue}>
                        <i className="fa fa-trash"></i>
                    </span>
                    <span className="icon cancel" onClick={this.cancelEditingDue}>
                        <i className="fa fa-times"></i>
                    </span>
                    <span className="icon save" onClick={this.handleDueSave}>
                        <i className="fa fa-save"></i>
                    </span>
                    <input type="date" name="due" value={this.state.due} onChange={this.handleDueChange}/>
                </span>
            );
        } else if (this.state.due) {
            let classes = 'todo__due';
            let due = window.moment(this.state.due);
            if (window.moment().diff(due) >= 0) {
                classes += ' is-danger';
            }

            dueElement = (
                <span className={classes} onClick={this.startEditingDue}>
                    <span className="icon">
                        <i className="fa fa-clock-o"></i>
                    </span>
                    {this.formatDate()}
                </span>
            );
        } else {
            dueElement = (
                <span className="todo__due" onClick={this.startEditingDue}>
                    <span className="icon">
                        <i className="fa fa-clock-o"></i>
                    </span>
                </span>
            );
        }

        if (this.state.loadingDelete) {
            deleteButtonClasses += " is-loading";
        }

        if (this.state.editingName) {
            editButton = (
                <button className="todo__edit-button button is-primary is-outlined" onClick={this.handleNameSave} aria-label="Edit">
                    <span className="icon"><i className="fa fa-save"></i></span>
                </button>
            );
        } else {
            editButton = (
                <button className="todo__edit-button button is-primary is-outlined" onClick={this.startEditingName} aria-label="Edit">
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

                {dueElement}

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
