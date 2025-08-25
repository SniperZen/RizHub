<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class QuizSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('quizzes')->insert([

            // ===== KABANATA 1 =====
            [
                'kabanata_id'   => 1,
                'question'      => 'Sino ang pangunahing tauhan sa Kabanata 1?',
                'choice_a'      => 'Juan',
                'choice_b'      => 'Pedro',
                'choice_c'      => 'Maria',
                'correct_answer'=> 'A',
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
            [
                'kabanata_id'   => 1,
                'question'      => 'Ano ang paksa ng Kabanata 1?',
                'choice_a'      => 'Paglalakbay',
                'choice_b'      => 'Pagkakaibigan',
                'choice_c'      => 'Pakikipaglaban',
                'correct_answer'=> 'B',
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
            [
                'kabanata_id'   => 1,
                'question'      => 'Ano ang ginamit na simbolo sa Kabanata 1?',
                'choice_a'      => 'Ilaw',
                'choice_b'      => 'Ilog',
                'choice_c'      => 'Bundok',
                'correct_answer'=> 'A',
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
            [
                'kabanata_id'   => 1,
                'question'      => 'Saan naganap ang pangyayari sa Kabanata 1?',
                'choice_a'      => 'Bayan',
                'choice_b'      => 'Gubat',
                'choice_c'      => 'Paaralan',
                'correct_answer'=> 'B',
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
            [
                'kabanata_id'   => 1,
                'question'      => 'Ano ang layunin ng pangunahing tauhan sa Kabanata 1?',
                'choice_a'      => 'Mag-aral',
                'choice_b'      => 'Maglakbay',
                'choice_c'      => 'Makipaglaban',
                'correct_answer'=> 'B',
                'created_at'    => now(),
                'updated_at'    => now(),
            ],

            // ===== KABANATA 2 =====
            [
                'kabanata_id'   => 2,
                'question'      => 'Ano ang paksa ng Kabanata 2?',
                'choice_a'      => 'Paglalakbay',
                'choice_b'      => 'Pag-aaral',
                'choice_c'      => 'Pakikipaglaban',
                'correct_answer'=> 'B',
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
            [
                'kabanata_id'   => 2,
                'question'      => 'Ano ang simbolo ng ilaw sa Kabanata 2?',
                'choice_a'      => 'Pag-asa',
                'choice_b'      => 'Takot',
                'choice_c'      => 'Kadiliman',
                'correct_answer'=> 'A',
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
            [
                'kabanata_id'   => 2,
                'question'      => 'Sino ang bagong tauhan na ipinakilala sa Kabanata 2?',
                'choice_a'      => 'Andres',
                'choice_b'      => 'Mateo',
                'choice_c'      => 'Jose',
                'correct_answer'=> 'C',
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
            [
                'kabanata_id'   => 2,
                'question'      => 'Ano ang pangunahing suliranin sa kabanatang ito?',
                'choice_a'      => 'Kakulangan sa pagkain',
                'choice_b'      => 'Pagkakasakit',
                'choice_c'      => 'Pag-aaway',
                'correct_answer'=> 'A',
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
            [
                'kabanata_id'   => 2,
                'question'      => 'Ano ang aral mula sa Kabanata 2?',
                'choice_a'      => 'Pagmamahal sa kapwa',
                'choice_b'      => 'Pagiging masipag',
                'choice_c'      => 'Pagpapatawad',
                'correct_answer'=> 'A',
                'created_at'    => now(),
                'updated_at'    => now(),
            ],

            [
                'kabanata_id'   => 3,
                'question'      => 'Ano ang paksa ng Kabanata 2?',
                'choice_a'      => 'Paglalakbay',
                'choice_b'      => 'Pag-aaral',
                'choice_c'      => 'Pakikipaglaban',
                'correct_answer'=> 'B',
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
            [
                'kabanata_id'   => 3,
                'question'      => 'Ano ang simbolo ng ilaw sa Kabanata 2?',
                'choice_a'      => 'Pag-asa',
                'choice_b'      => 'Takot',
                'choice_c'      => 'Kadiliman',
                'correct_answer'=> 'A',
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
            [
                'kabanata_id'   => 3,
                'question'      => 'Sino ang bagong tauhan na ipinakilala sa Kabanata 2?',
                'choice_a'      => 'Andres',
                'choice_b'      => 'Mateo',
                'choice_c'      => 'Jose',
                'correct_answer'=> 'C',
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
            [
                'kabanata_id'   => 3,
                'question'      => 'Ano ang pangunahing suliranin sa kabanatang ito?',
                'choice_a'      => 'Kakulangan sa pagkain',
                'choice_b'      => 'Pagkakasakit',
                'choice_c'      => 'Pag-aaway',
                'correct_answer'=> 'A',
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
            [
                'kabanata_id'   => 3,
                'question'      => 'Ano ang aral mula sa Kabanata 2?',
                'choice_a'      => 'Pagmamahal sa kapwa',
                'choice_b'      => 'Pagiging masipag',
                'choice_c'      => 'Pagpapatawad',
                'correct_answer'=> 'A',
                'created_at'    => now(),
                'updated_at'    => now(),
            ],

        ]);
    }
}
