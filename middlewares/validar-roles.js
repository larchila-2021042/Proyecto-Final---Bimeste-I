const { request, response } = require('express');
const Usuario = require('../models/usuario');

//Verificador si es admin
const esAdminRole = (req = request, res = response, next) => {

    //Si no viene el usuario
    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se require verificar el role sin validar el token primero'
        });
    }

    //Verificar que le rol sea ADMIN_ROLE
    const { rol, nombre } = req.usuario;

    if (rol !== 'ADMIN_ROLE') {
        return res.status(500).json({
            msg: `${nombre} no es Administrador - No tiene acceso a esta función`
        });
    }

    next();


}


//Operador rest u operador spread 
const tieneRole = (...roles) => {

    return (req = request, res = response, next) => {

        if (!req.usuario) {
            return res.status(500).json({
                msg: 'Se quiere verificar el role sin validar el token primero'
            })
        }

        if (!roles.includes(req.usuario.rol)) {
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles: ${roles}`
            })

        }

        next();

    }

}


const checkAdminRole = (req = request, res = response, next) => {
    if (req.usuario.rol === 'ADMIN_ROLE') {
        if (req.params.id) {
            Usuario.findById(req.params.id, (err, usuario) => {
                if (err) {
                    return next(err);
                }
                if (usuario.rol === 'ADMIN_ROLE') {
                    return res.status(403).json({ message: 'No puedes eliminar a otro admin' });
                }
                next();
            });
        } else {
            next();
        }
    } else {
        next();
    }
};



module.exports = {
    tieneRole,
    esAdminRole,
    checkAdminRole
}