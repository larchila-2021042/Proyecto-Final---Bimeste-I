const { Schema, model, default: mongoose } = require('mongoose');

const CarritoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true , 'El nombre del carrito es obligatorio']
    },
    estado: {
        type: Boolean,
        default: true
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    productos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto',
        //default: null
    }],
    precio: {
        type: Number ,
        default: 0    
    },
    cantidad: {
        type: Number,
        default: 0
    }
});


module.exports = model('Carrito', CarritoSchema);
