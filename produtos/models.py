from django.db import models

class Fornecedor(models.Model):
    nome = models.CharField(max_length=100)
    cnpj = models.CharField(max_length=18, unique=True, null=True, blank=True)
    contato = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return self.nome


class Item(models.Model):
    codigo = models.CharField(max_length=50, unique=True)
    descricao = models.CharField(max_length=200)
    fornecedor = models.ForeignKey(Fornecedor, on_delete=models.CASCADE, related_name='itens')
    categoria = models.CharField(max_length=100, null=True, blank=True)
    preco = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return f"{self.codigo} - {self.descricao}"
