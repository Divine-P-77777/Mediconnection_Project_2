# Cashfree Integration

This repository uses Cashfree in a Next.js application with server-side API routes and a client-side checkout flow.

## Key files in this codebase

- `src/app/layout.tsx`
  - Loads the Cashfree JS SDK from `https://sdk.cashfree.com/js/v3/cashfree.js`.
- `src/app/user/(pages)/book/payment/page.tsx`
  - Initializes Cashfree on the client using `load()` from `@cashfreepayments/cashfree-js`.
  - Creates a payment order by calling the backend endpoint `/api/appointments/payment/order`.
  - Starts the Cashfree checkout flow with `cashfree.checkout(...)`.
  - Verifies payment after success using `/api/appointments/payment/verify`.
- `src/app/api/appointments/payment/order/route.ts`
  - Uses `cashfree-pg` server-side to create a Cashfree order.
  - Reads `process.env.CASHFREE_CLIENT_ID` and `process.env.CASHFREE_CLIENT_SECRET`.
  - Inserts order details into a `payment_appointments` table via `serviceSupabase`.
- `src/app/api/appointments/payment/verify/route.ts`
  - Uses `cashfree-pg` server-side to fetch payment status with `PGOrderFetchPayments`.
  - Updates the appointment status in Supabase when payment succeeds.

## Environment variables

The repository expects Cashfree credentials in the environment:

- `CASHFREE_CLIENT_ID`
- `CASHFREE_CLIENT_SECRET`

These are already referenced in `.env` and in the API routes above.

## How Next.js uses Cashfree in this repo

### Client-side flow

1. The Cashfree JS SDK is loaded globally in `src/app/layout.tsx`.
2. In `src/app/user/(pages)/book/payment/page.tsx`, the SDK is initialized with:
   - `load({ mode: "sandbox" })`
   - Switch to `production` once live.
3. The client calls the order creation endpoint:
   - `POST /api/appointments/payment/order`
   - Body includes `amount`, `customer_id`, `customer_name`, `customer_email`, and `customer_phone`.
4. The backend returns `payment_session_id` and `order_id`.
5. The client performs `cashfree.checkout({ paymentSessionId, ... })`.
6. On success, the client calls verification:
   - `POST /api/appointments/payment/verify`
   - Body includes `order_id`.

### Server-side implementation

The two main server routes are:

- `src/app/api/appointments/payment/order/route.ts`
  - Creates the order with `cashfree.PGCreateOrder(...)`.
  - Stores the order and payment session ID in Supabase.
- `src/app/api/appointments/payment/verify/route.ts`
  - Fetches payment data with `cashfree.PGOrderFetchPayments("2023-08-01", order_id)`.
  - Updates the appointment record when payment succeeds.

## Express usage pattern

If you want to use Cashfree in an Express backend, follow the same pattern as the Next.js API routes.

### Example Express order route

```js
import express from "express";
import { Cashfree, CFEnvironment } from "cashfree-pg";

const router = express.Router();

router.post("/payments/order", async (req, res) => {
  const { appointment_id, amount, customer_id, customer_name, customer_email, customer_phone } = req.body;

  if (!appointment_id || !amount || !customer_id) {
    return res.status(400).json({ success: false, error: "Missing required fields" });
  }

  if (!process.env.CASHFREE_CLIENT_ID || !process.env.CASHFREE_CLIENT_SECRET) {
    return res.status(500).json({ success: false, error: "Missing Cashfree credentials" });
  }

  const cashfree = new Cashfree(
    CFEnvironment.PRODUCTION,
    process.env.CASHFREE_CLIENT_ID,
    process.env.CASHFREE_CLIENT_SECRET
  );

  const response = await cashfree.PGCreateOrder({
    order_amount: String(amount),
    order_currency: "INR",
    customer_details: {
      customer_id,
      customer_name,
      customer_email,
      customer_phone,
    },
  });

  return res.json({ success: true, ...response.data });
});

export default router;
```

### Example Express verify route

```js
router.post("/payments/verify", async (req, res) => {
  const { order_id } = req.body;
  if (!order_id) return res.status(400).json({ success: false, error: "Missing order_id" });

  const cashfree = new Cashfree(
    CFEnvironment.PRODUCTION,
    process.env.CASHFREE_CLIENT_ID,
    process.env.CASHFREE_CLIENT_SECRET
  );

  const response = await cashfree.PGOrderFetchPayments("2023-08-01", order_id);
  return res.json({ success: true, data: response.data });
});
```

## Notes from this repo

- The user checkout example is implemented in `src/app/user/(pages)/book/payment/page.tsx`.
- The app uses `@cashfreepayments/cashfree-js` on the client and `cashfree-pg` on the server.
- If you adapt this to Express, keep the server-side credential handling and order creation logic the same.

## Summary

- **Next.js implementation**: `src/app/api/appointments/payment/order/route.ts` + `src/app/api/appointments/payment/verify/route.ts`.
- **Frontend checkout**: `src/app/user/(pages)/book/payment/page.tsx`.
- **SDK loader**: `src/app/layout.tsx`.
- **Express equivalent**: use the same `cashfree-pg` pattern in Express route handlers.
