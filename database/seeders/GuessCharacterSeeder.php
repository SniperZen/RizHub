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
        $characters = [
            ['c_name' => 'Crisostomo Ibarra', 'filename' => 'char-1'],
            ['c_name' => 'Maria Clara', 'filename' => 'char-2'],
            ['c_name' => 'Padre Damaso', 'filename' => 'char-3'],
            ['c_name' => 'Crispin', 'filename' => 'char-4'],
            ['c_name' => 'Sisa', 'filename' => 'char-5'],
            ['c_name' => 'Padre Sibyla', 'filename' => 'char-6'],
            ['c_name' => 'Kapitan Heneral', 'filename' => 'char-7'],
            ['c_name' => 'Tenyente Guevarra', 'filename' => 'char-8'],
        ];

        foreach ($characters as $char) {
            DB::table('guesscharacters')->updateOrInsert(
                ['c_name' => $char['c_name']],
                ['filename' => $char['filename']]
            );
        }
    }
}