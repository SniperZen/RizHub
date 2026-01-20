import React from 'react';

type ModalProps = {
  open: boolean;
  onClose: () => void;
};

const TermsOfServiceModal: React.FC<ModalProps> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-[#FAF7F0] rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#5A3416]">Mga Tuntunin ng Serbisyo</h2>
          <button
            onClick={onClose}
            className="text-[#5A3416] hover:text-[#E26F42] text-2xl font-bold"
          >
            &times;
          </button>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-[#E26F42] mb-3">RizHub – Mga Tuntunin at Kundisyon</h3>
          <p className="text-sm text-gray-600 mb-4">Huling In-update: Hulyo 4, 2025</p>

          <p className="mb-4 text-[#282725]">
            Maligayang pagdating sa RizHub, isang interaktibong platapormang pang-edukasyon na idinisenyo upang mapalalim ang pag-unawa ng mga estudyante sa <em>Noli Me Tangere</em>. Sa paggamit ng RizHub, sumasang-ayon ka sa mga sumusunod na tuntunin:
          </p>

          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-[#5A3416]">1. Pagtanggap ng Mga Tuntunin</h4>
              <p className="text-[#282725]">
                Sa paggamit ng RizHub, tinatanggap mo ang Mga Tuntunin ng Paggamit kasama ang aming Patakaran sa Pagkapribado.
                Hinihikayat ang mga gumagamit na basahin ang Patakaran sa Pagkapribado upang maunawaan kung paano kinokolekta,
                ginagamit, at pinoprotektahan ang personal na impormasyon.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-[#5A3416]">2. Karapat-dapat na Gumamit</h4>
              <p className="text-[#282725]">
                Bukas ang RizHub sa lahat ng estudyante at guro anuman ang edad. Para sa mga gumagamit na wala pang 18 taong gulang,
                hinihikayat ang gabay ng magulang o tagapag-alaga habang ginagamit ang plataporma.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-[#5A3416]">3. Paglalarawan ng Mga Serbisyo</h4>
              <p className="text-[#282725]">
                Nagbibigay ang RizHub ng interaktibong pagsusuri at impormasyon tungkol sa <em>Noli Me Tangere</em>. Layunin nitong
                mapalalim ang pag-unawa ng mga estudyante sa nobela ni Dr. Jose Rizal sa isang masaya at makabagong paraan.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-[#5A3416]">4. Mga Pagsusulit at Pag-unlad ng Kabanata</h4>
              <ol className="list-decimal pl-5 space-y-2 text-[#282725]">
                <li>Bago magpatuloy sa susunod na kabanata, dapat munang matapos ng gumagamit ang pagsusulit.</li>
                <li>Kinakailangan makapasa sa pagsusulit upang ma-unlock ang susunod na kabanata.</li>
                <li>Ang bawat pagsusulit ay nakabatay sa nilalaman ng kabanatang nilaro o pinanood.</li>
              </ol>
            </div>

            <div>
              <h4 className="font-bold text-[#5A3416]">5. Kodigo ng Pag-uugali</h4>
              <ol className="list-decimal pl-5 space-y-2 text-[#282725]">
                <li>
                  Inaasahan ang lahat ng manlalaro ng RizHub na kumilos nang may respeto, katarungan, at integridad habang ginagamit
                  ang plataporma.
                </li>
                <li>
                  Ang anumang anyo ng panliligalig, bastos na pananalita, panloloko, o hindi angkop na pag-uugali ay mahigpit na
                  ipinagbabawal.
                </li>
              </ol>
            </div>

            {/* ✅ NEW SECTION ADDED */}
            <div>
              <h4 className="font-bold text-[#5A3416]">6. Pagmamay-ari ng Nilalaman at Mga Mahigpit na Paghihigpit</h4>
              <p className="text-[#282725] mb-2">
                Lahat ng nilalaman sa RizHub—kabilang ang mga larawan (images), bidyo (videos), animations, tunog, teksto, disenyo,
                at iba pang materyales—ay protektado ng karapatang-ari (copyright) at iba pang batas sa pagmamay-ari.
                Ang paggamit nito ay para lamang sa pag-aaral at sa loob ng RizHub.
              </p>

              <p className="text-[#282725] mb-2">
                Bilang gumagamit, sumasang-ayon ka na <span className="font-semibold">HINDI</span> mo gagawin ang mga sumusunod
                nang walang malinaw na pahintulot mula sa mga tagapangasiwa ng RizHub:
              </p>

              <ol className="list-decimal pl-5 space-y-2 text-[#282725]">
                <li>
                  <span className="font-semibold">I-download, i-save, o i-extract</span> ang anumang larawan, bidyo, animation,
                  audio, o iba pang content mula sa RizHub.
                </li>
                <li>
                  <span className="font-semibold">Mag-screenshot, mag-screen record, o mag-record</span> gamit ang phone, PC,
                  o anumang device, lalo na kung layunin ay kopyahin o ipamahagi ang content. (Tandaan: maaaring may mga pagkakataong
                  hindi ito 100% mapipigilan sa teknikal na paraan, ngunit ito ay mahigpit pa ring ipinagbabawal sa ilalim ng
                  tuntunin na ito.)
                </li>
                <li>
                  <span className="font-semibold">I-post, i-upload, i-share, o ipamahagi</span> sa social media, group chats,
                  websites, o anumang platform ang content ng RizHub—buo man o bahagi.
                </li>
                <li>
                  <span className="font-semibold">Kopyahin, baguhin, i-edit, i-remix, o gawing sariling gawa</span> ang anumang
                  content, kabilang ang animations at video clips.
                </li>
                <li>
                  <span className="font-semibold">Gamitin ang content</span> para sa ibang proyekto, presentasyon, o anumang layunin
                  na hindi saklaw ng pag-aaral sa RizHub, lalo na kung may kaugnayan sa kita o public sharing.
                </li>
              </ol>
            </div>

            {/* Renumbered old section 6 -> 7 */}
            <div>
              <h4 className="font-bold text-[#5A3416]">7. Limitasyon ng Pananagutan</h4>
              <p className="text-[#282725]">
                Ang RizHub ay ibinibigay "as-is" at "as-available." Hindi namin ginagarantiyahan ang tuloy-tuloy na akses o paggana
                ng plataporma. Hindi kami mananagot sa anumang pinsala na maaaring magmula sa teknikal na problema, pagkawala ng
                koneksyon sa internet, o pagkakamali ng gumagamit.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-[#5A3416]">Makipag-ugnayan sa Amin</h4>
              <p className="text-[#282725]">Para sa mga katanungan, tulong, o ulat:</p>
              <ul className="list-disc pl-5 space-y-1 text-[#282725]">
                <li>Email: rizhub.caps@gmail.com</li>
                <li>Lokasyon: Lubang Occidental Mindoro</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServiceModal;
