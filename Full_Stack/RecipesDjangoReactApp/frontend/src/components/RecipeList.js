import React from 'react';
import { Card, Button, ListGroup, Spinner, Alert } from 'react-bootstrap';

const RecipeList = ({ recipes, onDeleteRecipe, loading, error }) => {
  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status" className="mb-3">
          <span className="visually-hidden">Loading recipes...</span>
        </Spinner>
        <p className="text-white">Loading recipes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="mx-auto my-4 max-w-xl">
        <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
        <p>{error.message}</p>
        <hr />
        <p className="mb-0">Please ensure your Django backend is running on http://localhost:8000.</p>
      </Alert>
    );
  }

  if (!recipes || recipes.length === 0) {
    return (
      <Alert variant="info" className="text-center mx-auto my-4 max-w-xl">
        <Alert.Heading>No Recipes Found!</Alert.Heading>
        <p>Start by adding a new recipe using the "Add New Recipe" button.</p>
      </Alert>
    );
  }

  return (
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      {recipes.map((recipe) => (
        <div className="col" key={recipe.id}>
          <Card className="h-100 shadow-lg border-0 bg-secondary text-white">
            <Card.Body className="d-flex flex-column">
              <Card.Title className="text-primary fs-3 fw-bold mb-3">{recipe.recipe_name}</Card.Title>
              <Card.Text>
                <strong className="text-info">Ingredients:</strong>
                <ListGroup variant="flush" className="bg-secondary mb-3">
                  {recipe.ingredients.split('\n').map((item, index) => (
                    item.trim() && <ListGroup.Item key={index} className="bg-secondary text-white border-bottom border-secondary py-1 px-0">{item.trim()}</ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Text>
              <Card.Text className="flex-grow-1">
                <strong className="text-info">Instructions:</strong>
                <p className="text-light-emphasis">{recipe.instructions}</p>
              </Card.Text>
              <Button
                variant="danger"
                onClick={() => onDeleteRecipe(recipe.id)}
                className="mt-auto"
              >
                Delete Recipe
              </Button>
            </Card.Body>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default RecipeList;
