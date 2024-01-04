// Import necessary libraries

import sgMail from "@sendgrid/mail";

const getEmail = async (subject, text, html) => {

  // Set the SendGrid API key from the environment variable.

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  // Define the email message with recipient, sender, subject, text, and HTML content.

  const msg = {
    to: "messum.ali.72@gmail.com",
    from:  "messum.ali.72@gmail.com",
    subject,
    text,
    html,
  };

  // Send the email message using the SendGrid API.

  await sgMail.send(msg);
};

export { getEmail };
