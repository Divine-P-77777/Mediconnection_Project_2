"use client";
import { useAppSelector } from "@/store/hooks";

export default function TermsAndConditionsPage() {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const headingClass = `font-bold mb-6 text-center ${isDarkMode ? "text-cyan-300" : "text-cyan-600"
    }`;

  const subHeadingClass = `font-semibold mt-8 mb-2 ${isDarkMode ? "text-cyan-300" : "text-cyan-600"
    }`;

  return (
    <div
      className={`p-6 z-20 mx-auto pt-30  ${isDarkMode ? "text-white bg-[#0A192F]" : "text-gray-800 bg-white"
        }`}
    >
      <h1 className={`text-3xl ${headingClass}`}>Terms and Conditions</h1>

      <p className="mb-4">
        Welcome to <span className="font-semibold">MediConnection</span>. By
        accessing or using our platform, you agree to comply with and be bound
        by the following Terms and Conditions. Please read them carefully.
        Continued use of the platform implies acceptance of these terms.
      </p>

      {/* General Terms */}
      <h2 className={`text-2xl ${subHeadingClass}`}>1. General Terms</h2>
      <ul className="list-disc list-inside mb-4">
        <li>
          MediConnection provides an online platform for connecting{" "}
          <strong>Doctors</strong>, <strong>Users</strong>, and{" "}
          <strong>Health Centers</strong>.
        </li>
        <li>
          We reserve the right to update, modify, or terminate services at any
          time without prior notice.
        </li>
        <li>
          Users are responsible for maintaining the confidentiality of their
          login details.
        </li>
      </ul>

      {/* Doctor Role */}
      <h2 className={`text-2xl ${subHeadingClass}`}>2. Terms for Doctors</h2>
      <p className="mb-2">
        Doctors registered on MediConnection must comply with the following
        terms:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>
          <strong>Account Creation:</strong> Doctors must register using a valid
          email and a secure password.
        </li>
        <li>
          <strong>Profile Information:</strong> Doctors must provide accurate
          details including name, specialization, qualification, and
          registration number.
        </li>
        <li>
          <strong>Authentication:</strong> Login requires{" "}
          <strong>Email</strong> and <strong>Password</strong>.
        </li>
        <li>
          <strong>Data Handling:</strong> All patient information shared during
          consultation must be treated as confidential.
        </li>
        <li>
          <strong>Compliance:</strong> Doctors must follow all applicable laws,
          medical council regulations, and ethical practices.
        </li>
      </ul>

      {/* User Role */}
      <h2 className={`text-2xl ${subHeadingClass}`}>3. Terms for Users</h2>
      <p className="mb-2">
        Users (patients/clients) must adhere to the following terms while using
        MediConnection:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>
          <strong>Account Creation:</strong> No pre-registration is required.
          User details are collected only during booking or consultation.
        </li>
        <li>
          <strong>Collected Data:</strong> Full name, age, gender, mobile
          number, and other necessary medical details.
        </li>
        <li>
          <strong>Login:</strong> Users can log in using{" "}
          <strong>Email</strong> or <strong>Username</strong>.
        </li>
        <li>
          <strong>Accuracy:</strong> Users are responsible for providing
          accurate details during form submissions.
        </li>
        <li>
          <strong>Conduct:</strong> Users must not misuse the platform,
          including spamming, fake bookings, or harassment.
        </li>
      </ul>

      {/* Health Center Role */}
      <h2 className={`text-2xl ${subHeadingClass}`}>
        4. Terms for Health Centers
      </h2>
      <p className="mb-2">
        Health Centers partnering with MediConnection must comply with the
        following:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>
          <strong>Registration:</strong> Health Centers must provide valid
          documents, including HCRN/HCF numbers and official address proof.
        </li>
        <li>
          <strong>Verification:</strong> MediConnection will verify all
          documents before approving a Health Center.
        </li>
        <li>
          <strong>Account Access:</strong> Login requires verified email and
          password.
        </li>
        <li>
          <strong>Compliance:</strong> Health Centers must adhere to healthcare
          laws, maintain patient safety, and provide legitimate services.
        </li>
        <li>
          <strong>Responsibility:</strong> Health Centers are solely responsible
          for the authenticity of the services they provide.
        </li>
      </ul>

      {/* Data Protection */}
      <h2 className={`text-2xl ${subHeadingClass}`}>5. Data Protection</h2>
      <ul className="list-disc list-inside mb-4">
        <li>
          All personal and medical information is encrypted and securely stored.
        </li>
        <li>
          MediConnection does not sell or share user data with third parties.
        </li>
        <li>
          Users may request data deletion by contacting our support team.
        </li>
      </ul>

      {/* Limitation of Liability */}
      <h2 className={`text-2xl ${subHeadingClass}`}>
        6. Limitation of Liability
      </h2>
      <p className="mb-4">
        MediConnection acts as a platform provider and is not responsible for
        the accuracy of medical advice, services provided by doctors or health
        centers, or any disputes arising between parties. Users are encouraged
        to verify and consult with licensed professionals before making medical
        decisions.
      </p>

      {/* Governing Law */}
      <h2 className={`text-2xl ${subHeadingClass}`}>7. Governing Law</h2>
      <p className="mb-4">
        These Terms and Conditions are governed by the laws of India. Any
        disputes will be subject to the exclusive jurisdiction of the courts in
        Patna, Bihar.
      </p>

      {/* Contact */}
      <h2 className={`text-2xl ${subHeadingClass}`}>8. Contact Us</h2>
      <p className="mb-4">
        For any queries or concerns regarding these Terms and Conditions, please
        contact us at:{" "}
        <a
          href="mailto:support@mediconnection.com"
          className={`underline ${isDarkMode ? "text-cyan-300" : "text-cyan-600"
            }`}
        >
          support@mediconnection.com
        </a>
      </p>
    </div>
  );
}
