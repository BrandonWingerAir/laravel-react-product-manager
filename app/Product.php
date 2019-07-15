<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = ['posted_by', 'title', 'description', 'price', 'availability'];
}
