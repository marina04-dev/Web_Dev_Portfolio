from django.db import models

# Create your models here.
class Recipe(models.Model):
    recipe_name = models.CharField(max_length=255)
    ingredients = models.TextField() # ingredients listed line by line 
    instructions = models.TextField()

    def __str__(self):
        return self.recipe_name