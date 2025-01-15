const createError = require('http-errors');
const debug = require("debug")("app:module-sales-controller");

const { SalesService } = require("./services");
const { ProductsService } = require('../products/services');
const { Response } = require('../common/response');
const { ObjectId } = require("mongodb");
const { UsersService } = require('../users/services');

module.exports.SalesController = {
    createSale: async (req, res) => {
        try {
            const { products, userId } = req.body;

            // Verificar si los productos existen y si hay suficiente inventario
            for (const { productId, quantity } of products) {
                const product = await ProductsService.getById(new ObjectId(productId)); 
                if (!product) {
                    return Response.error(res, new createError.NotFound(`Producto con ID ${productId} no encontrado.`));
                }

                // Verificar si hay suficiente inventario
                if (product.cantidad < quantity) {
                    return Response.error(res, new createError.BadRequest(`Cantidad insuficiente para el producto ${productId}.`));
                }
            }

            // Verificar si el usuario existe
            const user = await UsersService.getById(new ObjectId(userId));
            if (!user) {
                return Response.error(res, new createError.NotFound("Usuario no encontrado."));
            }

            // Crear la venta
            const saleId = await SalesService.createSale(products, userId); // Llamada a createSale

            // Actualizar el stock de los productos
            for (const { productId, quantity } of products) {
                const product = await ProductsService.getById(new ObjectId(productId));
                await ProductsService.updateProduct(productId, { cantidad: product.cantidad - quantity }); // Actualizar inventario
            }

            // Incluir el nombre del usuario en la respuesta
            const userName = `${user.nombre} ${user.apellido}`;

            Response.success(res, 201, "Venta realizada exitosamente", { saleId, userName });
        } catch (error) {
            debug(error);
            Response.error(res);
        }
    },

    getSales: async (req, res) => {
        try {
            const sales = await SalesService.getSales();
            
            // Obtener el nombre del usuario para cada venta
            for (const sale of sales) {
                const user = await UsersService.getById(sale.user_id);
                sale.user_name = user ? `${user.nombre} ${user.apellido}` : null; // Agregar el nombre del usuario a la venta
            }

            Response.success(res, 200, "Lista de ventas", sales);
        } catch (error) {
            debug(error);
            Response.error(res);
        }
    },

    getSale: async (req, res) => {
        try {
            const { id } = req.params;
            const sale = await SalesService.getSaleById(id);
            if (!sale) {
                return Response.error(res, new createError.NotFound("Venta no encontrada."));
            }

            // Obtener el nombre del usuario asociado a la venta
            const user = await UsersService.getById(sale.user_id);
            sale.user_name = user ? `${user.nombre} ${user.apellido}` : null; // Agregar el nombre del usuario a la venta

            Response.success(res, 200, `Venta ${id}`, sale);
        } catch (error) {
            debug(error);
            Response.error(res);
        }
    }
};
