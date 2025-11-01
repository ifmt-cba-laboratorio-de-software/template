from rest_framework import serializers
from .models import Item, Fornecedor


class FornecedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fornecedor
        fields = ['id', 'nome', 'contato']

    def validate_nome(self, value):
        """Garantir que o nome do fornecedor seja único (case-insensitive)."""
        qs = Fornecedor.objects.filter(nome__iexact=value)
        if self.instance is not None:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError('Fornecedor com esse nome já existe.')
        return value


class ItemSerializer(serializers.ModelSerializer):
    fornecedor = FornecedorSerializer(read_only=True)
    fornecedor_id = serializers.PrimaryKeyRelatedField(source='fornecedor', queryset=Fornecedor.objects.all(), write_only=True, required=False, allow_null=True)

    class Meta:
        model = Item
        fields = ['id', 'sku', 'nome', 'descricao', 'quantidade', 'localizacao', 'fornecedor', 'fornecedor_id', 'created_at', 'updated_at']
