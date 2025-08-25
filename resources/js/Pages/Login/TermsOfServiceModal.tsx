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
          <h2 className="text-2xl font-bold text-[#5A3416]">Terms of Service</h2>
          <button
            onClick={onClose}
            className="text-[#5A3416] hover:text-[#E26F42] text-2xl font-bold"
          >
            &times;
          </button>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-[#E26F42] mb-3">RizHub – Terms and Conditions</h3>
          <p className="text-sm text-gray-600 mb-4">Last Updated: July 4, 2025</p>
          
          <p className="mb-4 text-[#282725]">
            Welcome to RizHub, an interactive educational platform designed to enhance students' understanding of Noli Me Tangere. By using RizHub, you agree to the following terms:
          </p>

          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-[#5A3416]">1. Acceptance of Terms</h4>
              <p className="text-[#282725]">
                By using RizHub, you accept these Terms of Use along with our Privacy Policy. Users are encouraged to read the Privacy Policy to understand how personal information is collected, used, and protected. 
              </p>
            </div>

            <div>
              <h4 className="font-bold text-[#5A3416]">2. Eligibility</h4>
              <p className="text-[#282725]">
                RizHub is open to students and teachers of all ages. For users under 18, we encourage parental or guardian guidance while using the platform.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-[#5A3416]">3. Description of Services</h4>
              <p className="text-[#282725]">
                RizHub provides interactive assessment, and information about Noli Me Tangere. Its goal is to enhance students' understanding of Dr. Jose Rizal's novel in a fun and modern way.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-[#5A3416]">4. Quizzes and Chapter Progression</h4>
              <ol className="list-decimal pl-5 space-y-2 text-[#282725]">
                <li>Before proceeding to the next chapter, users must complete the assessment.</li>
                <li>Passing the quiz is required to unlock the next chapter.</li>
                <li>Each quiz is based on the content of the chapter that was played or watched.</li>
              </ol>
            </div>

            <div>
              <h4 className="font-bold text-[#5A3416]">5. Code of Conduct</h4>
              <ol className="list-decimal pl-5 space-y-2 text-[#282725]">
                <li>All RizHub players are expected to act respectfully, fairly, and with integrity while using the platform.</li>
                <li>Any form of harassment, offensive language, or inappropriate behavior is strictly discouraged.</li>
              </ol>
            </div>

            <div>
              <h4 className="font-bold text-[#5A3416]">6. Limitation of Liability</h4>
              <p className="text-[#282725]">
                RizHub is provided "as-is" and "as-available." We do not guarantee uninterrupted access or functionality of the platform. We are not liable for any damage resulting from technical issues, loss of internet connection, or user error.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-[#5A3416]">Contact Us</h4>
              <p className="text-[#282725]">
                For inquiries, assistance, or reports:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-[#282725]">
                <li>Email: rizhub.caps@gmail.com</li>
                <li>Facebook Page: RizHub EdGame</li>
                <li>Location: Lubang, Occidental Mindoro, Philippines</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#5A3416] text-white rounded hover:bg-[#3d2410] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServiceModal;