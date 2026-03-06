import { useSelector } from "react-redux";
import { useAppSelector } from "@/store/hooks";

interface StepperProps {
  step: number;
}

export default function Stepper({ step }: StepperProps) {
  const steps = ["Personal Info", "Health Center", "Schedule"];

  const isDarkMode = useAppSelector(
    (state) => state.theme.isDarkMode
  );

  return (
    <div className="flex justify-between mb-8">
      {steps.map((label, i) => {
        const active = step === i + 1;

        return (
          <div
            key={label}
            className={`flex-1 text-center py-2 rounded-full transition-all duration-300 font-medium ${active
              ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md shadow-cyan-500/30"
              : isDarkMode
                ? "text-gray-400 hover:bg-slate-800"
                : "text-gray-500 hover:bg-gray-100"
              }`}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
}
