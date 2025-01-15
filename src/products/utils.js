const excelGenerator = (products, name, res) => {
    const xl = require("excel4node");

    // Mapeamos los productos para transformar _id a id
    products = products.map((product) => {
        let id = product._id.toString();
        delete product._id;
        return {
            id,
            ...product,
        };
    });

    let wb = new xl.Workbook(); // Crear el libro de trabajo
    let ws = wb.addWorksheet("Inventario"); // Crear la hoja de trabajo

    // Agregar los datos de los productos, empezando desde la primera fila
    for (let i = 0; i < products.length; i++) {
        let product = products[i];
        let keys = Object.keys(product); // Obtener las claves de cada producto

        for (let j = 0; j < keys.length; j++) {
            let data = product[keys[j]]; // Obtener el valor según la clave

            // Asignar los valores directamente a las celdas, sin encabezados
            if (typeof data === "string") {
                ws.cell(i + 1, j + 1).string(data); // Empezamos desde la primera fila
            } else if (typeof data === "number") {
                ws.cell(i + 1, j + 1).number(data);
            }
        }
    }

    // Escribir el archivo Excel y enviarlo como respuesta
    wb.write(`${name}.xlsx`, res);
};

module.exports.ProductsUtils = {
    excelGenerator,
};
