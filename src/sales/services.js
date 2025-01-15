const { Database } = require("../database/index");
const { ObjectId } = require("mongodb");
const { ProductsService } = require('../products/services');
const { UsersService } = require('../users/services');

const COLLECTION = "sales";

// Modificación de la función createSale para manejar los productos como un arreglo de objetos
const createSale = async (products, userId) => {
    const collection = await Database(COLLECTION);

    let total = 0;
    const productDetails = [];

    // Obtener el usuario
    const user = await UsersService.getById(new ObjectId(userId)); 
    if (!user) {
        throw new Error(`Usuario con ID ${userId} no encontrado.`);
    }

    // Iterar sobre los productos y obtener el precio y nombre
    for (const { productId, quantity } of products) {
        const product = await ProductsService.getById(new ObjectId(productId)); // Obtener producto por ID
        if (!product) {
            throw new Error(`Producto con ID ${productId} no encontrado.`);
        }

        // Calcular el total de cada producto
        const productTotal = product.precio * quantity;
        total += productTotal; // Sumar el total de la venta

        productDetails.push({
            productId: new ObjectId(productId), // Convertir el productId a ObjectId
            quantity,
            price: product.precio, // Precio del producto
            total: productTotal, // Total por ese producto
            product_name: product.name // Nombre del producto
        });
    }

    const sale = {
        user_id: new ObjectId(userId), // Asegúrate de convertir el userId a ObjectId
        user_name: `${user.nombre} ${user.apellido}`, // Usa el formato correcto para el nombre
        product_id: productDetails,
        total, // El total de la venta
        date: new Date(),
    };
    

    let result = await collection.insertOne(sale);
    return result.insertedId; // Retorna el ID de la venta insertada
};

// Función para obtener todas las ventas con los nombres de los productos y del usuario
const getSales = async () => {
    const collection = await Database(COLLECTION);
    const sales = await collection.find({}).toArray();

    // Agregar los nombres del usuario y productos a las ventas
    for (const sale of sales) {
        const user = await UsersService.getById(new ObjectId(sale.user_id));
        sale.user_name = user ? user.name : "Usuario no encontrado"; // Asignar nombre del usuario

        // Obtener los detalles de los productos
        for (const product of sale.product_id) {
            const productDetails = await ProductsService.getById(product.productId);
            product.product_name = productDetails ? productDetails.name : "Producto no encontrado"; // Asignar nombre del producto
        }
    }

    return sales;
};

const getSaleById = async (id) => {
    const collection = await Database(COLLECTION);
    const sale = await collection.findOne({ _id: new ObjectId(id) });

    // Obtener el nombre del usuario y de los productos
    if (sale) {
        const user = await UsersService.getById(new ObjectId(sale.user_id));
        sale.user_name = user ? user.name : "Usuario no encontrado";

        for (const product of sale.product_id) {
            const productDetails = await ProductsService.getById(product.productId);
            product.product_name = productDetails ? productDetails.name : "Producto no encontrado";
        }
    }

    return sale;
};

module.exports.SalesService = {
    createSale,
    getSales,
    getSaleById,
};
