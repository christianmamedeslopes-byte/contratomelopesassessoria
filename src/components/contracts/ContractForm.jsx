import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CONTRACT_TYPE_MAP } from "@/lib/contractTypes";
import { ArrowLeft, Eye, Save } from "lucide-react";
import { motion } from "framer-motion";

const FIELD_GROUPS = [
  {
    title: "Dados da Contratada",
    sectionLetter: "A",
    fields: [
      { key: "empresa_contratada", label: "Razão Social", placeholder: "M e Lopes Assessoria Ltda" },
      { key: "cnpj_contratada", label: "CNPJ", placeholder: "00.000.000/0001-00" },
      { key: "endereco_contratada", label: "Endereço", placeholder: "Rua, Número, Cidade - UF" },
      { key: "representante_contratada", label: "Representante Legal", placeholder: "Nome completo" },
    ],
  },
  {
    title: "Dados do Contratante (Cliente)",
    sectionLetter: "B",
    fields: [
      { key: "cliente_nome", label: "Razão Social", placeholder: "Empresa do cliente" },
      { key: "cliente_cnpj", label: "CNPJ", placeholder: "00.000.000/0001-00" },
      { key: "cliente_endereco", label: "Endereço", placeholder: "Rua, Número, Cidade - UF" },
      { key: "cliente_representante", label: "Representante Legal", placeholder: "Nome completo" },
    ],
  },
  {
    title: "Termos do Contrato",
    sectionLetter: "C",
    fields: [
      { key: "escopo", label: "Escopo / Objeto", placeholder: "Descreva o escopo da parceria ou serviço...", textarea: true },
      { key: "condicoes_financeiras", label: "Condições Financeiras", placeholder: "Valores, prazos de pagamento, forma de cobrança...", textarea: true },
      { key: "valor", label: "Valor (R$)", placeholder: "0,00", type: "number" },
      { key: "vigencia", label: "Vigência", placeholder: "ex: 12 meses, prazo indeterminado..." },
      { key: "data_emissao", label: "Data de Emissão", type: "date" },
    ],
  },
];

export default function ContractForm({ contractType, formData, setFormData, onPreview, onSave, onBack, isSaving }) {
  const typeInfo = CONTRACT_TYPE_MAP[contractType];

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-8"
      >
        <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <p className="text-xs text-accent font-semibold uppercase tracking-wider mb-1">Novo Contrato</p>
          <h1 className="font-heading text-2xl font-bold text-foreground">{typeInfo?.label}</h1>
        </div>
      </motion.div>

      {/* Form Sections */}
      <div className="space-y-6">
        {FIELD_GROUPS.map((group, gi) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: gi * 0.1 }}
          >
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    {group.sectionLetter}
                  </div>
                  <CardTitle className="font-heading text-lg">{group.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {group.fields.map((field) => (
                  <div key={field.key}>
                    <Label className="text-sm font-medium text-foreground/80 mb-1.5 block">{field.label}</Label>
                    {field.textarea ? (
                      <Textarea
                        value={formData[field.key] || ""}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className="min-h-[100px] resize-none"
                      />
                    ) : (
                      <Input
                        type={field.type || "text"}
                        value={formData[field.key] || ""}
                        onChange={(e) => handleChange(field.key, field.type === "number" ? parseFloat(e.target.value) || "" : e.target.value)}
                        placeholder={field.placeholder}
                      />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-3 mt-8 pb-8"
      >
        <Button variant="outline" className="flex-1 gap-2" onClick={onPreview}>
          <Eye className="w-4 h-4" />
          Visualizar Contrato
        </Button>
        <Button className="flex-1 gap-2 bg-primary hover:bg-primary/90" onClick={onSave} disabled={isSaving}>
          <Save className="w-4 h-4" />
          {isSaving ? "Salvando..." : "Salvar Contrato"}
        </Button>
      </motion.div>
    </div>
  );
}
