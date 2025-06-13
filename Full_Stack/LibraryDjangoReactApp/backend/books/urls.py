from django.urls import path
from .views import BookListCreateAPIView, BookRetrieveUpdateDestroyAPIView

urlpatterns = [
    # Endpoint for listing all books and creating a new one
    path('books/', BookListCreateAPIView.as_view(), name='book-list-create'),
    # Endpoint for retrieving, updating, or deleting a specific book by ID
    path('books/<int:pk>/', BookRetrieveUpdateDestroyAPIView.as_view(), name='book-detail'),
]