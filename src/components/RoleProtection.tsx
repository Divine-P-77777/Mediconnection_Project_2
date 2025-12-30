"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/supabase/client";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RoleProtectionProps {
    children: ReactNode;
    allowedRoles: string[];
}

const RoleProtection = ({ children, allowedRoles }: RoleProtectionProps) => {
    const router = useRouter();
    const { errorToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const {
                    data: { session },
                } = await supabase.auth.getSession();

                if (!session) {
                    // No session -> Redirect to generic login or specific portal?
                    // For now, let's redirect to home or login choice
                    router.replace("/auth/login");
                    return;
                }

                const userId = session.user.id;
                const { data: profile, error } = await supabase
                    .from("profiles")
                    .select("role")
                    .eq("id", userId)
                    .single();

                if (error || !profile) {
                    throw new Error("Profile not found");
                }

                if (allowedRoles.includes(profile.role)) {
                    //  Authorized
                    setIsAuthorized(true);
                } else {
                    // Unauthorized -> Redirect based on their ACTUAL role
                    errorToast(`Access Denied: You are logged in as ${profile.role}`);

                    switch (profile.role) {
                        case "health_center":
                            router.replace("/healthcenter");
                            break;
                        case "doctor":
                            router.replace("/doctor");
                            break;
                        case "super_admin":
                            router.replace("/admin");
                            break;
                        case "user":
                        default:
                            router.replace("/user");
                            break;
                    }
                }
            } catch (err) {
                console.error("Auth check failed:", err);
                router.replace("/auth");
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [allowedRoles, router, errorToast]);

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
            </div>
        );
    }

    if (!isAuthorized) {
        return null;
    }

    return <>{children}</>;
};

export default RoleProtection;
