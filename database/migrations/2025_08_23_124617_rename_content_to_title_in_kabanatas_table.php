<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        // Use raw SQL for MariaDB/MySQL compatibility
        if (Schema::hasTable('kabanatas')) {
            $columns = Schema::getColumnListing('kabanatas');
            if (in_array('content', $columns)) {
                DB::statement('ALTER TABLE kabanatas CHANGE content title VARCHAR(255)');
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        if (Schema::hasTable('kabanatas')) {
            $columns = Schema::getColumnListing('kabanatas');
            if (in_array('title', $columns)) {
                DB::statement('ALTER TABLE kabanatas CHANGE title content VARCHAR(255)');
            }
        }
    }
};