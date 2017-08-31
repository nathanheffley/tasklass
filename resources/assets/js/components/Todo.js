import React, { Component } from 'react';

export default class Todo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            details: this.props.details,
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
        return (
            <li><input type="checkbox" checked={this.state.details.completed} onChange={this.complete} /> {this.state.details.name}</li>
        );
    }
}
