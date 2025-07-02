import React, { useState } from 'react';
import { Form, Button, Card, Spinner, Alert } from 'react-bootstrap';

const AddBook = ({ onAddBook, addingBook }) => {
  const [bookName, setBookName] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [validationError, setValidationError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bookName || !author || !description) {
      setValidationError('All Fields Are Required!');
      return;
    }

    setValidationError(null); // Clear previous validation errors

    try {
      await onAddBook({ book_name: bookName, author, description });
      setBookName('');
      setAuthor('');
      setDescription('');
    } catch (err) {
      // Error handling is primarily in App.js for API call errors
      console.error("Error Submitting Book:", err);
    }
  };

  return (
    <Card className="p-4 shadow-lg border-0 bg-secondary text-white mx-auto" style={{ maxWidth: '600px' }}>
      <Card.Body>
        <Card.Title className="text-center text-primary mb-4 fs-3 fw-bold">Add New Recipe</Card.Title>
        <Form onSubmit={handleSubmit}>
          {validationError && (
            <Alert variant="danger" className="mb-3">
              {validationError}
            </Alert>
          )}

          <Form.Group className="mb-3" controlId="formRecipeName">
            <Form.Label className="text-info">Book's Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter book's name"
              value={bookName}
              onChange={(e) => setBookName(e.target.value)}
              required
              className="bg-dark text-white border-info"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formIngredients">
            <Form.Label className="text-info">Author</Form.Label>
            <Form.Control
              type='text'
              placeholder="Enter book's author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              className="bg-dark text-white border-info"
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="formDescription">
            <Form.Label className="text-info">Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={7}
              placeholder="Enter book's description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="bg-dark text-white border-info"
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100 fw-bold" disabled={addingBook}>
            {addingBook ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Adding Book...
              </>
            ) : (
              'Add Book'
            )}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AddBook;