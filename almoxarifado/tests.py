from django.test import TestCase
from rest_framework.test import APIClient
from .models import Item

from .models import Fornecedor


class ItemAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        f1 = Fornecedor.objects.create(nome='Acme Ltda', contato='acme@example.com')
        f2 = Fornecedor.objects.create(nome='Fornecedor Dois', contato='f2@example.com')
        Item.objects.create(sku='A01', nome='Parafuso ABC', quantidade=10, localizacao='almoxarifado-a', fornecedor=f1)
        Item.objects.create(sku='B02', nome='Porca XYZ', quantidade=5, localizacao='almoxarifado-b', fornecedor=f2)

    def test_list_items(self):
        resp = self.client.get('/api/items/')
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        # DRF returns a list for DefaultRouter list view
        self.assertTrue(isinstance(data, list) or isinstance(data, dict))

    def test_search_items(self):
        resp = self.client.get('/api/items/?search=parafuso')
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        # ensure at least one item is returned
        self.assertTrue(len(data) >= 1)

    def test_search_by_fornecedor(self):
        # search by fornecedor name
        resp = self.client.get('/api/items/?search=Acme')
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertTrue(len(data) >= 1)
        # ensure returned item has fornecedor Acme
        found = False
        for item in data:
            fornecedor = item.get('fornecedor')
            if fornecedor and fornecedor.get('nome') == 'Acme Ltda':
                found = True
        self.assertTrue(found)
