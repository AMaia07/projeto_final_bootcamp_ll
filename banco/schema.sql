-- Rodar no SQL Editor do Supabase (uma unica vez, por quem criar o projeto do grupo).

create table jogos (
    id bigint generated always as identity primary key,
    api_id integer not null unique,          -- id do jogo na FreeToGame
    titulo text not null,
    imagem text,
    genero text,
    created_at timestamptz not null default now()
);

create table avaliacoes (
    id bigint generated always as identity primary key,
    jogo_id bigint not null references jogos(id) on delete cascade,
    usuario text not null,                   -- apelido (sem login nesta etapa)
    nota integer not null check (nota between 1 and 10),
    comentario text,
    created_at timestamptz not null default now()
);

create table favoritos (
    id bigint generated always as identity primary key,
    jogo_id bigint not null references jogos(id) on delete cascade,
    usuario text not null,
    created_at timestamptz not null default now(),
    unique (jogo_id, usuario)                -- nao favoritar duas vezes
);

-- Politicas abertas para o papel anon (limitacao conhecida: registrar no README).
alter table jogos enable row level security;
alter table avaliacoes enable row level security;
alter table favoritos enable row level security;

create policy "jogos_select" on jogos for select to anon using (true);
create policy "jogos_insert" on jogos for insert to anon with check (true);
create policy "jogos_delete" on jogos for delete to anon using (true);

create policy "avaliacoes_select" on avaliacoes for select to anon using (true);
create policy "avaliacoes_insert" on avaliacoes for insert to anon with check (true);
create policy "avaliacoes_delete" on avaliacoes for delete to anon using (true);

create policy "favoritos_select" on favoritos for select to anon using (true);
create policy "favoritos_insert" on favoritos for insert to anon with check (true);
create policy "favoritos_delete" on favoritos for delete to anon using (true);
