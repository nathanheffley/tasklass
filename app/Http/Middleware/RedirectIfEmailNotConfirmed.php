<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\MessageBag;

class RedirectIfEmailNotConfirmed
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if ($request->user()->confirmed) {
            return $next($request);
        }

        if ($request->wantsJson()) {
            return response()->json(['errors' => new MessageBag([
                'authorization' => 'Please confirm your email before using Task Lass!',
            ])], 403);
        }

        return redirect('/confirmation');
    }
}
