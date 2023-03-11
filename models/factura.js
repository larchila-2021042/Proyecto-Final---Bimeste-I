const { Schema, model } = require('mongoose');

const FacturaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre de la factura es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: String,
    },
    items: [
        {
            productos: String,
            cantidad: Number,
            precio: Number
        },
    ] ,
    total: {
        type: Number
    },
    date: { type: Date }
});


module.exports = model('Factura', FacturaSchema);