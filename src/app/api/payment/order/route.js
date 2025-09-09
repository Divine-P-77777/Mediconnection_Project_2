import { NextResponse } from "next/server";
import { Cashfree } from "cashfree-pg";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

function generateOrderId() {
    return crypto.randomBytes(6).toString("hex");
}

export async function POST(req) {
    try {
        const body = await req.json();
        const { doctorId, amount, date, customer } = body;

        if (!doctorId || !amount || !date || !customer) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Fetch doctor from Supabase (for future split, not strictly needed for payment)
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY
        );
        const { data: doctor, error } = await supabase
            .from("doctors")
            .select("account_number, name, email")
            .eq("id", doctorId)
            .single();

        if (error || !doctor) {
            return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
        }

        // Prepare Cashfree client (v5+)
        const cashfree = new Cashfree(
            Cashfree.SANDBOX, // or Cashfree.PRODUCTION
            process.env.CASHFREE_CLIENT_ID,
            process.env.CASHFREE_CLIENT_SECRET
        );

        const orderId = generateOrderId();
        const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?order_id=${orderId}`;

        // All fields must be correct type!
        const orderRequest = {
            order_id: "testorder1234",
            order_amount: 7,
            order_currency: "INR",
            customer_details: {
                customer_id: "testuser@example.com",
                customer_name: "Test User",
                customer_email: "testuser@example.com",
                customer_phone: "9999999999"
            },
            order_meta: {
                return_url: "https://google.com"
            }
        };
        console.log(JSON.stringify(orderRequest, null, 2));


        // Deep log for debugging
        console.log("Cashfree orderRequest:", JSON.stringify(orderRequest, null, 2));

        const apiVersion = "2023-08-01";
        let response;
        try {
            response = await cashfree.PGCreateOrder(apiVersion, orderRequest);
            console.log("Cashfree PGCreateOrder response:", response.data);
        } catch (cfErr) {
            if (cfErr.response) {
                console.error("Cashfree API error response:", cfErr.response.data);
                return NextResponse.json({
                    error: "Cashfree API error",
                    cashfree: cfErr.response.data,
                }, { status: 400 });
            } else {
                throw cfErr;
            }
        }

        return NextResponse.json({
            payment_session_id: response.data.payment_session_id,
            order_id: response.data.order_id,
        });
    } catch (err) {
        console.error("Payment order error (outer catch):", err);
        return NextResponse.json({ error: "Failed to create order", details: err?.message }, { status: 500 });
    }
}