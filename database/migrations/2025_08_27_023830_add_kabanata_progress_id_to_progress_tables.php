<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Quiz Progress
        if (Schema::hasTable('quiz_progress')) {
            Schema::table('quiz_progress', function (Blueprint $table) {
                if (!Schema::hasColumn('quiz_progress', 'kabanata_progress_id')) {
                    $table->unsignedBigInteger('kabanata_progress_id')->nullable()->after('id');
                    $table->foreign('kabanata_progress_id')
                        ->references('id')
                        ->on('user_kabanata_progress')
                        ->onDelete('cascade');
                }

                // Optionally drop direct user_id and kabanata_id FKs
                if (Schema::hasColumn('quiz_progress', 'user_id')) {
                    $table->dropForeign(['user_id']);
                    $table->dropColumn('user_id');
                }
                if (Schema::hasColumn('quiz_progress', 'kabanata_id')) {
                    $table->dropForeign(['kabanata_id']);
                    $table->dropColumn('kabanata_id');
                }
            });
        }

        // Guessword Progress
        if (Schema::hasTable('guessword_progress')) {
            Schema::table('guessword_progress', function (Blueprint $table) {
                if (!Schema::hasColumn('guessword_progress', 'kabanata_progress_id')) {
                    $table->unsignedBigInteger('kabanata_progress_id')->nullable()->after('id');
                    $table->foreign('kabanata_progress_id')
                        ->references('id')
                        ->on('user_kabanata_progress')
                        ->onDelete('cascade');
                }

                // Optionally drop direct user_id and kabanata_id FKs
                if (Schema::hasColumn('guessword_progress', 'user_id')) {
                    $table->dropForeign(['user_id']);
                    $table->dropColumn('user_id');
                }
                if (Schema::hasColumn('guessword_progress', 'kabanata_id')) {
                    $table->dropForeign(['kabanata_id']);
                    $table->dropColumn('kabanata_id');
                }
            });
        }

        // Video Progress
        if (Schema::hasTable('video_progress')) {
            Schema::table('video_progress', function (Blueprint $table) {
                if (!Schema::hasColumn('video_progress', 'kabanata_progress_id')) {
                    $table->unsignedBigInteger('kabanata_progress_id')->nullable()->after('id');
                    $table->foreign('kabanata_progress_id')
                        ->references('id')
                        ->on('user_kabanata_progress')
                        ->onDelete('cascade');
                }

                // Optionally drop direct user_id and kabanata_id FKs
                if (Schema::hasColumn('video_progress', 'user_id')) {
                    $table->dropForeign(['user_id']);
                    $table->dropColumn('user_id');
                }
                if (Schema::hasColumn('video_progress', 'kabanata_id')) {
                    $table->dropForeign(['kabanata_id']);
                    $table->dropColumn('kabanata_id');
                }
            });
        }
    }

    public function down()
    {
        // Rollback logic
        if (Schema::hasTable('quiz_progress')) {
            Schema::table('quiz_progress', function (Blueprint $table) {
                if (Schema::hasColumn('quiz_progress', 'kabanata_progress_id')) {
                    $table->dropForeign(['kabanata_progress_id']);
                    $table->dropColumn('kabanata_progress_id');
                }

                $table->unsignedBigInteger('user_id')->nullable();
                $table->unsignedBigInteger('kabanata_id')->nullable();
            });
        }

        if (Schema::hasTable('guessword_progress')) {
            Schema::table('guessword_progress', function (Blueprint $table) {
                if (Schema::hasColumn('guessword_progress', 'kabanata_progress_id')) {
                    $table->dropForeign(['kabanata_progress_id']);
                    $table->dropColumn('kabanata_progress_id');
                }

                $table->unsignedBigInteger('user_id')->nullable();
                $table->unsignedBigInteger('kabanata_id')->nullable();
            });
        }

        if (Schema::hasTable('video_progress')) {
            Schema::table('video_progress', function (Blueprint $table) {
                if (Schema::hasColumn('video_progress', 'kabanata_progress_id')) {
                    $table->dropForeign(['kabanata_progress_id']);
                    $table->dropColumn('kabanata_progress_id');
                }

                $table->unsignedBigInteger('user_id')->nullable();
                $table->unsignedBigInteger('kabanata_id')->nullable();
            });
        }
    }
};
