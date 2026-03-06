export const InfoRow = ({
    label,
    value,
    isDarkMode = false,
}: {
    label: string;
    value: string;
    isDarkMode?: boolean;
}) => (
    <div
        className={`
      flex flex-col gap-0.5 rounded-lg px-3 py-2 border
      ${isDarkMode
                ? "border-gray-800 bg-gray-900/40"
                : "border-gray-200 bg-gray-50"
            }
    `}
    >
        <span
            className={`
        text-xs font-medium
        ${isDarkMode ? "text-gray-400" : "text-gray-500"}
      `}
        >
            {label}
        </span>

        <span
            className={`
        text-sm font-semibold
        ${isDarkMode ? "text-gray-100" : "text-gray-900"}
      `}
        >
            {value}
        </span>
    </div>
);
