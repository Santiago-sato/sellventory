const express = require('express');

const {UsersController} = require("./controller");

const router = express.Router();

module.exports.UsersAPI = (app) => {
    router
    .get("/", UsersController.getUsers) // http://Localhost:3000/api/products/
    .get("/:id", UsersController.getUser)// http://Localhost:3000/api/products/23
    .post("/", UsersController.createUser)
    .put("/:id", UsersController.updateUser) // Actualizar producto
    .delete("/:id", UsersController.deleteUser); // Eliminar producto

    

    app.use("/api/users", router);
};