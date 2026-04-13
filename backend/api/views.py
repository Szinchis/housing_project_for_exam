from django.db import IntegrityError
from django.shortcuts import render

#Ez kell a test_decorhoz.
from django.http import JsonResponse


# Create your views here.


#Itt ügye ráhivjuk a világmindenséget. A REST részéből kell a vjúvszet, majd kell a .models-ből az összes és ugyan igy az ez előtt megirt .serializers összes része is.
from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Category, Decor, SubCategory, Culture, Style, Size, Expansion
from .serializers import CategorySerializer, DecorSerializer, SubCategorySerializer, CultureSerializer, StyleSerializer, SizeSerializer, ExpansionSerializer, FavoriteSerializer


from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from rest_framework import status, filters
#Ez a rész azért kell, hogy a regisztráció után létrehozzuk a token-t, amit majd a frontend használni fog a hitelesítéshez, és hogy visszaadjuk a token-t a regisztrációs válaszban.



#Majd létrehozzuk az /api/me/ végpontot, ahol a frontend lekérdezheti a saját adatait, és itt majd visszaadjuk a token-hez tartozó user adatokat, hogy a frontend tudja, hogy ki van bejelentkezve.
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes



#Majd pedig a backendfiltert is megimportálgatjuk ->
from django_filters.rest_framework import DjangoFilterBackend




# Ügye a Favorite modellekhez is kell vjúvszet, hogy a frontend tudja kezelni a kedvenceket, szóval létrehozzuk a FavoriteViewSet-et is, ami a Favorite modellel fog dolgozni, és a FavoriteSerializer-t fogja használni. Itt már persze a serializer importjából bekértük a FavoriteSerializer-t, hogy tudjuk használni a FavoriteViewSet-ben, de ezt a meglévőbe irtam, nem külön sorban hivtam meg (fentebb az alap .serializers import-nál.). - Meg persze a rest_framework permissions részt is beimportáljuk a meglévő viewsets mellé.
from .models import Favorite
from .serializers import FavoriteSerializer





# És ha még ennyi import sem elég, akkor kell egy MultiPartParser is, hogy biztositva legyen a multipart/form-data kérések kezelése.
from rest_framework.parsers import MultiPartParser, FormParser







# Majd a konkrét Viewset-ek:
class CategoryViewSets(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

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

    # És akkor peregjen a MultiPartParser ->
    parser_classes = [MultiPartParser, FormParser]

    # Szűrés + keresés
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]

    filterset_fields = [
        'category',
        'subcategory',
        'culture',
        'style',
        'size',
        'expansion'
    ]

    # Keresés név szerint (feltételezve, hogy ezeknek van name mezője)
    search_fields = [
        'name',
        'rarity',
        'culture__name',
        'style__name',
        'category__name',
        'subcategory__name',
        'expansion__name',
        'size__name',
    ]

    def list(self, request, *args, **kwargs):
        print("FILTER FUT")
        return super().list(request, *args, **kwargs)











#Csinálunk egy "teszt" decort, hogy lássuk, hogy működik-e a filterezés, és hogy a VITE is látja-e a backend API-ját, mert ha nem engedélyezzük a CORS-t, akkor a VITE rinyálni fog, hogy nem éri el a backend API-ját, és így nem fog működni a filterezés sem.
def test_decor(request):
    return JsonResponse({
        "id": 1,
        "name": "Test Decor",
        "category": "Test Category",
        "subcategory": "Test SubCategory",
        "culture": "Test Culture",
        "style": "Test Style",
        "size": "Test Size",
        "expansion": "Test Expansion"
    })












#Nah és ide ficcentjük a regisztrációs view-t, ami létrehozza a felhasználót és a token-t is, majd visszaadja a token-t a válaszban.
#Logikusan ez a REGISZTRÁCIÓS VIEW, szóval POST metódusra fog reagálni, és a request body-ban várja majd a username-t és a password-ot, amivel létrehozza a felhasználót, majd létrehozza a token-t is, és visszaadja a token-t a válaszban.
@api_view(['POST'])
def register_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if User.objects.filter(username=username).exists():
        return Response({'error': 'A felhasználónév már foglalt!'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, password=password)
    token = Token.objects.create(user=user)

    return Response({'token': token.key}, status=status.HTTP_201_CREATED)

# És itt van a login view is, ami szintén POST metódusra fog reagálni, és a request body-ban várja majd a username-t és a password-ot, amivel ellenőrzi a felhasználó létezését és a jelszó helyességét, majd ha minden rendben van, akkor visszaadja a token-t a válaszban.
@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = User.objects.filter(username=username).first()

    if user is None or not user.check_password(password):
        return Response({'detail': 'Hibás belépési adatok'}, status=status.HTTP_400_BAD_REQUEST)

    token, created = Token.objects.get_or_create(user=user)

    return Response({'token': token.key})









#És ügye meg is csináljuk az /api/me/ végpontot, ahol a frontend lekérdezgethet ->
@api_view(['GET'])
@permission_classes([IsAuthenticated])

def me_view(request):
    user = request.user
    return Response({
        "id": user.id,
        "username": user.username
        #Itt ügye irkálhatnánk még akármit, de ez még is csak egy vizsgaremek, nem kezelünk emailt, meg semmit, szóval jóóvane' alapon lesz ez igy.
    })













# Itt ügye pedig létrehozzuk maga a FavoriteViewSet-eket, amiben felhasználóra bontva létrehozza, vagy törli a kedvenceket, és visszaadja a kedvenceket a válaszban, hogy a frontend tudja kezelni a kedvenceket. Itt is persze a szűrőket is beállítjuk, hogy csak a saját kedvenceinket lássuk, és hogy csak a saját kedvenceinket tudjuk törölni.
class FavoriteViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError:
            return Response(
                {"detail": "Favorite already exists."},
                status=status.HTTP_400_BAD_REQUEST
            )