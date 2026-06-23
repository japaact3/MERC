const areaProdutos = document.getElementById("produtos");
const pesquisa = document.getElementById("pesquisa");

const carrinhoEl = document.getElementById("carrinho");
const overlay = document.getElementById("overlay");

const abrirCarrinho = document.getElementById("abrirCarrinho");
const fecharCarrinho = document.getElementById("fecharCarrinho");

const itensCarrinho = document.getElementById("itensCarrinho");
const totalCarrinho = document.getElementById("totalCarrinho");
const contadorCarrinho = document.getElementById("contadorCarrinho");

const limparCarrinho = document.getElementById("limparCarrinho");
const finalizarPedido = document.getElementById("finalizarPedido");

let carrinho =
JSON.parse(localStorage.getItem("carrinho")) || [];

let categoriaAtual = "Todos";





/*            NOTIFICAÇÕES      */



function mostrarToast(mensagem, tipo = "info"){

    const container =
    document.getElementById("toast-container");

    const toast =
    document.createElement("div");

    toast.classList.add("toast", tipo);

    let icon = "";

    if(tipo === "sucesso"){
        icon = "✔";
    }

    if(tipo === "erro"){
        icon = "⚠";
    }

    if(tipo === "info"){
        icon = "🛒";
    }

    toast.innerHTML = `
        <span class="icon">${icon}</span>
        <span>${mensagem}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}









/* ==========================
   PRODUTOS
========================== */

function renderizarProdutos(lista) {

    areaProdutos.innerHTML = "";

    lista.forEach(produto => {

        areaProdutos.innerHTML += `
        
        <div class="card">

            <img src="${produto.imagem}" alt="${produto.nome}">

            <div class="info">

                <h3>${produto.nome}</h3>

                <div class="preco">
                    R$ ${produto.preco.toFixed(2)}
                </div>

                <button onclick="adicionarCarrinho(${produto.id})">
                    Adicionar
                </button>

            </div>

        </div>

        `;
    });

}

/* ==========================
   CARRINHO
========================== */

function adicionarCarrinho(id){

    let produto = produtos.find(p => p.id === id);

    let itemExistente =
    carrinho.find(item => item.id === id);

    if(itemExistente){

        itemExistente.quantidade++;

    }else{

        carrinho.push({
            ...produto,
            quantidade:1
        });

    }

    salvarCarrinho();

    mostrarToast("Produto adicionado ao carrinho!", "sucesso");
}

function aumentarQuantidade(id){

    let item =
    carrinho.find(item => item.id === id);

    item.quantidade++;

    salvarCarrinho();
}

function diminuirQuantidade(id){

    let item =
    carrinho.find(item => item.id === id);

    item.quantidade--;

    if(item.quantidade <= 0){

        carrinho =
        carrinho.filter(item => item.id !== id);

    }

    salvarCarrinho();
}

function salvarCarrinho(){

    localStorage.setItem(
        "carrinho",
        JSON.stringify(carrinho)
    );

    atualizarCarrinho();
}

function atualizarCarrinho(){

    itensCarrinho.innerHTML = "";

    let total = 0;
    let quantidadeTotal = 0;

    carrinho.forEach(item => {

        total += item.preco * item.quantidade;

        quantidadeTotal += item.quantidade;

        itensCarrinho.innerHTML += `
        
        <div class="item-carrinho">

            <div class="item-info">

                <h4>${item.nome}</h4>

                <p>
                    R$ ${item.preco.toFixed(2)}
                </p>

            </div>

            <div class="controles">

                <button onclick="diminuirQuantidade(${item.id})">
                    -
                </button>

                <button>
                    ${item.quantidade}
                </button>

                <button onclick="aumentarQuantidade(${item.id})">
                    +
                </button>

            </div>

        </div>

        `;
    });

    totalCarrinho.textContent =
    total.toFixed(2);

    contadorCarrinho.textContent =
    quantidadeTotal;
}

/* ==========================
   FILTROS
========================== */

document
.querySelectorAll(".categoria")
.forEach(botao => {

    botao.addEventListener("click", () => {

        document
        .querySelectorAll(".categoria")
        .forEach(btn =>
            btn.classList.remove("ativa")
        );

        botao.classList.add("ativa");

        categoriaAtual =
        botao.dataset.categoria;

        aplicarFiltros();
    });

});

function aplicarFiltros(){

    let termo =
    pesquisa.value.toLowerCase();

    let lista = produtos.filter(produto => {

        let categoriaOk =
        categoriaAtual === "Todos" ||
        produto.categoria === categoriaAtual;

        let pesquisaOk =
        produto.nome
        .toLowerCase()
        .includes(termo);

        return categoriaOk && pesquisaOk;

    });

    renderizarProdutos(lista);
}

/* ==========================
   PESQUISA
========================== */

pesquisa.addEventListener("input", () => {

    aplicarFiltros();

});

/* ==========================
   CARRINHO ABRIR/FECHAR
========================== */

abrirCarrinho.addEventListener("click", () => {

    carrinhoEl.classList.add("aberto");

    overlay.classList.add("ativo");

    document.body.style.overflow = "hidden";

});

function fecharMenu(){

    carrinhoEl.classList.remove("aberto");

    overlay.classList.remove("ativo");

    document.body.style.overflow = "auto";

}

fecharCarrinho.addEventListener(
    "click",
    fecharMenu
);

overlay.addEventListener(
    "click",
    fecharMenu
);

/* ==========================
   LIMPAR CARRINHO
========================== */

limparCarrinho.addEventListener("click", () => {

    if(carrinho.length === 0){

        mostrarToast("Nenhum item no Carrinho!", "erro");
    }else{

        carrinho = [];

        salvarCarrinho();

        mostrarToast("Carrinho limpo!", "erro");

    }    

});

/* ==========================
   WHATSAPP
========================== */

finalizarPedido.addEventListener("click", () => {

    if(carrinho.length === 0){

        mostrarToast("Carrinho Vazio!", "erro");

        return;
    }

    let mensagem =
    "🛒 *NOVO PEDIDO*%0A%0A";

    let total = 0;

    carrinho.forEach(item => {

        let subtotal =
        item.preco * item.quantidade;

        total += subtotal;

        mensagem +=
        `${item.quantidade}x ${item.nome}%0A`;

        mensagem +=
        `R$ ${subtotal.toFixed(2)}%0A%0A`;

    });

    mensagem +=
    `💰 *TOTAL: R$ ${total.toFixed(2)}*`;

    let numero =
    "5579988342388";

    window.open(
        `https://wa.me/${numero}?text=${mensagem}`,
        "_blank"
    );

    mostrarToast("Pedido enviado pelo WhatsApp!", "sucesso");

});

/* ==========================
   INICIAR
========================== */

renderizarProdutos(produtos);

atualizarCarrinho();



/*      ROTAÇÃO DO BANNER       */



const slides = document.querySelectorAll(".banner-slide");
const dotsContainer = document.querySelector(".banner-dots");

let slideAtual = 0;

/* criar bolinhas */
slides.forEach((_, i) => {

    const dot = document.createElement("span");

    if(i === 0) dot.classList.add("ativo");

    dot.addEventListener("click", () => {
        irParaSlide(i);
    });

    dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll(".banner-dots span");

function atualizarBanner(){

    slides.forEach((slide, i) => {

        slide.classList.remove("ativo");
        dots[i].classList.remove("ativo");

        if(i === slideAtual){
            slide.classList.add("ativo");
            dots[i].classList.add("ativo");
        }

    });

}

function irParaSlide(index){
    slideAtual = index;
    atualizarBanner();
}

function proximoSlide(){

    slideAtual++;

    if(slideAtual >= slides.length){
        slideAtual = 0;
    }

    atualizarBanner();
}

function slideAnterior(){

    slideAtual--;

    if(slideAtual < 0){
        slideAtual = slides.length - 1;
    }

    atualizarBanner();
}

/* botões */
document.querySelector(".next")
.addEventListener("click", proximoSlide);

document.querySelector(".prev")
.addEventListener("click", slideAnterior);

/* auto play */
setInterval(proximoSlide, 4000);

/* inicial */
atualizarBanner();

const bannerBg = document.querySelector(".banner-bg");

window.addEventListener("scroll", () => {

    let scrollY = window.scrollY;

    // efeito leve (ajuste 0.3 se quiser mais forte)
    bannerBg.style.transform =
    `translateY(${scrollY * 0.3}px)`;

});