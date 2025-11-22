import React, { useRef } from "react";

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName?: string;
  totalStarsPercentage?: number;
  percentageDisplayType?: "rounded" | "decimal";
  totalKabanata?: number;
}

const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  studentName = "Juan Dela Cruz",
  totalStarsPercentage = 0,
  percentageDisplayType = "rounded",
  totalKabanata = 64,
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  // Format percentage based on display type
  const formatPercentage = (percentage: number) => {
    if (percentageDisplayType === "decimal") {
      return percentage.toFixed(2) + "%";
    } else {
      return Math.round(percentage) + "%";
    }
  };

const handleDownloadPDF = async () => {
    try {
      const jsPDF = (await import("jspdf")).default;
      const pdf = new jsPDF("landscape", "mm", "a4");

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Set background color
      pdf.setFillColor(249, 239, 205);
      pdf.rect(0, 0, pageWidth, pageHeight, "F");

      // Load images
      const loadImage = (src: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = src;
          img.onload = () => resolve(img);
          img.onerror = reject;
        });
      };

      try {
        const borderImg = await loadImage("/Img/Challenge/pdfcer.png");
        const titleImg = await loadImage("/Img/Challenge/fontimg.png");
        
        // Add the border image
        pdf.addImage(borderImg, "PNG", 0, 0, pageWidth, pageHeight);

        // Calculate title image dimensions and position
        const titleImgWidth = pageWidth * 0.6; // 80% of page width (bigger)
        const titleImgHeight = (titleImg.height / titleImg.width) * titleImgWidth;
        const titleX = (pageWidth - titleImgWidth) / 2;
        const titleY = 40; // Adjusted position

        // Add the title as image
        pdf.addImage(
          titleImg, 
          "PNG", 
          titleX, 
          titleY, 
          titleImgWidth, 
          titleImgHeight
        );

        // Add "Ang sertipikong ito ay ipinagkakaloob kay" text
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(16);

        // moved from 85 → 90
        pdf.text(
          "Ang sertipikong ito ay ipinagkakaloob kay",
          pageWidth / 2,
          90,
          { align: "center" }
        );

        // Student Name - using helvetica bolditalic
        pdf.setFont("helvetica", "bolditalic");
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(28);

        // Get the text width to center the underline properly
        const studentNameText = studentName.toUpperCase();
        const textWidth = pdf.getTextWidth(studentNameText);

        // Draw the student name
        // moved from 105 → 112
        pdf.text(studentNameText, pageWidth / 2, 112, { align: "center" });

        // Add underline - calculate position based on text width
        // moved from 108 → 116
        const underlineY = 116;
        const underlineX = (pageWidth - textWidth) / 2;

        // Draw the underline
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(0.8);
        pdf.line(underlineX, underlineY, underlineX + textWidth, underlineY);

        // Body text - using helvetica normal
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(14);
        pdf.setTextColor(60, 40, 20);
        
        const displayPercentage = percentageDisplayType === "decimal" 
          ? totalStarsPercentage.toFixed(2) + "%"
          : Math.round(totalStarsPercentage) + "%";

        const certificateText = [
          `bilang pagkilala sa kanyang matagumpay na pagtatapos sa aralin sa pamamagitan ng pagpapamalas`,
          `ng malalim na paglalakbay sa mga kabanata ng "Noli Me Tangere" sa pamamagitan ng kaniyang`,
          `talino, pag-unawa, at pagtitiyaga sa bawat pagsubok at hamon ng karunungan,`,
          `at nakamit ang ${displayPercentage} ng mga bituin sa lahat ng kabanata.`
        ];

        certificateText.forEach((line, index) => {
          pdf.text(line, pageWidth / 2, 135 + (index * 7), {
            align: "center",
            maxWidth: 250,
          });
        });

        // Date - using helvetica italic
        pdf.setFont("helvetica", "italic");
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

        // Save the PDF
        pdf.save(`Katibayan-ng-Pagtatapos-${studentName.replace(/\s+/g, "-")}.pdf`);
        
      } catch (imageError) {
        console.error("Error loading images:", imageError);
        // Fallback: Create PDF with text title if images fail to load
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(92, 62, 30);
        pdf.setFontSize(36);
        pdf.text("Katibayan ng Pagtatapos", pageWidth / 2, 60, { align: "center" });
        
        // Add the new text in fallback too
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(16);
        pdf.text("Ang sertipikong ito ay ipinagkakaloob kay", pageWidth / 2, 85, { align: "center" });
        
        pdf.setFont("helvetica", "bolditalic");
        
        // Student name with underline in fallback
        const studentNameText = studentName.toUpperCase();
        const textWidth = pdf.getTextWidth(studentNameText);
        pdf.text(studentNameText, pageWidth / 2, 105, { align: "center" });
        
        // Add underline in fallback
        const underlineY = 108;
        const underlineX = (pageWidth - textWidth) / 2;
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(0.8);
        pdf.line(underlineX, underlineY, underlineX + textWidth, underlineY);
        
        pdf.save(`Katibayan-ng-Pagtatapos-${studentName.replace(/\s+/g, "-")}.pdf`);
      }

    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("May error sa pag-generate ng PDF. Pakisubukan muli.");
    }
  };

  if (!isOpen) return null;

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
          <div className="absolute top-[55%] ml-[12%] w-1/2 px-16 text-center text-base md:text-[14px] leading-[18px] text-black">
            <p>
              bilang pagkilala sa kanyang matagumpay na pagtatapos sa aralin sa pamamagitan
              pagpapamalas ng malalim na paglalakbay sa mga kabanata ng{" "}
              <span className="italic font-bold">"Noli Me Tangere"</span> sa pamamagitan
              ng kaniyang talino, pag-unawa, at pagtitiyaga sa bawat pagsubok at
              hamon ng karunungan, at nakamit ang{" "}
              <span className="font-bold">{formatPercentage(totalStarsPercentage)}</span> ng mga bituin sa lahat ng
              kabanata.
            </p>

            {totalStarsPercentage > 0 && (
              <p className="mt-4 font-semibold">
                {new Date().toLocaleDateString("fil-PH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center ml-20 -mt-10">
          <button
            onClick={handleDownloadPDF}
            className="p-2 hover:opacity-90 transition"
          >
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