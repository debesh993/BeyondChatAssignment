<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OriginalArticle extends Model
{
    protected $fillable = ['title', 'content', 'source'];
}
