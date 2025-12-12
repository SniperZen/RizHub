import React from 'react';

type ModalProps = {
  open: boolean;
  onClose: () => void;
};

const PrivacyPolicyModal: React.FC<ModalProps> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-[#FAF7F0] rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#5A3416]">Patakaran sa Pagkapribado</h2>
          <button
            onClick={onClose}
            className="text-[#5A3416] hover:text-[#E26F42] text-2xl font-bold"
          >
            &times;
          </button>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-[#E26F42] mb-3">RizHub: Patakaran sa Pagkapribado</h3>
          <p className="text-sm text-gray-600 mb-4">Huling In-update: Hulyo 4, 2025</p>
          
          <p className="mb-4 text-[#282725]">
            Sa RizHub, kami ay nakatuon sa pangangalaga ng iyong pribadong impormasyon. Ang Patakarang ito sa Pagkapribado ay nagpapaliwanag kung paano namin kinokolekta, ginagamit, at pinoprotektahan ang iyong personal na impormasyon kapag ginamit mo ang aming plataporma, alinsunod sa umiiral na mga batas sa pagkapribado ng datos sa Pilipinas.
          </p>

          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-[#5A3416]">1. Mga Batas sa Pagkapribado ng Datos</h4>
              <p className="text-[#282725]">
                Sumusunod kami sa Data Privacy Act of 2012 (Republic Act No. 10173) upang matiyak na ang iyong personal na impormasyon ay pinangangasiwaan nang responsable at ligtas.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-[#5A3416]">2. Anong Impormasyon ang Kinokolekta Namin</h4>
              <p className="text-[#282725]">
                Maaaring kolektahin namin ang sumusunod na uri ng impormasyon:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-[#282725]">
                <li>Pangalan</li>
                <li>Email address</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-[#5A3416]">3. Paano Ginagamit ang Iyong Impormasyon</h4>
              <p className="text-[#282725]">
                Ginagamit namin ang iyong impormasyon upang:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-[#282725]">
                <li>Magbigay ng akses sa account at mga functionality ng plataporma</li>
                <li>Makipag-ugnayan sa mahahalagang update o sagutin ang mga katanungan</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-[#5A3416]">4. Proteksyon ng Datos</h4>
              <p className="text-[#282725]">
                Nagpapatupad kami ng makatuwirang hakbang sa seguridad, kabilang ang encrypted na storage at kontrol sa akses, upang protektahan ang iyong datos mula sa hindi awtorisadong pag-access o maling paggamit. Gayunpaman, walang sistema ang ganap na ligtas. Hinihikayat ang mga gumagamit na gumamit ng natatanging password at panatilihing pribado ang kanilang account.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-[#5A3416]">5. Pagbabahagi ng Datos</h4>
              <p className="text-[#282725]">
                Hindi namin ibinebenta o ibinabahagi ang personal na impormasyon sa mga third party. Ang datos ay maaaring ibahagi sa loob ng RizHub development team para lamang sa pagpapabuti ng plataporma.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-[#5A3416]">6. Iyong mga Karapatan</h4>
              <p className="text-[#282725]">
                Bilang gumagamit, may karapatan kang:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-[#282725]">
                <li>I-update ang iyong datos</li>
                <li>Itama ang anumang maling impormasyon</li>
                <li>Burahin ang iyong account at datos</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-[#5A3416]">7. Patakaran sa Pag-iimbak ng Datos</h4>
              <p className="text-[#282725]">
                Iniimbak lamang namin ang datos ng gumagamit hangga’t kinakailangan para sa operasyon ng plataporma o hanggang sa hilingin ng gumagamit ang pagtanggal nito.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-[#5A3416]">Makipag-ugnayan sa Amin</h4>
              <p className="text-[#282725]">
                Para sa mga katanungan tungkol sa patakarang ito o sa iyong datos, makipag-ugnayan sa:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-[#282725]">
                <li>Email: rizhub.caps@gmail.com</li>
                <li>Facebook Page: RizHub EdGame</li>
                <li>Lokasyon: Looc, Occidental Mindoro, Pilipinas</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;