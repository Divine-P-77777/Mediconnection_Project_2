import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSelector } from "react-redux";

export default function CenterSearchStep({ onSelectCenter, onNext }) {
  const { errorToast } = useToast();
  const [pincode, setPincode] = useState("");
  const [centers, setCenters] = useState([]);
  const [selected, setSelected] = useState(null);
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const inputClass = `w-full p-3 rounded-lg border transition-all duration-300 outline-none focus:ring-2 focus:ring-cyan-500 ${isDarkMode
    ? "bg-slate-800 border-slate-700 text-white placeholder:text-gray-500"
    : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
    }`;

  const search = async () => {
    if (pincode.length !== 6) {
      errorToast("Enter valid 6-digit pincode");
      return;
    }
    const res = await fetch(`/api/healthcenter/search?pincode=${pincode}`);
    const json = await res.json();
    setCenters(json.centers || []);
  };

  const continueNext = () => {
    if (!selected) {
      errorToast("Please select a health center");
      return;
    }
    onSelectCenter(selected);
    onNext();
  };

  return (
    <Card className={`p-6 shadow-md transition-all duration-300 ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white"}`}>
      <CardHeader>
        <CardTitle>Find Health Center</CardTitle>
        <CardDescription>
          Search nearby centers by pincode
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <input
            className={inputClass}
            maxLength={6}
            placeholder="Enter pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
          />
          <Button onClick={search}>Search</Button>
        </div>

        {centers.map((c) => (
          <div
            key={c.id}
            onClick={() => setSelected(c)}
            className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 flex justify-between items-center ${selected?.id === c.id
              ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20"
              : isDarkMode
                ? "border-slate-700 hover:border-cyan-400 hover:bg-slate-800 text-gray-300"
                : "border-gray-200 hover:border-cyan-300 hover:bg-gray-50 text-gray-700"
              }`}
          >
            <div className="font-semibold">{c.name}</div>
            <div className="text-sm text-gray-500">{c.address}</div>
          </div>
        ))}

        <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-6 text-lg font-semibold shadow-lg shadow-cyan-500/20 transition-all active:scale-95" onClick={continueNext}>
          Continue
        </Button>
      </CardContent>
    </Card>
  );
}
