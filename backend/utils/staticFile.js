// Import necessary libraries

import express from "express";

// Sets up static files to be served by the Express application.

export const setupStaticFiles = (app) => {
  app.use(express.static("../public"));
};