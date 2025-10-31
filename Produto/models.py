from django.db import models

class Fornecedor(models.Model):
    nome = models.CharField(max_length=100)
    cnpj = models.CharField(max_length=14)
    contato = models.CharField(max_length=100)
    telefone = models.CharField(max_length=15)
    email = models.EmailField()

    def __str__(self):
        return self.nome


class Produto(models.Model):
    descricao = models.CharField(max_length=100)
    unidade_medida = models.CharField(max_length=2)
    valor_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    fornecedor = models.ForeignKey(
        Fornecedor,
        on_delete=models.CASCADE,  
        related_name='produtos'   
    )

    def __str__(self):
        return self.descricao
