import { NextResponse } from "next/server";
import { serviceSupabase } from "@/supabase/serviceClient";

export async function POST(req: Request) {
    try {
        const { email, redirectTo } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const { error: emailError } = await serviceSupabase.auth.resetPasswordForEmail(email, {
            redirectTo: redirectTo || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password`,
        });

        if (emailError) {
            console.warn("Standard email sending failed:", emailError.message);
            console.warn("Attempting to generate recovery link manually (DEV MODE Fallback)...");

            // 2. Fallback: Generate Link (Bypass Email Service)
            // This is useful if the project hit the 3 emails/hour rate limit
            const { data: linkData, error: linkError } = await serviceSupabase.auth.admin.generateLink({
                type: "recovery",
                email,
                options: {
                    redirectTo: redirectTo || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password`,
                }
            });

            if (linkError) {
                console.error("Link generation also failed:", linkError);
                throw emailError;
            }

            if (linkData?.properties?.action_link) {

                console.log(linkData.properties.action_link);
                console.log("\n");

                return NextResponse.json({
                    success: true,
                    message: "Email failed (likely rate limit), check server terminal for link"
                });
            }
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error("Forgot Password Error - Full Object:", JSON.stringify(err, null, 2));
        console.error("Forgot Password Error - Message:", err.message);

        const status = err.status || 500;
        return NextResponse.json(
            { error: err.message || "Failed to send recovery email", details: err },
            { status }
        );
    }
}
