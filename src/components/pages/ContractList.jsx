import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import ContractListItem from "@/components/contracts/ContractListItem";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, FilePlus, FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function ContractList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: contracts = [], isLoading } = useQuery({
    queryKey: ["contracts"],
    queryFn: () => base44.entities.Contract.list("-created_date", 200),
    initialData: [],
  });

  const filtered = contracts.filter((c) => {
    const matchesSearch =
      !search ||
      (c.cliente_nome || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.empresa_contratada || "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleClick = (contract) => {
    navigate(`/contrato/${contract.id}`);
  };

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs text-accent font-semibold uppercase tracking-[0.2em] mb-2">Documentos</p>
            <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground">Meus Contratos</h1>
          </div>
          <Button onClick={() => navigate("/novo-contrato")} className="gap-2 bg-primary hover:bg-primary/90">
            <FilePlus className="w-4 h-4" />
            <span className="hidden sm:inline">Novo Contrato</span>
          </Button>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente ou empresa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="rascunho">Rascunho</TabsTrigger>
            <TabsTrigger value="enviado">Enviado</TabsTrigger>
            <TabsTrigger value="assinado">Assinado</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 border-2 border-muted border-t-primary rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">Nenhum contrato encontrado</p>
            <p className="text-sm text-muted-foreground/60 mt-1">Crie seu primeiro contrato para começar.</p>
          </motion.div>
        ) : (
          filtered.map((contract, i) => (
            <motion.div
              key={contract.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <ContractListItem contract={contract} onClick={handleClick} />
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
