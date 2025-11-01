
from django.db import models


class Fornecedor(models.Model):
    nome = models.CharField(max_length=255, unique=True)
    contato = models.CharField(max_length=255, blank=True)

    class Meta:
        verbose_name = 'Fornecedor'
        verbose_name_plural = 'Fornecedores'

    def __str__(self):
        return self.nome


class Item(models.Model):
    sku = models.CharField(max_length=64, unique=True)
    nome = models.CharField(max_length=255)
    descricao = models.TextField(blank=True)
    quantidade = models.IntegerField(default=0)
    localizacao = models.CharField(max_length=128, blank=True)
    fornecedor = models.ForeignKey(Fornecedor, null=True, blank=True, on_delete=models.SET_NULL, related_name='itens')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['nome']

    def __str__(self):
        return f"{self.nome} ({self.sku})"
