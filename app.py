import streamlit as st
from jinja2 import Template
from weasyprint import HTML
from datetime import datetime
import base64
from pathlib import Path

# =====================================================
# CONFIG
# =====================================================

st.set_page_config(
    page_title="M e Lopes Business Suite",
    layout="wide",
    page_icon="📄"
)

# =====================================================
# FUNÇÕES
# =====================================================

def image_to_base64(image_path):
    with open(image_path, "rb") as img:
        return base64.b64encode(img.read()).decode()

def carregar_css():
    with open("assets/style.css", "r", encoding="utf-8") as f:
        return f.read()

def carregar_template():
    with open("assets/templates/contrato.html", "r", encoding="utf-8") as f:
        return f.read()

def gerar_html(dados):

    template = Template(carregar_template())

    html = template.render(**dados)

    return html

def gerar_pdf(html_content):

    pdf = HTML(string=html_content).write_pdf()

    return pdf

# =====================================================
# SIDEBAR
# =====================================================

st.sidebar.image("assets/logo.png", width=180)

st.sidebar.title("M e Lopes")
st.sidebar.caption("Business Suite")

st.sidebar.divider()

st.sidebar.markdown("""
### 🚀 Plataforma B2B

- Contratos premium
- Parcerias empresariais
- Gestão documental
- Branding corporativo
""")

# =====================================================
# FORMULÁRIO
# =====================================================

st.title("📄 Gerador Premium de Contratos")

st.caption("""
Criação de contratos corporativos modernos
com identidade visual profissional.
""")

col1, col2 = st.columns([1,1])

with col1:

    st.subheader("🏢 Dados do Cliente")

    cliente_nome = st.text_input(
        "Empresa",
        value="G.A SOLAR"
    )

    cliente_cnpj = st.text_input(
        "CNPJ",
        value="66.283.865/0001-10"
    )

    cliente_rep = st.text_input(
        "Representante",
        value="Wellington Rafael Nascimento de Sá"
    )

    cliente_endereco = st.text_input(
        "Endereço",
        value="Campo Grande - MS"
    )

    st.subheader("🎯 Escopo")

    escopo = st.text_area(
        "Escopo da parceria",
        height=180,
        value="""
• Engenharia de Dados
• Relatórios financeiros
• Modelagem operacional
• Interface visual
• Estruturação comercial
        """
    )

    condicoes = st.text_area(
        "Condições financeiras",
        height=140,
        value="""
Acordo estratégico sem repasse financeiro direto.
As entregas poderão compor o portfólio técnico
da M e Lopes Assessoria.
        """
    )

# =====================================================
# DADOS TEMPLATE
# =====================================================

logo_melopes = image_to_base64("assets/logo.png")

dados = {
    "style": carregar_css(),
    "logo_melopes": f"data:image/png;base64,{logo_melopes}",
    "logo_parceiro": None,
    "empresa_melopes": "M e Lopes Assessoria",
    "cnpj_melopes": "66.283.560/0001-09",
    "endereco_melopes": "Sidrolândia - MS",
    "cliente_nome": cliente_nome,
    "cliente_cnpj": cliente_cnpj,
    "cliente_endereco": cliente_endereco,
    "cliente_rep": cliente_rep,
    "escopo": escopo.replace("\n", "<br>"),
    "condicoes": condicoes.replace("\n", "<br>"),
    "data": datetime.now().strftime("%d/%m/%Y")
}

html_final = gerar_html(dados)

# =====================================================
# PREVIEW
# =====================================================

with col2:

    st.subheader("👁️ Preview do Contrato")

    st.components.v1.html(
        html_final,
        height=900,
        scrolling=True
    )

# =====================================================
# PDF
# =====================================================

st.divider()

if st.button(
    "🚀 Gerar Contrato Premium",
    use_container_width=True
):

    with st.spinner("Gerando documento corporativo..."):

        pdf = gerar_pdf(html_final)

    st.success("Contrato gerado com sucesso.")

    st.download_button(
        label="📥 Baixar PDF",
        data=pdf,
        file_name=f"Contrato_{cliente_nome}.pdf",
        mime="application/pdf",
        use_container_width=True
    )
