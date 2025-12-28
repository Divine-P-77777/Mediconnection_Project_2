"use client";

import { memo } from "react";
import { useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FileText,
  Shield,
  Briefcase,
  LayoutDashboard,
  LucideIcon,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { JSX } from "react"
/* ---------------------------------- */
/* Types */
/* ---------------------------------- */
interface AdminFeature {
  icon: LucideIcon;
  title: string;
  link: string;
  description: string;
}

interface FeatureCardProps {
  feature: AdminFeature;
  isDarkMode: boolean;
}

/* ---------------------------------- */
/* Feature Config */
/* ---------------------------------- */
const adminFeatures: AdminFeature[] = [
  {
    icon: LayoutDashboard,
    title: "Dashboard",
    link: "/admin/dashboard",
    description: "Overview of the admin panel",
  },
  {
    icon: FileText,
    title: "Manage Reports",
    link: "/admin/reports",
    description: "Upload or review reports from users",
  },
  {
    icon: Shield,
    title: "Privacy & Terms",
    link: "/admin/privacy",
    description: "Edit and manage privacy policies",
  },
  {
    icon: Briefcase,
    title: "Careers",
    link: "/admin/careers",
    description: "Post or manage job openings",
  },
];

/* ---------------------------------- */
/* Feature Card */
/* ---------------------------------- */
const FeatureCard = memo(({ feature, isDarkMode }: FeatureCardProps) => {
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.05 }}
    >
      <Link href={feature.link}>
        <Card
          className={`p-6 h-[200px] text-center border rounded-lg transition-shadow ${isDarkMode
            ? "bg-gray-800 border-gray-700 shadow-cyan-400/30"
            : "bg-white border-gray-300 shadow-gray-300"
            } hover:shadow-md`}
        >
          <CardHeader>
            <div className="flex justify-center mb-4 text-cyan-500">
              <Icon size={30} />
            </div>
            <CardTitle>{feature.title}</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm opacity-80">
              {feature.description}
            </p>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
});
FeatureCard.displayName = "FeatureCard";

/* ---------------------------------- */
/* Admin Home */
/* ---------------------------------- */
export default function AdminHome(): JSX.Element {
  const isDarkMode = useSelector(
    (state: any) => state.theme.isDarkMode
  );

  const { user, session, isSuperAdmin, loading } = useAuth();
  const router = useRouter();

  /* ---------- Guard ---------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!user || !session || !isSuperAdmin) {
    router.replace("/auth/admin");
    return null;
  }

  /* ---------- Render ---------- */
  return (
    <div
      className={`min-h-screen p-6 py-24 transition-colors ${isDarkMode
        ? "bg-[#0A192F] text-white"
        : "bg-gray-50 text-gray-900"
        }`}
    >
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-2xl sm:text-4xl font-bold">
          Welcome Admin to Mediconnection
        </h1>
        <p className="mt-2 text-lg opacity-80">
          Manage everything from one simple dashboard.
        </p>
      </motion.div>

      {/* Admin Info */}
      <div className="mb-8">
        <div
          className={`mx-auto max-w-md p-4 rounded-lg shadow transition-colors ${isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
        >
          <h3 className="text-lg font-semibold mb-2">
            Admin Info
          </h3>
          <p>
            Name:{" "}
            <span className="font-medium">
              {user.user_metadata?.name ??
                user.user_metadata?.username ??
                "Admin"}
            </span>
          </p>
          <p>
            Email:{" "}
            <span className="font-medium">
              {user.email}
            </span>
          </p>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="container mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminFeatures.map((feature) => (
            <FeatureCard
              key={feature.link}
              feature={feature}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
