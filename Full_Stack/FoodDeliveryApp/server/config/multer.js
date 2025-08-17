import multer from "multer";

// image storage engine configuration
const storage = multer.diskStorage({
  destination: "uploads", // images folder destination
  // function to rename the file with the date created/saved (unique) & the original filename
  filename: (req, file, callback) => {
    return callback(null, `${Date.now()}${file.originalname}`);
  },
});

// upload middleware creation
const upload = multer({ storage: storage });

export default upload;
