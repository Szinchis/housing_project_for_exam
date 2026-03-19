from rest_framework import serializers
from .models import Category, Decor, SubCategory, Culture, Style, Size, Expansion

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class DecorSerializer(serializers.ModelSerializer):
    culture = serializers.PrimaryKeyRelatedField(read_only=True)
    style = serializers.PrimaryKeyRelatedField(read_only=True)
    size = serializers.PrimaryKeyRelatedField(read_only=True)
    expansion = serializers.PrimaryKeyRelatedField(read_only=True)
    category = serializers.PrimaryKeyRelatedField(read_only=True)
    subcategory = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Decor
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