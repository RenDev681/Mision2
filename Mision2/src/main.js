
//Variables
let prefecturas = [];
const lista = document.getElementById("lista");
const estado = document.getElementById("estado");
const buscador = document.getElementById("buscador");



async function obtenerPrefecturas() {
  try{
  const respuesta = await fetch(
    "https://apis-cloud.net/prefectures/all"
  );

  if (!respuesta.ok) {
    throw new Error("Error al consultar la API");
  }

  const datos = await respuesta.json();
  // Admite una lista directa o una lista dentro de data.
  prefecturas = Array.isArray(datos)
    ? datos
    : datos.data;
if (!Array.isArray(prefecturas)) {
          throw new Error("Formato de respuesta inesperado");
        }

        mostrarPrefecturas(prefecturas);
}catch (error){
  estado.textContent =
          "No se pudieron cargar los datos. " +
          "Comprueba tu conexión e inténtalo de nuevo.";
        console.error(error);
}
}

obtenerPrefecturas();



//Hacer buscador
//Ordenar por numero, alfabeticamente, población, tamaño, region
//Dar la opcion de poner los nombres en japones o en romanji, pero con el kana siempre debajo
//Filtrar por región 



    function mostrarPrefecturas(datos) {
      lista.replaceChildren();

      estado.textContent =
        datos.length + " prefectura(s) encontrada(s)";

      datos.forEach(p => {
        const casilla = document.createElement("article");
        casilla.className = "casilla";

        const nombre = document.createElement("h2");
        nombre.className = "japones";
        nombre.textContent = p.name;

        const romanizacion = document.createElement("p");
        romanizacion.className = "romaji";
        romanizacion.textContent = p.romaji;

        const detalle = document.createElement("p");
        detalle.className = "detalle";
        detalle.textContent =
          "Capital: " + (p.capitalRomaji || p.capital || "—") +
          "\n Región: " + (p.region || "—") +
          "\n Superficie: " +
          (p.area != null
            ? Number(p.area).toLocaleString("es-ES") + " km²"
            : "—") +
          "\n Población: " +
          (p.population != null
            ? Number(p.population).toLocaleString("es-ES")
            : "—");

        detalle.style.whiteSpace = "pre-line";

        casilla.append(nombre, romanizacion, detalle);
        lista.appendChild(casilla);
      });
    }

    buscador.addEventListener("input", () => {
      const texto = buscador.value
        .trim()
        .toLocaleLowerCase();

      const filtradas = prefecturas.filter(p =>
        [
          p.name,
          p.kana,
          p.romaji,
          p.capital,
          p.capitalRomaji,
          p.region
        ].some(valor =>
          String(valor || "")
            .toLocaleLowerCase()
            .includes(texto)
        )
      );

      mostrarPrefecturas(filtradas);
    });

    document
      .getElementById("aleatoria")
      .addEventListener("click", () => {
        if (prefecturas.length === 0) return;

        const indice = Math.floor(
          Math.random() * prefecturas.length
        );

        buscador.value = "";
        mostrarPrefecturas([prefecturas[indice]]);
      });

    cargarPrefecturas();