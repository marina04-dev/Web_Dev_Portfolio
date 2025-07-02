from django.shortcuts import render
from rest_framework import generics
from .models import Book
from .serializers import BookSerializer

# Create your views here.
class BookListCreateAPIView(generics.ListCreateAPIView):
    """
    API view to list all recipes or create a new recipe.
    - GET /api/books/  (lists all books)
    - POST /api/books/ (creates a new book)
    """
    queryset = Book.objects.all()
    serializer_class = BookSerializer


class BookRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    API view to retrieve, update, or delete a specific book.
    - GET /api/books/{id}/    (retrieves a book by ID)
    - PUT /api/books/{id}/    (updates a book by ID)
    - PATCH /api/books/{id}/  (partially updates a book by ID)
    - DELETE /api/books/{id}/ (deletes a book by ID)
    """
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    lookup_field = 'pk' # The URL keyword argument that should be used for looking up the object.
