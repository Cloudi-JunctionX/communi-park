<?php

namespace App\Http\Controllers;

use App\Models\Location;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;

class LocationController extends Controller
{
    public function index(): Factory|View|Application
    {
        $locations = Location::all();
        return view('locations.list', compact('locations'));
    }

    public function create(): Factory|View|Application
    {
        return view('locations.create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->all();
        $data['medias'] = isset($data['medias'])
            ? [
                [
                    'key' => now()->timestamp,
                    'url' => $data['medias']
                ]
            ] : [];
        $data['shop_id'] = 1;
        $res = Location::create($data);
        Artisan::call('app:test');
        return redirect()->route('locations.edit', $res->id);
    }

    public function edit(int $id): Factory|View|Application
    {
        $location = Location::findOrFail($id);
        return view('locations.edit', compact('location'));
    }

    public function update(int $id, Request $request): RedirectResponse
    {
        $location = Location::findOrFail($id);
        $data = $request->all();
        $data['medias'] = isset($data['medias'])
            ? [
                [
                    'key' => now()->timestamp,
                    'url' => $data['medias']
                ]
            ] : [];
        $location->update($data);
        Artisan::call('app:test');
        return back();
    }
}
