const createError = require('http-errors');
const debug = require("debug")("app:module-users-controller");

const { UsersService } = require("./services");
const { Response } = require('../common/response');

module.exports.UsersController = {
    getUsers: async (req,res) => {
        try {
            let users = await UsersService.getAll();
            Response.success(res, 200, "Lista de usuarios", users);
        } catch (error) {
            debug(error);
            Response.error(res);
        }
    },
    getUser: async (req,res) => {
        try {
            const {
                params: {id},
            } = req;
            let user = await UsersService.getById(id);
            if(!user){
                Response.error(res, new createError.NotFound());
            } else {
                Response.success(res, 200, `User ${id}`, user);
            }
        } catch (error) {
            debug(error);
            Response.error(res);
        }
    },
    createUser: async (req,res) => {
        try {
            const {body} = req;
            if (!body || Object.keys(body).length == 0){
                Response.error(res, new createError.BadRequest())
            } else {
                const insertedId = await UsersService.create(body);
                Response.success(res, 201, "Usuario agregado", insertedId);
            }
        } catch (error) {
            debug(error);
            Response.error(res);
        }
    },


    updateUser : async (req, res) => {
        const { id } = req.params;
        const updatedUser = await UsersService.updateUser(id, req.body);
        if (!updatedUser) return res.status(404).json({ message: "user not found" });
        res.status(200).json(updatedUser);
      },
      
       deleteUser : async (req, res) => {
        const { id } = req.params;
        const deletedUser = await UsersService.deleteUser(id);
        if (!deletedUser) return res.status(404).json({ message: "user not found" });
        res.status(200).json({ message: "user deleted successfully" });
      },

    
};