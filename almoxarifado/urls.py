from rest_framework import routers
from .views import ItemViewSet, FornecedorViewSet

router = routers.DefaultRouter()
router.register(r'items', ItemViewSet, basename='item')
router.register(r'fornecedores', FornecedorViewSet, basename='fornecedor')

urlpatterns = router.urls
