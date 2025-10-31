"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ItemForm {
  descricao: string;
  codigo: string;
  unidadeMedida: string;
  valorUnitario: string;
  fornecedor: string;
}

export default function CadastroItens() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<ItemForm>>({});

  const [formData, setFormData] = useState<ItemForm>({
    descricao: "",
    codigo: "",
    unidadeMedida: "",
    valorUnitario: "",
    fornecedor: "",
  });

  const unidadesMedida = [
    { value: "UN", label: "Unidade" },
    { value: "KG", label: "Quilograma" },
    { value: "M", label: "Metro" },
    { value: "M2", label: "Metro Quadrado" },
    { value: "M3", label: "Metro Cúbico" },
    { value: "L", label: "Litro" },
    { value: "CX", label: "Caixa" },
    { value: "PC", label: "Peça" },
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<ItemForm> = {};

    if (!formData.descricao.trim()) {
      newErrors.descricao = "Descrição é obrigatória";
    }

    if (!formData.codigo.trim()) {
      newErrors.codigo = "Código é obrigatório";
    }

    if (!formData.unidadeMedida) {
      newErrors.unidadeMedida = "Unidade de medida é obrigatória";
    }

    if (!formData.valorUnitario) {
      newErrors.valorUnitario = "Valor unitário é obrigatório";
    } else if (parseFloat(formData.valorUnitario) <= 0) {
      newErrors.valorUnitario = "Valor deve ser maior que zero";
    }

    if (!formData.fornecedor.trim()) {
      newErrors.fornecedor = "Fornecedor é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/produtos/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codigo: formData.codigo,
          descricao: formData.descricao,
          unidade_medida: formData.unidadeMedida,
          valor_unitario: parseFloat(formData.valorUnitario),
          fornecedor: formData.fornecedor,
        }),
      });

      if (!response.ok) throw new Error("Erro no envio");

      alert("Item cadastrado com sucesso!");

      setFormData({
        descricao: "",
        codigo: "",
        unidadeMedida: "",
        valorUnitario: "",
        fornecedor: "",
      });
    } catch (error) {
      alert("Erro ao cadastrar item. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Limpar erro do campo ao digitar
    if (errors[name as keyof ItemForm]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    const amount = parseFloat(numbers) / 100;
    return amount.toFixed(2);
  };

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    setFormData(prev => ({ ...prev, valorUnitario: formatted }));

    if (errors.valorUnitario) {
      setErrors(prev => ({ ...prev, valorUnitario: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Cadastro de Itens
            </h1>
            <p className="text-gray-600 mt-1">
              Preencha os dados do novo item
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="descricao"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Descrição *
              </label>
              <input
                type="text"
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.descricao ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="Ex: Cimento Portland"
              />
              {errors.descricao && (
                <p className="text-red-500 text-sm mt-1">{errors.descricao}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="codigo"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Código *
              </label>
              <input
                type="text"
                id="codigo"
                name="codigo"
                value={formData.codigo}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.codigo ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="Ex: CIM001"
              />
              {errors.codigo && (
                <p className="text-red-500 text-sm mt-1">{errors.codigo}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="unidadeMedida"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Unidade de Medida *
              </label>
              <select
                id="unidadeMedida"
                name="unidadeMedida"
                value={formData.unidadeMedida}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.unidadeMedida ? "border-red-500" : "border-gray-300"
                  }`}
              >
                <option value="">Selecione uma unidade</option>
                {unidadesMedida.map((unidade) => (
                  <option key={unidade.value} value={unidade.value}>
                    {unidade.label} ({unidade.value})
                  </option>
                ))}
              </select>
              {errors.unidadeMedida && (
                <p className="text-red-500 text-sm mt-1">{errors.unidadeMedida}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="valorUnitario"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Valor Unitário (R$) *
              </label>
              <input
                type="text"
                id="valorUnitario"
                name="valorUnitario"
                value={formData.valorUnitario}
                onChange={handleValorChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.valorUnitario ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="0.00"
              />
              {errors.valorUnitario && (
                <p className="text-red-500 text-sm mt-1">{errors.valorUnitario}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="fornecedor"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Fornecedor *
              </label>
              <input
                type="text"
                id="fornecedor"
                name="fornecedor"
                value={formData.fornecedor}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.fornecedor ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="Ex: Fornecedor ABC Ltda"
              />
              {errors.fornecedor && (
                <p className="text-red-500 text-sm mt-1">{errors.fornecedor}</p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Cadastrando..." : "Cadastrar Item"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}