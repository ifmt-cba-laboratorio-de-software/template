from rest_framework import generics, filters
from rest_framework.permissions import IsAuthenticated
from .models import Item
from .serializers import ItemSerializer

class ItemListCreateView(generics.ListCreateAPIView):
    """
    GET: lista e busca de itens (filtros: código, descrição, fornecedor, categoria)
    POST: cria novo item
    """
    queryset = Item.objects.select_related('fornecedor').all()
    serializer_class = ItemSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['codigo', 'descricao', 'fornecedor__nome', 'categoria']
    ordering_fields = ['codigo', 'descricao', 'preco']
    permission_classes = [IsAuthenticated]


class ItemRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET: retorna item por ID
    PUT/PATCH: atualiza item
    DELETE: remove item
    """
    queryset = Item.objects.select_related('fornecedor').all()
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated]
