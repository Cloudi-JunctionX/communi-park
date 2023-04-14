<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class TestAppCommand extends Command
{
    protected $signature = 'app:test';
    protected $description = 'Command description';
    public function handle()
    {
        $this->line(json_encode([
            'text' => [
                'show_map_text_button' => 'Show Map',
                'show_list_text_button' => 'Show List'
            ],
            'function' => [
                'map_center_coordinates' => [
                    'lat' => 21.021424559392315,
                    'lng' => 105.79727663760241
                ],
                'zoom' => 15,
                'max_first_load' => 1100000,
                'enable_clustering' => true
            ],
            'list_and_map' => [
                'list_display_fields' => [
                    "id",
                    "shop_id",
                    "name",
                    "priority",
                    "description",
                    "phone_number",
                    "fax",
                    "website",
                    "website_display",
                    "open_hour",
                    "close_hour",
                    "address1",
                    "address2",
                    "country",
                    "state",
                    "city",
                    "zipcode",
                    "latitude",
                    "longitude",
                    "medias",
                    "status",
                    "schedule",
                    "email",
                    "created_at",
                    "updated_at"
                ],
                'map_display_fields' => [
                    "id",
                    "shop_id",
                    "name",
                    "priority",
                    "description",
                    "phone_number",
                    "fax",
                    "website",
                    "website_display",
                    "open_hour",
                    "close_hour",
                    "address1",
                    "address2",
                    "country",
                    "state",
                    "city",
                    "zipcode",
                    "latitude",
                    "longitude",
                    "medias",
                    "status",
                    "schedule",
                    "email",
                    "created_at",
                    "updated_at"
                ],
                'list_location_fields_sort' => [
                    "id",
                    "shop_id",
                    "name",
                    "priority",
                    "description",
                    "phone_number",
                    "fax",
                    "website",
                    "website_display",
                    "open_hour",
                    "close_hour",
                    "address1",
                    "address2",
                    "country",
                    "state",
                    "city",
                    "zipcode",
                    "latitude",
                    "longitude",
                    "medias",
                    "status",
                    "schedule",
                    "email",
                    "created_at",
                    "updated_at"
                ],
                'map_location_fields_sort' => [
                    "id",
                    "shop_id",
                    "name",
                    "priority",
                    "description",
                    "phone_number",
                    "fax",
                    "website",
                    "website_display",
                    "open_hour",
                    "close_hour",
                    "address1",
                    "address2",
                    "country",
                    "state",
                    "city",
                    "zipcode",
                    "latitude",
                    "longitude",
                    "medias",
                    "status",
                    "schedule",
                    "email",
                    "created_at",
                    "updated_at"
                ],
            ]
        ]));
    }
}
