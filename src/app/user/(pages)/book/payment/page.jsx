"use client";
import { useEffect, useState } from "react";
import { load } from "@cashfreepayments/cashfree-js";
import { useRouter } from "next/navigation";

function Checkout() {
  const [cashfree, setCashfree] = useState(null);
  const router = useRouter();

  // Initialize Cashfree SDK
  useEffect(() => {
    (async () => {
      const cf = await load({ mode: "sandbox" }); // change to "production" after going live
      setCashfree(cf);
    })();
  }, []);

  const doPayment = async () => {
    // 1️⃣ Call backend to generate order
    const res = await fetch("/api/appointments/payment/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: "1",
        customer_id: "cust_001",
        customer_name: "Test User",
        customer_email: "test@example.com",
        customer_phone: "9999999999",
      }),
    });

    const data = await res.json();

    if (!data.payment_session_id) {
      alert("Failed to create order: " + JSON.stringify(data));
      return;
    }

    // 2️⃣ Use payment_session_id from backend
    const checkoutOptions = {
      paymentSessionId: data.payment_session_id,
      redirectTarget: "_self",
      onSuccess: async (paymentResponse) => {
        console.log("Payment Response:", paymentResponse);

        // 3️⃣ Call verify API after payment success
        const verifyRes = await fetch("/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order_id: data.order_id }),
        });

        const verifyData = await verifyRes.json();
        console.log("Verify Response:", verifyData);

        if (verifyData.success) {
          // Redirect to my bookings page
          router.push("/user/book/mybooking");
        } else {
          alert("Payment verification failed!");
        }
      },
      onFailure: (err) => {
        console.error("Payment failed:", err);
        alert("Payment failed!");
      },
    };

    cashfree.checkout(checkoutOptions);
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
