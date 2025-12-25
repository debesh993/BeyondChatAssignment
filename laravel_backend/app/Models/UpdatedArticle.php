<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UpdatedArticle extends Model
{
    protected $fillable = ['original_article_id', 'title', 'content', 'references'];
}
