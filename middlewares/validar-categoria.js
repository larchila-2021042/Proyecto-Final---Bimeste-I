const { request, response } = require('express');
const Producto = require('../models/producto');

//Verificador si es admin
const eliminarCategoria = async (req = request, res = response, next) => {

  try {
    const categoryId = req.params.id;
    const defaultCategoryId = '640b64437c6369c824871a01'; // Aquí se establece la categoría por defecto

    // Buscar todos los productos que pertenezcan a la categoría eliminada
    const products = await Producto.find({ categoria: categoryId });

    // Actualizar cada producto con la categoría por defecto
    for (let i = 0; i < products.length; i++) {
      products[i].categoria = defaultCategoryId;
      await products[i].save();
    }

    // Continuar con la eliminación de la categoría
    next();
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al actualizar los productos');
  }


}


function checkProducto(req = request, res = response, next) {
  const productId = req.params.productos; // obtener el ID del producto del cuerpo de la solicitud
  const product = Producto.findById(productId);
  // el producto no está en el carrito de compras, verificar si está disponible en el inventario
  
  if (product && product.disponible) {
    // el producto está disponible, continuar con la ejecución normal
    next();
  } else {
    // el producto no está disponible, enviar una respuesta de error
    res.status(400).send("El producto no está disponible.");
  }
}







module.exports = {

  eliminarCategoria,
  checkProducto

}