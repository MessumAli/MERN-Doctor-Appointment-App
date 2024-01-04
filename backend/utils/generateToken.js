// Import necessary libraries

import jwt from "jsonwebtoken";

// Generates a JWT token and sets it as an HTTP-only cookie.

const generateToken = (user, res) => {

  // Generate a JWT token containing user information and role.

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "30d",
    }
  );

  // Set the JWT token as an HTTP-only cookie with security options.

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

export { generateToken };
