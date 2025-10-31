"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import * as React from 'react';

interface Item {
  id: string;
  codigo: string;
  descricao: string;
  unidadeMedida: string;
  valorUnitario: number;
  fornecedor: string;
}

interface FilterCriteria {
  codigo: string;
  descricao: string;
  fornecedor: string;
  unidadeMedida: string;
  valorMin: string;
  valorMax: string;
}

export default function ConsultaItens() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [results, setResults] = useState<Item[]>([]);
  const [filterOpen, setFilterOpen] = useState(true);
  
  // Estado dos filtros
  const [filters, setFilters] = useState<FilterCriteria>({
    codigo: "",
    descricao: "",
    fornecedor: "",
    unidadeMedida: "",
    valorMin: "",
    valorMax: "",
  });

  // Dados mockados para demonstração
  const mockData: Item[] = [
    {
      id: "1",
      codigo: "CIM001",
      descricao: "Cimento Portland 50kg",
      unidadeMedida: "SC",
      valorUnitario: 35.50,
      fornecedor: "Fornecedor ABC Ltda",
    },
    {
      id: "2",
      codigo: "ARE002",
      descricao: "Areia grossa m³",
      unidadeMedida: "M3",
      valorUnitario: 120.00,
      fornecedor: "Fornecedor XYZ Ltda",
    },
    {
      id: "3",
      codigo: "BRI003",
      descricao: "Tijolo cerâmico 6 furos",
      unidadeMedida: "UN",
      valorUnitario: 1.25,
      fornecedor: "Fornecedor ABC Ltda",
    },
    {
      id: "4",
      codigo: "FER004",
      descricao: "Ferro redondo 10mm",
      unidadeMedida: "KG",
      valorUnitario: 8.75,
      fornecedor: "Fornecedor DEF Ltda",
    },
    {
      id: "5",
      codigo: "CAL005",
      descricao: "Cal hidratada 20kg",
      unidadeMedida: "SC",
      valorUnitario: 28.00,
      fornecedor: "Fornecedor XYZ Ltda",
    },
    {
      id: "6",
      codigo: "TIN006",
      descricao: "Tinta acrílica branca 18L",
      unidadeMedida: "L",
      valorUnitario: 65.00,
      fornecedor: "Fornecedor GHI Ltda",
    },
  ];

  const unidadesMedida = [
    { value: "UN", label: "Unidade" },
    { value: "KG", label: "Quilograma" },
    { value: "M", label: "Metro" },
    { value: "M2", label: "Metro Quadrado" },
    { value: "M3", label: "Metro Cúbico" },
    { value: "L", label: "Litro" },
    { value: "CX", label: "Caixa" },
    { value: "SC", label: "Saco" },
  ];

  // Função para filtrar resultados
  const filteredResults = useMemo(() => {
    return mockData.filter((item) => {
      const codigoMatch = item.codigo
        .toLowerCase()
        .includes(filters.codigo.toLowerCase());
      
      const descricaoMatch = item.descricao
        .toLowerCase()
        .includes(filters.descricao.toLowerCase());
      
      const fornecedorMatch = item.fornecedor
        .toLowerCase()
        .includes(filters.fornecedor.toLowerCase());
      
      const unidadeMatch = !filters.unidadeMedida || 
        item.unidadeMedida === filters.unidadeMedida;
      
      const valorMinMatch = !filters.valorMin || 
        item.valorUnitario >= parseFloat(filters.valorMin);
      
      const valorMaxMatch = !filters.valorMax || 
        item.valorUnitario <= parseFloat(filters.valorMax);

      return (
        codigoMatch &&
        descricaoMatch &&
        fornecedorMatch &&
        unidadeMatch &&
        valorMinMatch &&
        valorMaxMatch
      );
    });
  }, [filters]);

  // Função para realizar busca
  const handleSearch = useCallback(async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setSearchPerformed(true);

  try {
    const queryParams = new URLSearchParams();

    // Se quiser implementar busca aproximada
    if (filters.codigo) queryParams.append("search", filters.codigo);
    if (filters.descricao) queryParams.append("search", filters.descricao);
    if (filters.fornecedor) queryParams.append("search", filters.fornecedor);

    const response = await fetch(`http://127.0.0.1:8000/api/produtos/?${queryParams}`);
    const data = await response.json();

    // Aplicar filtros de valor no frontend
    const filtered = data.filter((item: any) => {
      const valorMinOk = !filters.valorMin || item.valor_unitario >= parseFloat(filters.valorMin);
      const valorMaxOk = !filters.valorMax || item.valor_unitario <= parseFloat(filters.valorMax);
      return valorMinOk && valorMaxOk;
    });

    setResults(filtered);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
  } finally {
    setLoading(false);
  }
}, [filters]);


  // Função para limpar filtros
  const handleClearFilters = useCallback(() => {
    setFilters({
      codigo: "",
      descricao: "",
      fornecedor: "",
      unidadeMedida: "",
      valorMin: "",
      valorMax: "",
    });
    setResults([]);
    setSearchPerformed(false);
  }, []);

  // Função para atualizar filtros
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Contar filtros ativos
  const activeFiltersCount = Object.values(filters).filter(v => v !== "").length;

  // Formatar valor monetário
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Cabeçalho */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Consulta de Itens
          </h1>
          <p className="text-gray-600 mt-1">
            Busque itens por diversos critérios
          </p>
        </div>

        {/* Painel de Filtros */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium"
            >
              <span className="text-lg">
                {filterOpen ? "▼" : "▶"}
              </span>
              Filtros de Busca
              {activeFiltersCount > 0 && (
                <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1">
                  {activeFiltersCount}
                </span>
              )}
            </button>
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Limpar Filtros
              </button>
            )}
          </div>

          {/* Conteúdo dos Filtros */}
          {filterOpen && (
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Código */}
                <div>
                  <label
                    htmlFor="codigo"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Código
                  </label>
                  <input
                    type="text"
                    id="codigo"
                    name="codigo"
                    value={filters.codigo}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: CIM001"
                  />
                </div>

                {/* Descrição */}
                <div>
                  <label
                    htmlFor="descricao"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Descrição
                  </label>
                  <input
                    type="text"
                    id="descricao"
                    name="descricao"
                    value={filters.descricao}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Cimento"
                  />
                </div>

                {/* Fornecedor */}
                <div>
                  <label
                    htmlFor="fornecedor"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Fornecedor
                  </label>
                  <input
                    type="text"
                    id="fornecedor"
                    name="fornecedor"
                    value={filters.fornecedor}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Fornecedor ABC"
                  />
                </div>

                {/* Unidade de Medida */}
                <div>
                  <label
                    htmlFor="unidadeMedida"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Unidade de Medida
                  </label>
                  <select
                    id="unidadeMedida"
                    name="unidadeMedida"
                    value={filters.unidadeMedida}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Todas as unidades</option>
                    {unidadesMedida.map((unidade) => (
                      <option key={unidade.value} value={unidade.value}>
                        {unidade.label} ({unidade.value})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Valor Mínimo */}
                <div>
                  <label
                    htmlFor="valorMin"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Valor Mínimo (R$)
                  </label>
                  <input
                    type="number"
                    id="valorMin"
                    name="valorMin"
                    value={filters.valorMin}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>

                {/* Valor Máximo */}
                <div>
                  <label
                    htmlFor="valorMax"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Valor Máximo (R$)
                  </label>
                  <input
                    type="number"
                    id="valorMax"
                    name="valorMax"
                    value={filters.valorMax}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  Limpar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? "Buscando..." : "Buscar"}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Resultados */}
        {searchPerformed && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Cabeçalho de Resultados */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <p className="text-sm font-medium text-gray-700">
                {loading ? (
                  <>Carregando resultados...</>
                ) : (
                  <>
                    <span className="font-bold text-gray-900">
                      {results.length}
                    </span>{" "}
                    {results.length === 1 ? "resultado encontrado" : "resultados encontrados"}
                  </>
                )}
              </p>
            </div>

            {/* Tabela de Resultados */}
            {results.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Código
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Descrição
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Unidade
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Valor Unitário
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Fornecedor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {results.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                          {item.codigo}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {item.descricao}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {item.unidadeMedida}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(item.valorUnitario)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {item.fornecedor}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            type="button"
                            onClick={() => router.push(`/itens/${item.id}`)}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Editar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-600 text-sm">
                  Nenhum item encontrado com os critérios especificados.
                </p>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  Limpar filtros e tentar novamente
                </button>
              </div>
            )}
          </div>
        )}

        {/* Estado Inicial */}
        {!searchPerformed && (
          <div className="bg-white rounded-lg shadow-md px-6 py-12 text-center">
            <p className="text-gray-600 text-sm">
              Preencha os filtros acima e clique em "Buscar" para encontrar itens
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
