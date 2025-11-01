from django.urls import path
from .views import ItemListCreateView, ItemRetrieveUpdateDeleteView

urlpatterns = [
    path('itens/', ItemListCreateView.as_view(), name='lista-cria-itens'),
    path('itens/<int:pk>/', ItemRetrieveUpdateDeleteView.as_view(), name='detalha-item'),
]
