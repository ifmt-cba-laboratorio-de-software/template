from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Item
from .serializers import ItemSerializer


class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['localizacao', 'sku', 'fornecedor']  # fornecedor filters by id
    search_fields = ['nome', 'descricao', 'sku', 'fornecedor__nome']
    ordering_fields = ['nome', 'quantidade']
