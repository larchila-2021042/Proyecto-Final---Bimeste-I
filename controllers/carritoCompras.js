const { response, request } = require('express');

const Carrito = require('../models/carritoCompras');
const producto = require('../models/producto');
const Producto = require('../models/producto');

const getCarrito = async (req = request, res = response) => {
    const query = { estado: true };
    const listaCompras = await Promise.all([
        Carrito.countDocuments(query),
        Carrito.find(query).populate("usuario", "nombre").populate('productos',)
    ]);
    res.json({
        msg: "get Api - Controlador Carrito",
        listaCompras,
    });
};

const getComprasRealizadasPorID = async (req = request, res = response) => {
    const { id } = req.params;
    query = { usuario: id }
    const listaCompras = await Promise.all([
        Carrito.countDocuments(query),
        Carrito.find(query).populate("usuario", "nombre").populate('productos',)
    ]);
    res.json({
        msg: "get Api - Controlador Carrito",
        listaCompras,
    });
}

/*
const postCarrito = async (req = request, res = response) => {
    const { estado, usuario, precio, ...body } = req.body;
    const nombre = req.body.nombre.toUpperCase();
    const carritoDB = await Carrito.findOne({ nombre });
    //validacion si el carrito ya existe
    if (carritoDB) {
        return res.status(400).json({
            msg: `El carrito ${carritoDB.nombre}, ya existe en la DB`
        });
    }

    //const prouductoById = await Producto.findById({productos: body.id});
    //const precio = prouductoById.precio;


    //Generar la data a guardar
    const data = {
        ...body,
        nombre,
        usuario: req.usuario._id
    };

    const carritos = new Carrito(data);
    await carritos.save();
    res.status(201).json(carritos);
};
*/

const postCarrito = async (req = request, res = response) => {
    try {
        const {  productos, cantidad, precio } = req.body;
        const nombre = req.body.nombre.toUpperCase();
        const carritoDB = await Carrito.findOne({ nombre });
        //validacion si el carrito ya existe
        if (carritoDB) {
            return res.status(400).json({
                msg: `El carrito ${carritoDB.nombre}, ya existe en la DB`
            });
        }

        const product = await Producto.findById(productos);

        // Añadir el producto al carrito de compras
        const cart = new Carrito({
            nombre,
            usuario: req.usuario._id,
            productos,
            cantidad,
            precio,
        });
        await cart.save();

        res.send('Producto añadido al carrito de compras');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al añadir producto al carrito de compras');
    }
}

const putCarrito = async (req = request, res = response) => {
    const { id } = req.params;
    const { estado, usuario, ...resto } = req.body;

    resto.carrito = resto.carrito.toUpperCase();
    resto.productos = [...req.body.productos];
    resto.usuario = req.usuario._id;

    const carritoEditado = await Carrito.findByIdAndUpdate(id, resto, { new: true });

    res.status(201).json(carritoEditado);
};

module.exports = {
    getCarrito,
    getComprasRealizadasPorID,
    postCarrito,
    putCarrito,
}
