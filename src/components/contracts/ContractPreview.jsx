import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer } from "lucide-react";
import { CONTRACT_TYPE_MAP } from "@/lib/contractTypes";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

function formatDate(dateStr) {
  if (!dateStr) return format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  return format(new Date(dateStr), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
}

function getClausulas(data, contractType) {
  const base = [
    {
      num: "1",
      title: "Objeto",
      content: data.escopo || "A ser definido pelas partes contratantes conforme negociação.",
    },
    {
      num: "2",
      title: "Condições Financeiras",
      content: data.condicoes_financeiras || "Conforme acordo entre as partes.",
    },
    {
      num: "3",
      title: "Confidencialidade",
      content: `A ${data.empresa_contratada || "contratada"} compromete-se a tratar todas as informações estratégicas, comerciais e financeiras compartilhadas pela contratante com absoluto sigilo, vedada a divulgação a terceiros sem autorização expressa, durante a vigência e após o encerramento deste instrumento, sob pena das sanções legais cabíveis.`,
    },
    {
      num: "4",
      title: "Vigência e Rescisão",
      content: `O presente instrumento entra em vigor na data de sua assinatura, com vigência de ${data.vigencia || "prazo indeterminado"}, podendo ser rescindido por qualquer das partes mediante notificação prévia de 30 (trinta) dias, sem incidência de penalidades, desde que respeitadas as obrigações já assumidas.`,
    },
  ];

  if (contractType === "prestacao_servico") {
    base.push({
      num: "5",
      title: "Obrigações da Contratada",
      content: "A contratada se obriga a prestar os serviços com zelo, diligência e pontualidade, em conformidade com as normas técnicas aplicáveis e com os padrões de qualidade exigidos pelo mercado.",
    });
    base.push({
      num: "6",
      title: "Obrigações da Contratante",
      content: "A contratante se obriga a fornecer todas as informações e condições necessárias para a execução dos serviços, bem como efetuar os pagamentos nos prazos estipulados neste instrumento.",
    });
  }

  if (contractType === "confidencialidade") {
    base[0] = {
      num: "1",
      title: "Objeto e Definição de Informações Confidenciais",
      content: "O presente Termo tem por objeto a proteção de informações confidenciais trocadas entre as partes. Consideram-se confidenciais todas as informações técnicas, comerciais, financeiras, estratégicas, operacionais e quaisquer outras de natureza sigilosa, transmitidas por qualquer meio.",
    };
  }

  base.push({
    num: String(base.length + 1),
    title: "Foro",
    content: "As partes elegem o foro da comarca da sede da contratada para dirimir quaisquer questões oriundas do presente instrumento, renunciando a qualquer outro, por mais privilegiado que seja.",
  });

  return base;
}

export default function ContractPreview({ data, contractType, onBack }) {
  const printRef = useRef();
  const typeInfo = CONTRACT_TYPE_MAP[contractType];
  const clausulas = getClausulas(data, contractType);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Toolbar */}
      <div className="no-print flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Formulário
        </Button>
        <Button onClick={handlePrint} className="gap-2 bg-primary hover:bg-primary/90">
          <Printer className="w-4 h-4" />
          Imprimir / PDF
        </Button>
      </div>

      {/* Contract Document */}
      <div ref={printRef} className="bg-white text-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-200">
        {/* Header Band */}
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 px-10 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-block px-3 py-1 bg-amber-500/20 text-amber-300 text-[10px] font-semibold uppercase tracking-[0.2em] rounded-full mb-3">
                Assessoria Tech & Gestão
              </div>
              <h1 className="font-heading text-2xl font-bold text-white tracking-tight">
                {typeInfo?.label}
              </h1>
              <p className="text-gray-400 text-sm mt-1">Documento corporativo formal</p>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center">
                <span className="text-gray-900 font-heading font-bold text-lg">ML</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-10 py-8 space-y-8">
          {/* Parties */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PartyCard
              letter="A"
              title="Contratada"
              name={data.empresa_contratada}
              cnpj={data.cnpj_contratada}
              address={data.endereco_contratada}
              rep={data.representante_contratada}
            />
            <PartyCard
              letter="B"
              title="Contratante"
              name={data.cliente_nome}
              cnpj={data.cliente_cnpj}
              address={data.cliente_endereco}
              rep={data.cliente_representante}
            />
          </div>

          <div className="border-t border-gray-200" />

          {/* Clausulas */}
          {clausulas.map((cl) => (
            <div key={cl.num}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-7 h-7 rounded-md bg-gray-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {cl.num}
                </div>
                <h2 className="font-heading font-semibold text-gray-900">{cl.title}</h2>
              </div>
              <div className="ml-10 text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {cl.content}
              </div>
            </div>
          ))}

          {/* Valor */}
          {data.valor && (
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 font-medium">Valor Total do Contrato</span>
                <span className="font-heading text-xl font-bold text-gray-900">
                  R$ {Number(data.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          )}

          <div className="border-t border-gray-200" />

          {/* Signatures */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <SignatureBlock
              name={data.representante_contratada}
              company={data.empresa_contratada}
              cnpj={data.cnpj_contratada}
            />
            <SignatureBlock
              name={data.cliente_representante}
              company={data.cliente_nome}
              cnpj={data.cliente_cnpj}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-10 py-4 flex items-center justify-between text-[11px] text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span className="font-medium">M e Lopes Business Suite</span>
          </div>
          <span>Emitido em {formatDate(data.data_emissao)}</span>
        </div>
      </div>
    </div>
  );
}

function PartyCard({ letter, title, name, cnpj, address, rep }) {
  return (
    <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-md bg-amber-500 text-gray-900 flex items-center justify-center text-xs font-bold">
          {letter}
        </div>
        <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{title}</span>
      </div>
      <p className="font-semibold text-gray-900 text-sm">{name || "—"}</p>
      {cnpj && <p className="text-xs text-gray-500 mt-1">CNPJ: {cnpj}</p>}
      {address && <p className="text-xs text-gray-500">{address}</p>}
      {rep && (
        <p className="text-xs text-gray-500 mt-2">
          Representado(a) por: <strong className="text-gray-700">{rep}</strong>
        </p>
      )}
    </div>
  );
}

function SignatureBlock({ name, company, cnpj }) {
  return (
    <div className="text-center">
      <div className="border-b border-gray-300 mb-3 pb-12" />
      <p className="font-semibold text-gray-900 text-sm">{name || "________________________"}</p>
      {company && <p className="text-xs text-gray-500">{company}</p>}
      {cnpj && <p className="text-xs text-gray-400">CNPJ: {cnpj}</p>}
    </div>
  );
}
