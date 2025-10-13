from rest_framework.views import APIView
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.response import Response
from rest_framework import status

from .models import Vyapari, Category, SubCategory
from .serializers import VyapariSerializer, CategorySerializer, SubCategorySerializer

class VyapariListCreateView(ListCreateAPIView):
    """
    Handles GET (list all) and POST (create new Vyapari).
    """
    queryset = Vyapari.objects.all()
    serializer_class = VyapariSerializer

class VyapariDetailView(RetrieveUpdateDestroyAPIView):
    """
    Handles GET (retrieve), PUT/PATCH (update), and DELETE (destroy) for a single Vyapari.
    """
    queryset = Vyapari.objects.all()
    serializer_class = VyapariSerializer
    lookup_field = 'pk' # The default, but explicit is fine

class CategoryListCreateView(ListCreateAPIView):
    """
    Handles GET (list all categories) and POST (create new category).
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class CategoryDetailView(APIView):
    """
    Handles R, U, D for a single Category instance.
    """
    def get_object(self, pk):
        try:
            return Category.objects.get(pk=pk)
        except Category.DoesNotExist:
            return None

    def get(self, request, pk):
        category = self.get_object(pk)
        if not category:
            return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = CategorySerializer(category)
        return Response(serializer.data)

    def put(self, request, pk):
        category = self.get_object(pk)
        if not category:
            return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)
            
        serializer = CategorySerializer(category, data=request.data, partial=True) 
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        category = self.get_object(pk)
        if not category:
            return Response(status=status.HTTP_204_NO_CONTENT) 
        category.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class SubCategoryListCreateView(ListCreateAPIView):
    """
    Handles GET (list all) and POST (create new SubCategory).
    """
    queryset = SubCategory.objects.all()
    serializer_class = SubCategorySerializer

class SubCategoryDetailView(RetrieveUpdateDestroyAPIView):
    """
    Handles GET (retrieve), PUT/PATCH (update), and DELETE (destroy) for a single SubCategory.
    """
    queryset = SubCategory.objects.all()
    serializer_class = SubCategorySerializer