const express = require('express');
const { SalesController } = require("./controller");

const router = express.Router();

module.exports.SalesAPI = (app) => {
    router
    .get("/", SalesController.getSales) // http://localhost:3000/api/sales/
    .get("/:id", SalesController.getSale) // http://localhost:3000/api/sales/12345
    .post("/create", SalesController.createSale); // http://localhost:3000/api/sales/create

    app.use("/api/sales", router);
};
//router.get('/', salesController.getSales);