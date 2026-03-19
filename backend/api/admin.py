from django.contrib import admin

# Register your models here.

from .models import Category, Decor, SubCategory, Culture, Style, Size, Expansion

admin.site.register(Category)
admin.site.register(SubCategory)
admin.site.register(Culture)
admin.site.register(Style)
admin.site.register(Size)
admin.site.register(Expansion)

admin.site.register(Decor)