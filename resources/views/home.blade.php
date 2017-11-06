@extends('layouts.master')

@section('body')
    <section class="hero is-primary is-bold">
        <div class="hero-body">
            <div class="container">
                <h1 class="title">the simple task list</h1>
            </div>
        </div>
    </section>
    <section class="section promo promo--simple">
        <div class="container">
            <p>Keep track of what you need to do - nothing else.</p>
        </div>
    </section>
    <!-- <section class="section promo promo--due">
        <div class="container">
            <p>Due date? Task lass has you covered so you don't miss anything.</p>
        </div>
    </section> -->
    <section class="section cta">
        <div class="container">
            <p class="cta__text">No Fluff<br>Just Task Stuff</p>
            <a class="cta__button button is-large" href="/register">Create a List</a>
        </div>
    </section>
    <!-- <section class="section promo promo--offline">
        <div class="container">
            <p>Offline? No worries, you can still access your task list.</p>
        </div>
    </section> -->
    <footer class="footer">
        <div class="container">
            <div class="content has-text-centered">
                <p>
                    <strong>TASKLASS</strong> by <a href="https://www.nathanheffley.com">Nathan Heffley</a>.
                </p>
            </div>
        </div>
    </footer>
@endsection
