
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes React and other helpers. It's a great starting point while
 * building robust, powerful web applications using React + Laravel.
 */

require('./bootstrap');

/**
 * Next, we will create a fresh React component instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

require('./components/TodoList');
require('./components/Todo');
require('./components/AddTodo');

/**
 * Finally check for Service Worker support and install ours if possible.
 */

 if ('serviceWorker' in navigator) {
     window.addEventListener('load', function() {
         navigator.serviceWorker.register('/sw.js').then(function(registration) {
             // Successfully registered!
         }, function(err) {
             // Failed to register.
             console.log('ServiceWorker registration failed: ', err);
         });
     });
 }
