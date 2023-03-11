const { Router } = require('express');
const { check } = require('express-validator');
const { getCarrito, postCarrito, putCarrito, getComprasRealizadasPorID} = require('../controllers/carritoCompras');
const { existeCarritoPorId, existeUsuarioPorId } = require('../helpers/db-validators');

const { validarCampos } = require('../middlewares/validar-campos');
const { checkProducto } = require('../middlewares/validar-categoria');
const { validarJWT, validarJWTProducto } = require('../middlewares/validar-jwt');
const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/mostrar', getCarrito)

router.get('/mostrar/:id', [
    validarJWT,
    tieneRole('CLIENTE_ROLE'),
    check('id', 'No es un id de Mongo Válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], getComprasRealizadasPorID);

router.post('/agregar',[
    validarJWT,
    tieneRole('CLIENTE_ROLE'),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], postCarrito)

router.put ('/editar/:id',[
    validarJWT,
    tieneRole('CLIENTE_ROLE'),
    check('carrito', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], putCarrito)

// idEmpresa = req.empresa.id

/*router.put('/editar/:id', putCategoria)
router.delete('/eliminar/:id', deleteCategoria)*/



module.exports = router;