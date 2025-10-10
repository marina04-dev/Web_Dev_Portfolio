// Importing the Express application from app.js
import app from "./app.js";

// Extracting PORT from environment variables, defaulting to 5000 if not set
const PORT = process.env.PORT || 5000;

// Starting the server and listening on the specified PORT
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
