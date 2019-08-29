// Build your sqPaymentForm here
// Set the application ID
const applicationId = "XX";

// onGetCardNonce is triggered when the "Pay $1.00" button is clicked
function onGetCardNonce(event) {
  // Don't submit the form until SqPaymentForm returns with a nonce
  event.preventDefault();
  // Request a nonce from the SqPaymentForm object
  paymentForm.requestCardNonce();
}

function submitPaymentRequest(event) {
  let nonce = document.getElementById("card-nonce").value;

  fetch("process-payment", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nonce: nonce,
      amount: document.querySelector('input[name="amount"]').value
    })
  })
    .then(response => {
      console.log(response);
      response.json().then(data => {
        console.log(data);
        alert(JSON.stringify(data));
      });
    })
    .catch(function(error) {
      console.log("the error was", error);
    });
}

// Create and initialize a payment form object
const paymentForm = new SqPaymentForm({
  // Initialize the payment form elements
  applicationId: applicationId,
  inputClass: "sq-input",

  // Customize the CSS for SqPaymentForm iframe elements
  inputStyles: [
    {
      fontSize: "16px",
      lineHeight: "24px",
      padding: "16px",
      placeholderColor: "#a0a0a0",
      backgroundColor: "transparent"
    }
  ],

  // Initialize the credit card placeholders
  cardNumber: {
    elementId: "sq-card-number",
    placeholder: "Card Number"
  },
  cvv: {
    elementId: "sq-cvv",
    placeholder: "CVV"
  },
  expirationDate: {
    elementId: "sq-expiration-date",
    placeholder: "MM/YY"
  },
  postalCode: {
    elementId: "sq-postal-code",
    placeholder: "Postal"
  },
  amount: {
      elementId: "sq-amount",
      placeholder: "Amount"
  },

  // SqPaymentForm callback functions
  callbacks: {
    /*
     * callback function: cardNonceResponseReceived
     * Triggered when: SqPaymentForm completes a card nonce request
     */
    cardNonceResponseReceived: function(errors, nonce, cardData) {
      if (errors) {
        // Log errors from nonce generation to the browser developer console.
        console.error("Encountered errors:");
        errors.forEach(function(error) {
          console.error("  " + error.message);
        });
        alert(
          "Encountered errors, check browser developer console for more details"
        );
        return;
      }

      // alert(`The generated nonce is:\n${nonce}`);
      // Uncomment the following block to
      // 1. assign the nonce to a form field and
      // 2. post the form to the payment processing handler
      document.getElementById("card-nonce").value = nonce;
      submitPaymentRequest(null);
    }
  }
});
