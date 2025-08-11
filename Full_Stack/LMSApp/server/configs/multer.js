import multer from "multer";

// multer configuration
const storage = multer.diskStorage({});

const upload = multer({ storage });

export default upload;
