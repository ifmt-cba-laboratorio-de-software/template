"""
Configuração WSGI para o projeto `template`.

Expõe o objeto WSGI no nível do módulo com o nome ``application``.

Para mais informações sobre este arquivo (em português):
https://docs.djangoproject.com/pt-br/5.2/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'template.settings')

application = get_wsgi_application()
