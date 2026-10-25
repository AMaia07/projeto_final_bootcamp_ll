// Frente de favoritos: marcar, listar e remover jogos favoritos (Supabase).
// Depende de: supabase-js (CDN), utils.js e script.js (todosOsJogos, areaStatus), carregados antes.

// ======= CONFIGURAÇÃO DO SUPABASE (projeto do grupo) =======
// Troque pelos valores de Project Settings -> API. A chave anon e publica por natureza.
const URL_SUPABASE = "https://elzzkjbatfxuquwlwxqe.supabase.co";
const CHAVE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsenpramJhdGZ4dXF1d2x3eHFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5MzQ1NjUsImV4cCI6MjEwODUxMDU2NX0.b3LI6VJRBD4SC4zeTGVSW2CaTxsX76RYRwgIJE8kunU";
const db = supabase.createClient(URL_SUPABASE, CHAVE_ANON);
// ===========================================================

const campoUsuario = document.getElementById("campo-usuario");
const areaResultados = document.getElementById("resultados");
const listaFavoritos = document.getElementById("lista-favoritos");

// Evita que texto vindo do banco seja interpretado como HTML.
function escaparHtml(texto) {
    const div = document.createElement("div");
    div.textContent = texto ?? "";
    return div.innerHTML;
}

function obterUsuario() {
    return campoUsuario.value.trim();
}

// Garante que o jogo exista na tabela "jogos" e devolve o id dele no banco.
async function garantirJogoNoCatalogo(jogo) {
    const { data: existente, error: erroBusca } = await db
        .from("jogos").select("id").eq("api_id", jogo.id).maybeSingle();
    if (erroBusca) throw erroBusca;
    if (existente) return existente.id;

    const { data, error } = await db
        .from("jogos")
        .insert({ api_id: jogo.id, titulo: jogo.title, imagem: jogo.thumbnail, genero: jogo.genre })
        .select("id").single();

    // 23505 = violacao de unicidade: outra pessoa inseriu o mesmo jogo ao mesmo tempo
    if (error && error.code === "23505") {
        const { data: ja } = await db.from("jogos").select("id").eq("api_id", jogo.id).single();
        return ja.id;
    }
    if (error) throw error;
    return data.id;
}

// CREATE — favorita um jogo para o apelido informado
async function favoritarJogo(jogo) {
    const usuario = obterUsuario();
    if (!validarApelido(usuario)) {
        areaStatus.textContent = "Informe um apelido de 2 a 20 caracteres para favoritar.";
        campoUsuario.focus();
        return;
    }

    try {
        const jogoId = await garantirJogoNoCatalogo(jogo);
        const { error } = await db.from("favoritos").insert({ jogo_id: jogoId, usuario });

        if (error && error.code === "23505") {
            areaStatus.textContent = `${jogo.title} já está nos seus favoritos.`;
            return;
        }
        if (error) throw error;

        areaStatus.textContent = `${jogo.title} foi adicionado aos favoritos.`;
        listarFavoritos();
    } catch (erro) {
        console.error(erro);
        areaStatus.textContent = "Não foi possível favoritar agora. Veja o Console (F12) para detalhes.";
    }
}

// READ — lista os favoritos do apelido informado
async function listarFavoritos() {
    const usuario = obterUsuario();
    if (!validarApelido(usuario)) {
        listaFavoritos.innerHTML = "<p>Informe seu apelido para ver seus favoritos.</p>";
        return;
    }

    const { data, error } = await db
        .from("favoritos")
        .select("id, jogos(titulo, imagem, genero)")
        .eq("usuario", usuario)
        .order("created_at", { ascending: true });

    if (error) {
        console.error(error);
        listaFavoritos.innerHTML = '<div class="erro">Não foi possível carregar seus favoritos agora.</div>';
        return;
    }

    if (data.length === 0) {
        listaFavoritos.innerHTML = "<p>Você ainda não tem favoritos. Busque um jogo e clique em “Favoritar”.</p>";
        return;
    }

    listaFavoritos.innerHTML = data.map((fav) => `
        <article class="cartao">
            <img src="${escaparHtml(fav.jogos.imagem)}" alt="Capa de ${escaparHtml(fav.jogos.titulo)}">
            <h3>${escaparHtml(fav.jogos.titulo)}</h3>
            <p>${escaparHtml(fav.jogos.genero)}</p>
            <button class="btn-desfavoritar" data-id="${fav.id}">Remover dos favoritos</button>
        </article>
    `).join("");
}

// DELETE — remove um favorito
async function desfavoritar(id) {
    const { error } = await db.from("favoritos").delete().eq("id", id);
    if (error) {
        console.error(error);
        areaStatus.textContent = "Não foi possível remover agora. Veja o Console (F12) para detalhes.";
        return;
    }
    listarFavoritos();
}

// ---------- Eventos ----------

// Delegação: os botões são criados dinamicamente, então o listener fica no container pai.
areaResultados.addEventListener("click", (e) => {
    if (!e.target.classList.contains("btn-favoritar")) return;
    const jogo = todosOsJogos.find((j) => j.id === Number(e.target.dataset.id));
    if (jogo) favoritarJogo(jogo);
});

listaFavoritos.addEventListener("click", (e) => {
    if (!e.target.classList.contains("btn-desfavoritar")) return;
    desfavoritar(e.target.dataset.id);
});

// Lembra o apelido neste navegador e recarrega os favoritos ao trocar de usuário.
campoUsuario.value = localStorage.getItem("apelido") || "";
campoUsuario.addEventListener("change", () => {
    localStorage.setItem("apelido", obterUsuario());
    listarFavoritos();
});

listarFavoritos();
