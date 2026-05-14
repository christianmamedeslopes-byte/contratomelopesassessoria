import { FileText, Handshake, BriefcaseBusiness, ShieldCheck, Users } from "lucide-react";

export const CONTRACT_TYPES = [
  {
    id: "b2b",
    label: "Termo de Parceria B2B",
    description: "Acordo entre duas empresas para parceria estratégica, cooperação mútua e desenvolvimento de negócios.",
    icon: Handshake,
    color: "bg-primary/10 text-primary",
  },
  {
    id: "prestacao_servico",
    label: "Prestação de Serviço",
    description: "Contrato formal para prestação de serviços técnicos, consultivos ou operacionais com escopo definido.",
    icon: BriefcaseBusiness,
    color: "bg-accent/10 text-accent",
  },
  {
    id: "consultoria",
    label: "Contrato de Consultoria",
    description: "Acordo para prestação de serviços de consultoria especializada com entregas e prazos definidos.",
    icon: FileText,
    color: "bg-chart-2/10 text-chart-2",
  },
  {
    id: "confidencialidade",
    label: "Termo de Confidencialidade (NDA)",
    description: "Acordo de sigilo e não divulgação de informações confidenciais entre as partes envolvidas.",
    icon: ShieldCheck,
    color: "bg-destructive/10 text-destructive",
  },
  {
    id: "parceria_comercial",
    label: "Parceria Comercial",
    description: "Contrato de cooperação comercial para distribuição, representação ou venda conjunta de produtos e serviços.",
    icon: Users,
    color: "bg-chart-4/10 text-chart-4",
  },
];

export const CONTRACT_TYPE_MAP = CONTRACT_TYPES.reduce((acc, type) => {
  acc[type.id] = type;
  return acc;
}, {});

export const STATUS_CONFIG = {
  rascunho: { label: "Rascunho", color: "bg-muted text-muted-foreground" },
  enviado: { label: "Enviado", color: "bg-accent/10 text-accent" },
  assinado: { label: "Assinado", color: "bg-green-50 text-green-700" },
  cancelado: { label: "Cancelado", color: "bg-destructive/10 text-destructive" },
};
