from django.shortcuts import render
from rest_framework import generics
from .models import Recipe
from .serializers import RecipeSerializer

# Create your views here.
class RecipeListCreateAPIView(generics.ListCreateAPIView):
    # API view to list all recipes or create a new recipe
    # - GET /api/recipes/ (lists all recipes)
    # - POST /api/recipes/ (creates a new recipe)
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer


class RecipeRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    # API view to retrieve, update, or delete a specific recipe
    # - GET /api/recipes/{id}/ (retrieves a recipe by ID)
    # - PUT /api/recipes/{id}/ (updates a recipe by ID)
    # - PATCH /api/recipes/{id}/ (partially updates a recipe by ID)
    # - DELETE /api/recipes/{id}/ (deletes a recipe by ID)
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    lookup_field = 'pk' # the URL keyword argument that should be used for looking up the object.