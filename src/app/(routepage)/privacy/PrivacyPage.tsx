"use client"
import { useAppSelector } from "@/store/hooks";

export default function PrivacyPage() {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const headingClass = `font-bold mb-6 ${isDarkMode ? "text-cyan-300" : "text-cyan-600"
    }`;

  const subHeadingClass = `font-semibold mt-8 mb-2 ${isDarkMode ? "text-cyan-300" : "text-cyan-600"
    }`;

  return (
    <div
      className={`p-6 z-20  mx-auto pt-30 ${isDarkMode ? "text-white bg-[#0A192F]" : "text-gray-80 bg-white"
        }`}
    >
      <h1 className={`text-3xl  text-center ${headingClass}`}>Privacy Policy</h1>

      <p className="mb-4">
        At MediConnection, we are committed to safeguarding your privacy and
        ensuring that your personal, medical, and professional data is handled
        with the highest standards of security and integrity. This Privacy Policy
        explains how we collect, use, and protect the data of{" "}
        <strong>Doctors</strong>, <strong>Users</strong>, and{" "}
        <strong>Health Centers</strong>.
      </p>

      {/* Data Collection */}
      <h2 className={`text-2xl ${subHeadingClass}`}>1. Data Collection</h2>

      <h3 className="text-lg font-semibold mt-4 mb-1">For Doctors</h3>
      <ul className="list-disc list-inside mb-4">
        <li>Email and Password (used only for login and account verification).</li>
        <li>
          Professional details such as specialization, qualifications, and clinic
          information.
        </li>
        <li>Optional: License numbers and documents for verification purposes.</li>
      </ul>

      <h3 className="text-lg font-semibold mt-4 mb-1">For Users</h3>
      <ul className="list-disc list-inside mb-4">
        <li>
          Details provided during form submission, including full name, age,
          gender, and symptoms.
        </li>
        <li>
          Mobile Number (used only for appointment confirmation and
          communication).
        </li>
        <li>Email or Username (used for login and profile access).</li>
      </ul>

      <h3 className="text-lg font-semibold mt-4 mb-1">For Health Centers</h3>
      <ul className="list-disc list-inside mb-4">
        <li>
          Official documents including HCRN/HCF number, registration
          certificates, and address proof.
        </li>
        <li>
          Contact details of the authorized person representing the health
          center.
        </li>
        <li>Email and Password for account access.</li>
      </ul>

      {/* Data Usage */}
      <h2 className={`text-2xl ${subHeadingClass}`}>2. Data Usage</h2>
      <p className="mb-4">The collected data is strictly used for:</p>
      <ul className="list-disc list-inside mb-4">
        <li>Appointment booking and consultation purposes.</li>
        <li>
          Verification of Doctors and Health Centers before allowing them to
          operate on the platform.
        </li>
        <li>Providing a secure and personalized experience for Users.</li>
      </ul>

      {/* Data Security */}
      <h2 className={`text-2xl ${subHeadingClass}`}>3. Data Security</h2>
      <p className="mb-4">
        All sensitive data including medical history, documents, and login
        credentials are <strong>encrypted</strong> and stored securely in
        compliance with industry standards. We employ firewalls, access controls,
        and monitoring tools to ensure that your data remains protected from
        unauthorized access.
      </p>

      {/* Technical Team */}
      <h2 className={`text-2xl ${subHeadingClass}`}>
        4. Role of Technical Team
      </h2>
      <p className="mb-4">
        Our dedicated <strong>Technical and Compliance Team</strong> oversees the
        approval of Health Centers by reviewing submitted documents and ensuring
        compliance with medical regulations. They also monitor Doctor and User
        activities to prevent misuse. The team has full authority to:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>
          Approve or reject Health Center registrations after verifying
          authenticity.
        </li>
        <li>
          Close or suspend accounts of Doctors, Users, or Health Centers if found
          violating our policies.
        </li>
        <li>
          Investigate reported misconduct, fraud, or misrepresentation.
        </li>
      </ul>

      {/* Sharing Policy */}
      <h2 className={`text-2xl ${subHeadingClass}`}>
        5. Sharing of Information
      </h2>
      <p className="mb-4">
        We <strong>do not share</strong> your data with third parties for
        marketing or commercial purposes. Data may only be shared with:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>Authorized medical professionals during consultations.</li>
        <li>
          Government authorities, if legally required under applicable laws.
        </li>
      </ul>

      {/* Policy Violations */}
      <h2 className={`text-2xl ${subHeadingClass}`}>6. Policy Violations</h2>
      <p className="mb-4">
        Any violation of this policy, including false registration, misuse of
        patient data, fraudulent activities, or unethical practices, will lead to
        immediate suspension or permanent termination of the account by our
        Technical Team.
      </p>

      {/* User Rights */}
      <h2 className={`text-2xl ${subHeadingClass}`}>7. User Rights</h2>
      <p className="mb-4">
        You have the right to access, modify, or delete your personal data at any
        time. Requests can be made through your account dashboard or by
        contacting our support team.
      </p>

      {/* Updates */}
      <h2 className={`text-2xl ${subHeadingClass}`}>
        8. Updates to Privacy Policy
      </h2>
      <p>
        We may update this Privacy Policy from time to time to reflect legal,
        technical, or business changes. Continued use of the platform after
        updates constitutes acceptance of the new policy.
      </p>
    </div>
  );
}
