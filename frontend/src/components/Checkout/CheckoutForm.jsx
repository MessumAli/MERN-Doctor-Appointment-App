// Neccessary imports

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import "./CheckoutForm.css";

export const CheckoutForm = ({ doctor }) => {

  // Import necessary hooks and functions from react-stripe-js and react-router-dom

  const location = useLocation();
  const [clientSecret, setClientSecret] = useState("");
  const [intentId, setIntentId] = useState("");
  const [appointment, setAppointment] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  // Use the useEffect hook to fetch the client secret and appointment details

  useEffect(() => {
    const fetchClientSecret = async () => {
      const { clientSecret, appointment } = location.state;

      // Check if the client secret is available; if not, set an error message

      if (!clientSecret) {
        setErrorMessage("Could not fetch client secret.");
        return;
      }

      // Set the client secret and appointment data

      setClientSecret(clientSecret);
      setAppointment(appointment);
    };

    // Call the fetchClientSecret function when the location state changes

    fetchClientSecret();
  }, [location.state]);

  // Define a function to handle form submission and payment processing

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if Stripe and Elements are available

    if (!stripe || !elements) {
      return;
    }

    // Set payment processing state to true

    setPaymentProcessing(true);

    // Get the card element for payment

    const cardElement = elements.getElement(CardElement);

    // Confirm the card payment with the client secret and card element

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    // Handle payment confirmation result

    if (result.error) {
      setErrorMessage(result.error.message);
      setPaymentProcessing(false);
    } else {
      if (result?.paymentIntent) {

        // Handle payment success and navigate to the thank-you page

        handlePaymentSuccess(result?.paymentIntent?.id);
      }
    }
  };

  // Define a function to handle payment success and navigate to the thank-you page

  const handlePaymentSuccess = (paymentIntentId) => {
    setPaymentProcessing(false);
    setPaymentSuccess(true);

    // Delay the navigation to the thank-you page and pass payment and appointment data

    setTimeout(() => {
      navigate("/thank-you", {
        state: {
          message: "Payment successful! Thank you for your purchase.",
          appointment: appointment,
          paymentIntentId,
        },
      });
    }, 2000);
  };

  return (
    <div className="checkout-form mt-36 mb-36 pt-8 pb-8 px-4  border border-blue-200 rounded-lg shadow-lg max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-3">Checkout</h1>
      <h3 className="text-lg mb-3">Total: PKR{appointment.price}</h3>
      <form onSubmit={handleSubmit} className="my-3">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mt-5">
            Card Information
          </label>
          <div className="mt-8">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#32325d",
                    "::placeholder": {
                      color: "#aab7c4",
                    },
                  },
                  invalid: {
                    color: "#dc3545",
                  },
                },
              }}
            />
          </div>
        </div>
        <button
          className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md disabled:opacity-50"
          disabled={!stripe || paymentProcessing}
        >
          {paymentProcessing ? "Processing..." : "Pay"}
        </button>
      </form>
      {errorMessage && <div className="text-red-500 mt-3">{errorMessage}</div>}
      {paymentSuccess && (
        <div className="text-green-500 mt-3">
          Payment successful! Redirecting...
        </div>
      )}
    </div>
  );
};
