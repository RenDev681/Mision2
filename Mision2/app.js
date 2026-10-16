require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/prefectures", async (req, res) => {
  try {
    const respuesta = await fetch(
      "https://api.nihonbase.com/v1/prefectures",
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`
        }
      }
    );

    const texto = await respuesta.text();
    console.log("URL:", respuesta.url);
    console.log("Estado:", respuesta.status);
    console.log("Tipo:", respuesta.headers.get("content-type"));
    console.log("Respuesta:", texto.slice(0, 300)); 
    if (!respuesta.ok) {
      console.error("Error de Nihonbase:", respuesta.status, texto);
      return res.status(respuesta.status).json({
        error: "Nihonbase ha rechazado la petición"
      });
    }

    res.type("application/json").send(texto);
  } catch (error) {
    console.error(error.message);
    res.status(502).json({
      error: "No se pudo conectar con Nihonbase"
    });
  }
});

app.listen(5173, () => {
  console.log("Servidor iniciado en http://localhost:5173");
});