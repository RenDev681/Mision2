import "./style.css";

import { obtenerPrefecturas } from "./api.js";

import {
    normalizarPrefecturas,
    filtrarYOrdenar
} from "./logic.js";

import {
    renderEstado,
    renderPrefecturas
} from "./render.js";

const buscador = document.querySelector("#buscador");
const selector = document.querySelector("#selector");
const selectorRegion = document.querySelector("#selectorRegion");
const botonModo = document.querySelector("#modo");
const botonAleatorio = document.querySelector("#aleatorio");
const botonReintentar = document.querySelector("#reintentar");

let prefecturas = [];

const estado = {
    busqueda: "",
    region: "Todas",
    orden: "id",
    enJapones: false,
    idAleatorio: null
};

// Aplica todos los controles usando el mismo estado.
function actualizarVista() {
    let resultados = filtrarYOrdenar(prefecturas, estado);

    if (estado.idAleatorio !== null) {
        resultados = resultados.filter(
            p => String(p.id) === String(estado.idAleatorio)
        );
    }

    renderPrefecturas(resultados, estado.enJapones);
}

// Al cambiar los filtros, dejamos de mostrar el resultado aleatorio.
function limpiarAleatorio() {
    estado.idAleatorio = null;
}

// Carga los datos desde la API.
async function cargarPrefecturas() {
    botonReintentar.hidden = true;
    renderEstado("Cargando prefecturas…", "cargando");

    document.querySelector("#lista").replaceChildren();

    try {
        const datos = await obtenerPrefecturas();

        prefecturas = normalizarPrefecturas(datos);

        if (prefecturas.length === 0) {
            renderEstado("La API no ha devuelto prefecturas.");

            const mensaje = document.createElement("p");
            mensaje.className = "vacio";
            mensaje.textContent = "No hay datos para mostrar.";

            document.querySelector("#lista").append(mensaje);

            return;
        }

        actualizarVista();
    } catch {
        renderEstado(
            "No se pudieron cargar los datos. Comprueba tu conexión e inténtalo de nuevo.",
            "error"
        );

        botonReintentar.hidden = false;
    } finally {
        document.querySelector("#estado")
            .classList.remove("cargando");
    }
}

// Búsqueda.
buscador.addEventListener("input", () => {
    estado.busqueda = buscador.value;
    limpiarAleatorio();
    actualizarVista();
});

// Orden.
selector.addEventListener("change", () => {
    estado.orden = selector.value;
    limpiarAleatorio();
    actualizarVista();
});

// Región.
selectorRegion.addEventListener("change", () => {
    estado.region = selectorRegion.value;
    limpiarAleatorio();
    actualizarVista();
});

// Japonés o romaji.
botonModo.addEventListener("click", () => {
    estado.enJapones = !estado.enJapones;
    actualizarVista();
});

// Elige una prefectura al azar entre los resultados filtrados.
botonAleatorio.addEventListener("click", () => {
    const candidatos = filtrarYOrdenar(prefecturas, estado);

    if (candidatos.length === 0) {
        return;
    }

    const indice = Math.floor(Math.random() * candidatos.length);
    estado.idAleatorio = candidatos[indice].id;

    actualizarVista();
});

// Reintenta la petición a la API.
botonReintentar.addEventListener("click", cargarPrefecturas);

// Inicio de la aplicación.
cargarPrefecturas();
