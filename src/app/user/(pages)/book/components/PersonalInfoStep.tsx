"use client";

import { useState } from "react";
import { Controller, UseFormReturn, FieldErrors } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SeamlessCalendar from "@/components/ui/SeamlessCalendar";
import { useToast } from "@/hooks/use-toast";
import { useAppSelector } from "@/store/hooks";
import { format } from "date-fns";

interface PersonalInfoFormValues {
  fullName: string;
  phone: string;
  gender: "male" | "female" | "other" | "";
  dob: Date | null;
}

interface PersonalInfoStepProps {
  form: UseFormReturn<PersonalInfoFormValues>;
  onNext: () => void;
}

export default function PersonalInfoStep({
  form,
  onNext,
}: PersonalInfoStepProps) {
  const { control, handleSubmit, formState, watch } = form;
  const { errorToast } = useToast();
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const inputClass = `w-full pl-14 pr-3 py-3 rounded-lg border transition-all duration-300 outline-none focus:ring-2 focus:ring-cyan-500 ${isDarkMode
      ? "bg-slate-800 border-slate-700 text-white placeholder:text-gray-500 hover:border-slate-600"
      : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 hover:border-cyan-300"
    }`;

  const onError = (errors: FieldErrors<PersonalInfoFormValues>): void => {
    const firstError = Object.values(errors)[0];
    if (firstError?.message) {
      errorToast(String(firstError.message));
    } else {
      errorToast("Please fill all required details");
    }
  };

  const submit = (): void => {
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(submit, onError)}>
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
            Personal Information
          </CardTitle>
          <CardDescription>
            This helps us book your appointment accurately
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <Controller
            name="fullName"
            control={control}
            rules={{ required: "Full name is required" }}
            render={({ field }) => (
              <input
                {...field}
                placeholder="Full Name"
                className={inputClass.replace("pl-14", "pl-3")}
              />
            )}
          />

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              +91
            </span>
            <Controller
              name="phone"
              control={control}
              rules={{
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Phone number must be 10 digits",
                },
              }}
              render={({ field }) => (
                <input
                  {...field}
                  maxLength={10}
                  placeholder="Phone number"
                  className={inputClass}
                  onChange={(e) =>
                    field.onChange(e.target.value.replace(/\D/g, ""))
                  }
                />
              )}
            />
          </div>

          <Controller
            name="gender"
            control={control}
            rules={{ required: "Gender is required" }}
            render={({ field }) => (
              <select
                {...field}
                className={inputClass.replace("pl-14", "pl-3")}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            )}
          />

          <div>
            <button
              type="button"
              onClick={() => setShowCalendar((v) => !v)}
              className={`w-full border rounded-lg p-3 text-left transition-all duration-300 flex items-center justify-between group ${isDarkMode
                  ? "bg-slate-800 border-slate-700 text-white hover:border-cyan-500"
                  : "bg-white border-gray-200 text-gray-900 hover:border-cyan-500"
                }`}
            >
              <span className={!watch("dob") ? "text-gray-400" : ""}>
                {watch("dob")
                  ? format(new Date(watch("dob") as Date), "PPP")
                  : "Choose Date of Birth"}
              </span>
              <span className="text-cyan-500 group-hover:scale-110 transition-transform text-xl">
                📅
              </span>
            </button>

            {showCalendar && (
              <div className="mt-3 animate-fade-in">
                <Controller
                  name="dob"
                  control={control}
                  rules={{ required: "Date of Birth is required" }}
                  render={({ field }) => (
                    <SeamlessCalendar
                      selectedDate={field.value}
                      onDateChange={(d) => {
                        field.onChange(d);
                        setShowCalendar(false);
                      }}
                    />
                  )}
                />
              </div>
            )}

            {formState.errors.dob && (
              <p className="text-red-500 text-sm mt-1">
                {String(formState.errors.dob.message)}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-1 text-lg font-semibold shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
          >
            Continue to Search
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
