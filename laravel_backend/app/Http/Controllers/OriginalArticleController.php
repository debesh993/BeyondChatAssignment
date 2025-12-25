<?php

namespace App\Http\Controllers;

use App\Models\OriginalArticle;
use Illuminate\Http\Request;

class OriginalArticleController extends Controller
{
    // Fetch all original articles
    public function index()
    {
        return OriginalArticle::all();
    }

    // Fetch single article by id
    public function show($id)
    {
        return OriginalArticle::findOrFail($id);
    }

    // Store a new original article
    public function store(Request $request)
    {
        $article = OriginalArticle::create([
            'title' => $request->title,
            'content' => $request->content,
            'source' => $request->source,
        ]);

        return $article;
    }

    // Update article by id
    public function update(Request $request, $id)
    {
        $article = OriginalArticle::findOrFail($id);
        $article->update($request->all());
        return $article;
    }

    // Delete article by id
    public function destroy($id)
    {
        return OriginalArticle::destroy($id);
    }
}
