"""
Configuração de URLs do projeto `template`.

A lista `urlpatterns` roteia URLs para views. Para mais informações:
    https://docs.djangoproject.com/pt-br/5.2/topics/http/urls/

Exemplos:

Views em função
    1. Adicione uma importação: from my_app import views
    2. Adicione uma URL em urlpatterns: path('', views.home, name='home')

Views baseadas em classe
    1. Adicione uma importação: from other_app.views import Home
    2. Adicione uma URL em urlpatterns: path('', Home.as_view(), name='home')

Incluindo outro URLconf
    1. Importe a função include(): from django.urls import include, path
    2. Adicione uma URL em urlpatterns: path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('almoxarifado.urls')),
    # OpenAPI / Swagger
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]
