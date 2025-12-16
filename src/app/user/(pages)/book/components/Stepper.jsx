import { useSelector } from "react-redux";

export default function Stepper({ step }) {
  const steps = ["Personal Info", "Health Center", "Schedule"];
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  return (
    <div className="flex justify-between mb-8">
      {steps.map((label, i) => {
        const active = step === i + 1;
        return (
          <div
            key={label}
            className={`flex-1 text-center pb-2 border-b-4 transition-all duration-300 ${active
                ? "border-cyan-500 text-cyan-500 font-bold"
                : isDarkMode
                  ? "border-slate-700 text-gray-500"
                  : "border-gray-200 text-gray-400"
              }`}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
}
