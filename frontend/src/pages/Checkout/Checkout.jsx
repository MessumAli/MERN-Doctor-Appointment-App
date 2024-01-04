// Neccessary imports

import React from "react";
import { CheckoutForm } from "../../components/Checkout/CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51ND1JlJ9NW9xyMfcjO9vTR6hCgJnuKbQecquBWjGgbBxDgskkWYSCtZKdZ1cwb7cObLG5suOUTxXKlwWqC7c6vcZ00Z3YSUAzd"
);

export const Checkout = () => {
  return (
    <div>
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
};
