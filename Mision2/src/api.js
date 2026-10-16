const API_URL = "https://apis-cloud.net/prefectures/all";

export async function obtenerPrefecturas() {
    const respuesta = await fetch(API_URL);

    if (!respuesta.ok) {
        throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    const datos = await respuesta.json();

    const prefecturas = Array.isArray(datos)
        ? datos
        : datos?.data;

    if (!Array.isArray(prefecturas)) {
        throw new Error("El formato de la respuesta no es válido.");
    }

    return prefecturas;
}