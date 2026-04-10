from django.db import models

# Create your models here.

# Itt behivjuk az autentikátoros júúzeres modellt, hogy a "kedvenceket" tudjuk vele kezelni.
from django.contrib.auth.models import User








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

    #A dekorációkhoz tartozó képek és leírások tárolására szolgáló mezőket kicsit késve, de meghozzuk a modelbe ->
    description = models.TextField(null = True, blank = True)
    image_url = models.ImageField(upload_to='decors', null = True, blank = True)

    def __str__(self):
        return self.name
    





#Itt pedig létrehozzuk a modellt, amely a kedvenceket fogja tárolni. Ez egy "many to many" kapcsolat lesz, mivel egy dekoráció több felhasználó kedvence is lehet, és egy felhasználónak több kedvence is lehet.
class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    decor = models.ForeignKey('Decor', on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'decor')

    def __str__(self):
        return f"{self.user.username} -> {self.decor.id}"
