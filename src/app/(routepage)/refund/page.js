"use client";
import { useSelector } from "react-redux";

export default function RefundPage() {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const headingClass = `font-bold mb-6 text-center ${
    isDarkMode ? "text-cyan-300" : "text-cyan-600"
  }`;

  const subHeadingClass = `font-semibold mt-8 mb-2 ${
    isDarkMode ? "text-cyan-300" : "text-cyan-600"
  }`;

  return (
    <div
      className={`p-6 z-20 mx-auto pt-30  ${
        isDarkMode ? "text-white bg-[#0A192F]" : "text-gray-800 bg-white"
      }`}
    >
      <h1 className={`text-3xl ${headingClass}`}>Refund Policy</h1>

      <p className="mb-4">
        At MediConnection, we strive to maintain a transparent and fair refund
        policy for <strong>Users, Doctors, and Health Centers</strong>. This
        policy outlines the circumstances under which refunds are applicable and
        the processes involved.
      </p>

      {/* For Users */}
      <h2 className={`text-2xl ${subHeadingClass}`}>1. For Users (Patients)</h2>
      <ul className="list-disc list-inside mb-4">
        <li>
          Refunds will be initiated if the user enters incorrect or incomplete
          details during booking and cancels the appointment.
        </li>
        <li>
          If the Health Center or Doctor cancels the appointment, users are
          eligible for a full refund.
        </li>
        <li>
          Refunds will not be provided for no-shows or cancellations made less
          than <strong>2 hours</strong> before the appointment.
        </li>
        <li>
          Refunds will be processed within <strong>2 working days</strong> to
          the original payment method.
        </li>
      </ul>

      {/* For Doctors */}
      <h2 className={`text-2xl ${subHeadingClass}`}>2. For Doctors</h2>
      <ul className="list-disc list-inside mb-4">
        <li>
          Doctors who cancel a confirmed consultation may forfeit their share of
          the booking fee, which will be refunded to the user.
        </li>
        <li>
          If a consultation could not be completed due to a technical issue from
          the platform’s side, the doctor’s account will not be charged, and the
          user will be refunded.
        </li>
        <li>
          In case of disputes, refunds will be determined after investigation by
          our <strong>Technical and Compliance Team</strong>.
        </li>
      </ul>

      {/* For Health Centers */}
      <h2 className={`text-2xl ${subHeadingClass}`}>3. For Health Centers</h2>
      <ul className="list-disc list-inside mb-4">
        <li>
          Health Centers may set their consultation or appointment prices.
          However, if they cancel an appointment, the full refund will be
          provided to the user.
        </li>
        <li>
          If users submit incorrect details or provide fraudulent information,
          the Health Center is not liable for an immediate refund. Refunds will
          be processed after a review period of <strong>2 working days</strong>.
        </li>
        <li>
          In case of repeated misuse of bookings or false submissions, the
          Health Center may request deduction of service fees before refunds are
          issued.
        </li>
      </ul>

      {/* Final Note */}
      <h2 className={`text-2xl ${subHeadingClass}`}>4. Important Note</h2>
      <p className="mb-4">
        All refunds are subject to verification by our{" "}
        <strong>Technical and Compliance Team</strong>. Any violation of our
        policies by <strong>Users, Doctors, or Health Centers</strong> may
        result in account suspension or termination, and refunds may be withheld
        in such cases.
      </p>
    </div>
  );
}
