from rest_framework import serializers
from .models import Item, Fornecedor

class FornecedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fornecedor
        fields = ['id', 'nome', 'cnpj', 'contato']

class ItemSerializer(serializers.ModelSerializer):
    fornecedor = FornecedorSerializer()

    class Meta:
        model = Item
        fields = ['id', 'codigo', 'descricao', 'categoria', 'preco', 'fornecedor']

    # Criação/Atualização com fornecedor aninhado
    def create(self, validated_data):
        fornecedor_data = validated_data.pop('fornecedor')
        fornecedor, _ = Fornecedor.objects.get_or_create(**fornecedor_data)
        item = Item.objects.create(fornecedor=fornecedor, **validated_data)
        return item

    def update(self, instance, validated_data):
        fornecedor_data = validated_data.pop('fornecedor', None)
        if fornecedor_data:
            fornecedor, _ = Fornecedor.objects.get_or_create(**fornecedor_data)
            instance.fornecedor = fornecedor
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
