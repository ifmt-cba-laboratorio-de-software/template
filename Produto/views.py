from django.shortcuts import render
import Produto
from Produto.models import Fornecedor

from rest_framework import generics, filters, viewsets
from .models import Produto
from .serializers import ProdutoSerializer

class ProdutoListCreateView(generics.ListCreateAPIView):
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['codigo', 'descricao', 'fornecedor', 'unidade_medida']


def listar_produtos(request):

    produtos = Produto.objects.all()
    return render(request, 'produto/produto_list.html', {'produtos': produtos})

def cadastrar_produto(request):
    if request.method == 'POST':
        descricao = request.POST.get('descricao')
        unidade_medida = request.POST.get('unidade_medida')
        valor_unitario = request.POST.get('valor_unitario')
        fornecedor_id = request.POST.get('id_fornecedor')

        fornecedor = Fornecedor.objects.get(id=fornecedor_id)

        novo_produto = Produto(
            descricao=descricao,
            unidade_medida=unidade_medida,
            valor_unitario=valor_unitario,
            fornecedor=fornecedor
        )
        novo_produto.save()

        return render(request, 'produto/produto.html', {'produto': novo_produto})

    fornecedores = Fornecedor.objects.all()
    return render(request, 'produto/produto_form.html', {'fornecedores': fornecedores})

class ProdutoViewSet(viewsets.ModelViewSet):
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer
