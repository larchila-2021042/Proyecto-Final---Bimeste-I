const { request, response } = require('express');
const Factura = require('../models/factura');
const Carrito = require('../models/carritoCompras');

const getFacturas = async (req = request, res = response) => {

    //condiciones del get
    const query = { estado: true };
    const listafacturas = await Promise.all([
        Factura.countDocuments(query),
        Factura.find(query).populate("usuario", "nombre").populate('items',).populate("total")
    ]);
    res.json({
        msg: "get Api - Controlador Facturas",
        listafacturas,
    });

}

const getFacturaPorID = async (req = request, res = response) => {
    const { id } = req.params;
    const facturaById = await Factura.findById(id)
        //.populate('usuario', 'nombre')
        .populate('admin', 'correo')
        .populate('cliente', 'nombre')
        .populate('carrito',)

    res.status(201).json(facturaById);

}

/*
const postFactura = async (req = request, res = response) => {

    const { estado, usuario, ...body } = req.body;
    const nombre = req.body.nombre.toUpperCase();
    const facturaDB = await Factura.findOne({ nombre });
    //validacion si el producto ya existe
    if ( facturaDB ) {
        return res.status(400).json({
            msg: `La factura ${ facturaDB.nombre }, ya existe en la DB`
        });
    }
    

    //Generar la data a guardar
    const data = {
        ...body,
        nombre,
        admin: req.usuario._id
    }

    const factura = await Factura( data );

    //Guardar en DB
    await factura.save();

    res.status(201).json( factura );
   
}
*/

const postFactura = async (req = request, res = response) => {
    const { usuario } = req.params;
    try {
        const nombre = req.body.nombre.toUpperCase();
        const carritoDB = await Carrito.findOne({ nombre });
        //validacion si el carrito ya existe
        if (carritoDB) {
            return res.status(400).json({
                msg: `El carrito ${carritoDB.nombre}, ya existe en la DB`
            });
        }
        // Buscar todos los productos en el carrito de compras del usuario
        const cartItems = await Carrito.find({usuario});

        // Calcular el total de la factura
        let total = 0;
        for (const item of cartItems){
            total += item.precio * item.cantidad
        }
        

        // Crear la factura
        await Factura.create({
            nombre,
            usuario,
            items: cartItems,
            total,
            date: new Date(),
        });

        // Elminar del carrito de compras
        //await Carrito.deleteMany({usuario});

        res.send('Generada Correctamente')
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al generar la factura');
    }
}


const putProducto = async (req = request, res = response) => {
    const { id } = req.params;

    const { estado, usuario, ...restoData } = req.body;

    if (restoData.nombre) {
        restoData.nombre = restoData.nombre.toUpperCase();
        restoData.usuario = req.usuario._id;
    }

    const productoActualizado = await Producto.findByIdAndUpdate(id, restoData, ({ new: true }));

    res.status(201).json({
        msg: 'Put Controller Producto',
        productoActualizado
    });
}

const deleteProducto = async (req = request, res = response) => {

    const { id } = req.params;
    const productoEliminado = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.json({
        msg: "DELETE",
        productoEliminado
    });
}




module.exports = {
    getFacturas,
    getFacturaPorID,
    postFactura,
    putProducto,
    deleteProducto
}