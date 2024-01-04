// Generates a one-time password (OTP) and its expiration time.

const generateOTP = () => {

  // Generate a random 6-digit OTP by adding a random number to 100000.

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Calculate the expiration time of the OTP, which is 60 seconds from the current time.

  const expirationTime = new Date(Date.now() + 60 * 1000);

  // Return the OTP and its expiration time as an object.

  return { otp, expirationTime };
};

export { generateOTP };
