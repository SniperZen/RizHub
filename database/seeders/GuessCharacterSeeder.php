<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GuessCharacterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        DB::table('guesscharacters')->insert([
            ['c_name' => 'Crisostomo Ibarra', 'filename' => 'char-1.png'],
            ['c_name' => 'Maria Clara', 'filename' => 'char-2.png'],
            ['c_name' => 'Padre Damaso', 'filename' => 'char-3.png'],
            ['c_name' => 'Crispin', 'filename' => 'char-4.png'],
            ['c_name' => 'Sisa', 'filename' => 'char-5.png'],
            ['c_name' => 'Padre Sibyla', 'filename' => 'char-6.png'],
            ['c_name' => 'Kapitan Heneral', 'filename' => 'char-7.png'],
            ['c_name' => 'Tenyente Guevarra', 'filename' => 'char-8.png'],
        ]);
    }

}
