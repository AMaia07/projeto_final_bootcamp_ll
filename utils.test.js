const { calcularMedia, validarNota, normalizarBusca, filtrarPorTitulo, validarApelido } = require("./utils");

describe("calcularMedia", () => {
    test("retorna 0 para lista vazia", () => {
        expect(calcularMedia([])).toBe(0);
    });

    test("calcula a media de varias notas", () => {
        expect(calcularMedia([8, 9, 10])).toBe(9);
    });

    test("arredonda para uma casa decimal", () => {
        expect(calcularMedia([7, 8])).toBe(7.5);
        expect(calcularMedia([10, 9, 9])).toBe(9.3);
    });
});

describe("validarNota", () => {
    test("aceita inteiros de 1 a 10", () => {
        expect(validarNota(1)).toBe(true);
        expect(validarNota(10)).toBe(true);
    });

    test("rejeita valores fora do intervalo ou nao inteiros", () => {
        expect(validarNota(0)).toBe(false);
        expect(validarNota(11)).toBe(false);
        expect(validarNota(7.5)).toBe(false);
    });
});

describe("normalizarBusca", () => {
    test("remove espacos e converte para minusculas", () => {
        expect(normalizarBusca("  Dota 2 ")).toBe("dota 2");
    });

    test("trata entrada nula como texto vazio", () => {
        expect(normalizarBusca(null)).toBe("");
    });
});

describe("filtrarPorTitulo", () => {
    const jogos = [{ title: "Overwatch" }, { title: "Dota 2" }, { title: "Warframe" }];

    test("filtra ignorando maiusculas e minusculas", () => {
        expect(filtrarPorTitulo(jogos, "WAR")).toEqual([{ title: "Warframe" }]);
    });

    test("termo vazio devolve a lista inteira", () => {
        expect(filtrarPorTitulo(jogos, "  ")).toHaveLength(3);
    });
});

describe("validarApelido", () => {
    test("aceita apelido entre 2 e 20 caracteres", () => {
        expect(validarApelido("Artur")).toBe(true);
        expect(validarApelido("  Jo  ")).toBe(true);
    });

    test("rejeita apelido vazio, curto demais ou longo demais", () => {
        expect(validarApelido("")).toBe(false);
        expect(validarApelido("A")).toBe(false);
        expect(validarApelido("a".repeat(21))).toBe(false);
        expect(validarApelido(null)).toBe(false);
    });
});