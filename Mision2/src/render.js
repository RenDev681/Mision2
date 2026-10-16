
import { nombreRegion } from "./logic.js";

function formatoNumero(valor) {
    return valor === null || valor === undefined
        ? "—"
        : Number(valor).toLocaleString("es-ES");
}

export function renderEstado(mensaje, tipo = "") {
    const estado = document.querySelector("#estado");

    estado.textContent = mensaje;
    estado.className = tipo;
}

export function renderPrefecturas(datos, enJapones = false) {
    const lista = document.querySelector("#lista");
    const botonModo = document.querySelector("#modo");

    lista.replaceChildren();

    botonModo.textContent = enJapones
        ? "Cambiar a Romaji"
        : "Cambiar a Japonés";

    if (datos.length === 0) {
        const mensaje = document.createElement("p");

        mensaje.className = "vacio";
        mensaje.textContent =
            "No hay prefecturas que coincidan con la búsqueda.";

        lista.append(mensaje);
        renderEstado("Prueba con otra búsqueda o cambia la región.");

        return;
    }
    if(datos.length==47){
        renderEstado("");
    }else{
        renderEstado(`${datos.length} prefectura(s) encontrada(s)`);
    }

    datos.forEach(p => {
        const tarjeta = document.createElement("article");
        tarjeta.className = "casilla";

        const titulo = document.createElement("h2");
        titulo.className = "japones";
        titulo.textContent = enJapones
            ? (p.name || p.romaji)
            : p.romaji;

        const kana = document.createElement("p");
        kana.className = "kana";
        kana.textContent = p.kana || "Lectura no disponible";

        const detalle = document.createElement("p");
        detalle.className = "detalle";

        detalle.textContent = [
            `Capital: ${p.capitalRomaji || p.capital || "—"}`,
            `Región: ${enJapones
                ? (p.region || "不明")
                : nombreRegion(p.region)}`,
            `Superficie: ${p.area === null
                ? "—"
                : `${formatoNumero(p.area)} km²`}`,
            `Población: ${formatoNumero(p.population)}`
        ].join("\n");

        if (p.kana) {
            const imagen = new Image();

            imagen.onload = () => {
                tarjeta.style.backgroundImage =
                    `linear-gradient(to bottom, ` +
                    `rgba(0,0,0,.08), rgba(0,0,0,.88)), ` +
                    `url("${imagen.src}")`;
            };

            imagen.onerror = () => {
                tarjeta.classList.add("sin-imagen");
                tarjeta.style.backgroundImage = "";
            };

            imagen.src =
                `/src/assets/backgrounds/${encodeURIComponent(p.kana)}.jpg`;
        } else {
            tarjeta.classList.add("sin-imagen");
        }

        tarjeta.append(titulo, kana, detalle);
        lista.append(tarjeta);
    });
}
