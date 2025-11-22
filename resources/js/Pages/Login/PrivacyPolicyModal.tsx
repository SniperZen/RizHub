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
          <h2 className="text-2xl font-bold text-[#5A3416]">Privacy Policy</h2>
          <button
            onClick={onClose}
            className="text-[#5A3416] hover:text-[#E26F42] text-2xl font-bold"
          >
            &times;
          </button>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-[#E26F42] mb-3">RizHub: Privacy Policy</h3>
          <p className="text-sm text-gray-600 mb-4">Last Updated: July 4, 2025</p>
          
          <p className="mb-4 text-[#282725]">
            At RizHub, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you access our platform, in accordance with applicable data privacy laws in the Philippines.
          </p>

          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-[#5A3416]">1. Data Privacy Laws</h4>
              <p className="text-[#282725]">
                We adhere to the Data Privacy Act of 2012 (Republic Act No. 10173) to ensure your personal information is handled responsibly and securely.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-[#5A3416]">2. What We Collect</h4>
              <p className="text-[#282725]">
                We may collect the following types of information:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-[#282725]">
                <li>Name</li>
                <li>Email address</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-[#5A3416]">3. How We Use Your Information</h4>
              <p className="text-[#282725]">
                We use your information to:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-[#282725]">
                <li>Provide account access and functionality</li>
                <li>Communicate important updates or responses to inquiries</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-[#5A3416]">4. Data Protection</h4>
              <p className="text-[#282725]">
                We apply reasonable security measures, including encrypted storage and access controls, to protect your data from unauthorized access or misuse. However, no system is completely secure. Users are encouraged to use unique passwords and keep their accounts private.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-[#5A3416]">5. Sharing of Data</h4>
              <p className="text-[#282725]">
                We do not sell or share personal information with third parties. Data may be shared internally within the RizHub development team for platform improvements only.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-[#5A3416]">6. Your Rights</h4>
              <p className="text-[#282725]">
                As a user, you have the right to:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-[#282725]">
                <li>Update your data</li>
                <li>Correct inaccurate information</li>
                <li>Delete your account and data</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-[#5A3416]">7. Retention Policy</h4>
              <p className="text-[#282725]">
                We retain user data only for as long as necessary to operate the platform or until the user requests deletion.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-[#5A3416]">Contact Us</h4>
              <p className="text-[#282725]">
                For questions about this policy or your data, please contact:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-[#282725]">
                <li>Email: rizhub.caps@gmail.com</li>
                <li>Facebook Page: RizHub EdGame</li>
                <li>Location: Looc, Occidental Mindoro, Philippines</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;