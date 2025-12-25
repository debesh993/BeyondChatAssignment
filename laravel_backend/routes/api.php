<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OriginalArticleController;
use App\Http\Controllers\UpdatedArticleController;

// Original articles
Route::get('/original-articles', [OriginalArticleController::class, 'index']);
Route::get('/original-articles/{id}', [OriginalArticleController::class, 'show']);
Route::post('/original-articles', [OriginalArticleController::class, 'store']);
Route::put('/original-articles/{id}', [OriginalArticleController::class, 'update']);
Route::delete('/original-articles/{id}', [OriginalArticleController::class, 'destroy']);

// Updated articles
Route::get('/updated-articles', [UpdatedArticleController::class, 'index']);
Route::get('/updated-articles/{id}', [UpdatedArticleController::class, 'show']);
Route::post('/updated-articles', [UpdatedArticleController::class, 'store']);
Route::put('/updated-articles/{id}', [UpdatedArticleController::class, 'update']);
Route::delete('/updated-articles/{id}', [UpdatedArticleController::class, 'destroy']);
