
//Variables
let prefecturas = [];
const lista = document.getElementById("lista");
const estado = document.getElementById("estado");
const buscador = document.getElementById("buscador");
const selector = document.getElementById("selector");
const selectorRegion = document.getElementById("selectorRegion");

async function obtenerPrefecturas() {
  try{
    const respuesta = await fetch("https://apis-cloud.net/prefectures/all");

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
    estado.textContent = "No se pudieron cargar los datos. " + "Comprueba tu conexión e inténtalo de nuevo.";
    console.error(error);
  }
}

obtenerPrefecturas();



//Ordenar por numero, alfabeticamente, población, tamaño, region
//Dar la opcion de poner los nombres en japones o en romanji, pero con el kana siempre debajo
//Filtrar por región 



function mostrarPrefecturas(datos) {
  lista.replaceChildren();

  if(datos.length ==47 ){
    estado.textContent = "";
  }else{
    estado.textContent = datos.length + " prefectura(s) encontrada(s)";
  }

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
  const texto = buscador.value.trim().toLocaleLowerCase();

  const filtradas = prefecturas.filter(p => [p.name, p.kana, p.romaji, p.capital, p.capitalRomaji, p.region].some(valor => String(valor || "").toLocaleLowerCase().includes(texto)));

  mostrarPrefecturas(filtradas);
});

document.getElementById("aleatorio").addEventListener("click", () => {
  if (prefecturas.length === 0) return;

  const indice = Math.floor(Math.random() * prefecturas.length);

  buscador.value = "";
  mostrarPrefecturas([prefecturas[indice]]);
});

 
selector.addEventListener("change", function(){
  let selectedOption = this.selectedIndex;
  ordenar(selectedOption);
});

function ordenar(selectedOption){

  let ordenadas;

  switch(selectedOption){
    case 0:
      console.log("Por ID");
      ordenadas = prefecturas;
      break;
    case 1:
      ordenadas = prefecturas.toSorted((a,b) => b.population - a.population);
      break;
    case 2:
      ordenadas = prefecturas.toSorted((a,b) => a.population - b.population);
      break;
    case 3:
      ordenadas = prefecturas.toSorted((a,b) => b.area - a.area);
      break;
    case 4:
      ordenadas = prefecturas.toSorted((a,b) => a.area - b.area);
      break;
    default:
      break;
  }

  mostrarPrefecturas(ordenadas);
}

selectorRegion.addEventListener("change", function(){
  var selectedOption = this.options[this.selectedIndex];
  console.log("Option selected: " + selectedOption.value);

  let filtradas;
  if(selectedOption.value == "Todas"){
    filtradas = prefecturas;
  }else{
    filtradas = prefecturas.filter(p => convertirKanji(p.region) == selectedOption.value);
  }

  mostrarPrefecturas(filtradas);
});




function convertirKanji(kanji){

  switch(kanji){
    case "北海道":
      return "Hokkaido";
    case "東北":
      return "Tohoku";
    case "関東":
      return "Kansai";
    case "中部":
      return "Chubu";
    case "近畿":
      return "Kansai";
    case "中国":
      return "Chugoku";
    case "四国":
      return "Shikoku";
    case "九州":
      return "Kyushu";
    case "沖縄":
      return "Okinawa";
  }
}