"use client";

import { useEffect, useState, JSX } from "react";
import { load } from "@cashfreepayments/cashfree-js";
import { useRouter } from "next/navigation";

/* -------------------- TYPES -------------------- */

// Cashfree JS SDK does not export strict TS types yet
type CashfreeInstance = {
  checkout: (options: CashfreeCheckoutOptions) => void;
};

interface CashfreeCheckoutOptions {
  paymentSessionId: string;
  redirectTarget?: "_self" | "_blank";
  onSuccess?: (paymentResponse: unknown) => void;
  onFailure?: (error: unknown) => void;
}

interface CreateOrderResponse {
  success: boolean;
  order_id?: string;
  payment_session_id?: string;
  error?: string;
}

interface VerifyPaymentResponse {
  success: boolean;
  [key: string]: unknown;
}

/* -------------------- COMPONENT -------------------- */

function Checkout(): JSX.Element {
  const [cashfree, setCashfree] = useState<CashfreeInstance | null>(null);
  const router = useRouter();

  /* -------- INIT CASHFREE SDK -------- */
  useEffect(() => {
    (async () => {
      const cf = (await load({
        mode: "sandbox", // switch to "production" when live
      })) as CashfreeInstance;

      setCashfree(cf);
    })();
  }, []);

  /* -------- START PAYMENT -------- */
  const doPayment = async (): Promise<void> => {
    try {
      const res = await fetch("/api/appointments/payment/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 1,
          customer_id: "cust_001",
          customer_name: "Test User",
          customer_email: "test@example.com",
          customer_phone: "9999999999",
        }),
      });

      const data: CreateOrderResponse = await res.json();

      if (!data.payment_session_id || !data.order_id) {
        alert("Failed to create order");
        console.error("Order error:", data);
        return;
      }

      const checkoutOptions: CashfreeCheckoutOptions = {
        paymentSessionId: data.payment_session_id,
        redirectTarget: "_self",

        onSuccess: async (paymentResponse) => {
          console.log("Payment success:", paymentResponse);

          // Verify payment
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order_id: data.order_id }),
          });

          const verifyData: VerifyPaymentResponse =
            await verifyRes.json();

          console.log("Verify response:", verifyData);

          if (verifyData.success) {
            router.push("/user/book/mybooking");
          } else {
            alert("Payment verification failed!");
          }
        },

        onFailure: (error) => {
          console.error("Payment failed:", error);
          alert("Payment failed!");
        },
      };

      cashfree?.checkout(checkoutOptions);
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Something went wrong during payment");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-white">
      <p>Click below to open the checkout page in current tab</p>

      <button
        type="button"
        className="btn btn-primary"
        onClick={doPayment}
        disabled={!cashfree}
      >
        Pay Now
      </button>
    </div>
  );
}

export default Checkout;
