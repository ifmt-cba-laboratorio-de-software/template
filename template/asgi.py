"""
Configuração ASGI para o projeto `template`.

Expõe o objeto ASGI no nível do módulo com o nome ``application``.

Para mais informações sobre este arquivo (em português):
https://docs.djangoproject.com/pt-br/5.2/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'template.settings')

application = get_asgi_application()
