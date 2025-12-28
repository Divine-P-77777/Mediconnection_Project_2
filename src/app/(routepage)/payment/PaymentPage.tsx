"use client";
import { useAppSelector } from "@/store/hooks";

export default function PaymentPage() {
    const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

    const containerClass = `p-6 pt-30 min-h-screen mx-auto ${isDarkMode ? "text-gray-200 bg-gray-900" : "text-gray-800 bg-white"
        }`;

    const headingClass = `font-bold mb-6 text-center ${isDarkMode ? "text-cyan-300" : "text-cyan-600"
        }`;

    const subHeadingClass = `font-semibold mt-8 mb-2 ${isDarkMode ? "text-cyan-300" : "text-cyan-600"
        }`;

    return (
        <div className={containerClass}>
            <h1 className={headingClass + " text-2xl"}>Payment Terms</h1>
            <p>
                Payments for appointments and consultations are processed through our secure gateway.
                Prices are set individually by each Health Center or Doctor.
                By default, services are free unless the provider specifies a price.
            </p>

            <h2 className={subHeadingClass + " text-xl"}>Refund Policy</h2>
            <p>
                In case of incorrect submission by the user (such as wrong details), refunds will be
                initiated within <strong>2 working days</strong> of the cancellation request.
            </p>

            <h2 className={subHeadingClass + " text-xl"}>Responsibility</h2>
            <p>
                MediConnection is only a platform to connect patients with health centers and doctors.
                Payment responsibility lies with the respective provider.
            </p>
        </div>
    );
}
