require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { serverLog } = require("./src/serveLog.middleware");
const { getJoyas, getJoyasFilter } = require("./src/utils/consult.js");
const app = express();

const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(serverLog); 

// Rutas
app.get("/", (_, res) => {
    res.status(200).send("API Joyas");
});

app.get("/joyas", async (req, res) => {
    try {
        const { limits, orderBy, page } = req.query;
        const joyas = await getJoyas({ limits, orderBy, page });
        res.status(200).json(joyas);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get("/joyas/filtros", async (req, res) => {
    try {
        const { limits, orderBy, page, stockMin, stockMax, categoria, metal } = req.query;
        const joyas = await getJoyasFilter({ limits, orderBy, page, stockMin, stockMax, categoria, metal });
        res.status(200).json(joyas);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.all("*", (_, res) => {
    res.status(404).send("La página no existe");
});

// Iniciar servidor
app.listen(port, () => console.log(`Escuchando en el puerto ${port}`));
