import streamlit as st
from jinja2 import Template
from datetime import datetime
import base64

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

    .main {
        background-color: #f8fafc;
    }

    .block-container {
        padding-top: 2rem;
    }

    h1, h2, h3 {
        color: #0f172a;
    }

    .stButton button {
        background: linear-gradient(90deg,#0f172a,#1e293b);
        color: white;
        border: none;
        border-radius: 12px;
        height: 52px;
        font-weight: 600;
        font-size: 16px;
    }

    .stDownloadButton button {
        background: linear-gradient(90deg,#065f46,#047857);
        color: white;
        border: none;
        border-radius: 12px;
        height: 52px;
        font-weight: 600;
        font-size: 16px;
    }

</style>
""", unsafe_allow_html=True)

# =====================================================
# FUNÇÕES
# =====================================================

def image_to_base64(image_file):

    if image_file is None:
        return None

    return base64.b64encode(image_file.read()).decode()


def carregar_css():

    with open("assets/style.css", "r", encoding="utf-8") as f:
        return f.read()


def carregar_template():

    with open("assets/templates/contrato.html", "r", encoding="utf-8") as f:
        return f.read()


def gerar_html(dados):

    template = Template(carregar_template())

    return template.render(**dados)
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
    "Enviar logo PNG",
    type=["png", "jpg", "jpeg"]
)

# =====================================================
# TELA PRINCIPAL
# =====================================================

st.title("📄 Gerador Premium de Contratos")

st.caption("""
Crie contratos empresariais modernos com identidade visual profissional.
""")

col1, col2 = st.columns([1,1])

# =====================================================
# FORMULÁRIO
# =====================================================

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
        "Representante Legal",
        value="Wellington Rafael Nascimento de Sá"
    )

    cliente_endereco = st.text_input(
        "Endereço",
        value="Campo Grande - MS"
    )

    st.divider()

    st.subheader("🎯 Escopo")

    escopo = st.text_area(
        "Escopo da parceria",
        height=220,
        value="""
• Engenharia de Dados
• Relatórios financeiros
• Modelagem operacional
• Interface visual
• Estruturação comercial
        """
    )

    st.subheader("💰 Condições")

    condicoes = st.text_area(
        "Condições financeiras",
        height=180,
        value="""
Acordo estratégico sem repasse financeiro direto.

As entregas poderão compor o portfólio técnico
da M e Lopes Assessoria.
        """
    )

# =====================================================
# LOGOS
# =====================================================

with open("assets/logo.png", "rb") as img:
    logo_melopes = base64.b64encode(img.read()).decode()

logo_parceiro = image_to_base64(logo_parceiro_upload)

# =====================================================
# DADOS TEMPLATE
# =====================================================

dados = {
    "style": carregar_css(),

    "logo_melopes":
        f"data:image/png;base64,{logo_melopes}",

    "logo_parceiro":
        f"data:image/png;base64,{logo_parceiro}"
        if logo_parceiro else None,

    "empresa_melopes":
        "M e Lopes Assessoria",

    "cnpj_melopes":
        "66.283.560/0001-09",

    "endereco_melopes":
        "Sidrolândia - MS",

    "cliente_nome":
        cliente_nome,

    "cliente_cnpj":
        cliente_cnpj,

    "cliente_endereco":
        cliente_endereco,

    "cliente_rep":
        cliente_rep,

    "escopo":
        escopo.replace("\n", "<br>"),

    "condicoes":
        condicoes.replace("\n", "<br>"),

    "data":
        datetime.now().strftime("%d/%m/%Y")
}

# =====================================================
# HTML FINAL
# =====================================================

html_final = gerar_html(dados)

# =====================================================
# PREVIEW
# =====================================================

with col2:

    st.subheader("👁️ Preview do Contrato")

    st.components.v1.html(
        html_final,
        height=950,
        scrolling=True
    )

# =====================================================
# BOTÃO PDF
# =====================================================

st.divider()

st.info("""
📄 Para salvar em PDF:

1. Clique dentro do preview
2. Pressione CTRL + P
3. Escolha "Salvar como PDF"
""")

st.components.v1.html(
    f"""
    <div style="padding:20px;text-align:center;">

        <a href="data:text/html;charset=utf-8,{html_final}"
           target="_blank"
           style="
                background:#0f172a;
                color:white;
                padding:14px 24px;
                border-radius:12px;
                text-decoration:none;
                font-weight:600;
           ">

           🚀 Abrir versão para impressão

        </a>

    </div>
    """,
    height=120
)
    st.success("Contrato gerado com sucesso.")

    st.download_button(
        label="📥 Baixar PDF",
        data=pdf,
        file_name=f"Contrato_{cliente_nome}.pdf",
        mime="application/pdf",
        use_container_width=True
    )
