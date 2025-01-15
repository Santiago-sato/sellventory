const createError = require('http-errors');
const debug = require("debug")("app:module-products-controller");

const { ProductsService } = require("./services");
const { Response } = require('../common/response');

module.exports.ProductsController = {
    getProducts: async (req,res) => {
        try {
            let products = await ProductsService.getAll();
            Response.success(res, 200, "Lista de productos", products);
        } catch (error) {
            debug(error);
            Response.error(res);
        }
    },
    getProduct: async (req,res) => {
        try {
            const {
                params: {id},
            } = req;
            let product = await ProductsService.getById(id);
            if(!product){
                Response.error(res, new createError.NotFound());
            } else {
                Response.success(res, 200, `Producto ${id}`, product);
            }
        } catch (error) {
            debug(error);
            Response.error(res);
        }
    },
    createProduct: async (req,res) => {
        try {
            const {body} = req;
            if (!body || Object.keys(body).length == 0){
                Response.error(res, new createError.BadRequest())
            } else {
                const insertedId = await ProductsService.create(body);
                Response.success(res, 201, "Producto agregado", insertedId);
            }
        } catch (error) {
            debug(error);
            Response.error(res);
        }
    },


    updateProduct : async (req, res) => {
        const { id } = req.params;
        const updatedProduct = await ProductsService.updateProduct(id, req.body);
        if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
        res.status(200).json(updatedProduct);
      },
      
       deleteProduct : async (req, res) => {
        const { id } = req.params;
        const deletedProduct = await ProductsService.deleteProduct(id);
        if (!deletedProduct) return res.status(404).json({ message: "Product not found" });
        res.status(200).json({ message: "Product deleted successfully" });
      },

    generateReport: async (req, res) => {
        try {
            let products = await ProductsService.getAll(); // Obtener todos los productos
            console.log(products); // Esto imprimirá todos los productos, asegúrate de ver todas sus propiedades
            ProductsService.generateReport("Inventario", res); // Generar el reporte de Excel
        } catch (error) {
            debug(error);
            Response.error(res);
        }
    }
    
};