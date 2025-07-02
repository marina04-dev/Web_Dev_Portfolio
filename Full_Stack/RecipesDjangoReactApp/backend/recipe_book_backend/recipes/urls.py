from django.urls import path
from .views import RecipeListCreateAPIView, RecipeRetrieveUpdateDestroyAPIView

urlpatterns = [
    # Endpoint for listing all recipes and creating a new one
    path('recipes/', RecipeListCreateAPIView.as_view(), name='recipe-list-create'),
    # Endpoint for retrieving, updating, or deleting a specific recipe by ID
    path('recipes/<int:pk>/', RecipeRetrieveUpdateDestroyAPIView.as_view(), name='recipe-detail'),
]

