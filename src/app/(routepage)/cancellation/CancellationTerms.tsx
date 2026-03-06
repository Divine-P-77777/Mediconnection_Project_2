"use client";

import { motion } from "framer-motion";
import { useAppSelector } from "@/store/hooks";

export default function CancellationTerms() {
    const isDarkMode = useAppSelector(
        (state) => state.theme.isDarkMode
    );

    const bgClass = isDarkMode
        ? "bg-gray-900 text-white"
        : "bg-white text-black";

    const cardClass = isDarkMode
        ? "bg-gray-800"
        : "bg-gray-100";

    return (
        <section
            className={`w-full min-h-screen flex flex-col items-center justify-center px-6 md:px-16 ${bgClass}`}
        >
            {/* Title */}
            <motion.h1
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-4xl md:text-5xl font-bold mb-8 text-cyan-500 text-center"
            >
                Cancellation Terms
            </motion.h1>

            {/* Content Card */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className={`p-6 md:p-10 rounded-xl shadow-lg max-w-3xl w-full ${cardClass}`}
            >
                <ol className="space-y-4 text-lg list-decimal list-inside">
                    <li>
                        All cancellations must be requested at least
                        <span className="font-semibold"> 24 hours </span>
                        before the scheduled appointment.
                    </li>

                    <li>
                        Refunds, if applicable, will be processed using the
                        same payment method used during booking.
                    </li>

                    <li>
                        A cancellation fee may apply based on the payment
                        gateway’s policies.
                    </li>

                    <li>
                        Requests made after the allowed cancellation window
                        may not be eligible for a refund.
                    </li>

                    <li>
                        MediConnection is not responsible for delays or failures
                        caused by third-party payment gateways.
                    </li>
                </ol>

                <p className="text-lg mt-6">
                    For further assistance, please contact our support team.
                </p>
            </motion.div>
        </section>
    );
}
