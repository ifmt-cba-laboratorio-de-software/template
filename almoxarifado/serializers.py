from rest_framework import serializers
from .models import Item, Fornecedor


class FornecedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fornecedor
        fields = ['id', 'nome', 'contato']


class ItemSerializer(serializers.ModelSerializer):
    fornecedor = FornecedorSerializer(read_only=True)
    fornecedor_id = serializers.PrimaryKeyRelatedField(source='fornecedor', queryset=Fornecedor.objects.all(), write_only=True, required=False, allow_null=True)

    class Meta:
        model = Item
        fields = ['id', 'sku', 'nome', 'descricao', 'quantidade', 'localizacao', 'fornecedor', 'fornecedor_id', 'created_at', 'updated_at']
