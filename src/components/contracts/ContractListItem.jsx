import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CONTRACT_TYPE_MAP, STATUS_CONFIG } from "@/lib/contractTypes";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

export default function ContractListItem({ contract, onClick }) {
  const typeInfo = CONTRACT_TYPE_MAP[contract.contract_type];
  const statusInfo = STATUS_CONFIG[contract.status] || STATUS_CONFIG.rascunho;
  const Icon = typeInfo?.icon;

  return (
    <Card
      className="group flex items-center gap-4 p-4 cursor-pointer hover:shadow-md hover:border-primary/20 transition-all duration-200"
      onClick={() => onClick(contract)}
    >
      {Icon && (
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", typeInfo.color)}>
          <Icon className="w-5 h-5" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-medium text-sm text-foreground truncate">{contract.cliente_nome || "Sem cliente"}</p>
          <Badge variant="secondary" className={cn("text-[10px] px-2 py-0.5 shrink-0", statusInfo.color)}>
            {statusInfo.label}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          {typeInfo?.label} · {contract.created_date ? format(new Date(contract.created_date), "dd/MM/yyyy") : "—"}
        </p>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </Card>
  );
}
