from django.test import TestCase
from rest_framework.test import APIClient
from .models import Item


class ItemAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        Item.objects.create(sku='A01', nome='Parafuso ABC', quantidade=10, localizacao='almoxarifado-a')
        Item.objects.create(sku='B02', nome='Porca XYZ', quantidade=5, localizacao='almoxarifado-b')

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
