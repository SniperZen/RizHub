<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\GuessWord;

class GuessWordSeeder extends Seeder
{
    public function run(): void
    {
        $kabanatas = [
            1 => [
                ['question' => 'LUGAR: Dito ginanap ang unang pagtitipon.', 'answer' => 'KUBA'],
                ['question' => 'TAO: Siya ang unang presidente ng Pilipinas.', 'answer' => 'AGUINALDO'],
                ['question' => 'BAGAY: Ginagamit sa pagsusulat.', 'answer' => 'LAPIS'],
                ['question' => 'HAYOP: May mahahabang leeg.', 'answer' => 'GIRAFFE'],
                ['question' => 'PRUTAS: Dilaw at matamis.', 'answer' => 'MANGGA'],
                ['question' => 'KULAY: Kulay ng damo.', 'answer' => 'BERDE'],
                ['question' => 'BAYANI: Kilala bilang “Ama ng Katipunan”.', 'answer' => 'BONIFACIO'],
                ['question' => 'LUGAR: Kabiserang lungsod ng Pilipinas.', 'answer' => 'MANILA'],
                ['question' => 'BAGAY: Ginagamit sa pagtulog.', 'answer' => 'UNAN'],
                ['question' => 'HAYOP: May shell sa likod.', 'answer' => 'PAGONG'],
            ],
            2 => [
                ['question' => 'LUGAR: Matatagpuan sa tabi ng dagat.', 'answer' => 'BAYBAYIN'],
                ['question' => 'TAO: Nagsulat ng Noli Me Tangere.', 'answer' => 'RIZAL'],
                ['question' => 'BAGAY: Ginagamit sa pagputol ng papel.', 'answer' => 'GUNTING'],
                ['question' => 'HAYOP: Gumagawa ng pulot.', 'answer' => 'BEE'],
                ['question' => 'PRUTAS: Pulang prutas na malutong.', 'answer' => 'MANSANAS'],
                ['question' => 'KULAY: Kulay ng dagat.', 'answer' => 'ASUL'],
                ['question' => 'BAYANI: Kilala sa “GomBurZa” kasama sina Burgos at Zamora.', 'answer' => 'GOMEZ'],
                ['question' => 'LUGAR: Kilalang lungsod sa Ilocos.', 'answer' => 'VIGAN'],
                ['question' => 'BAGAY: Ginagamit sa pagsusuklay.', 'answer' => 'SUKLAY'],
                ['question' => 'HAYOP: Lumilipad sa gabi.', 'answer' => 'PANIKI'],
            ],
            3 => [
                ['question' => 'LUGAR: Matatagpuan sa tabi ng dagat.', 'answer' => 'BAYBAYIN'],
                ['question' => 'TAO: Nagsulat ng Noli Me Tangere.', 'answer' => 'RIZAL'],
                ['question' => 'BAGAY: Ginagamit sa pagputol ng papel.', 'answer' => 'GUNTING'],
                ['question' => 'HAYOP: Gumagawa ng pulot.', 'answer' => 'BEE'],
                ['question' => 'PRUTAS: Pulang prutas na malutong.', 'answer' => 'MANSANAS'],
                ['question' => 'KULAY: Kulay ng dagat.', 'answer' => 'ASUL'],
                ['question' => 'BAYANI: Kilala sa “GomBurZa” kasama sina Burgos at Zamora.', 'answer' => 'GOMEZ'],
                ['question' => 'LUGAR: Kilalang lungsod sa Ilocos.', 'answer' => 'VIGAN'],
                ['question' => 'BAGAY: Ginagamit sa pagsusuklay.', 'answer' => 'SUKLAY'],
                ['question' => 'HAYOP: Lumilipad sa gabi.', 'answer' => 'PANIKI'],
            ],
            4 => [
                ['question' => 'LUGAR: Matatagpuan sa tabi ng dagat.', 'answer' => 'BAYBAYIN'],
                ['question' => 'TAO: Nagsulat ng Noli Me Tangere.', 'answer' => 'RIZAL'],
                ['question' => 'BAGAY: Ginagamit sa pagputol ng papel.', 'answer' => 'GUNTING'],
                ['question' => 'HAYOP: Gumagawa ng pulot.', 'answer' => 'BEE'],
                ['question' => 'PRUTAS: Pulang prutas na malutong.', 'answer' => 'MANSANAS'],
                ['question' => 'KULAY: Kulay ng dagat.', 'answer' => 'ASUL'],
                ['question' => 'BAYANI: Kilala sa “GomBurZa” kasama sina Burgos at Zamora.', 'answer' => 'GOMEZ'],
                ['question' => 'LUGAR: Kilalang lungsod sa Ilocos.', 'answer' => 'VIGAN'],
                ['question' => 'BAGAY: Ginagamit sa pagsusuklay.', 'answer' => 'SUKLAY'],
                ['question' => 'HAYOP: Lumilipad sa gabi.', 'answer' => 'PANIKI'],
            ],
        ];

        foreach ($kabanatas as $kabanataId => $items) {
            foreach ($items as $item) {
                GuessWord::create([
                    'kabanata_id' => $kabanataId,
                    'question'    => $item['question'],
                    'answer'      => strtoupper($item['answer']),
                    'pickedChar'  => '',
                ]);
            }
        }
    }
}
