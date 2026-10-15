async function obtenerPrefecturas() {
  const respuesta = await fetch(
    "https://apis-cloud.net/prefectures/all"
  );

  if (!respuesta.ok) {
    throw new Error("Error al consultar la API");
  }

  const datos = await respuesta.json();
  console.log(datos);
}

obtenerPrefecturas();



//Hacer buscador
//Ordenar por numero, alfabeticamente, población, tamaño, region
//Dar la opcion de poner los nombres en japones o en romanji, pero con el kana siempre debajo
//Filtrar por región 