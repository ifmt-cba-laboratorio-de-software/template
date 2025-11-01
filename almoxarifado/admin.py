from django.contrib import admin
from .models import Item


@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ('sku', 'nome', 'quantidade', 'localizacao')
    search_fields = ('sku', 'nome', 'descricao')

from .models import Fornecedor


@admin.register(Fornecedor)
class FornecedorAdmin(admin.ModelAdmin):
    list_display = ('nome', 'contato')
    search_fields = ('nome',)
