<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = ['posted_by', 'title', 'image', 'description', 'user_interface', 'speed_size', 'software', 'support', 'administration', 'rating', 'availability'];
}