import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import BookList from './components/BookList';
import AddBook from './components/AddBook';
import { Container, Navbar, Nav, Alert, Button } from 'react-bootstrap'; // Import Bootstrap components

// Define your API base URL
const API_BASE_URL = 'http://localhost:8000/api/books/';

function App() {
  const [books, setBooks] = useState([]); // State to store books
  const [loading, setLoading] = useState(true); // Loading state for fetching books
  const [error, setError] = useState(null); // Error state for API calls
  const [addingBook, setAddingBook] = useState(false); // Loading state for adding a book
  const [currentView, setCurrentView] = useState('list'); // 'list' or 'add'

  // Function to fetch all recipes from the backend
  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const response = await axios.get(API_BASE_URL);
      // Sort recipes by ID for consistent display
      const sortedBooks = response.data.sort((a, b) => a.id - b.id);
      setBooks(sortedBooks);
    } catch (err) {
      console.error("Error Fetching Books:", err);
      if (err.response) {
        setError(new Error(`Failed To Load Books: ${err.response.status} - ${err.response.statusText}.`));
      } else if (err.request) {
        setError(new Error('Failed To Connect To The Backend. Is The Django Server Running?'));
      } else {
        setError(new Error('An Unexpected Error Occurred While Fetching Books.'));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch books when the component mounts
  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // Function to add a new book
  const handleAddBook = async (newBook) => {
    setAddingBook(true);
    setError(null); // Clear previous errors
    try {
      const response = await axios.post(API_BASE_URL, newBook);
      // Add the newly created book to the state and re-sort
      setBooks((prevBooks) => {
        const updatedBooks = [...prevBooks, response.data];
        return updatedBooks.sort((a, b) => a.id - b.id);
      });
      setCurrentView('list'); // Go back to the list view after adding
      console.log('Book Added Successfully:', response.data);
    } catch (err) {
      console.error("Error Adding Book:", err);
      if (err.response && err.response.data) {
        // If API returns specific error messages
        const errorMessages = Object.values(err.response.data).flat().join('; ');
        setError(new Error(`Failed To Add Book: ${errorMessages}`));
      } else {
        setError(new Error('Failed To Add Book. Please Try Again.'));
      }
    } finally {
      setAddingBook(false);
    }
  };

  // Function to delete a book
  const handleDeleteBook = async (id) => {
    setError(null); // Clear previous errors
    // Simple custom confirmation message
    const confirmed = window.confirm("Are You Sure You Want To Delete This Recipe?");
    if (!confirmed) {
        return; // User cancelled
    }

    try {
      await axios.delete(`${API_BASE_URL}${id}/`);
      // Filter out the deleted book from the state
      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
      console.log(`Book With ID ${id} Deleted Successfully.`);
    } catch (err) {
      console.error(`Error Deleting Book With ID ${id}:`, err);
      if (err.response && err.response.status === 404) {
          setError(new Error('Book Not Found. It Might Have Been Deleted Already.'));
      } else {
          setError(new Error('Failed To Delete Recipe. Please Try Again.'));
      }
    }
  };

  return (
    <div className="bg-dark text-white min-vh-100"> {/* Apply dark background from theme */}
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4 shadow">
        <Container>
          <Navbar.Brand href="#home" className="text-primary fw-bold fs-4">Recipe Book</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link
                onClick={() => setCurrentView('list')}
                active={currentView === 'list'}
                className="text-info fw-bold me-3"
              >
                View Books
              </Nav.Link>
              <Nav.Link
                onClick={() => setCurrentView('add')}
                active={currentView === 'add'}
                className="text-success fw-bold"
              >
                Add New Book
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="py-4">
        <h1 className="text-center mb-5 text-primary display-4 fw-bold">
          {currentView === 'list' ? 'Your Recipe Collection' : 'Add a New Culinary Creation'}
        </h1>

        {/* Global error message display, unless handled specifically by a component */}
        {error && (
            <Alert variant="danger" className="text-center mx-auto mb-4" style={{ maxWidth: '700px' }}>
                <Alert.Heading>Error!</Alert.Heading>
                <p>{error.message}</p>
                <Button variant="danger" onClick={() => setError(null)} className="mt-2">Dismiss</Button>
            </Alert>
        )}

        {currentView === 'list' ? (
          <BookList
            books={books}
            onDeleteBook={handleDeleteBook}
            loading={loading}
            error={error} // Pass error to BookList to display
          />
        ) : (
          <AddBook onAddBook={handleAddBook} addingBook={addingBook} />
        )}
      </Container>
    </div>
  );
}

export default App;