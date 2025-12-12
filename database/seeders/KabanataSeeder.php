<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Kabanata;

class KabanataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $kabanatas = [
            ['kabanata' => 'Kabanata 1', 'title' => 'Isang Salusalo'],
            ['kabanata' => 'Kabanata 2', 'title' => 'Si Crisostomo Ibarra'],
            ['kabanata' => 'Kabanata 3', 'title' => 'Ang Hapunan'],
            ['kabanata' => 'Kabanata 4', 'title' => 'Erehe at Pilibustero'],
            ['kabanata' => 'Kabanata 5', 'title' => 'Isang Bituin sa Gabing Madilim'],
            ['kabanata' => 'Kabanata 6', 'title' => 'Si Kapitan Tiyago'],
            ['kabanata' => 'Kabanata 7', 'title' => 'Suyuan sa Asotea'],
            ['kabanata' => 'Kabanata 8', 'title' => 'Mga Alaala'],
            ['kabanata' => 'Kabanata 9', 'title' => 'Mga Bagay-bagay Ukol sa Bayan'],
            ['kabanata' => 'Kabanata 10', 'title' => 'Ang Bayan ng San Diego'],
            ['kabanata' => 'Kabanata 11', 'title' => 'Ang Mga Makapangyarihan'],
            ['kabanata' => 'Kabanata 12', 'title' => 'Araw ng mga Patay'],
            ['kabanata' => 'Kabanata 13', 'title' => 'Ang Unang Banta ng Sigwa'],
            ['kabanata' => 'Kabanata 14', 'title' => 'Tasyo, Baliw o Pilosopo'],
            ['kabanata' => 'Kabanata 15', 'title' => 'Ang Dalawang Sakristan'],
            ['kabanata' => 'Kabanata 16', 'title' => 'Si Sisa'],
            ['kabanata' => 'Kabanata 17', 'title' => 'Si Basilio'],
            ['kabanata' => 'Kabanata 18', 'title' => 'Mga kaluluwang Naghihirap'],
            ['kabanata' => 'Kabanata 19', 'title' => 'Mga Karanasan ng Isang Guro'],
            ['kabanata' => 'Kabanata 20', 'title' => 'Mga Pulong sa Tribunal'],
            ['kabanata' => 'Kabanata 21', 'title' => 'Ang Kasaysayan ng Isang Ina'],
            ['kabanata' => 'Kabanata 22', 'title' => 'Liwanag at Dilim'],
            ['kabanata' => 'Kabanata 23', 'title' => 'Ang Pangingisda'],
            ['kabanata' => 'Kabanata 24', 'title' => 'Sa Kagubatan'],
            ['kabanata' => 'Kabanata 25', 'title' => 'Sa Bahay ng Pilosopo'],
            ['kabanata' => 'Kabanata 26', 'title' => 'Ang Bisperas ng Pista'],
            ['kabanata' => 'Kabanata 27', 'title' => 'Sa Pagtatakipsilim'],
            ['kabanata' => 'Kabanata 28', 'title' => 'Ilang Sulat'],
            ['kabanata' => 'Kabanata 29', 'title' => 'Kinaumagahan'],
            ['kabanata' => 'Kabanata 30', 'title' => 'Sa Simbahan'],
            ['kabanata' => 'Kabanata 31', 'title' => 'Ang Sermon'],
            ['kabanata' => 'Kabanata 32', 'title' => 'Ang Kalo'],
            ['kabanata' => 'Kabanata 33', 'title' => 'Malayang Pagkukuro'],
            ['kabanata' => 'Kabanata 34', 'title' => 'Ang Pananghalian'],
            ['kabanata' => 'Kabanata 35', 'title' => 'Mga Bali-Balita'],
            ['kabanata' => 'Kabanata 36', 'title' => 'Ang Unang Suliranin'],
            ['kabanata' => 'Kabanata 37', 'title' => 'Ang Kapitan Heneral'],
            ['kabanata' => 'Kabanata 38', 'title' => 'Ang Prusisyon'],
            ['kabanata' => 'Kabanata 39', 'title' => 'Si Donya Consolacion'],
            ['kabanata' => 'Kabanata 40', 'title' => 'Ang Katwiran at Lakas'],
            ['kabanata' => 'Kabanata 41', 'title' => 'Dalawang Dalaw'],
            ['kabanata' => 'Kabanata 42', 'title' => 'Ang Mag-asawang de Espadaña'],
            ['kabanata' => 'Kabanata 43', 'title' => 'Mga Panukala'],
            ['kabanata' => 'Kabanata 44', 'title' => 'Pagsusuri ng Budhi'],
            ['kabanata' => 'Kabanata 45', 'title' => 'Ang mga Pinag-uusig'],
            ['kabanata' => 'Kabanata 46', 'title' => 'Ang Sabungan'],
            ['kabanata' => 'Kabanata 47', 'title' => 'Ang Dalawang Senyora'],
            ['kabanata' => 'Kabanata 48', 'title' => 'Ang Talinghaga'],
            ['kabanata' => 'Kabanata 49', 'title' => 'Ang Tinig ng mga Inuusig'],
            ['kabanata' => 'Kabanata 50', 'title' => 'Ang Kaanak ni Elias'],
            ['kabanata' => 'Kabanata 51', 'title' => 'Mga Pagbabago'],
            ['kabanata' => 'Kabanata 52', 'title' => 'Ang Baraha ng mga Patay at mga Anino'],
            ['kabanata' => 'Kabanata 53', 'title' => 'Ang Mabuting Araw ay Nakikilala sa Umaga at mga Anino'],
            ['kabanata' => 'Kabanata 54', 'title' => 'Lahat ng Lihim ay Nabubunyag, Walang  Hindi Nagkakamit ng Parusa'],
            ['kabanata' => 'Kabanata 55', 'title' => 'Ang Kaguluhan'],
            ['kabanata' => 'Kabanata 56', 'title' => 'Mga Sabi-sabi at Kuru-kuro'],
            ['kabanata' => 'Kabanata 57', 'title' => 'Sa Aba ng mga Nalupig'],
            ['kabanata' => 'Kabanata 58', 'title' => 'Ang Isinumpa'],
            ['kabanata' => 'Kabanata 59', 'title' => 'Pag-ibig sa Bayan at Sariling Kapakanan'],
            ['kabanata' => 'Kabanata 60', 'title' => 'Ikakasal si Maria Clara'],
            ['kabanata' => 'Kabanata 61', 'title' => 'Ang Habulan sa Lawa'],
            ['kabanata' => 'Kabanata 62', 'title' => 'Ang Pagtatapat ni Padre Damaso'],
            ['kabanata' => 'Kabanata 63', 'title' => 'Ang Noche Buena'],
            ['kabanata' => 'Kabanata 64', 'title' => 'Huling Kabanata'],
        ];

        foreach ($kabanatas as $kabanata) {
            Kabanata::create($kabanata);
        }
    }
}
