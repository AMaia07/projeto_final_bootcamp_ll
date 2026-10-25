// Funcoes puras do projeto: faceis de testar e reutilizadas pelo script.js.
// No navegador, ficam disponiveis como funcoes globais (utils.js e carregado antes do script.js).
// No Node/Jest, sao exportadas no final do arquivo.

// Media das notas arredondada em 1 casa decimal. Lista vazia retorna 0.
function calcularMedia(notas) {
    if (!Array.isArray(notas) || notas.length === 0) return 0;
    const soma = notas.reduce((acc, n) => acc + n, 0);
    return Math.round((soma / notas.length) * 10) / 10;
}

// Aceita apenas numeros inteiros de 1 a 10.
function validarNota(nota) {
    return Number.isInteger(nota) && nota >= 1 && nota <= 10;
}

// Higieniza o texto digitado na busca.
function normalizarBusca(texto) {
    return String(texto ?? "").trim().toLowerCase();
}

// Filtra a lista da API pelo titulo (a FreeToGame nao tem busca por nome).
function filtrarPorTitulo(jogos, termo) {
    const busca = normalizarBusca(termo);
    if (!busca) return jogos;
    return jogos.filter((jogo) => jogo.title.toLowerCase().includes(busca));
}

// Apelido válido: de 2 a 20 caracteres, sem contar espaços nas pontas.
function validarApelido(apelido) {
    const texto = String(apelido ?? "").trim();
    return texto.length >= 2 && texto.length <= 20;
}

if (typeof module !== "undefined") {
    module.exports = { calcularMedia, validarNota, normalizarBusca, filtrarPorTitulo, validarApelido };
}
