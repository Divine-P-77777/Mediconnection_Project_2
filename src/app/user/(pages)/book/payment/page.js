"use client";
import { useRef, useEffect } from "react";
import { load } from "@cashfreepayments/cashfree-js";

export default function V3Card() {
  const paymentBtn = useRef(null);
  const paymentMessage = useRef(null);

  // Store cashfree instance + fields in refs so they persist without re-renders
  const cashfreeRef = useRef(null);
  const cardComponentRef = useRef(null);
  const cvvComponentRef = useRef(null);
  const cardHolderRef = useRef(null);
  const cardExpiryRef = useRef(null);
  const saveRef = useRef(null);

  useEffect(() => {
    const renderCard = async () => {
      const cashfree = await load({ mode: "sandbox" });
      cashfreeRef.current = cashfree;

      let styleObject = {
        fonts: [{ cssSrc: "https://fonts.googleapis.com/css2?family=Lato" }],
        base: {
          fontSize: "16px",
          fontFamily: "Lato",
          backgroundColor: "#FFFFFF",
          ":focus": {
            border: "1px solid #2361d5",
          },
          border: "1px solid #e6e6e6",
          borderRadius: "5px",
          padding: "16px",
          color: "#000000",
        },
        invalid: {
          color: "#df1b41",
        },
      };

      // Card Number
      const cardComponent = cashfree.create("cardNumber", {
        values: { placeholder: "Enter Card Number" },
        style: styleObject,
      });
      cardComponent.mount("#cardNumber");
      cardComponentRef.current = cardComponent;

      // CVV
      const cvvComponent = cashfree.create("cardCvv", { style: styleObject });
      cvvComponent.mount("#cardCvv");
      cvvComponentRef.current = cvvComponent;

      // Card Holder
      const cardHolder = cashfree.create("cardHolder", {
        values: { placeholder: "Enter Card Holder Name" },
        style: styleObject,
      });
      cardHolder.mount("#cardHolder");
      cardHolderRef.current = cardHolder;

      // Expiry
      const cardExpiry = cashfree.create("cardExpiry", { style: styleObject });
      cardExpiry.mount("#cardExpiry");
      cardExpiryRef.current = cardExpiry;

      // Save Option
      const save = cashfree.create("savePaymentInstrument", {
        values: { label: "Save Card for later" },
        style: styleObject,
      });
      save.mount("#save");
      saveRef.current = save;

      // Event Listeners
      const toggleBtn = () => {
        if (
          cardExpiry.isComplete() &&
          cardHolder.isComplete() &&
          cardComponent.isComplete() &&
          cvvComponent.isComplete()
        ) {
          paymentBtn.current.disabled = false;
        } else {
          paymentBtn.current.disabled = true;
        }
      };

      cardExpiry.on("change", toggleBtn);
      cardHolder.on("change", toggleBtn);
      cardComponent.on("change", (data) => {
        cvvComponent.update({ cvvLength: data.value.cvvLength });
        toggleBtn();
      });
      cvvComponent.on("change", toggleBtn);
    };

    renderCard();
  }, []);

  const doPayment = () => {
    paymentBtn.current.disabled = true;
    cashfreeRef.current
      .pay({
        paymentMethod: cardComponentRef.current,
        paymentSessionId: "your-payment-session-id", // TODO: Replace with backend session ID
        savePaymentInstrument: saveRef.current,
      })
      .then((data) => {
        if (data && data.error) {
          paymentMessage.current.innerHTML = data.error.message;
        }
        paymentBtn.current.disabled = false;
      });
  };

  return (
    <div  className="pt-30 min-h-screen mt-30"
      id="cardLayout"
      style={{
        width: "400px",
        padding: "20px",
        background: "#f6f9fb",
        borderRadius: "8px",
      }}
    >
      <div id="cardNumber" style={{ marginBottom: "10px" }}></div>
      <div id="cardHolder" style={{ marginBottom: "10px" }}></div>
      <div style={{ marginBottom: "10px", display: "flex" }}>
        <div id="cardExpiry" style={{ marginRight: "1rem" }}></div>
        <div id="cardCvv"></div>
      </div>
      <div id="save" style={{ marginBottom: "10px" }}></div>
      <button
        type="submit"
        id="payNow"
        ref={paymentBtn}
        onClick={doPayment}
        disabled
        style={{
          width: "100%",
          height: "35px",
          cursor: "pointer",
          border: "1px solid #2361d5",
          color: "#2361d5",
          background: "none",
          borderRadius: "8px",
        }}
      >
        Pay Now
      </button>
      <p id="paymentMessage" ref={paymentMessage} style={{ color: "#df1b41" }}></p>
    </div>
  );
}
