<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property array $medias
 */
class Location extends Model
{
    protected $guarded = [
        'id'
    ];

    protected $hidden = ['shop_id'];

    protected $casts = [
        'status' => 'boolean',
        'medias' => 'array'
    ];
}
