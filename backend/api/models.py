from django.db import models

# Create your models here.


from django.db import models

class Category(models.Model):
    name = models.CharField(max_length = 100)
    def __str__(self):
        return self.name
    
class SubCategory(models.Model):
    name = models.CharField(max_length = 100)
    def __str__(self):
        return self.name

class Culture(models.Model):
    name = models.CharField(max_length = 100)
    def __str__(self):
        return self.name

class Style(models.Model):
    name = models.CharField(max_length = 100)
    def __str__(self):
        return self.name

class Size(models.Model):
    name = models.CharField(max_length = 100)
    def __str__(self):
        return self.name

class Expansion(models.Model):
    name = models.CharField(max_length = 100)
    def __str__(self):
        return self.name

    




class Decor(models.Model):
    name = models.CharField(max_length = 200)
    rarity = models.CharField(max_length = 50)
    patch = models.CharField(max_length = 20)

    category = models.ForeignKey(Category, on_delete = models.CASCADE)
    subcategory = models.ForeignKey(SubCategory, on_delete = models.CASCADE, null = True, blank = True)

    culture = models.ForeignKey(Culture, on_delete = models.SET_NULL, null = True, blank = True)
    style = models.ForeignKey(Style, on_delete = models.SET_NULL, null = True, blank = True)
    size = models.ForeignKey(Size, on_delete = models.SET_NULL, null = True, blank = True)
    expansion = models.ForeignKey(Expansion, on_delete = models.SET_NULL, null = True, blank = True)

    def __str__(self):
        return self.name