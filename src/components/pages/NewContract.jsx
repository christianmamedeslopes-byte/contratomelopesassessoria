import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { CONTRACT_TYPES } from "@/lib/contractTypes";
import ContractTypeCard from "@/components/contracts/ContractTypeCard";
import ContractForm from "@/components/contracts/ContractForm";
import ContractPreview from "@/components/contracts/ContractPreview";
import { motion } from "framer-motion";

export default function NewContract() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const urlParams = new URLSearchParams(window.location.search);
  const initialType = urlParams.get("tipo") || null;

  const [selectedType, setSelectedType] = useState(initialType);
  const [view, setView] = useState(initialType ? "form" : "select"); // select | form | preview
  const [formData, setFormData] = useState({
    empresa_contratada: "M e Lopes Assessoria Tech & Gestão Ltda",
    representante_contratada: "Cristhian Mamede Lopes",
  });

  const saveMutation = useMutation({
    mutationFn: (data) => base44.entities.Contract.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      navigate("/contratos");
    },
  });

  const handleSelectType = (typeId) => {
    setSelectedType(typeId);
    setView("form");
  };

  const handleSave = () => {
    saveMutation.mutate({
      contract_type: selectedType,
      status: "rascunho",
      ...formData,
      data_emissao: formData.data_emissao || new Date().toISOString().split("T")[0],
    });
  };

  // Step 1: Select type
  if (view === "select") {
    return (
      <div className="p-6 lg:p-10 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="text-xs text-accent font-semibold uppercase tracking-[0.2em] mb-2">Passo 1</p>
          <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground">
            Selecione o Tipo de Contrato
          </h1>
          <p className="text-muted-foreground mt-2">Escolha o modelo que melhor se aplica à sua necessidade.</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CONTRACT_TYPES.map((type, index) => (
            <ContractTypeCard key={type.id} type={type} index={index} onClick={handleSelectType} />
          ))}
        </div>
      </div>
    );
  }

  // Step 3: Preview
  if (view === "preview") {
    return (
      <div className="p-6 lg:p-10">
        <ContractPreview
          data={formData}
          contractType={selectedType}
          onBack={() => setView("form")}
        />
      </div>
    );
  }

  // Step 2: Form
  return (
    <div className="p-6 lg:p-10">
      <ContractForm
        contractType={selectedType}
        formData={formData}
        setFormData={setFormData}
        onPreview={() => setView("preview")}
        onSave={handleSave}
        onBack={() => {
          setSelectedType(null);
          setView("select");
        }}
        isSaving={saveMutation.isPending}
      />
    </div>
  );
}
