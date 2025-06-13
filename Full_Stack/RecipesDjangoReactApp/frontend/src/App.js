import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import RecipeList from './components/RecipeList';
import AddRecipe from './components/AddRecipe';
import { Container, Navbar, Nav, Alert, Button } from 'react-bootstrap'; // Import Bootstrap components

// Define your API base URL
const API_BASE_URL = 'http://localhost:8000/api/recipes/';

function App() {
  const [recipes, setRecipes] = useState([]); // State to store recipes
  const [loading, setLoading] = useState(true); // Loading state for fetching recipes
  const [error, setError] = useState(null); // Error state for API calls
  const [addingRecipe, setAddingRecipe] = useState(false); // Loading state for adding a recipe
  const [currentView, setCurrentView] = useState('list'); // 'list' or 'add'

  // Function to fetch all recipes from the backend
  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const response = await axios.get(API_BASE_URL);
      // Sort recipes by ID for consistent display
      const sortedRecipes = response.data.sort((a, b) => a.id - b.id);
      setRecipes(sortedRecipes);
    } catch (err) {
      console.error("Error fetching recipes:", err);
      if (err.response) {
        setError(new Error(`Failed to load recipes: ${err.response.status} - ${err.response.statusText}.`));
      } else if (err.request) {
        setError(new Error('Failed to connect to the backend. Is the Django server running?'));
      } else {
        setError(new Error('An unexpected error occurred while fetching recipes.'));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch recipes when the component mounts
  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  // Function to add a new recipe
  const handleAddRecipe = async (newRecipe) => {
    setAddingRecipe(true);
    setError(null); // Clear previous errors
    try {
      const response = await axios.post(API_BASE_URL, newRecipe);
      // Add the newly created recipe to the state and re-sort
      setRecipes((prevRecipes) => {
        const updatedRecipes = [...prevRecipes, response.data];
        return updatedRecipes.sort((a, b) => a.id - b.id);
      });
      setCurrentView('list'); // Go back to the list view after adding
      console.log('Recipe added successfully:', response.data);
    } catch (err) {
      console.error("Error adding recipe:", err);
      if (err.response && err.response.data) {
        // If API returns specific error messages
        const errorMessages = Object.values(err.response.data).flat().join('; ');
        setError(new Error(`Failed to add recipe: ${errorMessages}`));
      } else {
        setError(new Error('Failed to add recipe. Please try again.'));
      }
    } finally {
      setAddingRecipe(false);
    }
  };

  // Function to delete a recipe
  const handleDeleteRecipe = async (id) => {
    setError(null); // Clear previous errors
    // Simple custom confirmation message
    const confirmed = window.confirm("Are you sure you want to delete this recipe?");
    if (!confirmed) {
        return; // User cancelled
    }

    try {
      await axios.delete(`${API_BASE_URL}${id}/`);
      // Filter out the deleted recipe from the state
      setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe.id !== id));
      console.log(`Recipe with ID ${id} deleted successfully.`);
    } catch (err) {
      console.error(`Error deleting recipe with ID ${id}:`, err);
      if (err.response && err.response.status === 404) {
          setError(new Error('Recipe not found. It might have been deleted already.'));
      } else {
          setError(new Error('Failed to delete recipe. Please try again.'));
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
                View Recipes
              </Nav.Link>
              <Nav.Link
                onClick={() => setCurrentView('add')}
                active={currentView === 'add'}
                className="text-success fw-bold"
              >
                Add New Recipe
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
          <RecipeList
            recipes={recipes}
            onDeleteRecipe={handleDeleteRecipe}
            loading={loading}
            error={error} // Pass error to RecipeList to display
          />
        ) : (
          <AddRecipe onAddRecipe={handleAddRecipe} addingRecipe={addingRecipe} />
        )}
      </Container>
    </div>
  );
}

export default App;