import React, { useRef } from "react";

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName?: string;
  totalProgress?: number;
  totalKabanata?: number;  
}

const CertificateModal: React.FC<CertificateModalProps> = ({ 
  isOpen, 
  onClose, 
  studentName = "Juan Dela Cruz",
  totalProgress,
  totalKabanata,
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);

//   const handleDownloadPDF = async () => {
//     if (!certificateRef.current) return;

//     try {
//       const html2canvas = (await import("html2canvas")).default;
//       const jsPDF = (await import("jspdf")).default;

//       const canvas = await html2canvas(certificateRef.current, {
//         scale: 2,
//         useCORS: true,
//         logging: false,
//       });

//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF("landscape", "mm", "a4");
//       const imgWidth = 297;
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;

//       pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
//       pdf.save(`Katibayan-ng-Pagtatapos-${studentName.replace(/\s+/g, "-")}.pdf`);
//     } catch (error) {
//       console.error("Error generating PDF:", error);
//       alert("May error sa pag-generate ng PDF. Pakisubukan muli.");
//     }
//   };

    const handleDownloadPDF = async () => {
    try {
      const jsPDF = (await import("jspdf")).default;
      const pdf = new jsPDF("landscape", "mm", "a4");

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Background
      pdf.setFillColor(245, 232, 200);
      pdf.rect(0, 0, pageWidth, pageHeight, "F");

      // Borders
      pdf.setDrawColor(139, 90, 43);
      pdf.setLineWidth(3);
      pdf.rect(10, 10, pageWidth - 20, pageHeight - 20);
      pdf.setDrawColor(193, 154, 107);
      pdf.setLineWidth(1);
      pdf.rect(20, 20, pageWidth - 40, pageHeight - 40);

      // Title
      pdf.setFont("times", "bold");
      pdf.setTextColor(92, 62, 30);
      pdf.setFontSize(36);
      pdf.text("Katibayan ng Pagtatapos", pageWidth / 2, 60, { align: "center" });

      // Student Name
      pdf.setFont("times", "italic");
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(28);
      pdf.text(studentName.toUpperCase(), pageWidth / 2, 100, { align: "center" });

      // Body
      pdf.setFont("times", "normal");
      pdf.setFontSize(14);
      pdf.setTextColor(60, 40, 20);
      const certificateText = `ay matagumpay na nakatapos sa aralin sa pamamagitan ng pagpapamalas
ng malalim na paglalakbay sa mga kabanata ng "Noli Me Tangere" sa
pamamagitan ng kaniyang talino, pag-unawa, at pagtitiyaga sa bawat
pagsubok at hamon ng karunungan, nakumpleto ang ${percentage}% ng lahat ng kabanata.`;

      pdf.text(certificateText, pageWidth / 2, 130, { align: "center", maxWidth: 250 });

      // Date
      pdf.setFont("times", "italic");
      pdf.setFontSize(12);
      pdf.text(
        new Date().toLocaleDateString("fil-PH", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        pageWidth / 2,
        pageHeight - 40,
        { align: "center" }
      );

      // Signature
    //   pdf.setLineWidth(0.5);
    //   pdf.line(pageWidth / 2 - 40, pageHeight - 60, pageWidth / 2 + 40, pageHeight - 60);
    //   pdf.text("Lagda ng Guro", pageWidth / 2, pageHeight - 55, { align: "center" });

      pdf.save(`Katibayan-ng-Pagtatapos-${studentName.replace(/\s+/g, "-")}.pdf`);
    } catch (error) {
      console.error("Error generating vintage PDF:", error);
      alert("May error sa pag-generate ng PDF. Pakisubukan muli.");
    }
  };

  if (!isOpen) return null;

  const percentage = totalProgress !== undefined && totalKabanata !== undefined && totalKabanata > 0
    ? Math.min(100, Math.round((totalProgress / totalKabanata) * 100))
    : 0;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 p-4">
      <div className="relative w-full max-w-5xl">
        {/* Certificate Design */}
        <div
          ref={certificateRef}
          className="relative w-full aspect-[16/10] bg-no-repeat bg-center bg-contain flex flex-col items-center justify-center"
          style={{ backgroundImage: "url('/Img/Challenge/certificate2.png')" }}
        >
          {/* Title */}
          <div className="absolute top-[25%] ml-[12%] w-full text-center">
            <h1 className="text-5xl md:text-6xl font-lavish text-black">
              Katibayan ng Pagtatapos
            </h1>
          </div>

          {/* Student Name */}
          <div className="absolute top-[43%] ml-[15%] w-full text-center">
            <h2 className="text-2xl font-bold italic text-black">
              {studentName.toUpperCase()}
            </h2>
          </div>

          {/* Certificate Body Text */}
           <div className="absolute top-[55%] ml-[15%] w-1/2 px-16 text-center text-base md:text-[14px] leading-[18px] text-black">
                <p>
                    ay matagumpay na nakatapos sa aralin sa pamamagitan ng pagpapamalas ng malalim na
                    paglalakbay sa mga kabanata ng <span className="italic">"Noli Me Tangere"</span> sa
                    pamamagitan ng kaniyang talino, pag-unawa, at pagtitiyaga sa bawat pagsubok at hamon
                    ng karunungan, nakumpleto ang <span className="font-bold">{percentage}%</span> ng lahat ng kabanata.
                </p>
                
                {percentage > 0 && (
                    <p className="mt-4 font-semibold">
                    {new Date().toLocaleDateString("fil-PH", { 
                        year: "numeric", 
                        month: "long", 
                        day: "numeric" 
                    })}
                    </p>
                )}
            </div>

          {/* Date */}
          {/* <div className="absolute bottom-[15%] w-full text-center text-sm text-black">
            {new Date().toLocaleDateString("fil-PH", { 
              year: "numeric", 
              month: "long", 
              day: "numeric" 
            })}
          </div> */}
        </div>

        {/* Action Buttons */}
<div className="flex justify-center ml-20 -mt-10">
  <button onClick={handleDownloadPDF} className="p-2 hover:opacity-90 transition">
    <img 
      src="/Img/Challenge/pdf.png" 
      alt="I-download ang PDF" 
      width="180" 
      height="40" 
      className="min-w-[120px]"
    />
  </button>

  <button onClick={onClose} className="p-2 hover:opacity-90 transition">
    <img 
      src="/Img/Challenge/closepdf.png" 
      alt="Isara" 
      width="180" 
      height="40" 
      className="min-w-[120px]"
    />
  </button>
</div>
      </div>
    </div>
  );
};

export default CertificateModal;
