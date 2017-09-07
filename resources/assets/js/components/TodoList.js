import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Todo from './Todo';
import AddTodo from './AddTodo';

export default class TodoList extends Component {
    constructor() {
        super();

        this.todosStoreVersion = 1;
        
        this.state = {
            todos: null,
            todosCount: 0
        };
        this.loadTodos().then(todos => {
            this.setState({todos: todos});
            this.setState({todosCount: todos.length});
            this.storeTodoCount();
            
            this.setupTodosStore();
        });

        this.setupTodosStore = this.setupTodosStore.bind(this);
        this.storeTodo = this.storeTodo.bind(this);
        this.deleteTodo = this.deleteTodo.bind(this);
        this.getTodo = this.getTodo.bind(this);
        this.updateTodo = this.updateTodo.bind(this);
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

    setupTodosStore() {
        if (!('indexedDB' in window)) {
            return;
        }

        let dbRequest = window.indexedDB.open('todosStore', this.todosStoreVersion);
        dbRequest.onerror = (event) => {
            console.log('todosStore IndexedDB setup error:', event.target.errorCode);
        };
        dbRequest.onupgradeneeded = (event) => {
            let db = event.target.result;
            let objectStore = db.createObjectStore('todos', {keyPath: 'id'});

            objectStore.transaction.oncomplete = (event) => {
                let todosObjectStore = db.transaction('todos', 'readwrite').objectStore('todos');
                this.state.todos.forEach((todo) => {
                    console.log('calling storeTodo for', todo);
                    this.storeTodo(todo);
                });
            };
        };
        dbRequest.onsuccess = (event) => {
            let db = event.target.result;
            let objectStore = db.transaction('todos', 'readwrite').objectStore('todos');

            let storedTodoIds = [];
            objectStore.openCursor().onsuccess = (event) => {
                let cursor = event.target.result;
                if (cursor) {
                    storedTodoIds.push(cursor.value.id);
                    cursor.continue();
                } else {
                    // Store any todos that are in state but not indexeddb
                    this.state.todos.forEach(todo => {
                        let stored = false;
                        storedTodoIds.forEach(storedId => {
                            if (todo.id === storedId) {
                                stored = true;
                            }
                        });
                        if (!stored) {
                            this.storeTodo(todo);
                        }
                    });

                    // Delete any todos that are in indexeddb but not state
                    storedTodoIds.forEach(storedId => {
                        let shouldDelete = true;
                        this.state.todos.forEach(todo => {
                            if (todo.id === storedId) {
                                shouldDelete = false;
                            }
                        });
                        if (shouldDelete) {
                            this.deleteTodo(storedId);
                        }
                    });
                }
            };
        }
    }

    storeTodo(todo) {
        if (name == null && completed == null && !('indexedDB' in window)) {
            return;
        }

        let dbRequest = window.indexedDB.open('todosStore', this.todosStoreVersion);
        dbRequest.onerror = (event) => {
            console.log('todosStore IndexedDB storeTodo error:', event.target.errorCode);
        };
        dbRequest.onsuccess = (event) => {
            let db = event.target.result;
            let objectStore = db.transaction(['todos'], 'readwrite').objectStore('todos');
            let request = objectStore.add(todo);
            request.onerror = (event) => {
                console.log('Error while adding a todo:', event);
            };
        };
    }

    deleteTodo(id) {
        if (!('indexedDB' in window)) {
            return;
        }

        let dbRequest = window.indexedDB.open('todosStore', this.todosStoreVersion);
        dbRequest.onerror = (event) => {
            console.log('todosStore IndexedDB deleteTodo error:', event.target.errorCode);
        };
        dbRequest.onsuccess = (event) => {
            let db = event.target.result;
            let objectStore = db.transaction('todos', 'readwrite').objectStore('todos');
            let request = objectStore.delete(id);
            request.onerror = (event) => {
                console.log('Error while deleting a todo:', event);
            };
        };
    }

    getTodo(id) {
        if (!('indexedDB' in window)) {
            return;
        }

        let dbRequest = window.indexedDB.open('todosStore', this.todosStoreVersion);
        dbRequest.onerror = (event) => {
            console.log('todosStore IndexedDB getTodo error:', event.target.errorCode);
        };
        dbRequest.onsuccess = (event) => {
            let db = event.target.result;
            let objectStore = db.transaction('todos').objectStore('todos');
            let request = objectStore.get(id);
            request.onerror = (event) => {
                console.log('Error while getting a todo:', event);
            };
            request.onsuccess = (event) => {
                console.log('Name for the todo is', request.result.name);
            };
        };
    }

    updateTodo(id, name = null, completed = null) {
        if (name == null && completed == null && !('indexedDB' in window)) {
            return;
        }

        let dbRequest = window.indexedDB.open('todosStore', this.todosStoreVersion);
        dbRequest.onerror = (event) => {
            console.log('todosStore IndexedDB updateTodo error:', event.target.errorCode);
        };
        dbRequest.onsuccess = (event) => {
            let db = event.target.result;
            let objectStore = db.transaction('todos', 'readwrite').objectStore('todos');
            let request = objectStore.get(id);
            request.onerror = (event) => {
                console.log('Error while getting a todo for updating:', event);
            };
            request.onsuccess = (event) => {
                let data = event.target.result;
                if (name !== null) {
                    data.name = name;
                }
                if (completed !== null) {
                    data.completed = completed;
                }
                let requestUpdate = objectStore.put(data);
                requestUpdate.onerror = (event) => {
                    console.log('Error while updating todo:', event);
                };
            };
        };
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
                                    .map(key => <Todo key={key} id={key} details={this.state.todos[key]} removeTodo={this.removeTodo} updateTodo={this.updateTodo} />)
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
