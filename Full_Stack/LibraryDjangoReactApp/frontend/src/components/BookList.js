import React from 'react';
import { Card, Button, ListGroup, Spinner, Alert } from 'react-bootstrap';

const BookList = ({ books, onDeleteBook, loading, error }) => {
  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status" className="mb-3">
          <span className="visually-hidden">Loading Books...</span>
        </Spinner>
        <p className="text-white">Loading Books...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="mx-auto my-4 max-w-xl">
        <Alert.Heading>Oh Snap! You Got An Error!</Alert.Heading>
        <p>{error.message}</p>
        <hr />
        <p className="mb-0">Please Ensure Your Django Backend Is Running On http://localhost:8000.</p>
      </Alert>
    );
  }

  if (!books || books.length === 0) {
    return (
      <Alert variant="info" className="text-center mx-auto my-4 max-w-xl">
        <Alert.Heading>No Books Found!</Alert.Heading>
        <p>Start By Adding A New Book Using The "Add New Book" Button.</p>
      </Alert>
    );
  }

  return (
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      {books.map((book) => (
        <div className="col" key={book.id}>
          <Card className="h-100 shadow-lg border-0 bg-secondary text-white">
            <Card.Body className="d-flex flex-column">
              <Card.Title className="text-primary fs-3 fw-bold mb-3">{book.book_name}</Card.Title>
              <Card.Text>
                <strong className="text-info">Author:</strong>
                <Card.Subtitle className="text-secondary fs-3 fw-bold mb-3">{book.author}</Card.Subtitle>
              </Card.Text>
              <Card.Text className="flex-grow-1">
                <strong className="text-info">Description:</strong>
                <p className="text-light-emphasis">{book.description}</p>
              </Card.Text>
              <Button
                variant="danger"
                onClick={() => onDeleteBook(book.id)}
                className="mt-auto"
              >
                Delete Book
              </Button>
            </Card.Body>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default BookList;
