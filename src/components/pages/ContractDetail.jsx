import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import ContractPreview from "@/components/contracts/ContractPreview";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CONTRACT_TYPE_MAP, STATUS_CONFIG } from "@/lib/contractTypes";
import { ArrowLeft, Printer, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function ContractDetail() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const contractId = window.location.pathname.split("/").pop();

  const [showPreview, setShowPreview] = useState(false);

  const { data: contract, isLoading } = useQuery({
    queryKey: ["contract", contractId],
    queryFn: async () => {
      const list = await base44.entities.Contract.filter({ id: contractId });
      return list[0] || null;
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Contract.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["contract", contractId] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Contract.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      navigate("/contratos");
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-6 h-6 border-2 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="p-10 text-center">
        <p className="text-muted-foreground">Contrato não encontrado.</p>
        <Button variant="outline" onClick={() => navigate("/contratos")} className="mt-4">Voltar</Button>
      </div>
    );
  }

  if (showPreview) {
    return (
      <div className="p-6 lg:p-10">
        <ContractPreview
          data={contract}
          contractType={contract.contract_type}
          onBack={() => setShowPreview(false)}
        />
      </div>
    );
  }

  const typeInfo = CONTRACT_TYPE_MAP[contract.contract_type];
  const statusInfo = STATUS_CONFIG[contract.status] || STATUS_CONFIG.rascunho;
  const Icon = typeInfo?.icon;

  return (
    <div className="p-6 lg:p-10 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        {/* Top bar */}
        <div className="flex items-center gap-3 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate("/contratos")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <p className="text-xs text-accent font-semibold uppercase tracking-[0.2em] mb-1">Detalhes</p>
            <h1 className="font-heading text-xl font-bold text-foreground">{contract.cliente_nome || "Sem cliente"}</h1>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-card rounded-xl border border-border p-6 space-y-6">
          <div className="flex items-center gap-4">
            {Icon && (
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", typeInfo.color)}>
                <Icon className="w-6 h-6" />
              </div>
            )}
            <div>
              <p className="font-heading font-semibold">{typeInfo?.label}</p>
              <Badge className={cn("mt-1 text-xs", statusInfo.color)}>{statusInfo.label}</Badge>
            </div>
          </div>

          {/* Status update */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground font-medium">Alterar status:</span>
            <Select
              value={contract.status}
              onValueChange={(val) => updateMutation.mutate({ id: contract.id, data: { status: val } })}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rascunho">Rascunho</SelectItem>
                <SelectItem value="enviado">Enviado</SelectItem>
                <SelectItem value="assinado">Assinado</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <InfoField label="Contratada" value={contract.empresa_contratada} />
            <InfoField label="CNPJ Contratada" value={contract.cnpj_contratada} />
            <InfoField label="Contratante" value={contract.cliente_nome} />
            <InfoField label="CNPJ Contratante" value={contract.cliente_cnpj} />
            <InfoField label="Representante" value={contract.cliente_representante} />
            <InfoField label="Vigência" value={contract.vigencia} />
            {contract.valor && (
              <InfoField label="Valor" value={`R$ ${Number(contract.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} />
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
            <Button variant="outline" className="flex-1 gap-2" onClick={() => setShowPreview(true)}>
              <Printer className="w-4 h-4" />
              Visualizar / Imprimir
            </Button>
            <Button
              variant="outline"
              className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/5"
              onClick={() => {
                if (confirm("Tem certeza que deseja excluir este contrato?")) {
                  deleteMutation.mutate(contract.id);
                }
              }}
            >
              <Trash2 className="w-4 h-4" />
              Excluir
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function InfoField({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-muted-foreground text-xs font-medium mb-0.5">{label}</p>
      <p className="text-foreground">{value}</p>
    </div>
  );
}
