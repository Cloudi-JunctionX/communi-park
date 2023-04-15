<?php

namespace App\Console\Commands;

use App\Models\Location;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class TestAppCommand extends Command
{
    protected $signature = 'app:test';
    protected $description = 'Command description';

    public function handle(): void
    {
        $locations = Location::all();
        $locations = $locations->transform(function ($location) {
            return [
                'type' => 'Feature',
                'properties' => $location,
                'geometry' => [
                    'type' => 'Point',
                    'coordinates' => [
                        $location->longitude,
                        $location->latitude
                    ]
                ]
            ];
        });
        $geoJson = [
            'type' => 'FeatureCollection',
            'features' => $locations->toArray()
        ];
        $geoJson = json_encode($geoJson);
        $fileName = 'locations.js';
        File::put(public_path("locator/js/$fileName"), "dcStoreLocator.loadLocationCallback($geoJson)");
    }
}
