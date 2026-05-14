import streamlit as st
from jinja2 import Template
from datetime import datetime
import base64
import os

# =====================================================
# CONFIGURAÇÃO DA PÁGINA
# =====================================================

st.set_page_config(
    page_title="M e Lopes Business Suite",
    layout="wide",
    page_icon="📄"
)

# =====================================================
# ESTILO STREAMLIT
# =====================================================

st.markdown("""
<style>
    .main { background-color: #f8fafc; }
    .block-container { padding-top: 2rem; }
    h1, h2, h3 { color: #0f172a; }

    .stButton button {
        background: linear-gradient(90deg, #0f172a, #1e293b);
        color: white;
        border: none;
        border-radius: 12px;
        height: 52px;
        font-weight: 600;
        font-size: 16px;
    }

    .stDownloadButton button {
        background: linear-gradient(90deg, #065f46, #047857);
        color: white;
        border: none;
        border-radius: 12px;
        height: 52px;
        font-weight: 600;
        font-size: 16px;
        width: 100%;
    }
</style>
""", unsafe_allow_html=True)

# =====================================================
# FUNÇÕES UTILITÁRIAS
# =====================================================

def image_to_base64(image_file) -> str | None:
    """Converte um arquivo de imagem para string base64."""
    if image_file is None:
        return None
    return base64.b64encode(image_file.read()).decode()


@st.cache_data
def carregar_css() -> str:
    """Carrega o CSS do contrato. Usa cache para evitar releituras."""
    path = "assets/style.css"
    if not os.path.exists(path):
        st.error(f"Arquivo não encontrado: {path}")
        return ""
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


@st.cache_data
def carregar_template() -> str:
    """Carrega o template HTML do contrato. Usa cache para evitar releituras."""
    path = "assets/templates/contrato.html"
    if not os.path.exists(path):
        st.error(f"Arquivo não encontrado: {path}")
        return ""
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def carregar_logo_melopes() -> str | None:
    """Carrega o logo principal em base64."""
    path = "assets/logo.png"
    if not os.path.exists(path):
        st.warning("Logo da M e Lopes não encontrado em assets/logo.png")
        return None
    with open(path, "rb") as f:
        return base64.b64encode(f.read()).decode()


def gerar_html(dados: dict) -> str:
    """Renderiza o template Jinja2 com os dados fornecidos."""
    template_str = carregar_template()
    if not template_str:
        return "<p>Erro ao carregar template.</p>"
    return Template(template_str).render(**dados)


def montar_html_exportavel(css: str, html_contrato: str) -> str:
    """Monta o HTML completo para exportação/impressão."""
    return f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Contrato - M e Lopes Assessoria</title>
    <style>{css}</style>
</head>
<body>
    {html_contrato}
</body>
</html>"""

# =====================================================
# SIDEBAR
# =====================================================

st.sidebar.title("🚀 M e Lopes")
st.sidebar.caption("Business Suite")
st.sidebar.divider()

st.sidebar.markdown("""
### Plataforma Premium
- Contratos corporativos
- Branding empresarial
- Gestão B2B
- Documentação profissional
""")

st.sidebar.divider()
st.sidebar.subheader("🖼️ Logo do Parceiro")

logo_parceiro_upload = st.sidebar.file_uploader(
    "Enviar logo PNG/JPG",
    type=["png", "jpg", "jpeg"]
)

# =====================================================
# TELA PRINCIPAL
# =====================================================

st.title("📄 Gerador Premium de Contratos")
st.caption("Crie contratos empresariais modernos com identidade visual profissional.")

col1, col2 = st.columns([1, 1])

# =====================================================
# FORMULÁRIO
# =====================================================

with col1:
    st.subheader("🏢 Dados do Cliente")

    cliente_nome = st.text_input("Empresa", value="G.A SOLAR")
    cliente_cnpj = st.text_input("CNPJ", value="66.283.865/0001-10")
    cliente_rep = st.text_input(
        "Representante Legal",
        value="Wellington Rafael Nascimento de Sá"
    )
    cliente_endereco = st.text_input("Endereço", value="Campo Grande - MS")

    st.divider()
    st.subheader("🎯 Escopo")

    escopo = st.text_area(
        "Escopo da parceria",
        height=220,
        value=(
            "• Engenharia de Dados\n"
            "• Relatórios financeiros\n"
            "• Modelagem operacional\n"
            "• Interface visual\n"
            "• Estruturação comercial"
        )
    )

    st.subheader("💰 Condições")

    condicoes = st.text_area(
        "Condições financeiras",
        height=180,
        value=(
            "Acordo estratégico sem repasse financeiro direto.\n\n"
            "As entregas poderão compor o portfólio técnico\n"
            "da M e Lopes Assessoria."
        )
    )

# =====================================================
# MONTAGEM DOS DADOS
# =====================================================

logo_melopes_b64 = carregar_logo_melopes()
logo_parceiro_b64 = image_to_base64(logo_parceiro_upload)
css = carregar_css()

dados = {
    "style": css,
    "logo_melopes": (
        f"data:image/png;base64,{logo_melopes_b64}"
        if logo_melopes_b64 else None
    ),
    "logo_parceiro": (
        f"data:image/png;base64,{logo_parceiro_b64}"
        if logo_parceiro_b64 else None
    ),
    "empresa_melopes": "M e Lopes Assessoria",
    "cnpj_melopes": "66.283.560/0001-09",
    "endereco_melopes": "Sidrolândia - MS",
    "cliente_nome": cliente_nome,
    "cliente_cnpj": cliente_cnpj,
    "cliente_endereco": cliente_endereco,
    "cliente_rep": cliente_rep,
    "escopo": escopo.replace("\n", "<br>"),
    "condicoes": condicoes.replace("\n", "<br>"),
    "data": datetime.now().strftime("%d/%m/%Y"),
}

html_contrato = gerar_html(dados)
html_exportavel = montar_html_exportavel(css, html_contrato)

# =====================================================
# PREVIEW
# =====================================================

with col2:
    st.subheader("👁️ Preview do Contrato")
    st.components.v1.html(html_contrato, height=950, scrolling=True)

# =====================================================
# EXPORTAÇÃO
# =====================================================

st.divider()

col_dl, col_info = st.columns([1, 2])

with col_dl:
    nome_arquivo = (
        f"contrato_{cliente_nome.replace(' ', '_').lower()}_"
        f"{datetime.now().strftime('%Y%m%d')}.html"
    )

    st.download_button(
        label="⬇️ Baixar Contrato (HTML)",
        data=html_exportavel.encode("utf-8"),
        file_name=nome_arquivo,
        mime="text/html",
    )

with col_info:
    st.info("""
📄 **Como salvar em PDF:**

1. Clique em **Baixar Contrato (HTML)** ao lado
2. Abra o arquivo no navegador
3. Pressione **CTRL + P**
4. Escolha **"Salvar como PDF"**
""")
