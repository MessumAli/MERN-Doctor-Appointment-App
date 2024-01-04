// Import necessary libraries

import bcrypt from "bcryptjs";

// Asynchronously hashes a plain text password using a salt.

const hashPassword = async (password) => {

  // Generate a salt with a cost factor of 10.

  const salt = await bcrypt.genSalt(10);

  // Hash the provided password using the generated salt.

  return await bcrypt.hash(password, salt);
};

// Asynchronously compares a plain text password with a hashed password.

const comparePassword = async (password, hashed) => {

  // Compare the provided plain text password with the hashed password.

  return await bcrypt.compare(password, hashed);
};

export { hashPassword, comparePassword };
