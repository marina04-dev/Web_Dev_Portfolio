import React, { useState } from 'react';
import { Form, Button, Card, Spinner, Alert } from 'react-bootstrap';

const AddRecipe = ({ onAddRecipe, addingRecipe }) => {
  const [recipeName, setRecipeName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [validationError, setValidationError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!recipeName || !ingredients || !instructions) {
      setValidationError('All fields are required!');
      return;
    }

    setValidationError(null); // Clear previous validation errors

    try {
      await onAddRecipe({ recipe_name: recipeName, ingredients, instructions });
      setRecipeName('');
      setIngredients('');
      setInstructions('');
    } catch (err) {
      // Error handling is primarily in App.js for API call errors
      console.error("Error submitting recipe:", err);
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
            <Form.Label className="text-info">Recipe Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter recipe name"
              value={recipeName}
              onChange={(e) => setRecipeName(e.target.value)}
              required
              className="bg-dark text-white border-info"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formIngredients">
            <Form.Label className="text-info">Ingredients (one per line)</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              placeholder="Enter ingredients, e.g.:
200g spaghetti
100g pancetta
2 large eggs"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              required
              className="bg-dark text-white border-info"
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="formInstructions">
            <Form.Label className="text-info">Instructions</Form.Label>
            <Form.Control
              as="textarea"
              rows={7}
              placeholder="Enter cooking instructions, e.g.:
1. Cook spaghetti.
2. Pan-fry pancetta."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              required
              className="bg-dark text-white border-info"
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100 fw-bold" disabled={addingRecipe}>
            {addingRecipe ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Adding Recipe...
              </>
            ) : (
              'Add Recipe'
            )}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AddRecipe;
