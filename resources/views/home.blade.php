@extends('layouts.master')

@section('body')
    <section class="section promo promo--simple">
        <div class="container">
            <p>Keep track of what you need to do - nothing else.</p>
        </div>
    </section>
    <div class="divider"></div>
    <section class="section promo promo--due">
        <div class="container">
            <p>Due date? Task lass has you covered so you don't miss anything.</p>
        </div>
    </section>
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
            <div class="columns">
                <div class="column is-6">
                    <h2 class="title">TASKLASS</h2>
                </div>
                <div class="column is-6">
                    <p class="signature">
                        <span class="signature__made">Made with</span>
                        <span class="signature__heart"><i class="fa fa-heart"></i></span>
                        <a href="https://www.nathanheffley.com">Nathan Heffley</a>
                    </p>
                </div>
            </div>
        </div>
    </footer>
@endsection
