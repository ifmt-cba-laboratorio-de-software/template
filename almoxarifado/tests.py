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


class FornecedorCRUDApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        # create some fornecedores
        self.f1 = Fornecedor.objects.create(nome='Fornecedor A', contato='a@example.com')
        self.f2 = Fornecedor.objects.create(nome='Fornecedor B', contato='b@example.com')

    def test_list_fornecedores(self):
        resp = self.client.get('/api/fornecedores/')
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        # should return a list
        self.assertTrue(isinstance(data, list) or isinstance(data, dict))

    def test_create_fornecedor(self):
        payload = {'nome': 'Fornecedor C', 'contato': 'c@example.com'}
        resp = self.client.post('/api/fornecedores/', payload, format='json')
        self.assertEqual(resp.status_code, 201)
        data = resp.json()
        self.assertEqual(data.get('nome'), payload['nome'])

    def test_retrieve_fornecedor(self):
        resp = self.client.get(f'/api/fornecedores/{self.f1.id}/')
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data.get('nome'), self.f1.nome)

    def test_update_fornecedor(self):
        payload = {'contato': 'novo@example.com'}
        resp = self.client.patch(f'/api/fornecedores/{self.f2.id}/', payload, format='json')
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data.get('contato'), payload['contato'])

    def test_delete_fornecedor(self):
        resp = self.client.delete(f'/api/fornecedores/{self.f2.id}/')
        self.assertIn(resp.status_code, (204, 200))
        # subsequent get should return 404
        resp2 = self.client.get(f'/api/fornecedores/{self.f2.id}/')
        self.assertEqual(resp2.status_code, 404)

    def test_create_duplicate_fornecedor_returns_400(self):
        payload = {'nome': 'Fornecedor A', 'contato': 'dup@example.com'}
        resp = self.client.post('/api/fornecedores/', payload, format='json')
        self.assertEqual(resp.status_code, 400)
        self.assertIn('nome', resp.json())

    def test_update_to_duplicate_nome_returns_400(self):
        # attempt to change f2 nome to f1 nome
        payload = {'nome': 'Fornecedor A'}
        resp = self.client.patch(f'/api/fornecedores/{self.f2.id}/', payload, format='json')
        self.assertEqual(resp.status_code, 400)
        self.assertIn('nome', resp.json())
