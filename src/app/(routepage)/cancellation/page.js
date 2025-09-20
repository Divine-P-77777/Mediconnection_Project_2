"use client";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

export default function CancellationTerms() {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const bg = isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black";
  const cardBg = isDarkMode ? "bg-gray-800" : "bg-gray-100";

  return (
    <div className={`w-full min-h-screen flex flex-col items-center justify-center px-6 md:px-16 ${bg}`}>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-5xl font-bold mb-8 text-cyan-500"
      >
        Cancellation Terms
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={`p-6 md:p-10 rounded-lg shadow-lg max-w-3xl ${cardBg}`}
      >
        <p className="text-lg mb-4">
          1. All cancellations must be requested at least 24 hours before the scheduled appointment.
        </p>
        <p className="text-lg mb-4">
          2. Refunds, if applicable, will be processed through the same payment gateway used for booking.
        </p>
        <p className="text-lg mb-4">
          3. A cancellation fee may apply as per the payment gateway’s policies.
        </p>
        <p className="text-lg mb-4">
          4. Requests received after the allowed period may not be eligible for a refund.
        </p>
        <p className="text-lg mb-4">
          5. MediConnection is not responsible for delays or failures caused by the payment gateway.
        </p>
        <p className="text-lg mt-6">
          For further assistance, please contact our support team.
        </p>
      </motion.div>
    </div>
  );
}
