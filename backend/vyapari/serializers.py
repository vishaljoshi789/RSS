from rest_framework import serializers
from .models import Vyapari, Category, SubCategory

class VyapariSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vyapari
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class SubCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SubCategory
        fields = '__all__'
