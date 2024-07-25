const { pool } = require("../db/config");
const format = require('pg-format');

const prepararHATEOAS = (arreglo) => {
    let totalStock = 0;
    const results = arreglo.map((objeto) => {
        totalStock += +objeto.stock;
        return {
            name: objeto.nombre,
            href: `http://localhost:3000/joyas/joya/${objeto.id}`,
        };
    });

    return {
        total: arreglo.length,
        totalStock, // Incluimos el totalStock calculado
        results
    };
};

const getJoyas = async ({ limits = 5, orderBy = "precio_DESC", page = 1 }) => {
    try {
        let query = "SELECT * FROM joyas";
        const [column, sort] = orderBy.split("_");
        const offset = (page > 0 ? page - 1 : 0) * limits;
        const formattedQuery = format(`${query} ORDER BY %s %s LIMIT %s OFFSET %s;`, column, sort, limits, offset);
        const { rows } = await pool.query(formattedQuery);
        return prepararHATEOAS(rows);
    } catch (error) {
        console.error("Error al obtener joyas:", error.message);
        throw new Error("Error al obtener joyas");
    }
};

const getJoyasFilter = async ({ limits = 5, orderBy = "precio_DESC", page = 1, stockMin, stockMax, categoria, metal }) => {
    try {
        let query = "SELECT * FROM joyas";
        const filtros = [];
        const values = [];

        if (stockMin) {
            values.push(stockMin);
            filtros.push(`stock >= $${values.length}`);
        }

        if (stockMax) {
            values.push(stockMax);
            filtros.push(`stock <= $${values.length}`);
        }

        if (categoria) {
            values.push(categoria);
            filtros.push(`categoria = $${values.length}`);
        }

        if (metal) {
            values.push(metal);
            filtros.push(`metal = $${values.length}`);
        }

        if (filtros.length > 0) {
            query += ` WHERE ${filtros.join(" AND ")}`;
        }

        const [column, sort] = orderBy.split("_");
        const offset = (page > 0 ? page - 1 : 0) * limits;
        const formattedQuery = format(`${query} ORDER BY %s %s LIMIT %s OFFSET %s;`, column, sort, limits, offset);
        const { rows } = await pool.query(formattedQuery, values);
        return prepararHATEOAS(rows);
    } catch (error) {
        console.error("Error al obtener joyas:", error.message);
        throw new Error("Error al obtener joyas");
    }
};

module.exports = { getJoyas, getJoyasFilter };

