// Import necessary libraries

import multer from "multer";

// Configure multer to specify how file uploads should be handled

const storage = multer.diskStorage({
  destination: function (req, file, cb) {

    // Set the destination folder where uploaded files will be stored

    return cb(null, "/");
  },
  filename: function (req, file, cb) {

    // Define the file naming convention for uploaded files

    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Create a multer middleware instance with the specified storage configuration and allow uploading of one file with the field name "photo"

const upload = multer({ storage: storage }).array("photo", 1);

export default upload;