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
                ['question' => 'TAO (11 titik): Siya ang nagging kura paroko ng San Diego sa loob ng dalawampung taon.', 'answer' => 'PADRE DAMASO'],
                ['question' => 'TITULO/POSISYON (7 titik): Siya ang kinikilalang kinatawan ng hari sa Pilipinas.', 'answer' => 'HENERAL'],
                ['question' => 'TAO (11 titik): Siya ang paring nag awat sa pagtatalo ng tenyente at ni Padre Damaso.', 'answer' => 'PADRE SIBYLA'],
                ['question' => 'LUGAR (7 titik): Saang pook nakatirik ang bahay ni Kapitan Tiago.', 'answer' => 'BINUNDOK'],
                ['question' => 'PANAHON/TAGAL (9 titik): Gaano katagal nanungkulan si Padre Damaso sa San Diego.', 'answer' => 'DALAWAMPU'],
                ['question' => 'PANINIWALA/DESKRIPSYON (11 titik): Ayon sa kanya, ang mga Indio raw ay likas na ___.', 'answer' => 'MAPAGPABAYA'],
                ['question' => 'TAO, MAY INISYAL (7 titik): Siya ang nagpahayag na ang mga Indio ay mangmang at walang malasakit.', 'answer' => 'G LARUJA'],
                ['question' => 'TAO (14 titik): Siya ang mapagpanggap na asawa ni Dr. de Espadana.', 'answer' => 'DONYA VICTORINA'],
                ['question' => 'KAISIPAN/KAUGALIANG FILIPINO (11 titik): Ayon kay G. Laruja, kulang daw ang mga Indio sa ______.', 'answer' => 'UTANG NA LOOB'],
                ['question' => 'DAMDAMIN (7 titik): Ano ang nadama ni Padre Damaso hanggang muntik mabitawan ang hawak na kopita.', 'answer' => 'NABIGLA'],
            ],
            2 => [
                ['question' => 'TAO (18 titik): Siya ang binatang bagong balik mula sa pag-aaral sa Europa.', 'answer' => 'CRISOSTOMO IBARRA'],
                ['question' => 'PANAHON/TAGAL (4 titik): Ilang taon nanatili si Ibarra sa Europa para mag-aral.', 'answer' => 'PITO'],
                ['question' => 'TAO (13 titik): Siya ang matalik na kakilala ng ama ni Ibarra na nag-imbita ng pananghalian.', 'answer' => 'KAPITAN TINONG'],
                ['question' => 'TAO (12 titik): Siya ang nagpakilala kay Ibarra sa salusalo.', 'answer' => 'KAPITAN TIAGO'],
                ['question' => 'TAO (11 titik): Siya ang ama ni Crisostomo Ibarra.', 'answer' => 'DON RAFAEL'],
                ['question' => 'GRUPO (6 titik): Kaninong umpukan lumapit si Ibarra upang makipagkilala.', 'answer' => 'BINATA'],
                ['question' => 'TAO (11 titik): Sino ang kanyang nakilala sa umpukan.', 'answer' => 'ISANG MAKATA'],
                ['question' => 'BAGAY/SINING (4 titik): Ano ang muling nagpaalab ng pagmamahal ni Ibarra sa bayan habang kausap ang makata.', 'answer' => 'TULA'],
                ['question' => 'LUGAR (8 titik): Tinanggihan ni Ibarra ang alok na pananghalian dahil siya ay uuwi na sa ______.', 'answer' => 'SAN DIEGO'],
                ['question' => 'PANGALAN (8 titik): Juan Crisostomo Ibarra y ____________, ang buong pangalan ni Ibarra.', 'answer' => 'MAGSALIN'],
            ],
            3 => [
                ['question' => 'PAGKAIN (6 titik): Anong ulam ang inihanda ni Kapitan Tiago sa salusalo?', 'answer' => 'TINOLA'],
                ['question' => 'ALAALA (8 titik): Ano ang nagbalik ng gunita kay Ibarra nang maalala ang sinabi ng kanyang dating kura?', 'answer' => 'KABATAAN'],
                ['question' => 'BAGAY (9 titik): Ano ang tinukoy tungkol sa "luklukan" o upuan sa larawan?', 'answer' => 'KOMPESOR'],
                ['question' => 'BAGAY (8 titik): Ano ang pinag-aagawan nina Padre Damaso at Padre Sibyla?', 'answer' => 'KABISERA'],
                ['question' => 'LUGAR (6 titik): Saang pook namalagi si Ibarra bago siya bumalik sa bayan?', 'answer' => 'EUROPA'],
                ['question' => 'BANSA (7 titik): Itinuturing ni Ibarra na pangalawang inang bayan.', 'answer' => 'ESPANYA'],
                ['question' => 'PAGKAIN (12 titik): Anong bahagi ng manok ang napunta kay Padre Damaso kaya\'t binagsak niya ang kutsara\'t tinulak ang pinggan?', 'answer' => 'LEEG AT PAKPAK'],
                ['question' => 'KATANGIAN (11 titik): Ayon kay Padre Damaso, ano ang kasamaan na dulot ng pagpapaaral sa Europa?', 'answer' => 'MAPAGMATAAS'],
                ['question' => 'BAGAY (9 titik): Sa kanilang pagtatalo, ano ang sinabi ni Padre Sibyla na dapat mapunta kay Padre Damaso?', 'answer' => 'LUKLUKAN'],
                ['question' => 'ARALIN (10 titik): Ano ang unang pinag-aralan ni Ibarra bago siya tumungo sa isang bayan?', 'answer' => 'KASAYSAYAN'],
            ],
            4 => [
                ['question' => 'TAO (6 titik): Sino ang inilalarawan na naglalakad at walang tiyak na patutunguhan?', 'answer' => 'IBARRA'],
                ['question' => 'LUGAR (8 titik): Saan nakarating si Ibarra habang siya\'y naglalakad?', 'answer' => 'BINUNDOK'],
                ['question' => 'TAO (11 titik): Sino ang pinasasaringan ni Padre Damaso sa kanyang sermon?', 'answer' => 'DON RAFAEL'],
                ['question' => 'LUGAR (7 titik): Saan pinasasaringan ni Padre Damaso ang ama ni Ibarra?', 'answer' => 'PULPITO'],
                ['question' => 'KATANGIAN (11 titik): Saan nakilala ang dating artilyero na natanggal sa pagiging sundalo?', 'answer' => 'KAMANGMANGAN'],
                ['question' => 'PARATANG (11 titik): Ano ang ibinintang sa ama ni Ibarra?', 'answer' => 'PILIBUSTERO'],
                ['question' => 'TAO (9 titik): Siya ang sumuka ng dugo at kalaunan ay namatay.', 'answer' => 'ARTILYERO'],
                ['question' => 'PARATANG (12 titik): Ano pa ang isinakdal sa ama ni Ibarra bukod sa pagiging pilibustero?', 'answer' => 'NANGAMKAM'],
                ['question' => 'LUGAR (12 titik): Saan nagpahatid si Ibarra matapos ang usapan nila ng tenyente?', 'answer' => 'FONDA DE LALA'],
                ['question' => 'SASAKYAN (6 titik): Ano ang sinakyan ni Ibarra papuntang Fonda de Lala?', 'answer' => 'KALESA'],
            ],
            5 => [
                ['question' => 'DAMDAMIN (13 titik): Ano ang naramdaman ni Ibarra nang siya\'y umupo sa isang silyon?', 'answer' => 'BALISANG-BALISA'],
                ['question' => 'PANGITAIN (14 titik): Sa pangitain ni Ibarra, sino ang binatang masayang nakita niya sa ibayong dagat?', 'answer' => 'KANYANG SARILI'],
                ['question' => 'BAHAGI NG SILID (10 titik): Saang bahagi ng kanyang silid natatanaw ni Ibarra ang bahay na nagliliwanag sa kabilang ibayo?', 'answer' => 'DURUNGAWAN'],
                ['question' => 'TAO (11 titik): Sino ang magandang dilag na nakita ni Ibarra na nakadamit Pilipina?', 'answer' => 'MARIA CLARA'],
                ['question' => 'INSTRUMENTO (7 titik): Ito ang himig ng tugtugin na nanuot sa pandinig ni Ibarra.', 'answer' => 'BIYULIN'],
                ['question' => 'TAO (11 titik): Sino ang palaging laman ng isip ni Ibarra?', 'answer' => 'MARIA CLARA'],
                ['question' => 'LUGAR (8 titik): Saan nagmula si Maria Clara?', 'answer' => 'BEATERYO'],
                ['question' => 'BILANG (6 titik): Ilan ang pangitain na nasilayan ni Ibarra sa kalawakan?', 'answer' => 'DALAWA'],
                ['question' => 'TAO (3 titik): Sa kanyang pangitain, sino ang lalaking nakita ni Ibarra na nagdurusa sa kulungan?', 'answer' => 'AMA'],
                ['question' => 'BAGAY (4 titik): Ano ang namatay sa katapat na bahay Ibarra?', 'answer' => 'ILAW'],
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
