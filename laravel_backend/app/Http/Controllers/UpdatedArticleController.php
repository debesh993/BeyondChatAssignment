<?php

namespace App\Http\Controllers;

use App\Models\UpdatedArticle;
use Illuminate\Http\Request;

class UpdatedArticleController extends Controller
{
    // Fetch all updated articles
    public function index()
    {
        return UpdatedArticle::all();
    }

    // Fetch single updated article by id
    public function show($id)
    {
        return UpdatedArticle::findOrFail($id);
    }

    // Store updated article
    public function store(Request $request)
    {
        $article = UpdatedArticle::create([
            'original_article_id' => $request->original_article_id,
            'title' => $request->title,
            'content' => $request->content,
            'references' => $request->references,
        ]);

        return $article;
    }

    // Update updated article by id
    public function update(Request $request, $id)
    {
        $article = UpdatedArticle::findOrFail($id);
        $article->update($request->all());
        return $article;
    }

    // Delete updated article by id
    public function destroy($id)
    {
        return UpdatedArticle::destroy($id);
    }
}
