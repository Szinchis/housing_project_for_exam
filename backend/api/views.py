from django.shortcuts import render

# Create your views here.


# Itt ügye ráhivjuk a világmindenséget. A REST részéből kell a vjúvszet, majd kell a .models-ből az összes és ugyan igy az ez előtt megirt .serializers összes része is.
from rest_framework import viewsets
from .models import Category, Decor, SubCategory, Culture, Style, Size, Expansion
from .serializers import CategorySerializer, DecorSerializer, SubCategorySerializer, CultureSerializer, StyleSerializer, SizeSerializer, ExpansionSerializer


# Majd a konkrét Viewset-ek:
class CategoryViewSets(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class DecorViewSets(viewsets.ModelViewSet):
    queryset = Decor.objects.all()
    serializer_class = DecorSerializer

class SubCategoryViewSets(viewsets.ModelViewSet):
    queryset = SubCategory.objects.all()
    serializer_class = SubCategorySerializer

class CultureViewSets(viewsets.ModelViewSet):
    queryset = Culture.objects.all()
    serializer_class = CultureSerializer

class StyleViewSets(viewsets.ModelViewSet):
    queryset = Style.objects.all()
    serializer_class = StyleSerializer

class SizeViewSets(viewsets.ModelViewSet):
    queryset = Size.objects.all()
    serializer_class = SizeSerializer

class ExpansionViewSets(viewsets.ModelViewSet):
    queryset = Expansion.objects.all()
    serializer_class = ExpansionSerializer


# Persze ide is vonatkozik -> Ha bővül a model táblázat, akkor mindegyikhez külön serializers és külön viewset is kell!!!



# A Frontend képzése előtt létrehozott DJango-Filter-hez hozzá kell adni a szűrőket, ami alapján majd szűrni akarjuk a táblázatunkat, itt igazából csak az adott model szerint kell végig túrni az összes tipust.
from django_filters.rest_framework import DjangoFilterBackend

class DecorViewSets(viewsets.ModelViewSet):
    queryset = Decor.objects.all()
    serializer_class = DecorSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = [
        'category',
        'subcategory',
        'culture',
        'style',
        'size',
        'expansion'
    ]

    def list(self, request, *args, **kwargs):
        print("FILTER FUT")
        return super().list(request, *args, **kwargs)



