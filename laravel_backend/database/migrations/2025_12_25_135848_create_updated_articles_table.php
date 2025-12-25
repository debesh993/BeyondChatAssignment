<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('updated_articles', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('original_article_id');
        $table->string('title');
        $table->longText('content');
        $table->text('references')->nullable();
        $table->timestamps();

        $table->foreign('original_article_id')
              ->references('id')
              ->on('original_articles')
              ->onDelete('cascade');
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('updated_articles');
    }
};
