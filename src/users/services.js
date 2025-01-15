const { ObjectId } = require("mongodb");

const { Database } = require ("../database/index");

const COLLECTION = "users";

const getAll = async () => {
    const collection = await Database(COLLECTION);
    // Verifica que estamos obteniendo todos los productos con sus propiedades
    return await collection.find({}).toArray();
};


const getById = async (id) => {
const collection = await Database(COLLECTION);
return collection.findOne({_id: new ObjectId(id)});
};

const create = async (product) => {
    const collection = await Database(COLLECTION);
    let result = await collection.insertOne(product);
    return result.insertedId;
};


const updatedUser = async (id, userData) => {
    const collection = await Database(COLLECTION);
    const result = await collection.updateOne(
        { _id: new ObjectId(id) },    // Filtro para encontrar el producto por ID
        { $set: userData }         // Los datos a actualizar
    );
    // Si se actualizó al menos un documento, devuelve el nuevo producto
    if (result.matchedCount === 0) {
        return null; // No se encontró el producto
    }
    return await collection.findOne({ _id: new ObjectId(id) }); // Devuelve el producto actualizado
};

const deletedUser = async (id) => {
    const collection = await Database(COLLECTION);
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
        return null; // No se encontró el producto para eliminar
    }
    return true; // El producto fue eliminado exitosamente
};



module.exports.UsersService = {
    getAll,
    getById,
    create,
    updatedUser,
    deletedUser,
};