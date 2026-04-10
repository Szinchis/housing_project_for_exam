from rest_framework import serializers
from .models import Category, Decor, SubCategory, Culture, Style, Size, Expansion

# Itt ismét, ahogy mindenhol máshol, végig importálunk az importálásának az importálását, jöhetnek a favorit serializerjeink, amik a modellekből készítenek egyfajta "átjáró" objektumot, amivel a frontenddel tudunk kommunikálni.
from .models import Favorite








class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class SubCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SubCategory
        fields = '__all__'

class CultureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Culture
        fields = '__all__'

class StyleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Style
        fields = '__all__'

class SizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Size
        fields = '__all__'

class ExpansionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expansion
        fields = '__all__'







# Ez volt az eredeti serializer, ami csak a dekorok ID-jét adta vissza, eddig ezt használtuk az "épitéshez".... az átláthatóság miatt lentebb biggyesztettem, viszont probléma elkerülése végett a FavoriteSerializer ELÉ kell helyeznem, hisz abban már a DecorSerializerre hivatkozom
#class DecorSerializer(serializers.ModelSerializer):
    #culture = serializers.PrimaryKeyRelatedField(read_only=True)
    #style = serializers.PrimaryKeyRelatedField(read_only=True)
    #size = serializers.PrimaryKeyRelatedField(read_only=True)
    #expansion = serializers.PrimaryKeyRelatedField(read_only=True)
    #category = serializers.PrimaryKeyRelatedField(read_only=True)
    #subcategory = serializers.PrimaryKeyRelatedField(read_only=True)

    #class Meta:
        #model = Decor
        #fields = '__all__'


# Ide pedig az ÚJ DecorSerializer, ami a dekorok teljes objektumát adja vissza, így a frontendnek nem kell külön lekérdezéseket csinálnia a kapcsolódó modellekhez, hanem egyből megkapja azokat is.
class DecorSerializer(serializers.ModelSerializer):
    culture_name = serializers.CharField(source='culture.name', read_only=True)
    style_name = serializers.CharField(source='style.name', read_only=True)
    size_name = serializers.CharField(source='size.name', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    subcategory_name = serializers.CharField(source='subcategory.name', read_only=True)
    expansion_name = serializers.CharField(source='expansion.name', read_only=True)

    image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Decor
        fields = '__all__'











# És ide jöhet a favorit serializerünk, ami a Favorite modellünket fogja használni, hogy a kedvenceinket tudjuk kezelni a frontenddel.
class FavoriteSerializer(serializers.ModelSerializer):
    # A dekor teljes objektuma (GET esetén)
    decor = DecorSerializer(read_only=True)

    # A POST-hoz szükséges mező (csak ID-t vár)
    decor_id = serializers.PrimaryKeyRelatedField(
        queryset=Decor.objects.all(),
        source='decor',
        write_only=True
    )

    class Meta:
        model = Favorite
        fields = ['id', 'user', 'decor', 'decor_id']
        read_only_fields = ['user']