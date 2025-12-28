"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAppSelector } from "@/store/hooks";
import { MapPin, Loader2 } from "lucide-react";

interface Center {
  id: string;
  name: string;
  address?: string;
}

interface CenterSearchStepProps {
  onSelectCenter: (center: Center) => void;
  onNext: () => void;
}

export default function CenterSearchStep({
  onSelectCenter,
  onNext,
}: CenterSearchStepProps) {
  const { errorToast } = useToast();

  const [pincode, setPincode] = useState<string>("");
  const [centers, setCenters] = useState<Center[]>([]);
  const [selected, setSelected] = useState<Center | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const inputClass = `w-full p-3 rounded-lg border transition-all duration-300 outline-none focus:ring-2 focus:ring-cyan-500 ${isDarkMode
      ? "bg-slate-800 border-slate-700 text-white placeholder:text-gray-500"
      : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
    }`;

  const search = async (codeOverride?: string): Promise<void> => {
    const code = typeof codeOverride === "string" ? codeOverride : pincode;

    if (!code || code.length !== 6) {
      errorToast("Enter valid 6-digit pincode");
      return;
    }

    setIsSearching(true);

    try {
      const res = await fetch(
        `/api/healthcenter/search?pincode=${code}`
      );
      const json: { centers?: Center[] } = await res.json();

      if (!json.centers || json.centers.length === 0) {
        errorToast("No centers found for this pincode");
        errorToast("Try with different pincode");
      }

      setCenters(json.centers || []);
    } catch {
      errorToast("Failed to fetch centers");
    } finally {
      setIsSearching(false);
    }
  };

  const handleLocationSearch = (): void => {
    if (!navigator.geolocation) {
      errorToast("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );

          const data: { address?: { postcode?: string } } =
            await response.json();

          const postcode = data.address?.postcode;

          if (postcode) {
            setPincode(postcode);
            await search(postcode);
          } else {
            errorToast("Could not detect pincode from location");
            errorToast("Try with different pincode");
          }
        } catch {
          errorToast("Failed to fetch location details");
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);

        if (error.code === error.PERMISSION_DENIED) {
          errorToast(
            "Location permission denied. Please enter pincode manually."
          );
        } else {
          errorToast("Unable to retrieve location");
        }
      }
    );
  };

  const continueNext = (): void => {
    if (!selected) {
      errorToast("Please select a health center");
      return;
    }

    onSelectCenter(selected);
    onNext();
  };

  return (
    <Card
      className={`p-6 shadow-md transition-all duration-300 ${isDarkMode
          ? "bg-slate-900 border-slate-800"
          : "bg-white"
        }`}
    >
      <CardHeader>
        <CardTitle
          className={isDarkMode ? "text-white" : "text-gray-900"}
        >
          Find Health Center
        </CardTitle>
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
            onChange={(e) =>
              setPincode(e.target.value.replace(/\D/g, ""))
            }
          />

          <Button
            onClick={() => search()}
            disabled={isSearching}
            className="bg-cyan-600 hover:bg-cyan-700 text-white min-w-[100px] shadow-lg shadow-cyan-500/20 transition-all active:scale-95 disabled:opacity-70"
          >
            {isSearching ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Search"
            )}
          </Button>
        </div>

        <div className="relative flex items-center justify-center my-2">
          <span
            className={`absolute px-2 text-sm ${isDarkMode
                ? "bg-slate-900 text-gray-500"
                : "bg-white text-gray-400"
              }`}
          >
            OR
          </span>
          <div
            className={`w-full border-b ${isDarkMode
                ? "border-slate-700"
                : "border-gray-200"
              }`}
          />
        </div>

        <Button
          variant="outline"
          onClick={handleLocationSearch}
          disabled={isLocating}
          className={`w-full py-2 text-base border-2 border-dashed transition-all duration-300 flex justify-center items-center group ${isDarkMode
              ? "border-slate-700 text-cyan-400 hover:bg-slate-800 hover:border-cyan-500"
              : "border-gray-300 text-cyan-600 hover:bg-cyan-50 hover:border-cyan-500"
            }`}
        >
          {isLocating ? (
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
          ) : (
            <MapPin className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
          )}
          <div>
            {isLocating ? "Detecting..." : "Use My Location"}
          </div>
        </Button>

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
            <div
              className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"
                }`}
            >
              {c.name}
            </div>
            <div
              className={`text-sm ${isDarkMode
                  ? "text-gray-300"
                  : "text-gray-500"
                }`}
            >
              {c.address}
            </div>
          </div>
        ))}

        <Button
          onClick={continueNext}
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-1 text-lg font-semibold shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
        >
          Continue
        </Button>
      </CardContent>
    </Card>
  );
}
