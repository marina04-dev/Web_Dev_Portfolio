# Currency Calculator Application

This application implements a currency calculator with a REST API and a React-based Graphical User Interface. It allows users to convert currencies and manage currency exchange rates.

## Project Structure

The project is divided into two main folders:

-   `backend`: Contains the Node.js/Express API.
-   `frontend`: Contains the React user interface.

## Backend (Node.js/Express)

The backend API is built using Node.js and the Express framework. It provides the following functionalities:

-   **User Authentication:** Simple username/password-based authentication for accessing protected endpoints.
    -   `/api/users/signup`: Endpoint for user registration.
    -   `/api/users/login`: Endpoint for user login, returns a JWT token.
-   **Currency Management (Protected - Requires Authentication):**
    -   `GET /api/currencies`: Retrieves all currencies for the authenticated user.
    -   `GET /api/currencies/:code`: Retrieves a specific currency by its code for the authenticated user.
    -   `POST /api/currencies`: Creates a new currency for the authenticated user.
    -   `PUT /api/currencies/:code`: Updates an existing currency for the authenticated user.
    -   `DELETE /api/currencies/:code`: Deletes a currency for the authenticated user.
-   **Currency Conversion (Protected - Requires Authentication):**
    -   `GET /api/currencies/convert/:from/:to/:amount`: Converts an amount from one currency to another.

### Technologies Used (Backend)

-   Node.js
-   Express
-   MySQL2 (for database interaction)
-   jsonwebtoken (for JWT-based authentication)
-   bcrypt (for password hashing)
-   cors (for enabling Cross-Origin Resource Sharing)
-   dotenv (for managing environment variables)

### Setup Instructions (Backend)

1.  Navigate to the `backend` folder: `cd backend`
2.  Install dependencies: `npm install`
3.  Create a `.env` file in the `backend` folder based on the `.env.example` provided below.
4.  Set up your MySQL database with the credentials specified in the `.env` file. Ensure you have a `users` table and a `currencies` table. (SQL schema not provided, you'll need to create these based on the application's needs).
5.  Run the backend server: `npm start`

## Frontend (React)

The frontend GUI is built using React and the React Bootstrap library. It provides the following functionalities:

-   **User Authentication:** Forms for user signup and login, interacting with the backend API.
-   **Currency Conversion:** Allows users to select "from" and "to" currencies, enter an amount, and view the converted result fetched from the API.
-   **Currency Management (Protected - Requires Login):** Provides a form and a table to add, edit, and delete currency exchange rates. This section is only accessible after successful login.

### Technologies Used (Frontend)

-   React
-   React Router DOM (for routing)
-   Axios (for making HTTP requests to the API)
-   React Bootstrap (for UI components)
-   Bootstrap (CSS framework)

### Setup Instructions (Frontend)

1.  Navigate to the `frontend` folder: `cd frontend`
2.  Install dependencies: `npm install`
3.  Run the frontend development server: `npm start`
    -   This will usually start the application at `http://localhost:3000`.

## API Base URL

The frontend application is configured to communicate with the backend API at `http://localhost:5000/api`. Ensure that the backend server is running at this address (or update the `API_BASE_URL` in the frontend components if necessary).

## Authentication

-   Users need to sign up through the `/signup` page.
-   Existing users can log in through the `/login` page. Upon successful login, a JWT token is stored in the browser's local storage.
-   This token is automatically included in the `Authorization` header (as a Bearer token) for requests to protected API endpoints.

## Example Currencies and Exchange Ratios

(As provided in the Task Description)

-   Euro -> US Dollar (1.3764)
-   Euro -> Swiss Franc (1.2079)
-   Euro -> British Pound (0.8731)
-   US Dollar -> JPY (76.7200)
-   Swiss Franc -> US Dollar (1.1379)
-   British Pound -> CAD (1.5648)

These example rates can be added through the Currency Form in the frontend after logging in.

## Running the Application

1.  Start the backend server (follow instructions in the "Backend" section).
2.  Start the frontend development server (follow instructions in the "Frontend" section).
3.  Open your browser and navigate to `http://localhost:3000` to access the Currency Calculator GUI.

## Delivery Notes

-   The application implements user authentication to protect currency management and conversion functionalities.
-   CRUD operations for currencies are implemented through the API and accessible via the "Currency Form" in the frontend after login.
-   Currency conversion is implemented through the API and accessible via the "Currency Converter" in the frontend after login.
-   The database schema for `users` and `currencies` tables is not included and needs to be set up separately in the MySQL database.

---

**2. .env.example (for the backend)**

Create a `.env` file in your `backend` directory and populate it with your database and secret key details.


DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=your_database_name
DB_PORT=3306
SECRET_KEY=your_jwt_secret_key