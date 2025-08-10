<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('user_kabanata_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('kabanata_id')->constrained('kabanatas')->onDelete('cascade');
            $table->integer('progress')->default(0);
            $table->integer('stars')->default(0);
            $table->boolean('unlocked')->default(false);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('user_kabanata_progress');
    }
};