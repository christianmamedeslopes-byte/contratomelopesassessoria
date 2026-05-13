import streamlit as st
from datetime import datetime
from io import BytesIO
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak
)
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from reportlab.platypus.flowables import HRFlowable
from reportlab.lib.units import cm

# =========================================================
# CONFIGURAÇÃO DA PÁGINA
# =========================================================

st.set_page_config(
    page_title="M e Lopes | Gerador de Contratos",
    page_icon="📄",
    layout="centered"
)

# =========================================================
# ESTILO VISUAL STREAMLIT
# =========================================================

st.markdown("""
<style>
    .main {
        background-color: #f8fafc;
    }

    h1, h2, h3 {
        color: #0f172a;
    }

    .stButton button {
        background: linear-gradient(90deg, #0f172a, #1e293b);
        color: white;
        border-radius: 12px;
        height: 50px;
        font-size: 16px;
        border: none;
        font-weight: bold;
    }

    .stDownloadButton button {
        background: linear-gradient(90deg, #065f46, #047857);
        color: white;
        border-radius: 12px;
        height: 50px;
        font-size: 16px;
        border: none;
        font-weight: bold;
    }

    textarea, input {
        border-radius: 10px !important;
    }

    .block-container {
        padding-top: 2rem;
    }
</style>
""", unsafe_allow_html=True)

# =========================================================
# FUNÇÃO PDF PROFISSIONAL
# =========================================================

def gerar_pdf(dados):

    buffer = BytesIO()

    doc = SimpleDocTemplate(
    buffer,
    pagesize=A4,
    rightMargin=2 * cm,
    leftMargin=2 * cm,
    topMargin=2.5 * cm,
    bottomMargin=2 * cm
)
    styles = getSampleStyleSheet()

    # =========================
    # ESTILOS CUSTOMIZADOS
    # =========================

    titulo_style = ParagraphStyle(
        "Titulo",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=22,
        leading=28,
        alignment=TA_CENTER,
        textColor=colors.HexColor("#0f172a"),
        spaceAfter=25
    )

    subtitulo_style = ParagraphStyle(
        "Subtitulo",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=12,
        textColor=colors.white,
        backColor=colors.HexColor("#0f172a"),
        leading=18,
        leftIndent=8,
        spaceBefore=18,
        spaceAfter=12
    )

    texto_style = ParagraphStyle(
        "Texto",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=11.5,
        leading=22,
        alignment=TA_JUSTIFY,
        textColor=colors.HexColor("#1e293b")
    )

    destaque_style = ParagraphStyle(
        "Destaque",
        parent=texto_style,
        fontName="Helvetica-Bold"
    )

    footer_style = ParagraphStyle(
        "Footer",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=8,
        alignment=TA_CENTER,
        textColor=colors.HexColor("#64748b")
    )

    elementos = []

    # =========================================================
    # CABEÇALHO
    # =========================================================

    elementos.append(
        Paragraph(
            "TERMO DE PARCERIA E ASSESSORIA TÉCNICA B2B",
            titulo_style
        )
    )

    elementos.append(HRFlowable(
        width="100%",
        color=colors.HexColor("#cbd5e1"),
        thickness=1
    ))

    elementos.append(Spacer(1, 20))

    # =========================================================
    # CONTRATADA
    # =========================================================

    elementos.append(Paragraph("CONTRATADA (ASSESSORIA)", subtitulo_style))

    contratada = f"""
    <b>CRISTHIAN MAMEDE LOPES (Me Lopes Assessoria)</b><br/>
    CNPJ: 66.283.560/0001-09<br/>
    Rua Espírito Santo, 2215, Centro, Sidrolândia - MS
    """

    elementos.append(Paragraph(contratada, texto_style))

    # =========================================================
    # CONTRATANTE
    # =========================================================

    elementos.append(Paragraph("CONTRATANTE (CLIENTE)", subtitulo_style))

    contratante = f"""
    <b>{dados['cliente_nome']}</b><br/>
    CNPJ: {dados['cliente_cnpj']}<br/>
    {dados['cliente_end']}<br/>
    Representada por: {dados['cliente_rep']}
    """

    elementos.append(Paragraph(contratante, texto_style))

    # =========================================================
    # SEÇÕES
    # =========================================================

    secoes = [
        ("1. ESCOPO DA PARCERIA", dados["escopo"]),
        ("2. CONDIÇÕES FINANCEIRAS E PERMUTA", dados["condicoes"]),
        (
            "3. CICLO DE RENOVAÇÃO E CANCELAMENTO",
            """
            O ciclo de prestação de serviços é de 30 dias, renovado automaticamente.
            O acordo pode ser pausado ou cancelado mediante aviso prévio mínimo de 5 dias.
            """
        ),
        (
            "4. TRATAMENTO DE DADOS (COMPLIANCE)",
            """
            A Me Lopes compromete-se a tratar todas as informações financeiras
            e estratégicas da Contratante com absoluto sigilo, removendo qualquer
            dado sensível antes da utilização em portfólio técnico ou comercial.
            """
        )
    ]

    for titulo, conteudo in secoes:
        elementos.append(Paragraph(titulo, subtitulo_style))
        elementos.append(Paragraph(conteudo.replace("\n", "<br/>"), texto_style))

    elementos.append(Spacer(1, 60))

    # =========================================================
    # ASSINATURAS
    # =========================================================

    assinatura_data = [
        [
            Paragraph(
                f"""
                _______________________________<br/>
                <b>CRISTHIAN MAMEDE LOPES</b><br/>
                Me Lopes Assessoria
                """,
                texto_style
            ),
            Paragraph(
                f"""
                _______________________________<br/>
                <b>{dados['cliente_rep']}</b><br/>
                {dados['cliente_nome']}
                """,
                texto_style
            )
        ]
    ]

    assinatura_table = Table(
        assinatura_data,
        colWidths=[7.5*cm, 7.5*cm]
    )

    assinatura_table.setStyle(TableStyle([
        ("ALIGN", (0,0), (-1,-1), "CENTER"),
        ("VALIGN", (0,0), (-1,-1), "TOP"),
    ]))

    elementos.append(assinatura_table)

    elementos.append(Spacer(1, 40))

    # =========================================================
    # FOOTER
    # =========================================================

    data_atual = datetime.now().strftime("%d/%m/%Y")

    footer = f"""
    Documento emitido eletronicamente por
    <b>CRISTHIAN MAMEDE LOPES</b> |
    Me Lopes Assessoria |
    {data_atual}
    """

    elementos.append(HRFlowable(
        width="100%",
        color=colors.HexColor("#e2e8f0"),
        thickness=1
    ))

    elementos.append(Spacer(1, 10))

    elementos.append(Paragraph(footer, footer_style))

    # =========================================================
    # GERAÇÃO PDF
    # =========================================================

    doc.build(elementos)

    pdf = buffer.getvalue()
    buffer.close()

    return pdf

# =========================================================
# INTERFACE
# =========================================================

st.title("📄 Gerador Premium de Contratos")
st.caption("M e Lopes Assessoria • Contratos elegantes • PDF profissional")

with st.form("contrato_form"):

    st.subheader("🏢 Dados do Cliente")

    col1, col2 = st.columns(2)

    with col1:
        cliente_nome = st.text_input(
            "Nome da Empresa",
            value="G.A SOLAR"
        )

        cliente_cnpj = st.text_input(
            "CNPJ",
            value="66.283.865/0001-10"
        )

    with col2:
        cliente_rep = st.text_input(
            "Representante Legal",
            value="Wellington Rafael Nascimento de Sá"
        )

        cliente_end = st.text_input(
            "Endereço",
            value="Rua Jose Francelino Teixeira Gomes, 196, Campo Grande - MS"
        )

    st.subheader("🎯 Escopo do Projeto")

    escopo = st.text_area(
        "Escopo",
        height=180,
        value="""
• Engenharia de Dados
• Modelagem de relatórios financeiros
• Relatórios de conclusão
• Estruturação lógica de propostas comerciais
• Desenvolvimento visual e UI
• Padronização visual digital
        """
    )

    condicoes = st.text_area(
        "Condições Financeiras",
        height=150,
        value="""
Acordo de cooperação estratégica sem repasse financeiro direto.
Em permuta pela execução técnica, a contratante cede o direito
de uso das entregas anonimizadas para composição de portfólio
técnico e comercial da Me Lopes Assessoria.
        """
    )

    submit = st.form_submit_button(
        "🚀 Gerar Contrato Profissional",
        use_container_width=True
    )

# =========================================================
# PROCESSAMENTO
# =========================================================

if submit:

    dados = {
        "cliente_nome": cliente_nome,
        "cliente_cnpj": cliente_cnpj,
        "cliente_rep": cliente_rep,
        "cliente_end": cliente_end,
        "escopo": escopo,
        "condicoes": condicoes
    }

    with st.spinner("Gerando contrato premium..."):

        pdf = gerar_pdf(dados)

    st.success("✅ Contrato gerado com sucesso.")

    st.download_button(
        label="📥 BAIXAR PDF",
        data=pdf,
        file_name=f"Contrato_{cliente_nome}.pdf",
        mime="application/pdf",
        use_container_width=True
    )
