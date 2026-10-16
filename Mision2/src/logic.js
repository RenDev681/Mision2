
export const REGIONES = {
    "北海道": "Hokkaido",
    "東北": "Tohoku",
    "関東": "Kanto",
    "中部": "Chubu",
    "近畿": "Kansai",
    "中国": "Chugoku",
    "四国": "Shikoku",
    "九州": "Kyushu",
    "沖縄": "Okinawa"
};

export function nombreRegion(region) {
    return REGIONES[region] ?? region ?? "Región desconocida";
}

function numeroValido(valor) {
    if (valor === null || valor === undefined || valor === "") {
        return null;
    }

    const numero = Number(valor);

    return Number.isFinite(numero) && numero >= 0
        ? numero
        : null;
}

// Normaliza los datos antes de mostrarlos.
export function normalizarPrefecturas(datos) {
    return datos
        .filter(p => p && typeof p === "object")
        .map((p, indice) => ({
            ...p,
            id: p.id ?? p.code ?? indice + 1,
            name: String(p.name ?? ""),
            romaji: String(p.romaji ?? p.name ?? "Nombre desconocido"),
            kana: String(p.kana ?? ""),
            capital: p.capital ?? "",
            capitalRomaji: p.capitalRomaji ?? "",
            region: p.region ?? "",
            population: numeroValido(p.population),
            area: numeroValido(p.area)
        }));
}

// Filtra por búsqueda y región y aplica el orden seleccionado.
export function filtrarYOrdenar(prefecturas, estado) {
    const texto = estado.busqueda.trim().toLocaleLowerCase("es");

    const filtradas = prefecturas.filter(p => {
        const campos = [
            p.name,
            p.kana,
            p.romaji,
            p.capital,
            p.capitalRomaji,
            p.region,
            nombreRegion(p.region)
        ];

        const coincideTexto = !texto || campos.some(valor =>
            String(valor ?? "")
                .toLocaleLowerCase("es")
                .includes(texto)
        );

        const coincideRegion =
            estado.region === "Todas" ||
            nombreRegion(p.region) === estado.region;

        return coincideTexto && coincideRegion;
    });

    const comparadores = {
        poblacionDesc: (a, b) =>
            compararNumeros(b.population, a.population),

        poblacionAsc: (a, b) =>
            compararNumeros(a.population, b.population),

        areaDesc: (a, b) =>
            compararNumeros(b.area, a.area),

        areaAsc: (a, b) =>
            compararNumeros(a.area, b.area)
    };

    const comparador = comparadores[estado.orden];

    if (comparador) {
        return filtradas.toSorted(comparador);
    }

    return filtradas.toSorted((a, b) => {
        const idA = Number(a.id);
        const idB = Number(b.id);

        return idA - idB;
    });
}


function compararNumeros(a, b) {
    if (a === null && b === null) return 0;
    if (a === null) return 1;
    if (b === null) return -1;

    return a - b;
}
