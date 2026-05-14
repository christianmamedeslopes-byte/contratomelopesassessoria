import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { CONTRACT_TYPES, STATUS_CONFIG } from "@/lib/contractTypes";
import ContractTypeCard from "@/components/contracts/ContractTypeCard";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, CheckCircle2, Clock, Send } from "lucide-react";
import { motion } from "framer-motion";

const STAT_ICONS = {
  total: FileText,
  rascunho: Clock,
  enviado: Send,
  assinado: CheckCircle2,
};

export default function Dashboard() {
  const navigate = useNavigate();

  const { data: contracts = [] } = useQuery({
    queryKey: ["contracts"],
    queryFn: () => base44.entities.Contract.list("-created_date", 100),
    initialData: [],
  });

  const stats = {
    total: contracts.length,
    rascunho: contracts.filter((c) => c.status === "rascunho").length,
    enviado: contracts.filter((c) => c.status === "enviado").length,
    assinado: contracts.filter((c) => c.status === "assinado").length,
  };

  const handleSelectType = (typeId) => {
    navigate(`/novo-contrato?tipo=${typeId}`);
  };

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <p className="text-xs text-accent font-semibold uppercase tracking-[0.2em] mb-2">Painel de Controle</p>
        <h1 className="font-heading text-3xl lg:text-4xl font-bold text-foreground">
          Gestão de Contratos
        </h1>
        <p className="text-muted-foreground mt-2 max-w-lg">
          Crie, gerencie e formalize seus documentos corporativos com agilidade e segurança.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {[
          { key: "total", label: "Total", value: stats.total },
          { key: "rascunho", label: "Rascunhos", value: stats.rascunho },
          { key: "enviado", label: "Enviados", value: stats.enviado },
          { key: "assinado", label: "Assinados", value: stats.assinado },
        ].map((s, i) => {
          const Icon = STAT_ICONS[s.key];
          return (
            <motion.div key={s.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Card className="relative overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-heading text-2xl font-bold text-foreground">{s.value}</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Contract Types */}
      <div className="mb-4">
        <h2 className="font-heading text-xl font-semibold text-foreground mb-1">Novo Contrato</h2>
        <p className="text-sm text-muted-foreground">Selecione o tipo de documento que deseja criar</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CONTRACT_TYPES.map((type, index) => (
          <ContractTypeCard key={type.id} type={type} index={index} onClick={handleSelectType} />
        ))}
      </div>
    </div>
  );
}
