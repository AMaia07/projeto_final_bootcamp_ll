// Base do projeto: carrega a lista de jogos da FreeToGame uma unica vez.
// A API nao tem busca por titulo, entao a filtragem e feita aqui (filtrarPorTitulo, em utils.js).
// Cada frente do time implementa a sua parte a partir daqui.

const URL_API = "https://www.freetogame.com/api/games";

const campoBusca = document.getElementById("campo-busca");
const botaoBuscar = document.getElementById("botao-buscar");
const areaStatus = document.getElementById("status");

let todosOsJogos = [];

async function carregarJogos() {
    try {
        const resposta = await fetch(URL_API);
        if (!resposta.ok) throw new Error("falha-api");
        todosOsJogos = await resposta.json();
        areaStatus.textContent = `${todosOsJogos.length} jogos carregados. Digite um título para buscar.`;
    } catch (erro) {
        areaStatus.textContent = "Não foi possível carregar os jogos agora. Tente novamente em instantes.";
    }
}

function renderizarResultados(jogos) {
    const area = document.getElementById("resultados");

    if (jogos.length === 0) {
        area.innerHTML = "<p>Nenhum jogo encontrado. Tente outro título.</p>";
        return;
    }

    // Mostra no máximo 20 resultados para não pesar a página
    area.innerHTML = jogos.slice(0, 20).map((jogo) => `
        <article class="cartao">
            <img src="${jogo.thumbnail}" alt="Capa de ${jogo.title}">
            <h3>${jogo.title}</h3>
            <p>${jogo.genre} · ${jogo.platform}</p>
            <button class="btn-favoritar" data-id="${jogo.id}">♥ Favoritar</button>
        </article>
    `).join("");
}

function dispararBusca() {
    if (todosOsJogos.length === 0) {
        areaStatus.textContent = "Os jogos ainda não foram carregados. Aguarde um instante.";
        return;
    }

    const termo = campoBusca.value;
    if (!normalizarBusca(termo)) {
        areaStatus.textContent = "Digite um título para buscar.";
        return;
    }

    const encontrados = filtrarPorTitulo(todosOsJogos, termo);
    areaStatus.textContent = `${encontrados.length} jogo(s) encontrado(s).`;
    renderizarResultados(encontrados);
}

botaoBuscar.addEventListener("click", dispararBusca);
campoBusca.addEventListener("keydown", (e) => {
    if (e.key === "Enter") dispararBusca();
});

// TODO (frente de catalogo e banco): adicionar jogo ao catalogo, listar e excluir (Supabase)
// TODO (frente de notas): formulario de nota/comentario e media por jogo (calcularMedia, validarNota)

carregarJogos();