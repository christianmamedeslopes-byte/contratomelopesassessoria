import streamlit as st
from datetime import datetime
from io import BytesIO
from xhtml2pdf import pisa

# 1. Configuração da Página
st.set_page_config(page_title="Gerador de Contratos | M e Lopes", layout="centered", page_icon="📄")

# 2. Função para gerar o PDF (usando o xhtml2pdf que já conhece)
def gerar_pdf_contrato(html_content):
    result = BytesIO()
    pdf = pisa.pisaDocument(BytesIO(html_content.encode("UTF-8")), result)
    return result.getvalue() if not pdf.err else None

# 3. Interface Visual no Streamlit
st.title("📄 Gerador de Contratos B2B")
st.markdown("Preencha os dados do cliente e do escopo para gerar o contrato automaticamente com a marca **M e Lopes Assessoria**.")

with st.form("form_contrato"):
    st.subheader("🏢 Dados do Cliente (Contratante)")
    col1, col2 = st.columns(2)
    with col1:
        cliente_nome = st.text_input("Nome da Empresa", value="G.A SOLAR")
        cliente_cnpj = st.text_input("CNPJ", value="66.283.865/0001-10")
    with col2:
        cliente_rep = st.text_input("Representante Legal", value="Wellington Rafael Nascimento de Sá")
        cliente_end = st.text_input("Endereço", value="Rua Jose Francelino Teixeira Gomes, 196, Campo Grande - MS")
        
    st.subheader("🎯 Detalhes do Acordo")
    # Os textos padrão já vêm preenchidos com o modelo que enviou
    escopo = st.text_area(
        "1. Escopo da Parceria", 
        height=100,
        value="• Engenharia de Dados: Modelagem de Relatórios de Caixa de Obra, Relatórios de Conclusão e estruturação lógica de Propostas Comerciais.\n• Interface Visual (UI): Desenvolvimento de banners e padronização visual para canais digitais."
    )
    
    condicoes = st.text_area(
        "2. Condições Financeiras e Permuta", 
        height=100,
        value="Acordo de Cooperação Estratégica: Este termo não envolve repasse financeiro (R$). Em permuta pela execução técnica, a Contratante cede o direito de uso das entregas geradas (devidamente anonimizadas) para composição do portfólio público e comercial da Me Lopes."
    )
    
    gerar = st.form_submit_button("Gerar Contrato em PDF", use_container_width=True, type="primary")

# 4. Lógica de Montagem do Documento
if gerar:
    data_atual = datetime.now().strftime("%d/%m/%Y")
    
    # Substituímos as quebras de linha do ecrã por quebras de linha em HTML
    escopo_html = escopo.replace('\n', '<br>')
    condicoes_html = condicoes.replace('\n', '<br>')
    
    html_contrato = f"""
    <html>
    <head>
        <style>
            @page {{
                size: A4 portrait;
                margin: 2.5cm 2cm;
            }}
            body {{ font-family: Helvetica, Arial, sans-serif; font-size: 12px; color: #1e293b; line-height: 1.6; }}
            h1 {{ text-align: center; font-size: 16px; color: #0f172a; border-bottom: 2px solid #0f172a; padding-bottom: 8px; margin-bottom: 30px; }}
            h2 {{ font-size: 12px; color: #0f172a; background-color: #f1f5f9; padding: 6px 10px; margin-top: 25px; text-transform: uppercase; }}
            .destaque {{ font-weight: bold; color: #000; }}
            .assinaturas {{ margin-top: 80px; width: 100%; text-align: center; page-break-inside: avoid; }}
            .linha-ass {{ border-top: 1px solid #334155; width: 85%; margin: 0 auto; padding-top: 8px; }}
            .footer {{ text-align: center; font-size: 8.5px; color: #64748b; margin-top: 50px; border-top: 1px solid #e2e8f0; padding-top: 10px; }}
        </style>
    </head>
    <body>
        <h1>TERMO DE PARCERIA E ASSESSORIA TÉCNICA B2B</h1>
        
        <p><span class="destaque">CONTRATADA (ASSESSORIA)</span><br>
        <span class="destaque">CRISTHIAN MAMEDE LOPES (Me Lopes Assessoria)</span><br>
        CNPJ: 66.283.560/0001-09<br>
        Rua Espírito Santo, 2215, Centro, Sidrolândia - MS</p>
        
        <p><span class="destaque">CONTRATANTE (CLIENTE)</span><br>
        <span class="destaque">{cliente_nome}</span><br>
        CNPJ: {cliente_cnpj}<br>
        {cliente_end}<br>
        Representada por: {cliente_rep}</p>
        
        <h2>1. ESCOPO DA PARCERIA</h2>
        <p>{escopo_html}</p>
        
        <h2>2. CONDIÇÕES FINANCEIRAS E PERMUTA</h2>
        <p>{condicoes_html}</p>
        
        <h2>3. CICLO DE RENOVAÇÃO E CANCELAMENTO</h2>
        <p>O ciclo de prestação de serviços é de 30 dias, renovado automaticamente. Para garantir a flexibilidade e a saúde operacional de ambas as partes, o
