async function obtenerUsuarios() {
    try {
        const respuesta = await fetch("https://pokeapi.co/api/v2/");
        // fetch NO rechaza con errores HTTP (404, 500): hay que comprobar ok
        if (!respuesta.ok) {
            throw new Error(`HTTP ${respuesta.status}: ${respuesta.statusText}`);
        }
        const datos = await respuesta.json(); // parsea el cuerpo JSON
        return datos;
    } catch (error) {
        console.error("No se pudieron cargar los usuarios:", error.message);
        return [];
    }
}